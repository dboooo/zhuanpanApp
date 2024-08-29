import Taro from '@tarojs/taro';

// 获取转盘数据，根据 type 区分用户自定义和系统内置
export const getWheelsData = (type: 'user' | 'system' = 'user') => {
  const key = type === 'system' ? 'systemWheelsData' : 'userWheelsData';
  return Taro.getStorageSync(key) || [];
};

// 设置转盘数据，根据 type 区分用户自定义和系统内置
export const setWheelsData = (data, type: 'user' | 'system' = 'user') => {
  const key = type === 'system' ? 'systemWheelsData' : 'userWheelsData';
  Taro.setStorageSync(key, data);
};

// 获取首页展示的转盘数据
export const getHomeWheelsData = () => {
  return Taro.getStorageSync('homeWheelsData') || [];
};

// 设置首页展示的转盘数据
export const setHomeWheelsData = (data) => {
  Taro.setStorageSync('homeWheelsData', data);
};

// 删除转盘数据
export const removeWheelData = (index, type: 'user' | 'system' = 'user') => {
  const wheelsData = getWheelsData(type);
  wheelsData.splice(index, 1);
  setWheelsData(wheelsData, type);
};