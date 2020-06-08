'use strict';
var TIME = getTime()
var datetime = document.getElementsByClassName('datetime')[0];
datetime.innerText = TIME.Hours + ":" + TIME.Minute;
var dataEle = document.getElementsByClassName('data')[0];
dataEle.innerText = TIME.Year + '/' + TIME.Month + '/' + TIME.date;
var week = document.getElementsByClassName('week')[0];
week.innerText = "周" + week_arr[TIME.Day];
setInterval(function () {
    var TIME = getTime()
    datetime.innerText = TIME.Hours + ":" + TIME.Minute;
    dataEle.innerText = TIME.Year + '/' + TIME.Month + '/' + TIME.date;
    week.innerText = "周" + week_arr[TIME.Day];
}, 1000);

//获取URL参数
function getQueryVariable(variable) {
    var index;
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            index = i
            break
        }
    }
    if (index>=0) {
        console.log(index)
        return vars[index].split("=")[1];
    } else {
        return "";
    }
}

function face_check() {
    // console.log(getQueryVariable("deciveId"))
    window.location.href="face_check.html?deciveId="+getQueryVariable("deciveId")+"&department_id="+getQueryVariable("department_id");
    // window.location.href="face_check.html?deciveId="+getQueryVariable("deciveId");
}

setTimeout(function(){
window.history.go(-1)},10000)