// components/VerbDialog/VerbDialog.js

let usSpeech = undefined;
let ukSpeech = undefined;

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
    ShouldShow: true,
    isAddFav: false,
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

      console.log(data);

      var explains = [];

      var raw_explains = data.basic.explains;

      var e;

      for(var i=0;i<raw_explains.length;i++){
        //拆分解释和词性，使用词性作为key，
        e = raw_explains[i].match(verb_pattern)
        if(e!=null){
          explains.push({
            pos:e[1],
            explain:e[2]
          })
        }else{
          //未匹配时
          explains.push({
            pos:"",
            explain:raw_explains[i]
          })
        }
        
      }

      this.setData({
        ShouldShow: true,
        verb:data.query,
        uk_phonetic:data.basic["uk-phonetic"],
        us_phonetic:data.basic["us-phonetic"],
        uk_speech:data.basic["uk-speech"],
        us_speech:data.basic["us-speech"],
        explains:explains
      })

      ukSpeech = wx.createInnerAudioContext();
      usSpeech = wx.createInnerAudioContext();
      ukSpeech.src = this.data.uk_speech;
      usSpeech.src = this.data.us_speech;
    },

    onFav() {
      this.setData({
        isAddFav:!this.data.isAddFav
      });
      var DealFavDetail = {
        isFav:this.data.isAddFav,verb:this.data.verb
      }
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
    }

  },

})
