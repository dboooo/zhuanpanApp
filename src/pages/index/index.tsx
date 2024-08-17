import React, { useState } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import LuckyWheel from '../../components/wheel';

const Index: React.FC = () => {
  const [wheelItems] = useState([
    { name: 'Item 1', weight: 1 },
    { name: 'Item 2', weight: 1 },
    { name: 'Item 3', weight: 4 },
    { name: 'Item 4', weight: 6 },
    { name: 'Item 5', weight: 2 },
    { name: 'Item 6', weight: 3 }
  ]);

  const handleSpinEnd = (result: { name: string, weight: number }) => {
    Taro.showToast({
      title: `${result.name}`,
    });
  };

  return (
    <View className='index'>
      <LuckyWheel 
        items={wheelItems} 
        onSpinEnd={handleSpinEnd} 
      />
    </View>
  );
};

export default Index;