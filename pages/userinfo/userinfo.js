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

	ShowAuthDialog: function(){
		wx.hideTabBar({
			aniamtion:true
			}
		);
		this.AuthDialog.showDialog();
	},

	confirmEvent: function(){
		console.log('你干嘛点确定？');
	},

	cancelEvent: function(){
		this.AuthDialog.hideDialog();
		wx.showTabBar({
			aniamtion:false
		});
	},


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
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
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

	onReady:function(){
		//选择数据授权对话框
		this.AuthDialog = this.selectComponent('#AuthUserInfo');
	},

	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	}
})