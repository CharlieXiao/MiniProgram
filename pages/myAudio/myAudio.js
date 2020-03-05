// pages/myAudio/myAudio.js

const app = getApp();
const request_url = app.globalData.request_url;
let innerAudioContext = undefined;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	hasAudio:false,
	removeAudioList:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    })
		let that = this;

		wx.setNavigationBarTitle({
			title: '历史音频',
		}),
		
		// 获取音频列表
		wx.request({
			url:request_url+'/AudioList',
			method:'GET',
			header: { session: app.globalData.session },
			success(res){
				console.log(res);
				that.setData({
					hasAudio:res.data.hasAudio,
					AudioList:res.data.AudioList,
				})
        wx.hideLoading();
			},
		})
	},

	onUnload: function(){
		// 离开页面时停止播放
		if(innerAudioContext != undefined){
			innerAudioContext.destroy();
		}
		console.log('页面退出');
		console.log(this.data.removeAudioList);

		//连接服务器删除录音

		wx.request({
			url:request_url+'/removeAudioList',
			method:'GET',
			data:{
				removeList:this.data.removeAudioList,
            }, header: { session: app.globalData.session },
			success(res){
				console.log(res);
			}
		})
	},

	removeAudio: function(event){

		console.log('移除单词')

		let audio_id = event.currentTarget.dataset.id;
		let audio_index = event.currentTarget.dataset.index;
		let new_AudioList = this.data.AudioList;
		let new_remove_AudioList = this.data.removeAudioList;

		new_AudioList[audio_index].notRemove = false;

		// 更新删除的录音列表

		new_remove_AudioList.push(audio_id);

		// 判断录音列表是否全都被删除了

		let flag = true

		for(let i=0;i<new_AudioList.length;i++){
			if(new_AudioList[i].notRemove == true){
				flag = false;
				break;
			}
		}
		
		if(flag){
			this.setData({
				hasAudio:false
			})
		}

		this.setData({
			AudioList:new_AudioList,
			removeAudioList:new_remove_AudioList
		})
	},

	userAudio: function(event){
		let src = request_url+event.currentTarget.dataset.src
		innerAudioContext = wx.createInnerAudioContext()
		innerAudioContext.src = src
		innerAudioContext.autoplay = true

		console.log('开始播放')
		
		innerAudioContext.onEnded(function(){
		// 播放完成后立即删除
			innerAudioContext.destroy();
			console.log('播放结束')
		})
	}
})