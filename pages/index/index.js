//index.js

Page({
  data: {
		motto: 'Even the darkest night will end and the sun will rise.',
		author: 'Les Mserables',
    month:'',
    week:'',
    day:'',
    study:'start',
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
	};

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
	};
	
	this.setData({
		month:month,
		week:week,
		day:currDate.getDate()
	});

  }

})
