// pages/courseDetail/courseDetail.js

const app = getApp()

const request_url = app.globalData.request_url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo: { id: 1, name: '用英语聊聊垃圾分类', intro: '全国人民都在里聊垃圾分类，快戳get相关的英文表达！', curr_section:2 ,sections: 4, img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg'},
    courseSec:[
      { id: 1, title: '自我评价', subtitle: 'about yourself' },
      { id: 2, title: '教育背景', subtitle: 'education background' },
      { id: 3, title: '工作经历', subtitle: 'work experience' },
      { id: 4, title: '其他技能', subtitle: 'other skills' },
    ],
    scroll_height:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      url: request_url+"/SectionInfo",
      method:'GET',
      data:{
        course_id:course_id,
        open_id:app.globalData.open_id,
      },
      success(res){
        if(res.statusCode == "200"){
          let data = res.data;
          data.courseInfo.img = request_url+data.courseInfo.img;
          console.log(data);
          // 获取curr-section所对应的index
          let curr_section = data.courseInfo.curr_section;
          for(let i=0;i<data.courseSec.length;i+=1){
            if(curr_section == data.courseSec[i].id){
              that.setData({
                curr_section_index:i
              });
            }
          }
          that.setData({
            courseInfo:data.courseInfo,
            courseSec:data.courseSec
          })
        }else{
          console.log('课程不存在')
        }
      }
    })

    wx.getSystemInfo({
      success: function(res) {
        let cxClient = res.windowHeight;
        let cyClient = res.windowWidth;
        let ratio = cyClient/cxClient;
        let height = 750/ratio;
        //console.log(height);
        that.setData({
          scroll_height:height-120
        })
      },
    })
  },

  gotoRecord:function(event){
    let section = event.currentTarget.dataset.section;
    //console.log('section_id:'+section);
    let new_courseInfo = this.data.courseInfo;
    new_courseInfo.curr_section = section;
    // 更新当前课程
    this.setData({
      courseInfo:new_courseInfo
    });
    wx.navigateTo({
      url: '../record/record?section_id='+section,
    });
  },

  onShow:function(){
    //console.log('我出现了');
    // 在这里更新当前课程信息
    //console.log('当前课程：'+this.data.courseInfo.curr_section)
  }
})