//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Life is like a boat.',
    author: 'Rie fu',
    month:'july',
    week:'wed',
    day:'3',
    study:'start',
    style:'mood',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  //点击开始按钮跳转到学习页面
  bindViewTap: function() {
	//跳转到另一个tabBar页面
    wx.switchTab({
		url: '../study/study'
	})
  },

  onLoad: function () {
    //设定当前时间
	var currDate = new Date();
	var month,week;
	switch(currDate.getMonth()){
		//获取当前月份，且月份从0开始，0代表1月
		case 0:
			month = 'Jan';
			break;
		case 1:
			month = 'Feb';
			break;
		case 2:
			month = 'Mar';
			break;
		case 3:
			month = 'Apr';
			break;
		case 4:
			month = 'May';
			break;
		case 5:
			month = 'June';
			break;
		case 6:
			month = 'July';
			break;
		case 7:
			month = 'Aug';
			break;
		case 8:
			month = 'Sept';
			break;
		case 9:
			month = 'Oct';
			break;
		case 10:
			month = 'Nov';
			break;
		case 11:
			month = 'Dec';
			break;
	}

	switch(currDate.getDay()){
		//获取当前星期，0-6，0代表星期天
		case 0:
			week = 'Sun';
			break;
		case 1:
			week = 'Mon';
			break;
		case 2:
			week = 'Tues';
			break;
		case 3:
			week = 'Wed';
			break;
		case 4:
			week = 'Thur';
			break;
		case 5:
			week = 'Fri';
			break;
		case 6:
			week = 'Sat';
			break;
	}
	
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  
})
