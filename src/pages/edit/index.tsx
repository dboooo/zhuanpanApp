import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { getWheelsData, removeWheelData } from '../../utils/globalData'
import './index.scss'

const WheelConfig = () => {
  const [wheels, setWheels] = useState([])
  const [type, setType] = useState<'user' | 'system'>('user') // 默认显示用户自定义转盘

  useEffect(() => {
    fetchWheelsData()
  }, [type])

  const fetchWheelsData = () => {
    const wheelsData = getWheelsData(type)
    setWheels(wheelsData)
  }

  const handleAddWheel = () => {
    // 跳转到 ConfigWheel 页面，指定为新增模式
    Taro.navigateTo({
      url: `/pages/ConfigWheel/index?type=${type}&index=-1`
    })
  }

  const handleEditWheel = (index) => {
    // 跳转到 ConfigWheel 页面，传递转盘索引和类型
    Taro.navigateTo({
      url: `/pages/ConfigWheel/index?type=${type}&index=${index}`
    })
  }

  const handleDeleteWheel = (index) => {
    Taro.showModal({
      title: '确认删除',
      content: '确认要删除这个转盘吗？',
      success: function (res) {
        if (res.confirm) {
          // 移除转盘数据
          removeWheelData(index, type)
          fetchWheelsData()
          Taro.showToast({ title: '成功删除', icon: 'success' })
        } else if (res.cancel) {
          Taro.showToast({ title: '已取消删除', icon: 'none' })
        }
      }
    })
  }

  const handleTypeChange = (newType) => {
    setType(newType)
  }

  return (
    <View className='wheel-config'>
      <View className='config-header'>
        <Text className='title'>我的转盘</Text>
        <View className='type-selector'>
          <Button onClick={() => handleTypeChange('user')} className={type === 'user' ? 'active' : ''}>用户自定义</Button>
          <Button onClick={() => handleTypeChange('system')} className={type === 'system' ? 'active' : ''}>系统内置</Button>
        </View>
      </View>

      {wheels.length === 0 ? (
        <View className='no-wheels'>
          <View className='add-wheel-box' onClick={handleAddWheel}>
            <Text className='add-icon'>➕</Text>
            <Text>点击添加转盘</Text>
          </View>
        </View>
      ) : (
        <View className='wheels-list'>
          {wheels.map((wheel, index) => (
            <View key={index} className='wheel-item'>
              <View
                className='wheel-content'
                onClick={() => handleEditWheel(index)}
              >
                <Text>{wheel.title}</Text>
              </View>
              <View className='btnContainer'>
                <Text className='fix-button' onClick={() => handleEditWheel(index)}>修改</Text>
                <Text className='delete-button' onClick={() => handleDeleteWheel(index)}>删除</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {wheels.length > 0 && (
        <View className='add-wheel-box' onClick={handleAddWheel}>
          <Text className='add-icon'>➕</Text>
          <Text>点击添加转盘</Text>
        </View>
      )}
    </View>
  )
}

export default WheelConfig