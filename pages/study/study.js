// pages/study/study.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseArray:[
      { name: '用英语聊垃圾分类', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318470&di=4746451e773f9d579c00014ee0031e4f&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F0f9b37ceab6be262a7bfdb7107935dc5b7b31471170f3-sckldc_fw658', length: '18 hours' ,id:1},
      { name: '和同桌的日常', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=5e2808f1688bea9ac79f7b2d740bb2aa&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F6c9c4f15a369521f682394632f7e246ae004187e80847-uOtIza_fw658', length: '12 hours',id:2 },
      { name: '常用数字表示法', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg', length: '13 hours',id:3 },
      { name: '暑假晨读小故事', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318468&di=184c7e1522cb1de2746e3af6dc0deacc&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F88437179faa9750b72b02f028c14f6f9837e4db917778-JBHnBy_fw658', length: '11 hours',id:4 },
      { name: '每日生活口语', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318467&di=2e06a11b9b046a09b489fba6f4abefda&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201409%2F18%2F20140918232022_heWCU.jpeg', length: '10 hours',id:5 },
      { name: '用英语聊垃圾分类', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318470&di=4746451e773f9d579c00014ee0031e4f&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F0f9b37ceab6be262a7bfdb7107935dc5b7b31471170f3-sckldc_fw658', length: '18 hours',id:6 },
      { name: '和同桌的日常', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=5e2808f1688bea9ac79f7b2d740bb2aa&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F6c9c4f15a369521f682394632f7e246ae004187e80847-uOtIza_fw658', length: '12 hours' ,id:7},
      { name: '常用数字表示法', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg', length: '13 hours' ,id:8 },
      { name: '暑假晨读小故事', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318468&di=184c7e1522cb1de2746e3af6dc0deacc&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F88437179faa9750b72b02f028c14f6f9837e4db917778-JBHnBy_fw658', length: '11 hours' , id:9},
      { name: '每日生活口语', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318467&di=2e06a11b9b046a09b489fba6f4abefda&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201409%2F18%2F20140918232022_heWCU.jpeg', length: '10 hours' ,id:10 },
    ],
  },

  onLoad: function (options) {
		
  },

  gotoCourseDetail: function(event){
    console.log(event.currentTarget.dataset.courseid);
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  }

})