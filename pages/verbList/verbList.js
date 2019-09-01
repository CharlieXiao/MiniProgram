// pages/verbList/verbList.js

const app = getApp();
const requset_url = app.globalData.requset_url;

Page({

	/**
	 * 页面的初始数据
	 */

	data: {
	  hasVerb:true,
    verbList: [
      {verb: 'and',phonetic: '[ənd, ən, ænd]',explain: { pos: 'conj.', explain: '和，与；就；而且；但是；然后' },speech: 'xxxxxx'},
      {verb: 'or',phonetic: '[ɔr]',explain: { pos: 'conj.', explain: '或，或者；还是；要不然' },speech: 'xxxxxx'},
      {verb: 'not',phonetic: '[nɑt]',explain: { pos: 'adv.', explain: '表示否定，不' },speech: 'xxxxxx'},
    ],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '生词笔记',
    })
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