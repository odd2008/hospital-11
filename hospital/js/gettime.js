'use strict';

var week_arr = ['日', '一', '二', '三', '四', '五', '六'];
 // 补零函数
 function addZero(num) {
    return num >= 10 ? num : '0' + num;
}
// 获取时间函数
function getTime() {
    var data = new Date();
    var Hours = addZero(data.getHours());
    var Minute = addZero(data.getMinutes());
    var Year = data.getFullYear();
    var Month = addZero(data.getMonth()+1);
    // 周几
    var Day = data.getDay();
    // 日期天
    var date = addZero(data.getDate());

    return {
        Hours: Hours,
        Minute: Minute,
        Year: Year,
        Month: Month,
        Day: Day,
        date: date,
    };
}

 ;(
// 获取时间函数
function() {
    var data = new Date();
    var Hours = addZero(data.getHours());
    var Minute = addZero(data.getMinutes());
    var Year = data.getFullYear();
    var Month = addZero(data.getMonth()+1);
    // 周几
    var Day = data.getDay();
    // 日期天
    var date = addZero(data.getDate());

    window.TIME = {
        Hours: Hours,
        Minute: Minute,
        Year: Year,
        Month: Month,
        Day: Day,
        date: date
    };
})(); 