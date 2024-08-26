export default defineAppConfig( {
  pages: [
    'pages/index/index',
    'pages/edit/index',
    'pages/addWheel/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '转盘小程序',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/edit/index',
        text: '配置'
      },
    ]
  }
})
