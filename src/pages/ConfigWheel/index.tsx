import React, { Component } from 'react'
import { View, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtForm, AtInput, AtButton, AtSwitch } from 'taro-ui'
import { getWheelsData, setWheelsData, getHomeWheelsData, setHomeWheelsData } from '../../utils/globalData'
import './index.scss'

export default class ConfigWheel extends Component {
  constructor(props) {
    super(props)

    const { index, type } = Taro.getCurrentInstance().router.params

    let wheel = { title: '默认转盘', prizes: [], showOnHome: false }

    if (index >= 0) {
      const wheelsData = getWheelsData(type)
      wheel = wheelsData[index] || wheel
    }

    // 确保初始化至少两个选项
    if (wheel.prizes.length < 2) {
      wheel.prizes = [
        { range: 10, background: '#ffffff', fonts: [{ text: '选项1', top: 15, fontColor: '#333', fontSize: '16px' }], imgs: [] },
        { range: 10, background: '#ffffff', fonts: [{ text: '选项2', top: 15, fontColor: '#333', fontSize: '16px' }], imgs: [] }
      ]
    }

    this.state = {
      index: parseInt(index, 10),
      type: type || 'user',
      title: wheel.title,
      prizes: wheel.prizes,
      showOnHome: wheel.showOnHome,
    }
  }

  handleTitleChange = (value) => {
    this.setState({ title: value })
  }

  handlePrizeChange = (index, key, value) => {
    const prizes = [...this.state.prizes]
    if (key === 'text') {
      prizes[index].fonts[0].text = value
    } else {
      prizes[index][key] = value
    }
    this.setState({ prizes })
  }

  addPrize = () => {
    this.setState({
      prizes: [...this.state.prizes, { range: 10, background: '#ffffff', fonts: [{ text: `选项${this.state.prizes.length + 1}`, top: 15, fontColor: '#333', fontSize: '16px' }], imgs: [] }],
    })
  }

  removePrize = (index) => {
    const prizes = [...this.state.prizes]
    if (prizes.length > 2) {
      prizes.splice(index, 1)
      this.setState({ prizes })
    } else {
      Taro.showToast({ title: '至少需要两个选项', icon: 'none' })
    }
  }

  handleShowOnHomeChange = (value) => {
    this.setState({ showOnHome: value })
  }

  saveWheel = () => {
    const { index, title, prizes, showOnHome, type } = this.state
    if(title === '') {
      Taro.showToast({ title: '请输入标题', icon: 'error' })
      return
    }

    let wheelsData = getWheelsData(type)

    const wheel = { title, prizes, showOnHome }

    if (index >= 0) {
      wheelsData[index] = wheel
    } else {
      wheelsData.push(wheel)
    }

    setWheelsData(wheelsData, type)

    // 更新首页展示的转盘数据
    let homeWheelsData = getHomeWheelsData()
    if (showOnHome) {
      // 确保首页展示数据中不包含重复项
      const existingIndex = homeWheelsData.findIndex(hw => hw.title === title)
      if (existingIndex >= 0) {
        homeWheelsData[existingIndex] = wheel
      } else {
        homeWheelsData.push(wheel)
      }
    } else {
      // 从首页展示数据中移除该转盘
      homeWheelsData = homeWheelsData.filter(hw => hw.title !== title)
    }
    setHomeWheelsData(homeWheelsData)

    Taro.showToast({ title: '配置已保存', icon: 'success' })

    // 跳转回编辑页面
    Taro.navigateBack({
      delta: 1,
    })
  }

  render() {
    const { title, prizes, showOnHome } = this.state

    return (
      <View className='config-wheel-page'>
        <AtForm>
          <AtInput
            name='title'
            title='转盘名称'
            type='text'
            placeholder='请输入转盘名称'
            value={title}
            onChange={this.handleTitleChange}
          />

          <View className='prize-list'>
            {prizes.map((prize, index) => (
              <View key={`prize-${index}`} className='prize-item'>
                <Input
                  name={`prize-range-${index}`}
                  type='number'
                  placeholder='权重'
                  value={prize.range.toString()}
                  onInput={(e) => this.handlePrizeChange(index, 'range', parseInt(e.detail.value, 10))}
                />
                <Input
                  name={`prize-text-${index}`}
                  type='text'
                  placeholder='文字'
                  value={prize.fonts[0].text || ''}
                  onInput={(e) => this.handlePrizeChange(index, 'text', e.detail.value)}
                />
                <Button className='remove-button' onClick={() => this.removePrize(index)}>
                  删除
                </Button>
              </View>
            ))}
          </View>

          <Button className='add-button' onClick={this.addPrize}>
            新增选项
          </Button>

          <AtSwitch title='展示在首页' checked={showOnHome} onChange={this.handleShowOnHomeChange} />

          <Button onClick={this.saveWheel}>
            保存配置
          </Button>
        </AtForm>
      </View>
    )
  }
}