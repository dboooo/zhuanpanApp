// pages/index/index.tsx

import React from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Wheel from '../../components/wheel';

const wheelItems = [
  { text: '项目1', color: '#FF6B6B', resultText: '恭喜你获得项目1!', weight: 1 },
  { text: '项目2', color: '#4ECDC4', resultText: '恭喜你获得项目2!', weight: 2 },
  { text: '项目3', color: '#45B7D1', resultText: '恭喜你获得项目3!', weight: 3 },
  { text: '项目4', color: '#F7D065', resultText: '恭喜你获得项目4!', weight: 4 },
  { text: '项目5', color: '#C06C84', resultText: '恭喜你获得项目5!', weight: 5 },
  { text: '项目6', color: '#6C5B7B', resultText: '恭喜你获得项目6!', weight: 6 },
];

const Index: React.FC = () => {
  const handleResult = (item) => {
    console.log('抽中的项目:', item.text);
    Taro.showToast({
      title: item.resultText,
      icon: 'none',
      duration: 2000
    });
  };

  return (
    <View className='index'>
      <View style='display: flex; justify-content: center; padding: 20px;'>
        <Wheel items={wheelItems} onResult={handleResult} />
      </View>
    </View>
  );
};

export default Index;