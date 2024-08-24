import React from 'react'
import Taro from '@tarojs/taro'
import { View, Canvas, Image, BaseEventOrig, ImageProps } from '@tarojs/components'
import { LuckyWheel as Wheel } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag, getImage } from '../../utils'

export default class LuckyWheel extends React.Component {
  flag: any
  ctx: any
  canvas: any
  dpr: number

  constructor (props: any) {
    super(props)
    this.flag = getFlag()
    this.ctx = null
    this.canvas = null
    this.state = {
      imgSrc: '',
      myLucky: null,
      boxWidth: 300,
      boxHeight: 300,
      btnWidth: 0,
      btnHeight: 0,
    }
    this.dpr = 0
  }

  componentDidMount () {
    this.initLucky()
  }

  componentDidUpdate (prevProps: { blocks: any; prizes: any; buttons: any }) {
    const { props, state } = this
    if (!state.myLucky) return
    if (props.blocks !== prevProps.blocks) {
      state.myLucky.blocks = props.blocks
    }
    if (props.prizes !== prevProps.prizes) {
      state.myLucky.prizes = props.prizes
    }
    if (props.buttons !== prevProps.buttons) {
      state.myLucky.buttons = props.buttons
    }
  }

  async imgBindload (res: BaseEventOrig<ImageProps.onLoadEventDetail>, name: string, index: string | number, i: string | number) {
    const img = this.props[name][index].imgs[i]
    resolveImage(img, this.canvas)
  }

  getImage () {
    const page = Taro.getCurrentInstance().page
    return getImage.call(page, this.props.canvasId, this.canvas)
  }

  showCanvas () {
    this.setState({ imgSrc: '' })
  }

  hideCanvas () {
    if (this.flag === 'WEB') return
    this.getImage().then((res: { errMsg: string; tempFilePath: any }) => {
      if (res.errMsg !== 'canvasToTempFilePath:ok') {
        return console.error(res)
      }
      this.setState({
        imgSrc: res.tempFilePath
      })
    })
  }

  initLucky () {
    const { props } = this
    this.setState({
      boxWidth: changeUnits(props.width),
      boxHeight: changeUnits(props.height)
    }, () => {
      // 某些情况下获取不到 canvas
      setTimeout(() => {
        this.getConfig()
      }, 100)
    })
  }

  getConfig () {
    let flag = this.flag
    const dpr = this.dpr = Taro.getSystemInfoSync().pixelRatio
    if (flag === 'WEB') {
      // H5 环境
      const divElement = document.querySelector(`#${this.props.canvasId}`)
      this.drawLucky({
        dpr,
        flag,
        divElement,
        width: this.state.boxWidth,
        height: this.state.boxHeight,
        rAF: requestAnimationFrame,
      })
    } else {
      // 小程序环境
      const page = Taro.getCurrentInstance().page
      Taro.createSelectorQuery().in(page).select(`#${this.props.canvasId}`).fields({
        node: true, size: true
      }).exec((res) => {
        if (!res[0] || !res[0].node) return console.error('lucky-canvas 获取不到 canvas 标签')
        const { node, width, height } = res[0]
        const canvas = this.canvas = node
        const ctx = this.ctx = canvas.getContext('2d')
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        this.drawLucky({
          dpr,
          flag,
          ctx,
          width,
          height,
        })
      })
    }
  }

  drawLucky (config: Partial<{ nodeType?: number; flag: "WEB" | "MP-WX" | "UNI-H5" | "UNI-MP" | "TARO-H5" | "TARO-MP"; el?: string; divElement?: HTMLDivElement; canvasElement?: HTMLCanvasElement; ctx: CanvasRenderingContext2D; dpr: number; handleCssUnit?: (num: number, unit: string) => number; rAF?: Function; setTimeout: Function; setInterval: Function; clearTimeout: Function; clearInterval: Function; beforeCreate?: Function; beforeResize?: Function; afterResize?: Function; beforeInit?: Function; afterInit?: Function; beforeDraw?: Function; afterDraw?: Function; afterStart?: Function }>) {
    const _this = this
    const { props, flag, ctx } = this
    const myLucky = new Wheel({
      ...config,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      unitFunc: (num: any, unit: any) => changeUnits(num + unit),
      beforeCreate: function () {
        if (flag === 'WEB') return
        const Radius = Math.min(this.config.width, this.config.height) / 2
        ctx.translate(Radius, Radius)
      },
      beforeInit: function () {
        if (flag === 'WEB') return
        ctx.translate(-this.Radius, -this.Radius)
      },
      afterInit: function () {
        // 动态设置按钮大小
        _this.setState({
          btnWidth: this.maxBtnRadius * 2,
          btnHeight: this.maxBtnRadius * 2,
        })
      },
      afterStart: () => {
        this.showCanvas()
      },
    }, {
      ...props,
      width: config.width,
      height: config.height,
      start: (...rest) => {
        props.onStart && props.onStart(...rest)
      },
      end: (...rest) => {
        props.onEnd && props.onEnd(...rest)
        this.hideCanvas()
      }
    })
    this.setState({ myLucky })
  }

  init (...rest: any[]) {
    this.state.myLucky.init(...rest)
  }

  play (...rest: any[]) {
    this.state.myLucky.play(...rest)
  }

  stop (...rest: any[]) {
    this.state.myLucky.stop(...rest)
  }

  toPlay () {
    this.state.myLucky.startCallback()
  }

  render () {
    const { props, state, flag } = this
    const boxSize = { width: state.boxWidth + 'px', height: state.boxHeight + 'px' }
    const btnSize = { width: state.btnWidth + 'px', height: state.btnHeight + 'px' }
    const showImage = state.myLucky && flag !== 'WEB'
    return flag === 'WEB' ? <div id={props.canvasId}></div> : (
      <View className='lucky-box' style={boxSize}>
        <Canvas type='2d' className='lucky-canvas' id={props.canvasId} canvasId={props.canvasId} style={boxSize}></Canvas>
        <Image src={state.imgSrc} onLoad={() => state.myLucky.clearCanvas()} style={boxSize}></Image>
        {/* 按钮 */}
        <View className='lucky-wheel-btn' onClick={e => this.toPlay(e)} style={btnSize}></View>
        {/* 图片 */}
        { showImage ? <View className='lucky-imgs'>
          {
            props.blocks.map((block: { imgs: any[] }, index: string | number | undefined) => <View key={index}>
              {
                block.imgs ? <View>
                  { block.imgs.map((img: { src: string }, i: string | number | undefined) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'blocks', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
        { showImage ? <View className='lucky-imgs'>
          {
            props.prizes.map((prize: { imgs: any[] }, index: string | number | undefined) => <View key={index}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img: { src: string }, i: string | number | undefined) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
        { showImage ? <View className='lucky-imgs'>
          {
            props.buttons.map((button: { imgs: any[] }, index: string | number | undefined) => <View key={index}>
              {
                button.imgs ? <View>
                  { button.imgs.map((img: { src: string }, i: string | number | undefined) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'buttons', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
      </View>
    )
}
}