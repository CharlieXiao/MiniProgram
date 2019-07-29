// pages/record/record.js

//导入util外部文件

const pattern = /\w+'\w+|\w+-\w+|[.,;?!-:()'"]+|\w+/g;
const util = require('../../utils/util.js');
const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthRecord: true,
    MSG: '开始录音',
    courseInfo: { id: 1, name: '用英语聊聊垃圾分类', intro: '全国人民都在里聊垃圾分类，快戳get相关的英文表达！', curr_section: 2, sections: 4, img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564137318469&di=c1d4a055f340e69d91f09e6641a48146&imgtype=0&src=http%3A%2F%2Fwww.tsf.edu.pl%2Fwp-content%2Fuploads%2F2015%2F03%2Fpokaz1-1420x5001-1420x500.jpg' },
    sectionInfo: { id: 1, title: '自我评价', subtitle: 'about yourself' ,num_sentences:6,curr_sentence:4},
    sentences:[],
    isPlay:false,
    isRecord:false,
    isJudged:false,
    result:90,
  },

  onLoad: function (options) {
    //设置标题名称
    wx.setNavigationBarTitle({
      title: this.data.sectionInfo.title,
    })

    //从后端获取句子信息，将其拆分成单词数组，
    let sentence_en = ['You know - one loves the sunset,','when one is so sad.','The stars are beautiful,','because of a flower that cannot be seen.','It is the time you have wasted for your rose','that makes your rose so important.'];
    let sentence_ch = ['你知道的--当一个人情绪低落的时候，','他会格外喜欢看日落，','星星真美，','因为有一朵看不见的花。','你在你的玫瑰花身上耗费的时间','使得你的玫瑰变得如此重要'];
    let Sentences = [];
    for(var i = 0;i< sentence_en.length ;i++){
      Sentences.push({
        en:sentence_en[i],
        en_sep:sentence_en[i].match(pattern),
        ch:sentence_ch[i],
        id:i+1
      });
    }
    this.setData({
      sentences:Sentences
    });

    //用户授权使用录音功能
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    //this指针指向当前对象，再回调函数中无法使用，因此需要获取当前对象
    this.AuthDialog = this.selectComponent('#AuthRecord');
    var that = this;
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

  onReady:function(){
    this.setData({
      toIndex:'sentence-'+this.data.sectionInfo.curr_sentence
    });
  },

  StartRecord: function (e) {
    //检测录音时没有录音权限，提示用户开启权限
    if (!this.data.isAuthRecord) {
      wx.hideTabBar();
      this.AuthDialog.showDialog();
    } else {
      console.log('开始录音');
      this.setData({
        MSG: '结束录音',
        isRecord:true,
      });
    }
  },

  EndRecord: function (e) {
    //只对有录音权限时做出反应
    if (this.data.isAuthRecord) {
      console.log('录音结束');
      this.setData({
        MSG: '开始录音',
        isRecord:false,
      });
    }
  },

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

  gotoSentence:function(event){
    let sentence_id = event.currentTarget.dataset.sentenceid;
    let new_sectionInfo = this.data.sectionInfo;
    new_sectionInfo.curr_sentence = sentence_id;
    this.setData({
      sectionInfo:new_sectionInfo,
      toIndex: 'sentence-' + sentence_id
    });
  }

})