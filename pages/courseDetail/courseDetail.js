// pages/courseDetail/courseDetail.js

const app = getApp()

const request_url = app.globalData.request_url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '内容加载中',
    })
    let course_id = options.course_id;
    //console.log(course_id)
    //设置顶栏颜色
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#aaccbb',
    // });
    //计算滚动条高度
    let that = this;

    wx.request({
      url: request_url + "/SectionInfo",
      method: 'GET',
      data: {
        course_id: course_id
        }, 
        header: {
            'session': app.globalData.session
        },
      success(res) {
        if (res.statusCode == "200") {
          let data = res.data;
          data.courseInfo.img = request_url + data.courseInfo.img;
          console.log(data);
          let section_finish = data.section_finish;
          let prev_finish = true;
          let isLock = new Array(section_finish.length);
          for (let i = 0; i < section_finish.length; i += 1) {
            //console.log('prev_finish: '+prev_finish);
            //console.log('isFinish: '+section_finish[i]);
            if (prev_finish) {
              isLock[i] = false;
            } else {
              isLock[i] = true;
            }
            prev_finish = section_finish[i];
          }
          console.log(isLock);
          that.setData({
            courseInfo: data.courseInfo,
            courseSec: data.courseSec,
            isLock: isLock,
            course_id: course_id
          })
        } else {
          console.log('课程不存在')
        }
        wx.hideLoading();
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        let cxClient = res.windowHeight;
        let cyClient = res.windowWidth;
        let ratio = cyClient / cxClient;
        let height = 750 / ratio;
        //console.log(height);
        that.setData({
          scroll_height: height - 120
        })
      },
    })
  },

  gotoRecord: function (event) {
    let section = event.currentTarget.dataset.section;
    //console.log('section_id:'+section);
    let new_courseInfo = this.data.courseInfo;
    new_courseInfo.curr_section = section;
    // 更新当前课程
    this.setData({
      courseInfo: new_courseInfo
    });
    wx.navigateTo({
      url: '../record/record?section_id=' + section,
    });
  },

  onShow: function () {
    // 这里需要更新课程上锁信息
    //console.log('我出现了');
    // 在这里更新当前课程信息
    //console.log('当前课程：'+this.data.courseInfo.curr_section)
    // 由于此处的onShow和上一个页面的onUnload函数中的wx.request是一个异步的关系，有可能onShow中的wx.request函数会优先于后者的同名函数触发，因此获得的结果并不是更新后的结果
    //console.log(this.data.isLock)
    //let that = this
    // 延迟一段时间后输出isLock
    // setTimeout(function(){
    //   console.log(that.data.isLock)
    // },2000)
  }
})