// components/VerbDialog/VerbDialog.js

let usSpeech = undefined;
let ukSpeech = undefined;

let verb_pattern = /\w{1,4}\./g 

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
    verbInfo: {
      verb: 'good',
      uk_phonetic: 'gʊd',
      us_phonetic: 'gʊd',
      uk_speech: 'http://fjdx.sc.chinaz.net/files/download/sound1/201310/3610.wav',
      us_speech: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      explains: ["n. 日落；傍晚；晚霞；（法律的）自动废止期，效力消减期", "adj. 霞红色的；浅橘红色的；衰落的；最后期的；定期废止的"],
    },
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
    showDialog(verb)  {
      console.log('显示单词弹框')
      console.log(verb)
      ukSpeech = wx.createInnerAudioContext();
      usSpeech = wx.createInnerAudioContext();
      ukSpeech.src = this.data.verbInfo.uk_speech;
      usSpeech.src = this.data.verbInfo.us_speech;
      this.setData({
        ShouldShow: true
      })
    },

    onFav() {
      this.setData({
        isAddFav:!this.data.isAddFav
      });
      var DealFavDetail = {
        isFav:this.data.isAddFav,verb:this.data.verbInfo.verb
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
