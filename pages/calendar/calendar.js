Page({
    data: {
        is_today_learn: false,
    },
    onLoad: function () {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let date = now.getDate();
        let to_year = now.getFullYear();
        let to_month = now.getMonth();
        this.initDateArray(year,month);
        this.setData({
            year: year,
            month: month+1,
            to_month:to_month+1,
            to_year:to_year,
            date:date
        })
        // this.Test();
    },
    // dateInit: function (setYear, setMonth) {
    //     //全部时间的月份都是按0~11基准，显示月份才+1
    //     let dateArr = [];                        //需要遍历的日历数组数据
    //     let arrLen = 0;                            //dateArr的数组长度
    //     let now = setYear ? new Date(setYear, setMonth) : new Date();
    //     let year = setYear || now.getFullYear();
    //     let nextYear = 0;
    //     let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
    //     let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    //     let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                            //目标月1号对应的星期
    //     let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    //     let obj = {};
    //     let num = 0;

    //     if (month + 1 > 11) {
    //         nextYear = year + 1;
    //         dayNums = new Date(nextYear, nextMonth, 0).getDate();
    //     }
    //     arrLen = startWeek + dayNums;
    //     for (let i = 0; i < arrLen; i++) {
    //         if (i >= startWeek) {
    //             num = i - startWeek + 1;
    //             obj = {
    //                 isToday: '' + year + (month + 1) + num,
    //                 dateNum: num,
    //                 weight: 5
    //             }
    //         } else {
    //             obj = {};
    //         }
    //         dateArr[i] = obj;
    //     }
    //     this.setData({
    //         dateArr: dateArr
    //     })

    //     let nowDate = new Date();
    //     let nowYear = nowDate.getFullYear();
    //     let nowMonth = nowDate.getMonth() + 1;
    //     let nowWeek = nowDate.getDay();
    //     let getYear = setYear || nowYear;
    //     let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    //     if (nowYear == getYear && nowMonth == getMonth) {
    //         this.setData({
    //             isTodayWeek: true,
    //             todayIndex: nowWeek
    //         })
    //     } else {
    //         this.setData({
    //             isTodayWeek: false,
    //             todayIndex: -1
    //         })
    //     }
    // },
    lastMonth: function () {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
        let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.initDateArray(year, month);
    },
    nextMonth: function () {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
        let month = this.data.month > 11 ? 0 : this.data.month;
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.initDateArray(year, month);
    },

    initDateArray:function(year,month){
        // 通过今日的年份和月份计算该月第一天是星期几
        let month_first_day = new Date(year, month, 1);
        let first_week = month_first_day.getDay();
        let dateArray = [];
        let currDate = month_first_day;
        console.log(first_week);
        // 设置一个负数表示向后推移多少天
        // 设置成星期天
        if(first_week!=0){
            currDate.setDate(-first_week + 1);
        }else{
            // 此处会有特殊情况，对于一个月起始日期为星期日，如果按照上述算法，会找到下一个星期一，实际上需要的是上一个星期一
            currDate.setDate(-6);
        }
        // 设置正数需要用currDate.setDate(currDate.getDate()+1)
        console.log(currDate);
        for (let i = 0; i < 6; i++) {
            let weekArray = []
            for (let j = 0; j < 7; j++) {
                // 直接从星期一开始
                currDate.setDate(currDate.getDate() + 1)
                let date = currDate.getDate().toString()
                if(date.length<2){
                    date = '0'+date
                }
                weekArray.push({
                    'is_study': false,
                    'month': currDate.getMonth()+1,
                    'date': currDate.getDate(),
                    'dateString':date
                })
            }
            dateArray.push(weekArray)
        }
        dateArray[3][4]['is_study'] = true;
        console.log(dateArray)
        this.setData({
            'dateArray':dateArray
        })
    
    }
})