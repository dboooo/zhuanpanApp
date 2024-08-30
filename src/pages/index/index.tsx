import React, { Component } from 'react'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import LuckyWheel from '../../components/wheel'
import { getWheelsData,setWheelsData } from '../../utils/globalData'
import './index.scss'

export default class Index extends Component {
  sysWheels: any[]
  constructor(props) {
    super(props)
    this.state = {
      currentSwiper: 0,
      wheels: [],
      blocks: [
        { padding: '5px', background: '#f0f0f0' }
      ],
      buttons: [
        {
          radius: '40px',
          background: '#ffffff',
          pointer: true,
          fonts: [{ text: '点击开始', top: '-30%', fontColor: '#333', fontSize: '18px', fontWeight: 'bold' }]
        }
      ]
    }

    this.sysWheels = [
      {
        title: '今天吃什么',
        prizes: [
          { range: 50, background: '#fef4d9', fonts: [{ text: '火锅', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#fce8bc', fonts: [{ text: '烧烤', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 10, background: '#f7e0a3', fonts: [{ text: '寿司', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#fef4d9', fonts: [{ text: '炸鸡', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 40, background: '#fce8bc', fonts: [{ text: '披萨', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#f7e0a3', fonts: [{ text: '汉堡', top: '15%', fontColor: '#333', fontSize: '16px' }] }
        ],
        showOnHome: true
      },
      {
        title: '今天练什么',
        prizes: [
          { range: 40, background: '#d9fef4', fonts: [{ text: '跑步', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#bcfce8', fonts: [{ text: '游泳', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#a3f7e0', fonts: [{ text: '瑜伽', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 10, background: '#d9fef4', fonts: [{ text: '举重', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 50, background: '#bcfce8', fonts: [{ text: '骑行', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#a3f7e0', fonts: [{ text: '拳击', top: '15%', fontColor: '#333', fontSize: '16px' }] }
        ],
        showOnHome: true
      }
    ]

    setWheelsData(this.sysWheels, 'system')
  }

  componentDidMount() {
    this.fetchWheelsData()
  }

  componentDidShow() {
    // 页面每次展示时重新刷新数据
    this.fetchWheelsData()
  }

  fetchWheelsData = () => {
    const userWheels = getWheelsData('user')
    const systemWheels = getWheelsData('system')
    const wheelsData = [...userWheels, ...systemWheels].filter(wheel => wheel.showOnHome)

    this.setState({ wheels: wheelsData })
  }

  handleSwiperChange = (e) => {
    this.setState({
      currentSwiper: e.detail.current
    })
  }

  onStartWheel = (index) => {
    Taro.showToast({
      title: '开始啦~~~',
      icon: 'none'
    })
    const wheelRef = this[`wheelRef${index}`]
    wheelRef.current.play()
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * this.state.wheels[index].prizes.length)
      wheelRef.current.stop(randomIndex)
    }, 1000)
  }

  onEndWheel = (index, prize) => {
    Taro.showToast({
      title: `结果是:${prize.fonts[0].text}`,
      icon: 'success'
    })
  }

  render() {
    const { wheels, blocks, buttons, currentSwiper } = this.state

    return (
      <View className='zhuanpan-index'>
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          marginBottom: '2rem'
        }}
        >
          <Text>
            {wheels[currentSwiper]?.title || ''}
          </Text>
        </View>
        <Swiper
          className='swiper'
          indicatorDots
          autoplay={false}
          current={currentSwiper}
          onChange={this.handleSwiperChange}
        >
          {wheels.map((wheel, index) => (
            <SwiperItem key={`wheel-${index}`}>
              <LuckyWheel
                ref={this[`wheelRef${index}`] = React.createRef()}
                canvasId={`wheel-${index}`}
                width='500rpx'
                height='500rpx'
                blocks={blocks}
                prizes={wheel.prizes}
                buttons={buttons}
                onStart={() => this.onStartWheel(index)}
                onEnd={(prize) => this.onEndWheel(index, prize)}
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    )
  }
}