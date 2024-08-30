import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { getWheelsData, removeWheelData } from '../../utils/globalData'
import './index.scss'

const WheelConfig = () => {
  const [currentTab, setCurrentTab] = useState(0) // 默认选中用户自定义
  const [userWheels, setUserWheels] = useState([])
  const [systemWheels, setSystemWheels] = useState([])

  useEffect(() => {
    fetchWheelsData()
  }, [currentTab])

  const fetchWheelsData = () => {
    if (currentTab === 0) {
      const wheelsData = getWheelsData('user')
      setUserWheels(wheelsData)
    } else {
      const wheelsData = getWheelsData('system')
      setSystemWheels(wheelsData)
    }
  }

  const handleAddWheel = () => {
    const type = currentTab === 0 ? 'user' : 'system'
    Taro.navigateTo({
      url: `/pages/ConfigWheel/index?type=${type}&index=-1`
    })
  }

  const handleEditWheel = (index) => {
    const type = currentTab === 0 ? 'user' : 'system'
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
          const type = currentTab === 0 ? 'user' : 'system'
          removeWheelData(index, type)
          fetchWheelsData()
          Taro.showToast({ title: '成功删除', icon: 'success' })
        } else if (res.cancel) {
          Taro.showToast({ title: '已取消删除', icon: 'none' })
        }
      }
    })
  }

  return (
    <View className='wheel-config'>
      <View className='tab-header'>
        <Text className={currentTab === 0 ? 'active' : ''} onClick={() => setCurrentTab(0)}>用户自定义</Text>
        <Text className={currentTab === 1 ? 'active' : ''} onClick={() => setCurrentTab(1)}>系统内置</Text>
      </View>

      <View className='tab-content'>
        {currentTab === 0 && (
          <View>
            {userWheels.length === 0 ? (
              <View className='no-wheels'>
                <View className='add-wheel-box' onClick={handleAddWheel}>
                  <Text className='add-icon'>➕</Text>
                  <Text>点击添加转盘</Text>
                </View>
              </View>
            ) : (
              <View className='wheels-list'>
                {userWheels.map((wheel, index) => (
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
          </View>
        )}

        {currentTab === 1 && (
          <View>
            {systemWheels.length === 0 ? (
              <View className='no-wheels'>
                <View className='add-wheel-box' onClick={handleAddWheel}>
                  <Text className='add-icon'>➕</Text>
                  <Text>点击添加转盘</Text>
                </View>
              </View>
            ) : (
              <View className='wheels-list'>
                {systemWheels.map((wheel, index) => (
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
          </View>
        )}
      </View>
    </View>
  )
}

export default WheelConfig