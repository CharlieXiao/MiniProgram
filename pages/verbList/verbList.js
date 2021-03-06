// pages/verbList/verbList.js

const app = getApp();
const request_url = app.globalData.request_url;

Page({

    /**
     * 页面的初始数据
     */

    data: {
        hasVerb: true,
        removeVerbList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '数据加载中',
        })
        wx.setNavigationBarTitle({
            title: '生词笔记',
        });

        let that = this;

        wx.request({
            url: request_url + '/VerbList',
            header: {
                OPENID: app.globalData.open_id,
            },
            method: 'GET',
            success: function(res) {
                console.log(res);
                that.setData({
                    hasVerb: res.data.hasVerb,
                    verbList: res.data.verbList,
                })
                wx.hideLoading();
            }
        })
    },

    onUnload: function() {
        // 在页面退出时与服务器同步，删除所选单词，避免多次连接同步，尽量只同步一次
        // console.log(this.data.removeVerbList)

        wx.request({
            url: request_url + '/removeVerbList',
            data: {
                removeList: this.data.removeVerbList,
            },
            header: { OPENID: app.globalData.open_id,},
            method: 'GET',
            success: function(res) {
                console.log(res)
            }
        })

    },

    verbPron: function(event) {
        let src = request_url + event.currentTarget.dataset.src
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = src
        innerAudioContext.autoplay = true

        console.log('开始播放')

        innerAudioContext.onEnded(function() {
            // 播放完成后立即删除
            innerAudioContext.destroy();
            console.log('播放结束')
        })
    },

    removeVerb: function(event) {
        console.log('移除单词')

        let verbid = event.currentTarget.dataset.verbid;
        let verbindex = event.currentTarget.dataset.verbindex;
        let new_verbList = this.data.verbList;
        let new_remove_verbList = this.data.removeVerbList;

        new_verbList[verbindex].notRemove = false;

        // 更新删除的单词列表

        new_remove_verbList.push(verbid);

        // 判断单词列表是否全都被删除了

        let flag = true

        for (let i = 0; i < new_verbList.length; i++) {
            if (new_verbList[i].notRemove == true) {
                flag = false;
                break;
            }
        }

        if (flag) {
            this.setData({
                hasVerb: false
            })
        }

        this.setData({
            verbList: new_verbList,
            removeVerbList: new_remove_verbList
        })
    }

})