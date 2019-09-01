// components/VerbDialog/VerbDialog.js

let usSpeech = undefined;
let ukSpeech = undefined;

const app = getApp();
const request_url = app.globalData.request_url;

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
        {pos:"n.",explain:"花；精华；开花植物"},
        {pos: "vi.", explain: "成熟，发育；开花；繁荣；旺盛；三生三世十里桃花"},
        {pos: "vt.", explain: "使开花；用花装饰"},
        {pos: "n.", explain: "(Flower)人名；(英)弗劳尔"}
      ],
      uk_phonetic: "'flaʊə",
      uk_speech: "http://openapi.youdao.com/ttsapi?q=flower&langType=en&sign=66264F0B8941FA81A714C596E2432521&salt=1566197801227&voice=5&format=mp3&appKey=4f938f684c09931e",
      us_phonetic: "'flaʊɚ",
      us_speech: "http://openapi.youdao.com/ttsapi?q=flower&langType=en&sign=66264F0B8941FA81A714C596E2432521&salt=1566197801227&voice=6&format=mp3&appKey=4f938f684c09931e",
      verb: "flower"
    },
    ContainerHeight:0,
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
      this.setData({
        ShouldShow: false
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

  },

})
