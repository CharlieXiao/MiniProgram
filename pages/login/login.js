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
    let hasUserInfo = wx.getStorageSync('hasUserInfo')

    if(hasUserInfo != "" && hasUserInfo != false){
      wx.switchTab({
        url: '../index/index',
      })
    }

  },

  getUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      console.log(e);
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        hasUserInfo: true
      });
      wx.setStorageSync('hasUserInfo', true)
      wx.switchTab({
        url: '../index/index',
      });
    }
  },

})