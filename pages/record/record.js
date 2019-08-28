// pages/record/record.js

//导入util外部文件
const md5 = require('../../utils/md5.js')
//const pattern = /\w+'\w+|\w+-\w+|[.,;?!-:()'"]+|\w+/g;
const app = getApp();
const recorderManager = wx.getRecorderManager();
const request_url = app.globalData.request_url;

//分两个对象，一个播放教学语音，一个播放用户录音
let TutorialAudio = wx.createInnerAudioContext();
let UserAudio = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthRecord: true,
    MSG: '开始录音',
    courseImage: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg',
    //sectionInfo: { id: 1, title: '自我评价', subtitle: 'about yourself', num_sentences: 6, curr_sentence: 4 },
    //sentences: [],
    isPlay: false,
    isRecord: false,
    isJudged: false,
    result: 90,
    footer_height: '400rpx',
    cxClient: 0,
    cyClient: 0,
  },

  onLoad: function (options) {

    let section_id = options.section_id

    console.log('curr section: ' + section_id)

    // 从后台获取信息

    let that = this

    wx.request({
      url: request_url + "/SentenceInfo",
      method: 'GET',
      data: { section_id: section_id },
      success(res) {
        if (res.statusCode == '200' && res.data.error == '0') {
          console.log(res.data)
          var data = res.data
          // 由于小程序从后台获取图片链接是需要一定时间的，因此在渲染时会有一段时间图片链接为空，需要指定一张默认图片
          that.setData({
            courseImage:request_url + data.courseInfo.img,
            sectionInfo:data.sectionInfo,
            sentences:data.sentenceInfo
          })
        } else {
          console.log('数据请求失败')
        }
      }
    })

    //获取当前显示区域高度
    wx.getSystemInfo({
      success: (result) => {
        let cxClient = result.windowWidth;
        let cyClient = result.windowHeight;
        //对计算的高度进行向上取整
        this.setData({
          cxClient: cxClient,
          cyClient: cyClient,
        });
      },
    });

    //用户授权使用录音功能
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    //this指针指向当前对象，再回调函数中无法使用，因此需要获取当前对象
    this.AuthDialog = this.selectComponent('#AuthRecord');

    this.VerbDialog = this.selectComponent('#VerbTrans');

    wx.getSetting({
      success: function (res) {
        //保存用户授权记录
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              //wx.startRecord()
              that.setData({
                isAuthRecord: true
              });
              console.log('用户授权了')
            },
            //用户已经拒绝的时候不会出现弹窗,而是直接进入接口fail回调,需要进入设置页面手动设置
            fail() {
              that.setData({
                isAuthRecord: false
              });
              console.log('用户没授权')
            },
          })
        }
      }
    });
  },

  onReady: function () {
    let start_index = this.data.sentences[0].id
    TutorialAudio.autoplay = true
    TutorialAudio.src = request_url + this.data.sentences[this.data.sectionInfo.curr_sentence-start_index].src;

    console.log(TutorialAudio.src)

    //播放结束的回调函数
    TutorialAudio.onEnded(() => {
      console.log('播放结束');
      this.setData({
        isPlay: false,
      });
    });

    this.setData({
      toIndex: 'sentence-' + this.data.sectionInfo.curr_sentence,
      isPlay: true,
    });

    //设置标题名称
    wx.setNavigationBarTitle({
      title: this.data.sectionInfo.subtitle,
    });
  },

  onUnload: () => {
    //退出页面的同时要销毁发音对象，防止在后台继续播放
    TutorialAudio.destroy();
  },

  StartRecord: function (e) {
    //检测录音时没有录音权限，提示用户开启权限
    if (!this.data.isAuthRecord) {
      wx.hideTabBar();
      this.AuthDialog.showDialog();
    } else {
      //录音之前先暂停
      TutorialAudio.stop();
      const options = {
        duration: 10000,//指定录音的时长，单位 ms
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 96000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      }
      //开始录音
      recorderManager.start(options);
      recorderManager.onStart(() => {
        console.log('开始录音');
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
      })
      this.setData({
        MSG: '结束录音',
        isRecord: true,
      });
    }
  },

  EndRecord: function (e) {
    //只对有录音权限时做出反应
    if (this.data.isAuthRecord) {

      recorderManager.stop();

      recorderManager.onStop((res) => {

        this.tempFilePath = res.tempFilePath;

        console.log('停止录音', res.tempFilePath)

      })
      this.setData({
        MSG: '开始录音',
        isRecord: false,
      });
    }
  },

  //权限选择对话框
  confirmEvent: function () {
    wx.openSetting({
      //将返回的结果更新
      //但是返回的结果会在onShow函数之后才更新
      success: (res) => {
        this.setData({
          isAuthRecord: res.authSetting['scope.record']
        });
      }
    });
    this.AuthDialog.hideDialog();
    wx.showTabBar({
      aniamtion: true
    });
  },

  cancelEvent: function () {
    //由于onShow函数中将isAuthRecord设置为true，需要在取消时设置为false
    this.setData({
      isAuthRecord: false
    });
    this.AuthDialog.hideDialog();
    wx.showTabBar({
      aniamtion: true
    });
  },

  //跳转下一句
  gotoSentence: function (event) {
    let sentence_id = event.currentTarget.dataset.sentenceid;
    let new_sectionInfo = this.data.sectionInfo;

    //此时单位为rpx
    let num_others = this.data.sectionInfo.num_sentences - sentence_id;

    //最好不要使用rpx计算，直接计算px值，减小误差

    //计算px与rpx的转换关系
    //1rpx = cxClient/750 px

    //当前录音栏的实际高度

    let new_footer_height = '260rpx';
    //判断是否需要修改底部按钮栏的高度

    let rpx2px = this.data.cxClient / 750;

    let currSentenceHeight = parseInt(650 * rpx2px);

    let otherSentenceHeight = parseInt(260 * rpx2px);

    //直接取整计算px值
    let actualHeight = num_others * otherSentenceHeight + currSentenceHeight;

    if (actualHeight + otherSentenceHeight < this.data.cyClient) {
      new_footer_height = this.data.cyClient - actualHeight + 'px';
    }

    new_sectionInfo.curr_sentence = sentence_id;

    this.setData({
      sectionInfo: new_sectionInfo,
      toIndex: 'sentence-' + sentence_id,
      footer_height: new_footer_height,
      isPlay: true,
    });

    //进入页面就开始播放

    let start_index = this.data.sentences[0].id

    //更换地址需要销毁上一个对象
    TutorialAudio.destroy();
    TutorialAudio = wx.createInnerAudioContext();
    TutorialAudio.autoplay = true;
    TutorialAudio.src = request_url + this.data.sentences[sentence_id-start_index].src;

    console.log(TutorialAudio.src)

    //播放结束的回调函数
    TutorialAudio.onEnded(() => {
      console.log('播放结束');
      this.setData({
        isPlay: false,
      });
    });
  },

  //返回课程信息页，必须是navigateBack,返回上一个页面
  backToCourse: function (event) {
    //连接服务器，更新用户学习信息
    console.log(this.data.sectionInfo.curr_sentence)
    wx.request({
      url: request_url + '/updateStudyStatus',
      method: 'GET',
      data: { curr_sentence: this.data.sectionInfo.curr_sentence },
      success:(res)=>{
        console.log(res)
      }
    })
    wx.navigateBack({
      url: '../courseDetail/courseDetail',
    });
  },

  //开始播放音频
  StartPlay: function () {
    TutorialAudio.play();

    TutorialAudio.onPlay(() => {
      console.log('开始播放')
    });

    TutorialAudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });

    //在录音播放结束后重新变回播放状态
    TutorialAudio.onEnded(() => {
      console.log('播放结束');
      this.setData({
        isPlay: false,
      });
    });

    this.setData({
      isPlay: true
    });
  },

  //结束播放音频 
  EndPlay: function () {
    console.log('暂停播放音频');
    this.setData({
      isPlay: false
    });
    TutorialAudio.pause();
  },

  //上传服务器评分
  JudgeRecord: function () {
    console.log('播放个人录音');
    //还未实现，暂时仅播放个人录音
    //由于需要更新地址，先暂停播放教学音频
    TutorialAudio.pause();
    //清除上一次的录音
    if (UserAudio != undefined) {
      UserAudio.destroy();
    }
    UserAudio = wx.createInnerAudioContext();
    UserAudio.autoplay = true;
    UserAudio.src = this.tempFilePath;

    this.setData({
      isJudged: true,
      result: 99,
      isPlay: false,
    });
  },

  getTrans: function (event) {
    let verb = event.currentTarget.dataset.verb;
    const verbPattern = /\w+'\w+|\w+-\w+|\w+/g;
    if (verb.match(verbPattern)) {

      wx.showLoading({
        title: '查询释义中',
        mask: true
      })

      let that = this;

      wx.request({
        url:request_url + '/getVerbTrans',
        method:'GET',
        data:{verb:verb},
        success:(res)=>{
          let verbInfo = res.data;
          console.log(verbInfo);
          that.VerbDialog.showDialog(verbInfo);
        },

        complete() {
          wx.hideLoading()
        },
      })

    } else {
      console.log('不是单词嗷');
    }
  },

  VerbEvent: function (event) {
    console.log(event.detail.isFav);
    console.log(event.detail.verb);
  }

})