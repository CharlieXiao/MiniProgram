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

      console.log(data)

      this.setData({
        ShouldShow: true,
        verb:data.query,
        uk_phonetic:data.basic["uk-phonetic"],
        us_phonetic:data.basic["us-phonetic"],
        uk_speech:data.basic["uk-speech"],
        us_speech:data.basic["us-speech"],
        explains:data.basic.explains
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
