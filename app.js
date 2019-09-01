//app.js
App({
  onLaunch: function () {
    //在app.json文件中，pages数组设置在第一个的页面就是默认打开页面
    //在用户第一次点开小程序时，需要用户授权登录
    //优先跳转到login页面，用户授权登录后会进入首页，开始学习
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
							//userInfoReadyCallback是在Page.Onload函数中定义的，这个函数可以确保userinfo和hasUserInfo被正确的复制
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    request_url : 'http://127.0.0.1:8000'
  }
})