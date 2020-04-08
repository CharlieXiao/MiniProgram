const app = getApp();
const request_url = app.globalData.request_url;

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}  

Page({
    data: {
        is_today_learn: false,
        hasInfo: false
    },
    onLoad: function() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let date = now.getDate();
        let to_year = now.getFullYear();
        let to_month = now.getMonth();
        this.initDateArray(year, month);
        this.setData({
            year: year,
            month: month + 1,
            to_month: to_month + 1,
            to_year: to_year,
            date: date
        })
    },
    lastMonth: function() {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
        let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.initDateArray(year, month);
    },
    nextMonth: function() {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
        let month = this.data.month > 11 ? 0 : this.data.month;
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.initDateArray(year, month);
    },

    initDateArray: function(year, month) {
        // 通过今日的年份和月份计算该月第一天是星期几
        let month_first_day = new Date(year, month, 1);
        let first_week = month_first_day.getDay();
        let dateArray = [];
        let currDate = new Date(year,month,1);
        // 设置一个负数表示向后推移多少天
        // 设置成星期天
        if (first_week != 0) {
            currDate.setDate(-first_week + 1);
        } else {
            // 此处会有特殊情况，对于一个月起始日期为星期日，如果按照上述算法，会找到下一个星期一，实际上需要的是上一个星期一
            currDate.setDate(-6);
        }
        console.log(year,month)
        let month_day = new Date(year,month+1,0).getDate();
        console.log(month_day);
        let month_last_day = new Date(year,month,month_day);
    
        // 发送请求获取学习记录信息
        let that = this;
        wx.request({
            url: request_url + '/UserCalendar',
            method: 'GET',
            data: {
                date_from: month_first_day.format('yyyy-MM-dd'),
                date_to: month_last_day.format('yyyy-MM-dd'),
            },
            header: {
                session: app.globalData.session
            },
            success: (res) => {
                let hasInfo = false;
                let data = res.data;
                if (res.statusCode == 200) {
                    hasInfo = true;
                    console.log(data);
                }
                let ArrayPointer = 0;
                console.log(currDate.toDateString());
                // 设置正数需要用currDate.setDate(currDate.getDate()+1)
                for (let i = 0; i < 6; i++) {
                    let weekArray = []
                    for (let j = 0; j < 7; j++) {
                        // 直接从星期一开始
                        currDate.setDate(currDate.getDate() + 1)
                        let date = currDate.getDate().toString()
                        if (date.length < 2) {
                            date = '0' + date
                        }
                        let is_study = false;
                        if (hasInfo && currDate.format('yyyy-MM-dd') == data.date[ArrayPointer]) {
                            is_study = true;
                            ArrayPointer += 1;
                        }
                        weekArray.push({
                            'is_study': is_study,
                            'month': currDate.getMonth() + 1,
                            'date': currDate.getDate(),
                            'dateString': date
                        })
                    }
                    dateArray.push(weekArray)
                }
                console.log(dateArray)
                this.setData({
                    'dateArray': dateArray,
                    'learndays':data.learndays,
                    'attend_days':data.attend_days,
                    'ratio':data.ratio
                })
            }
        })
    }
})