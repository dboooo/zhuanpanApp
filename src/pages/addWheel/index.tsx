import Taro, { useState } from '@tarojs/taro';
import React, { useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { getWheelsData, setWheelsData } from '../../utils/globalData';
import './index.scss';

const defaultPrize = { range: 0, background: '#ffffff', fonts: [{ text: '', top: '15%', fontColor: '#333', fontSize: '16px' }] };
const defaultWheel = { title: '', prizes: [defaultPrize, defaultPrize, defaultPrize, defaultPrize, defaultPrize, defaultPrize] };

const AddWheel = () => {
  const [wheel, setWheel] = useState(defaultWheel);

  useEffect(() => {
    // 根据默认转盘的样式来初始化转盘数据
    const defaultWheels = [
      {
        title: '今天吃什么',
        prizes: [
          { range: 50, background: '#fef4d9', fonts: [{ text: '火锅', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#fce8bc', fonts: [{ text: '烧烤', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 10, background: '#f7e0a3', fonts: [{ text: '寿司', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#fef4d9', fonts: [{ text: '炸鸡', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 40, background: '#fce8bc', fonts: [{ text: '披萨', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#f7e0a3', fonts: [{ text: '汉堡', top: '15%', fontColor: '#333', fontSize: '16px' }] },
        ],
      },
      {
        title: '今天练什么',
        prizes: [
          { range: 40, background: '#d9fef4', fonts: [{ text: '跑步', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#bcfce8', fonts: [{ text: '游泳', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 20, background: '#a3f7e0', fonts: [{ text: '瑜伽', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 10, background: '#d9fef4', fonts: [{ text: '举重', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 50, background: '#bcfce8', fonts: [{ text: '骑行', top: '15%', fontColor: '#333', fontSize: '16px' }] },
          { range: 30, background: '#a3f7e0', fonts: [{ text: '拳击', top: '15%', fontColor: '#333', fontSize: '16px' }] },
        ],
      },
    ];
    setWheel(defaultWheels[0]);
  }, []);

  const handleTitleChange = (e) => {
    setWheel({ ...wheel, title: e.target.value });
  };

  const handlePrizeChange = (index, field, value) => {
    const updatedPrize = { ...wheel.prizes[index], [field]: value };
    const updatedPrizes = [...wheel.prizes];
    updatedPrizes.splice(index, 1, updatedPrize);
    setWheel({ ...wheel, prizes: updatedPrizes });
  };

  const handleAddPrize = () => {
    const updatedPrizes = [...wheel.prizes, defaultPrize];
    setWheel({ ...wheel, prizes: updatedPrizes });
  };

  const handleRemovePrize = (index) => {
    const updatedPrizes = [...wheel.prizes];
    updatedPrizes.splice(index, 1);
    setWheel({ ...wheel, prizes: updatedPrizes });
  };

  const handleSave = () => {
    const wheelsData = getWheelsData();
    const updatedWheels = [...wheelsData, wheel];
    setWheelsData(updatedWheels);
    Taro.navigateBack();
  };

  return (
    <View className='add-wheel'>
      <View className='add-wheel-header'>
        <View className='back-button' onClick={() => Taro.navigateBack()}>
          <Text className='back-icon'>{'<'}</Text>
        </View>
        <Text className='title'>添加转盘</Text>
        <View className='save-button' onClick={handleSave}>
          <Text>保存</Text>
        </View>
      </View>
      <View className='add-wheel-body'>
        <View className='title-input'>
          <Text>转盘名称：</Text>
          <Input value={wheel.title} onInput={handleTitleChange} />
        </View>
        <View className='prizes-list'>
          {wheel.prizes.map((prize, index) => (
            <View key={index} className='prize-item'>
              <View className='prize-range'>
                <Text>奖品{index + 1}：</Text>
                <Input value={prize.range} type='number' onInput={(e) => handlePrizeChange(index, 'range', e.target.value)} />
                <Text>%</Text>
              </View>
              <View className='prize-background'>
                <Text>背景颜色：</Text>
                <Input value={prize.background} onInput={(e) => handlePrizeChange(index, 'background', e.target.value)} />
              </View>
              <View className='prize-fonts'>
                <Text>文字内容：</Text>
                <Input value={prize.fonts[0].text} onInput={(e) => handlePrizeChange(index, 'fonts', [{ ...prize.fonts[0], text: e.target.value }])} />
              </View>
              <View className='prize-actions'>
                <View className='add-prize-button' onClick={handleAddPrize}>
                  <Text>添加</Text>
                </View>
                {wheel.prizes.length > 1 && (
                  <View className='remove-prize-button' onClick={() => handleRemovePrize(index)}>
                    <Text>删除</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AddWheel;
