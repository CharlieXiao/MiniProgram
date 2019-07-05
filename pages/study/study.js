// pages/study/study.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		//用户授权使用录音功能
		// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
		// wx.getSetting({
		// 	success(res) {
		// 		if (!res.authSetting['scope.record']) {
		// 			wx.authorize({
		// 				scope: 'scope.record',
		// 				success() {
		// 					// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
		// 					wx.startRecord()
		// 				}
		// 			})
		// 		}
		// 	}
		// });
  },

})