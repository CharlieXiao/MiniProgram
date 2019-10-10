// pages/study/study.js

const request_url = getApp().globalData.request_url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    choice:'default',
  },

  onLoad: function (options) {
    let that = this;

    wx.showLoading({
      title: '内容加载中',
    })

    wx.getSystemInfo({
      success: function(res) {
        let cyClient = res.windowHeight;
        //由于微信小程序宽度都是750rpx,可以计算出高度
        let cxClient = res.windowWidth;
        //顶部高度,计算时还需要减去下导航栏高度

        let headerHeight = parseInt(180*cxClient/750);

        that.setData({
          height:cyClient-headerHeight,
        })
      },
    })

    //连接后台服务器获取课程列表信息
    // 默认排序方式为1，按照添加顺序排序
    wx.request({
      url:request_url+'/CourseInfo',
      method:'GET',
      data:{
        order:this.data.choice
      },
      success:(res)=>{
        //console.log(res.data)
        that.setData({
          courseArray:res.data
        })
        wx.hideLoading();
      },
    })
  },

  gotoCourseDetail: function(event){
    let course_id = event.currentTarget.dataset.courseid
    console.log(course_id);
    wx.navigateTo({
      url: '../courseDetail/courseDetail?course_id='+course_id,
    });
  },

  gotoMyCourse: function(event){
    wx.navigateTo({
      url: '../myCourse/myCourse',
    });
  },

  changeChoice: function (event) {
    let that = this;
    let choice = event.currentTarget.dataset.choice;
    if (this.data.choice != choice) {
      //切换菜单显示
      this.setData({
        choice: choice
      });
      //发送request请求到服务器获取相应数据
      wx.showLoading({
        title: '数据加载中',
      })
      wx.request({
        url:request_url+'/CourseInfo',
        method:'GET',
        data:{
          order:choice
        },
        success:(res)=>{
          //console.log(res.data)
          that.setData({
            courseArray:res.data
          })
          wx.hideLoading();
        },
      })
    }
  },

})