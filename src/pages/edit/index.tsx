import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { getWheelsData, removeWheelData } from '../../utils/globalData';
import './index.scss'; 

const WheelConfig = () => {
  const [wheels, setWheels] = useState([]);

  useEffect(() => {
    // 获取存储的转盘数据
    const wheelsData = getWheelsData();
    setWheels(wheelsData);
  }, []);

  const handleAddWheel = () => {
    // 跳转到添加转盘页面
    Taro.navigateTo({
      url: '/pages/AddWheel/index' // 假设添加转盘的页面路径
    });
  };

  const handleEditWheel = (index) => {
    // 跳转到编辑转盘页面，传递转盘索引
    Taro.navigateTo({
      url: `/pages/EditWheel/index?index=${index}` // 假设编辑转盘的页面路径
    });
  };

  const handleDeleteWheel = (index) => {
    // 移除转盘数据
    removeWheelData(index);
    // 更新转盘列表
    const updatedWheels = [...wheels];
    updatedWheels.splice(index, 1);
    setWheels(updatedWheels);
  };

  const fixWheel = (index) => {

  }

  return (
    <View className='wheel-config'>
      <View className='config-header'>
        <Text className='title'>我的转盘</Text>
      </View>
      {wheels.length === 0 ? (
        <View className='no-wheels'>
          <View className='add-wheel-box' onClick={handleAddWheel}>
            <Text className='add-icon'>➕</Text>
            <Text>点击添加转盘</Text>
          </View>
          <Text>当前没有转盘，点击上方添加转盘</Text>
        </View>
      ) : (
        <View className='wheels-list'>
          {wheels.map((wheel, index) => (
            <View key={index} className='wheel-item'>
              <View
                className='wheel-content'
                onClick={() => handleEditWheel(index)}
                onLongPress={() => handleDeleteWheel(index)}
              >
                <Text>{wheel.title}</Text>
              </View>
              <View className='btnContainer'>
                <Text className='fix-button' onClick={()=> fixWheel(index)}>修改</Text>
                <Text className='delete-button' onClick={() => handleDeleteWheel(index)}>删除</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      <View className='add-wheel-box' onClick={handleAddWheel}>
        <Text className='add-icon'>➕</Text>
        <Text>点击添加转盘</Text>
      </View>
    </View>
  );
};

export default WheelConfig;
