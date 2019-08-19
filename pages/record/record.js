// pages/record/record.js

//导入util外部文件
const md5 = require('../../utils/md5.js') 
const pattern = /\w+'\w+|\w+-\w+|[.,;?!-:()'"]+|\w+/g;
const app = getApp();
const recorderManager = wx.getRecorderManager();

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
    courseInfo: { id: 1, name: '用英语聊聊垃圾分类', intro: '全国人民都在里聊垃圾分类，快戳get相关的英文表达！', curr_section: 2, sections: 4, img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg' },
    sectionInfo: { id: 1, title: '自我评价', subtitle: 'about yourself', num_sentences: 6, curr_sentence: 4 },
    sentences: [],
    isPlay: false,
    isRecord: false,
    isJudged: false,
    result: 90,
    footer_height: '260rpx',
    cxClient: 0,
    cyClient: 0,
  },

  onLoad: function (options) {
    //设置标题名称
    wx.setNavigationBarTitle({
      title: this.data.sectionInfo.title,
    });

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

    //从后端获取句子信息，将其拆分成单词数组，
    let sentence_en = ['You know - one loves the sunset,', 'when one is so sad.', 'The stars are beautiful,', 'because of a flower that cannot be seen.', 'It is the time you have wasted for your rose', 'that makes your rose so important.'];
    let sentence_ch = ['你知道的--当一个人情绪低落的时候，', '他会格外喜欢看日落，', '星星真美，', '因为有一朵看不见的花。', '你在你的玫瑰花身上耗费的时间', '使得你的玫瑰变得如此重要'];
    let Sentences = [];
    for (var i = 0; i < sentence_en.length; i++) {
      Sentences.push({
        en: sentence_en[i],
        en_sep: sentence_en[i].match(pattern),
        ch: sentence_ch[i],
        id: i + 1
      });
    }

    this.setData({
      sentences: Sentences
    });

    //用户授权使用录音功能
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    //this指针指向当前对象，再回调函数中无法使用，因此需要获取当前对象
    this.AuthDialog = this.selectComponent('#AuthRecord');

    this.VerbDialog = this.selectComponent('#VerbTrans');

    let that = this;

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
    TutorialAudio.autoplay = true
    TutorialAudio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';

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

    //更换地址需要销毁上一个对象
    TutorialAudio.destroy();
    TutorialAudio = wx.createInnerAudioContext();
    TutorialAudio.autoplay = true;
    TutorialAudio.src = this.tempFilePath;

    //播放结束的回调函数
    TutorialAudio.onEnded(() => {
      console.log('播放结束');
      this.setData({
        isPlay: false,
      });
    });
  },

  //返回课程信息页，必须是navigateBack,返回上一个页面
  backToCourse: function () {
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
    let verbInfo = event.currentTarget.dataset.verb;
    const verbPattern = /\w+'\w+|\w+-\w+|\w+/g;
    if (verbInfo.match(verbPattern)) {
      let that = this;

      var appKey = '4f938f684c09931e';
      var key = 'dkzAd8YOi8pg77V7j7a3QTcJ0vOv6VWk';//注意：暴露appSecret，有被盗用造成损失的风险
      var salt = (new Date).getTime();
      var query = verbInfo;
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var from = 'en';
      var to = 'zh-CHS';
      var str1 = appKey + query + salt +key;
      var sign = md5(str1);

      //发起request请求

      //考虑搭建数据库后先从数据库中获取单词解释，数据库中不存在时再从有道云中获取

      wx.request({
        url: 'https://openapi.youdao.com/api',
        type: 'post',
        dataType: 'jsonp',
        data: {
            q: query,
            appKey: appKey,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        },

        success(res){
          console.log('数据接受成功')
          //获取到的数据好像是一个字符串，需要用json.js进行分析，使用JSON.parse(jsonstr)可以将JSON字符串反序列化成json对象
          var verbInfo = JSON.parse(res.data);
          if(verbInfo.errorCode == "0"){
            //错误码为0时为请求成功
            that.VerbDialog.showDialog(verbInfo);
          }else{
            //因其他原因请求失败时
            console.log("ERROR : "+verbInfo.errCode)
          }
        },

        fail(){
          console.log('数据请求失败');
        }

      });

      //this.VerbDialog.showDialog(verbInfo);
    } else {
      console.log('不是单词嗷');
    }
  },

  VerbEvent: function(event){
    console.log(event.detail.isFav);
    console.log(event.detail.verb);
  }

})