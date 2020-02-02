//index.js

const app = getApp();

const request_url = app.globalData.request_url;

Page({
  data: {
    month:'',
    week:'',
    day:'',
    learn_days:0,
  },
  //事件处理函数

  //点击开始按钮跳转到学习页面
  gotoCurrCourse: function(e) {
    // 判断用户是否有当前学习课程
    let curr_course = e.currentTarget.dataset.currcourse;
    if(curr_course == -1){
      wx.switchTab({
        url: '../study/study',
      });
    }else{
      wx.navigateTo({
        url: '../courseDetail/courseDetail?course_id='+curr_course
      });
    }
    
  },

  gotoCourselist: function(){
    wx.switchTab({
      url: '../study/study',
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
	};

	switch(currDate.getDay()){
		//获取当前星期，0-6，0代表星期天
		case 0:
			week = 'Sunday';
			break;
		case 1:
			week = 'Monday';
			break;
		case 2:
			week = 'Tuesday';
			break;
		case 3:
			week = 'Wednesday';
			break;
		case 4:
			week = 'Thursday';
			break;
		case 5:
			week = 'Friday';
			break;
		case 6:
			week = 'Saturday';
			break;
	};
	
	this.setData({
		month:month,
		week:week,
		day:currDate.getDate()
	});

  let that = this;

  wx.request({
    url: request_url+"/index",
    method:"GET",
    data:{
		'open_id':app.globalData.open_id
	},

    success(res) {
      //请求成功
      if(res.statusCode == "200" && res.data.error == undefined){
        var data = res.data
        console.log(data)
        that.setData({
          motto:data.motto,
          author:data.author,
		      poster:request_url+data.poster,
		      learn_days:data.learn_days,
          curr_course:data.curr_course,
		});
		// 设置全局变量
		app.globalData.learn_days = data.learn_days;
      }else{
        console.log('网络连接失败，请检查网络')
      }
    }
   })
  },

  onReady: function(){
    //进入首页后直接跳转到想要预览的页面
    // wx.switchTab({
    //   url: '../userinfo/userinfo',
    // })
    // wx.switchTab({
    //   url: '../study/study',
    // });
    // wx.navigateTo({
    //   url: '../record/record?section_id=4',
    // })
    // wx.navigateTo({
    //     url: '../questions/questions',
    // })
  }

})
