import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface WheelItem {
  name: string;
  weight: number;
}

interface LuckyWheelProps {
  items: WheelItem[];
  onSpinEnd: (item: WheelItem) => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ items, onSpinEnd }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [rotation, setRotation] = useState(0);

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    const newRotation = rotation + 1800 + Math.random() * 360; // At least 5 full rotations + random
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const randomWeight = Math.random() * totalWeight;
      let currentWeight = 0;
      const winningItem = items.find(item => {
        currentWeight += item.weight;
        return randomWeight <= currentWeight;
      }) || items[0];
      setResult(winningItem);
      onSpinEnd(winningItem);
    }, 2000); // 5 seconds spin time
  };

  useEffect(() => {
    if (result) {
      Taro.showToast({
        title: `这是结果: ${result.name}`,
        icon: 'success',
        duration: 2000
      });
    }
  }, [result]);

  let currentAngle = 0;

  return (
    <View className='lucky-wheel-container'>
      <View className='wheel-container'>
        <View 
          className={`wheel ${spinning ? 'spinning' : ''}`} 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {items.map((item, index) => {
            const sliceAngle = (item.weight / totalWeight) * 360;
            const rotateAngle = currentAngle;
            currentAngle += sliceAngle;
            return (
              <View 
                key={index} 
                className='wheel-item'
                style={{ 
                  transform: `rotate(${rotateAngle}deg)`,
                  clip: `rect(0px, 150px, 300px, 0px)`,
                }}
              >
                <View 
                  className='wheel-item-inner'
                  style={{
                    transform: `rotate(${sliceAngle / 2}deg)`,
                    backgroundColor: `hsl(${index * 360 / items.length}, 70%, 50%)`,
                  }}
                >
                  <Text>{item.name}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View className='wheel-center' onClick={spinWheel}>
          <View className='wheel-arrow' />
          <Text>开始</Text>
        </View>
      </View>
    </View>
  );
};

export default LuckyWheel;