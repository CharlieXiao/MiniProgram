// pages/record/record.js

//导入util外部文件
const md5 = require('../../utils/md5.js')
//const pattern = /\w+'\w+|\w+-\w+|[.,;?!-:()'"]+|\w+/g;
const app = getApp();
const recorderManager = wx.getRecorderManager();
const request_url = app.globalData.request_url;
const query = wx.createSelectorQuery();

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
    JudgeStatus: 0,
    footer_height: '260rpx',
    cxClient: 0,
    cyClient: 0,
  },

  /*  isJudged 有三个状态
  *   0 未评分
  *   1 已评分，未播放用户发音
  *   2 已评分，播放用户发音
  */

  onLoad: function (options) {

    wx.showLoading({
      title: '加载语音文件中',
      mask: true
    })

    let section_id = options.section_id;

    console.log('curr section: ' + section_id)

    // 从后台获取信息

    let that = this

    wx.request({
      url: request_url + "/SentenceInfo",
      method: 'GET',
      data: {
        section_id: section_id,
      },
      header:{
          OPENID: app.globalData.open_id,
      },
      success(res) {
        if (res.data.status == '200') {
          console.log(res.data)
          var data = res.data
          // 由于小程序从后台获取图片链接是需要一定时间的，因此在渲染时会有一段时间图片链接为空，需要指定一张默认图片
          that.setData({
            courseImage: request_url + data.courseInfo.img,
            sectionInfo: data.sectionInfo,
            sentences: data.sentenceInfo,
            JudgeStatus: res.data.sentenceInfo[data.sectionInfo.curr_sentence].hasJudge
          })

          TutorialAudio.autoplay = true
          TutorialAudio.src = request_url + that.data.sentences[that.data.sectionInfo.curr_sentence].src;

          console.log(TutorialAudio.src)

          //播放结束的回调函数
          TutorialAudio.onEnded(() => {
            console.log('播放结束');
            that.setData({
              isPlay: false,
            });
          });

          that.setData({
            toIndex: 'sentence-' + that.data.sectionInfo.curr_sentence,
            isPlay: true,
          });

          //设置标题名称
          wx.setNavigationBarTitle({
            title: that.data.sectionInfo.subtitle,
          });

        } else {
          console.log('数据请求失败');
          console.log('ERROR: ' + res.data.error);
        }
      },
      complete: () => {
        wx.hideLoading();
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

  // 由于wx.request函数是异步函数，因此onReady优先于wx.request的回调函数触发，因此将设置发音部分代码调整至回调函数中
  onShow: function () {
    // 用户从返回上一级页面后再次进入页面，并不会重新播放
  },

  onUnload: function () {
    //退出页面的同时要销毁发音对象，防止在后台继续播放
    TutorialAudio.destroy();
    //销毁后应该再重新创建一个，以便下一次进入时能直接播放
    TutorialAudio = wx.createInnerAudioContext();

    UserAudio.destroy();

    UserAudio = wx.createInnerAudioContext();

    //在用户离开界面是更新学习状况
    // 
    console.log(this.data.sectionInfo.curr_sentence)

    // 使用getCurrentPages()获得当前页面栈信息，获取上一个页面句柄，通过setData来达到传参的目的

    wx.request({
      url: request_url + '/updateStudyStatus',
      method: 'GET',
      data: {
        type: 1,
        curr_sentence: this.data.sectionInfo.curr_sentence
      },
      header:{
          OPENID: app.globalData.open_id,
      },
      success(res) {
        console.log(res);
        let section_finish = res.data
        let pages = getCurrentPages();
        // 由于此时页面已经退出，上一个页面即为页面栈的最后一个元素
        let prev_page = pages[pages.length - 1];
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
        //console.log(isLock);
        // 最粗糙的页面间通信
        prev_page.setData({
          isLock: isLock
        });
      }
    })
  },

  StartRecord: function (e) {
    console.log(e);
    let that = this;
    //检测录音时没有录音权限，提示用户开启权限
    if (!this.data.isAuthRecord) {
      wx.hideTabBar();
      this.VerbDialog.hideDialog();
      this.AuthDialog.showDialog();
    } else {
      // 设置定时器，在一定时间段后自动返回结果为不成功
      if (e.currentTarget.id == 'VerbTrans') {
        // 由于let仅在当前块中可用，这里使用var声明TimerID
        var TimerID = setTimeout(() => {
          e.detail.CallBack({ 'status': 0 })
        }, 100000);
      }

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
        // 判断是否需要调用回调函数
        if (e.currentTarget.id == 'VerbTrans') {
          // 返回录音情况
          // 清除计时器
          clearTimeout(TimerID);
          e.detail.CallBack({ 'status': 1 })
        }
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
        console.log('录音错误');
        that.setData({
          MSG: '开始录音',
          isRecord: false,
        })
      })

      this.setData({
        MSG: '结束录音',
        isRecord: true,
      });

    }
  },

  EndRecord: function (e) {
    console.log(e);
    //只对有录音权限时做出反应

    if (this.data.isAuthRecord) {

      if (e.currentTarget.id == 'VerbTrans') {
        var TimerID = setTimeout(() => {
          e.detail.CallBack({ 'status': 0 })
        }, 10000)
      }

      recorderManager.stop();

      recorderManager.onStop((res) => {

        this.tempFilePath = res.tempFilePath;

        console.log('停止录音, 文件路径：' + res.tempFilePath);

        // 直接向服务器发送request请求
        wx.showLoading({
          title: '计算评分中...',
          mask: true
        })
        // 对于单词和句子的需要进行区分
        if (e.currentTarget.id == 'VerbTrans') {
          clearTimeout(TimerID);
          // 显示评分加载框
          let that = this;
          console.log(this.tempFilePath)
          wx.uploadFile({
            url: request_url + '/judgeAudio/',
            filePath: this.tempFilePath,
            name: 'audio',
            formData: {
              'type': 'verb',
              'verb_id': e.detail.verb_id
              }, header: { OPENID: app.globalData.open_id, },
            success(res) {
              wx.hideLoading();
              console.log('上传结束');
              //console.log(res);
              // 同时返回评价结果
              let data = JSON.parse(res.data)
              if(data['error_code'] != 0){
                  wx.showModal({
                      title: '提示',
                      content: '请重新读一遍'
                  })
              }else{
                  console.log(data)
                  e.detail.CallBack({ 'status': 1, 'score': data['score'], 'file-path': that.tempFilePath,'phones':data['sentence'][0] });
              }
            }
          })
        } else {
          let that = this;
          wx.uploadFile({
            url: request_url + '/judgeAudio/',
            filePath: this.tempFilePath,
            name: 'audio',
            formData: {
              'type': 'sentence',
              'sentence_id': this.data.sectionInfo.curr_sentence
              }, header: { OPENID: app.globalData.open_id,},
            success(res) {
              console.log(res);
              console.log('上传结束');
              wx.hideLoading();
              let data = JSON.parse(res.data);
              // 此处res中的data不知并不是json对象
              console.log(data);
              if(data['error_code'] == 0){
                let new_sentences = that.data.sentences;
                let curr_sentence_id = that.data.sectionInfo.curr_sentence;
                new_sentences[curr_sentence_id]['user-src'] = data['user-audio'];
                new_sentences[curr_sentence_id]['score'] = data['score'];
                // 需要遍历new_sentences
                let sentence_index = 0;
                let en_sep = new_sentences[curr_sentence_id]['en_sep'];
                for(let i = 0;i<en_sep.length;i=i+1){
                    if(sentence_index < data['sentence'].length && en_sep[i]['verb'] == data['sentence'][sentence_index]['verb']){
                        en_sep[i]['isBad'] = data['sentence'][sentence_index]['isBad']
                        sentence_index = sentence_index + 1
                    }
                }
                new_sentences[curr_sentence_id]['en_sep'] = en_sep
                console.log(new_sentences[curr_sentence_id]);
                that.setData({
                    sentences: new_sentences,
                    JudgeStatus: 1
                });
            }else{
                wx.showModal({
                    title:'提示',
                    content:'请重新读一遍'
                })
            }

            }
          })
        }
      });

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

    let that = this;

    let sentence_id = event.currentTarget.dataset.sentenceid;

    let new_sectionInfo = this.data.sectionInfo;

    new_sectionInfo.curr_sentence = sentence_id;

    this.setData({
      sectionInfo: new_sectionInfo,
      toIndex: 'sentence-' + sentence_id,
      isPlay: true,
      JudgeStatus: this.data.sentences[sentence_id]['hasJudge']
    });

    let currSentenceHeight = 0;

    //动态获取组件高度
    wx.createSelectorQuery().select('.curr-sentence').fields({
      size: true,
    }, function (res) {
      // 回调函数有一定延迟，应该在此函数里进行操作
      currSentenceHeight = res.height;
      //console.log('当前句子高度为： '+currSentenceHeight);
      //此时单位为rpx

      //console.log(sentence_id);

      //console.log(start_index);

      //console.log(that.data.sectionInfo.num_sentences);

      let num_others = that.data.sectionInfo.num_sentences - that.data.sentences[sentence_id].index;

      //console.log('剩余句子数： '+num_others);

      //最好不要使用rpx计算，直接计算px值，减小误差

      //计算px与rpx的转换关系
      //1rpx = cxClient/750 px

      //当前录音栏的实际高度

      let new_footer_height = '260rpx';
      //判断是否需要修改底部按钮栏的高度

      let rpx2px = that.data.cxClient / 750;

      let otherSentenceHeight = parseInt(260 * rpx2px);

      //直接取整计算px值
      let actualHeight = num_others * otherSentenceHeight + currSentenceHeight;

      //console.log('实际高度为： '+actualHeight);

      if (actualHeight + otherSentenceHeight < that.data.cyClient) {
        new_footer_height = that.data.cyClient - actualHeight + 'px';
      }

      //console.log('计算后底部高度为： '+new_footer_height);

      // 获取顶部高度后再进行计算
      that.setData({
        footer_height: new_footer_height,
      });
    }).exec()

    //进入页面就开始播放

    //更换地址需要销毁上一个对象
    TutorialAudio.destroy();
    TutorialAudio = wx.createInnerAudioContext();
    TutorialAudio.autoplay = true;
    TutorialAudio.src = request_url + this.data.sentences[sentence_id].src;

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
  backToCourse: function () {
    //连接服务器，更新用户学习信息
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

  // 上传服务器评分
  // 此处逻辑有问题，用户发音完成后不需要手动点击，直接发送到服务器进行评分，旁边的第三个按键用于播放用户音频
  PlayRecord: function () {
    //在用户已经有录音的情况下，才
    console.log('current sentence: ' + this.data.sectionInfo.curr_sentence);
    console.log('播放个人录音');
    //还未实现，暂时仅播放个人录音
    //由于需要更新地址，先暂停播放教学音频
    TutorialAudio.pause();
    //清除上一次的录音
    UserAudio.destroy();
    UserAudio = wx.createInnerAudioContext();
    //UserAudio.autoplay = true;
    UserAudio.src = request_url + this.data.sentences[this.data.sectionInfo.curr_sentence]['user-src'];
    console.log(UserAudio.src)
    UserAudio.play();
    this.setData({
      isPlay: false,
      JudgeStatus: 2,
    });
    UserAudio.onError((res)=>{
      console.log(res);
    })
    UserAudio.onEnded(() => {
      console.log('个人录音播放结束');
      this.setData({
        JudgeStatus: 1,
      });
    });
  },

  StopPlayRecord: function () {
    console.log('停止播放个人录音');
    UserAudio.pause();
    this.setData({
      JudgeStatus: 1,
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
        url: request_url + '/VerbTrans',
        method: 'GET',
        data: {
          verb: verb
        },
        header:{
            OPENID: app.globalData.open_id,
        },
        success: (res) => {
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

    let isFav = event.detail.isFav;
    let verb = event.detail.verb;

    wx.request({
      url: request_url + '/addVerbFav',
      method: 'GET',
      data: {
        isFav: isFav,
        verb: verb
      },
        header: { OPENID: app.globalData.open_id,},
      success: function (res) {
        console.log(res);
      }

    })

  }

})