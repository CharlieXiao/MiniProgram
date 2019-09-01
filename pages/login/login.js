// pages/login/login.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let hasUserInfo = wx.getStorageSync('hasUserInfo');
    let open_id = wx.getStorageSync('open_id');

    app.globalData.open_id = open_id;

    if(hasUserInfo != "" && hasUserInfo != false){
      wx.switchTab({
        url: '../index/index',
      })
    }

  },

  getUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      console.log(e);
      app.globalData.userInfo = e.detail.userInfo;
      // 登录，获取用户openID，并存储在全局信息中
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if(res.code){
            wx.request({
              url: app.globalData.request_url + '/UserLogin',
              data: {
                code: res.code
              },
              method:'GET',
              success: res =>{
                console.log(res.data.open_id);
                // 感觉此时这个同步版本的设置存储仍然是一个异步函数，因此将open_id存储在app.globalData中
                wx.setStorageSync('open_id',res.data.open_id);
                wx.setStorageSync('hasUserInfo',true);
                // 从服务端获取open_id,存储在全局信息中
                app.globalData.open_id = res.data.open_id;
                // 设置成功后再跳转，防止index页面在加载时open_id还不存在
                wx.switchTab({
                  url: '../index/index',
                });
              }
            });
          } else {
            console.log('登录失败: '+res.errMsg);
          }
        }
      })
    }
  },

})