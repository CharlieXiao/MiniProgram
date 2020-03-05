// pages/myCourse/myCourse.js

const app = getApp();

const request_url = app.globalData.request_url


Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: 0,
        choice: 1,
        hasCourse: false,
        request_url: request_url
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '数据加载中',
        })
        let that = this;

        wx.request({
            url: request_url + '/UserCourse',
            data: { 'order': 1 }, 
            header: { session: app.globalData.session },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
                console.log(res);
                let courseArray = res.data;
                if (courseArray.length == 0) {
                    that.setData({
                        hasCourse: false
                    })
                } else {
                    that.setData({
                        hasCourse: true,
                        courseArray: courseArray
                    })
                }
                wx.hideLoading();
            },
        });

        wx.getSystemInfo({
            success: function (res) {
                let cyClient = res.windowHeight;
                //由于微信小程序宽度都是750rpx,可以计算出高度
                let cxClient = res.windowWidth;

                let headerHeight = parseInt(210 * cxClient / 750);
                that.setData({
                    height: cyClient - headerHeight,
                });
            },
        });
    },

    gotoCourseDetail: function (event) {
        console.log(event.currentTarget.dataset.courseid);
        let course_id = event.currentTarget.dataset.courseid;
        wx.navigateTo({
            url: '../courseDetail/courseDetail?course_id=' + course_id,
        })
    },

    changeChoice: function (event) {
        let choice = event.currentTarget.dataset.choice;
        if (this.data.choice != choice) {
            //切换菜单显示
            this.setData({
                choice: choice
            });

            wx.showLoading({
                title: '数据加载中',
            })

            let that = this;
            //发送request请求到服务器获取相映数据

            wx.request({
                url: request_url + '/UserCourse',
                data: { 'order': choice }, 
                header: { session: app.globalData.session },
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    console.log(res);
                    let courseArray = res.data;
                    if (courseArray.length == 0) {
                        that.setData({
                            hasCourse: false
                        })
                    } else {
                        that.setData({
                            courseArray: res.data,
                            hasCourse: true
                        });
                    }
                    wx.hideLoading();
                },
            })
        }
    },

    gotoCourseList: function () {
        wx.switchTab({
            url: '../study/study',
        });
    }
})