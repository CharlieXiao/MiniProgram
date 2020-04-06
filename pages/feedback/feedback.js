// pages/feedback/feedback.js
const app = getApp()
const request_url = app.globalData.request_url

Page({

    /**
     * 页面的初始数据
     */
    data: {
        toast: false,
        hideToast: false,
    },

    showToast: function(){
        this.setData({
            toast: true
        });
        setTimeout(() => {
            this.setData({
                hideToast: true
            });
            setTimeout(() => {
                this.setData({
                    toast: false,
                    hideToast: false,
                });
            }, 300);
        }, 3000);
    },

    submit: function (e) {
        let message = e.detail.value.input_area
        if (message != "") {
            console.log(message)
            // 获取textarea中的值
            let that = this
            wx.request({
                url: request_url + '/Feedback',
                data: { 'message': message },
                header: { session: app.globalData.session },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    that.showToast();
                }
            })
        }
    }
})