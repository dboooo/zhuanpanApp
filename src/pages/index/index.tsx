import React, { Component } from 'react'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import LuckyWheel from '../../components/wheel'
import { getWheelsData } from '../../utils/globalData'
import './index.scss'

export default class Index extends Component {
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
  }

  componentDidMount() {
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
      title: '开始抽奖',
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
      title: `你今天${this.state.wheels[index].title.replace('今天', '')}${prize.fonts[0].text}`,
      icon: 'none'
    })
  }

  render() {
    const { wheels, blocks, buttons, currentSwiper } = this.state

    return (
      <View className='index'>
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          marginBottom: '20px'
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