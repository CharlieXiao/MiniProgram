// pages/userinfo/userinfo.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo:false,
    userLanguage:'英语',
    userGender:'未知'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //在载入时如果获取了用户信息，则将用户信息加载出来
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo:true
      })
      if (app.globalData.userInfo.language == 'zh_CN') {
        this.setData({userLanguage:'简体中文'})
      }
      if (app.globalData.userInfo.gender == 1) {
        this.setData({userGender:'男'})
      } else if (app.globalData.userInfo.gender == 2){
        this.setData({userGender:'女'})
      }
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})