// pages/study/study.js

const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
		isAuthRecord:true,
		MSG:'开始录音'
  },

  onLoad: function (options) {
		//用户授权使用录音功能
		// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
		//this指针指向当前对象，再回调函数中无法使用，因此需要获取当前对象
		this.AuthDialog = this.selectComponent('#AuthRecord');
		var that = this;
		wx.getSetting({
			success: function (res) {
				//保存用户授权记录
				if (!res.authSetting['scope.record']) {
					wx.authorize({
						scope: 'scope.record',
						success() {
							// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
							//wx.startRecord()
							that.setData({
								isAuthRecord: true
							});
							console.log('用户授权了')
						},
						//用户已经拒绝的时候不会出现弹窗,而是直接进入接口fail回调,需要进入设置页面手动设置
						fail() {
							that.setData({
								isAuthRecord: false
							});
							console.log('用户没授权')
						},
					})
				}
			}
		});		
  },

	StartRecord: function(e) {
		//检测录音时没有录音权限，提示用户开启权限
		if(!this.data.isAuthRecord){
			wx.hideTabBar();
			this.AuthDialog.showDialog();
		}else{
			console.log('开始录音');
			wx.showLoading({
				title: '开始录音',
			})
			this.setData({
				MSG:'结束录音'
			});
		}
	},

	EndRecord: function(e) {
		//只对有录音权限时做出反应
		if(this.data.isAuthRecord){
			console.log('录音结束');
			this.setData({
				MSG: '开始录音'
			});
			wx.hideLoading();
		}
	},

	confirmEvent: function () {
		wx.openSetting({
			//将返回的结果更新
			//但是返回的结果会在onShow函数之后才更新
			success: (res) => {
				this.setData({
					isAuthRecord: res.authSetting['scope.record']
				});
			}
		});
		this.AuthDialog.hideDialog();
		wx.showTabBar({
			aniamtion: true
		});
	},

	cancelEvent: function () {
		//由于onShow函数中将isAuthRecord设置为true，需要在取消时设置为false
		this.setData({
			isAuthRecord:false
		});
		this.AuthDialog.hideDialog();
		wx.showTabBar({
			aniamtion: true
		});
	},

})