import Taro from '@tarojs/taro';

export const getWheelsData = () => {
  return Taro.getStorageSync('wheelsData') || [];
};

export const setWheelsData = (data) => {
  Taro.setStorageSync('wheelsData', data);
};

export const removeWheelData = (index) => {
  const wheelsData = getWheelsData();
  wheelsData.splice(index, 1);
  setWheelsData(wheelsData); // 修正函数名错误，应该是 setWheelsData
};
