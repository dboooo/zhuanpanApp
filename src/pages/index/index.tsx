import React, { Component } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import LuckyWheel from '../../components/wheel'

export default class Index extends Component {
  state = {
    blocks: [
      { padding: '13px', background: '#869cfa' },
      { padding: '13px', background: '#e9e8fe' }
    ],
    prizes: [
      { title: '1元红包', background: '#f9e3bb', fonts: [{ text: '1元红包', top: '15%' }] },
      { title: '100元红包', background: '#f8d384', fonts: [{ text: '100元红包', top: '15%' }] },
      { title: '谢谢参与', background: '#f9e3bb', fonts: [{ text: '谢谢参与', top: '15%' }] },
      { title: '10元红包', background: '#f8d384', fonts: [{ text: '10元红包', top: '15%' }] },
      { title: '50元红包', background: '#f9e3bb', fonts: [{ text: '50元红包', top: '15%' }] },
      { title: '200元红包', background: '#f8d384', fonts: [{ text: '200元红包', top: '15%' }] }
    ],
    buttons: [
      { radius: '50px', background: '#ffdea0', pointer: true, fonts: [{ text: '开始', top: '-20px' }] }
    ]
  }

  onStart = () => {
    Taro.showToast({
      title: '开始抽奖',
      icon: 'none'
    })
  }

  onEnd = (prize: any) => {
    Taro.showToast({
      title: `恭喜你获得${prize.title}`,
      icon: 'none'
    })
  }

  render() {
    const { blocks, prizes, buttons } = this.state
    return (
      <View className='index'>
        <LuckyWheel
          canvasId='lucky-wheel'
          width='600rpx'
          height='600rpx'
          blocks={blocks}
          prizes={prizes}
          buttons={buttons}
          onStart={this.onStart}
          onEnd={this.onEnd}
        />
      </View>
    )
  }
}