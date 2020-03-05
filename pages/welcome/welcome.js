// pages/login/login.js

const app = getApp();

var log = require('../../utils/log.js')

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
        // 这个页面存在的意义应该是在用户第一次打开本应用时触发
        // 实际这个session并不能一直保存
        let hasUserInfo = wx.getStorageSync('hasUserInfo');
        app.globalData.session = wx.getStorageSync('session');
        
        if (hasUserInfo == true) {
            wx.switchTab({
                url: '../index/index',
            })
            log.info("跳转到初始界面")
        }else{
            log.info("没有获取到用户信息")
        }

    },
    // 响应按钮点击事件，当用户点击登录时
    getUserInfo: function (e) {
        if (e.detail.userInfo != undefined) {
            console.log(e);
            app.globalData.userInfo = e.detail.userInfo;
            // 登录，获取用户openID，并存储在全局信息中
            wx.setStorage({
                key: 'hasUserInfo',
                data: true,
            })
            wx.switchTab({
                url: '../index/index',
            })
            log.info("用户初次登录")
        }else{
            log.error("无法获取用户信息")
        }
    },

})