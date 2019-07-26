// pages/userinfo/userinfo.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

	//canIUse用于判断小程序API是否在当前版本可用

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
		//如果app中已经保存了用户信息，直接将全局变量的userinfo赋值过来即可
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			//箭头函数 函数名 = 参数名 => 返回值;代码多余一条就要用大括号括起来
			app.userInfoReadyCallback = res => {
				if(res.userInfo != undefined ){
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
  },

	getUserInfo: function (e) {
		if(e.detail.userInfo != undefined){
			console.log(e);
			app.globalData.userInfo = e.detail.userInfo
			this.setData({
				userInfo: e.detail.userInfo,
				hasUserInfo: true
			});
		}
	},

	verbList: function(){
		wx.navigateTo({
			url: '../verbList/verbList',
		});
	},

	AudioList: function () {
		wx.navigateTo({
			url: '../myAudio/myAudio',
		});
	},

	studyAlarm: function () {
		wx.navigateTo({
			url: '../studyAlarm/studyAlarm',
		});
	},

	courseList: function () {
		wx.navigateTo({
			url: '../myCourse/myCourse',
		});
	},

	questions: function(){
		wx.navigateTo({
			url: '../questions/questions',
		});
	},
})