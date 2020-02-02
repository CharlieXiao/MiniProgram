// components/VerbDialog/VerbDialog.js

let usSpeech = undefined;
let ukSpeech = undefined;
let userSpeech = undefined;

const app = getApp();
const request_url = app.globalData.request_url;
const recorderManager = wx.getRecorderManager();

//提取词性正则表达式
let verb_pattern = /(\w{1,4}\.)\s(.*)/ 

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ShouldShow: false,
    isAddFav: false,
    verbInfo:{
      explains:[
          { pos: "n.", explain: "[语][计] 句子，命题；宣判，判决"},
          { pos: "vi.", explain: "判决，宣判"},
      ],
        'uk-phonetic': "ˈsentəns",
        'uk-speech': "https://kaldi-speech.cn/media/verb/sentence_uk.mp3",
        'us-phonetic': "ˈsentəns",
        'us-speech': "https://kaldi-speech.cn/media/verb/sentence_us.mp3",
      verb: "sentence",
    },
    isPlay:false,
    JudgeStatus:0,
    isRecord:false,
    result:80,
    ContainerHeight:0,
    judgeInfo: {
        BadPhoneList: [],
        isBad: false,
        phones: [
            { phone: "S", level: 1 },
            { phone: "EH", level: 1 },
            { phone: "N", level: 2 },
            { phone: "T", level: 2 },
            { phone: "AH", level: 2 },
            { phone: "N", level: 2 },
            { phone: "S", level: 2 },
        ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      console.log('隐藏单词弹框')
      if(ukSpeech!=undefined){
        ukSpeech.destroy();
      }
      if(usSpeech!=undefined){
        usSpeech.destroy();
      }
      if(userSpeech!=undefined){
        userSpeech.destroy();
      }
      // 将所有的数据恢复原样
      this.setData({
        ShouldShow: false,
        isRecord:false,
        isPlay:false,
        JudgeStatus:0,
      })
    },
    //显示弹框
    showDialog(data)  {

      console.log('显示单词弹框') 

      data['uk-speech'] = request_url + data['uk-speech']
      data['us-speech'] = request_url + data['us-speech']

      if(data['uk-phonetic'] != ''){
        data['uk-phonetic'] = '[' + data['uk-phonetic'] + ']';
      }

      if(data['us-phonetic'] != ''){
        data['us-phonetic'] = '[' + data['us-phonetic'] + ']';
      }

      console.log(data)

      this.setData({
        verbInfo:data,
        ShouldShow:true,
        isAddFav:data['isFav']
      });

      ukSpeech = wx.createInnerAudioContext();
      usSpeech = wx.createInnerAudioContext();
      ukSpeech.src = this.data.verbInfo['uk-speech'];
      usSpeech.src = this.data.verbInfo['us-speech'];
    },

    onFav() {
      let DealFavDetail = {
        isFav:this.data.isAddFav,verb:this.data.verbInfo.verb
      }

      // 直接修改，然后异步与服务器同步
      this.setData({
        isAddFav:!this.data.isAddFav
      });

      //用户触发 onFav函数，再由自定义组件触发DealFav让父元素响应，父元素中指定函数响应DealFav函数
      this.triggerEvent('DealFav',DealFavDetail)
    },

    VerbPron(event){

      let type = event.currentTarget.dataset.id;

      if(type == 'us'){
        console.log(usSpeech.src);
        usSpeech.play();
      }else{
        console.log(ukSpeech.src);
        ukSpeech.play();
      }
    },

    StartPlay(){
      console.log('开始播放，默认美式音频');
      usSpeech.play();
      usSpeech.onEnded(() => {
        console.log('播放结束');
        this.setData({
          isPlay: false,
        });
      });
      this.setData({
        isPlay:true
      })
    },

    EndPlay(){
      console.log('暂停播放');
      this.setData({
        isPlay:false
      })
      // 由于一个单词读音较短，直接停止
      usSpeech.stop();
    },

    StartRecord(){
      this.setData({
        isRecord:true
      });
      let that = this;
      let StartRecordCallBack = function(e){
        // 父组件返回信息，开始成功
        if(e.status == 1){
          console.log('开始录音');
        }else{
          that.setData({
            isRecord:false
          });
          console.log('开始录音失败，请检查录音设备');
        }
      }
      this.triggerEvent('StartRecord',{CallBack:StartRecordCallBack});
    },

    EndRecord(){
      this.setData({
        isRecord:false
      });
      let that = this;
      let EndRecordCallBack = function(e){
        console.log(e)
        if(e.status == 1){
          console.log('结束录音');
          that.setData({
            isRecord:false,
            result:e.score,
            filepath:e['file-path'],
            JudgeStatus:1,
            judgeInfo:e['phones']
          });
        }else{
          console.log('录音失败，请重试');
        }
      }
      this.triggerEvent('EndRecord',{CallBack:EndRecordCallBack,verb_id:this.data.verbInfo.verb_id});
      
      // 需要一个回调函数返回告知是否录音成功，同时还需要获取文件路径等信息，便于上传
    },

    PlayRecord: function () {
      //还未实现，暂时仅播放个人录音
      //清除上一次的录音
      if (userSpeech != undefined) {
        userSpeech.destroy();
      }
      userSpeech = wx.createInnerAudioContext();
      userSpeech.autoplay = true;
      userSpeech.src = this.data.filepath;
      console.log(userSpeech.src)
      this.setData({
        isPlay: false,
        JudgeStatus:2,
      });
      userSpeech.onEnded(() => {
        console.log('个人录音播放结束');
        this.setData({
          JudgeStatus: 1,
        });
      });
    },
  
    StopPlayRecord:function(){
      console.log('停止播放个人录音');
      userSpeech.pause();
      this.setData({
        JudgeStatus:1,
      });
    },

  },

})
