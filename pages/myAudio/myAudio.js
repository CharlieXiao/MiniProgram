// pages/myAudio/myAudio.js

const app = getApp();
const request_url = app.globalData.request_url;
let innerAudioContext = undefined;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	hasAudio:true,
	AudioList:[
		{
			sentence_en:'when one is so sad',
			id:'1',
			src:'http://127.0.0.1:8000/media/default/default.wav',
			course:'《小王子》经典台词',
			score:'88',
			notRemove: true,
		},
		{
			sentence_en:'if you forget me',
			id:'3',
			src:'http://127.0.0.1:8000/media/default/default.wav',
			course:'《如果你忘了我》',
			score:'90',
			notRemove: true,
		},
		{
			sentence_en:'what makes the desert beautiful',
			id:'2',
			src:'http://127.0.0.1:8000/media/default/default.wav',
			course:'《小王子》经典台词',
			score:'65',
			notRemove: true,
		},
	],
	removeAudioList:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '历史音频',
    })
	},

	onUnload: function(){
		// 离开页面时停止播放
		if(innerAudioContext != undefined){
			innerAudioContext.destroy();
		}
		console.log('页面退出');
		console.log(this.data.removeAudioList);
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
		let src = event.currentTarget.dataset.src
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