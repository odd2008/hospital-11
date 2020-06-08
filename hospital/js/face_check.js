'use strict';
var base_url = baseURL;
var date = document.getElementsByClassName('date')[0];
var day = document.getElementsByClassName('day')[0];
var time = document.getElementsByClassName('time')[0];
var TIME = getTime()
date.innerText = TIME.Year + '年' + TIME.Month + '月' + TIME.date + '日';
day.innerText = "周" + week_arr[TIME.Day];
time.innerText = TIME.Hours + ": " + TIME.Minute;
var goback = document.getElementsByClassName('goback')[0];
goback.onclick = function () {
    window.history.go(-1);
};
var messagecontent = document.getElementsByClassName('pic_content')[0];
var message_obj = { 'DOCTOR_NAME': '医生姓名', 'DOCTOR_SEX_NAME': '医生性别', 'DEPARTMENT_NAME': '科室名称' };
var offband = document.getElementsByClassName('band')[0];
var offbtn = document.getElementsByClassName('offbtn')[0]
var btnList = document.querySelector('.group_btn').children;
var msg1 = '', msg = '';
var getId = false;
function getUser(useId) {
    var fd = JSON.stringify({
        "DOCTOR_ID": useId,
        "DOCTOR_STATUS_ID": 'normal',
        "CHECKING_ID": checkId
    });
    var url = base_url + "doctor/list";
    var fn = function fn(res) {

        if (res.data.length == 1 && res.data[0].DEPARTMENT_ID == getQueryVariable("department_id")) {
            var str = '';
            for (var key in message_obj) {
                str += '<div>\n                 <span>' + message_obj[key] + '\uFF1A</span>\n                 <span>' + res.data[0][key] + '</span>\n                 </div>';
            }
            messagecontent.innerHTML = str;
            var id = res.data[0].DOCTOR_ID;
            // 查询医生最后一次考勤详情
            var tag = false;
            var url = base_url + "attendance/find_last";
            var json = JSON.stringify({ DOCTOR_ID: res.data[0].DOCTOR_ID, "CHECKING_ID": checkId });
            var fn = function fn(res) {
                var fd = {
                    "DOCTOR_ID": id, "CHECKING_ID": checkId
                }

                fd.ATTENDANCE_TYPE_ID = "attendance_off";
                fd.ATTENDANCE_STATUS_ID = "attendance_off_normal"
                offbtn.parentNode.style.display = 'block';
                if (JSON.stringify(res.data) == '{}' || res.data.ATTENDANCE_TYPE_ID == "attendance_off") {
                    tag = true
                    offbtn.onclick = function () {
                        fd.ATTENDANCE_TYPE_ID = "attendance_start"
                        fd.ATTENDANCE_STATUS_ID = "attendance_start_normal"
                        var url = base_url + 'attendance/save';
                        fd = JSON.stringify(fd)

                        var fn = function (r) {
                            if (r.stateCode == "200") {
                                $('.offbtn').hide()
                                $('.band').hide()
                                $(".success").show()
                                if (r.data.ATTENDANCE_TYPE_ID == "attendance_start") {
                                    $('.start').show()
                                    $('.end').hide()
                                    setTimeout(function () {
                                        window.location.href = "regist.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id");
                                    }, 2000);
                                } else {
                                    $('.start').hide()
                                    $('.end').show()
                                    setTimeout(function () {
                                        window.location.href = "regist.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id");
                                    }, 2000);
                                }
                                return false
                            } else {
                                $(".fail").show()
                            }
                        }
                        upload(fd, url, fn)

                    }

                } else if (res.data.ATTENDANCE_TYPE_ID == "attendance_start") {
                    offbtn.onclick = function () {
                        offband.style.display = "block"

                    }

                    // 是否下班
                    btnList[0].onclick = function () {
                        window.location.replace("regist.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name"));
                    }
                    btnList[1].onclick = function () {
                        var url = base_url + 'attendance/save';
                        fd = JSON.stringify(fd)
                        var fn = function (r) {
                            if (r.stateCode == "200") {
                                $('.offbtn').hide()
                                $(".success").show()
                                if (r.data.ATTENDANCE_TYPE_ID == "attendance_start") {
                                    $('.start').show()
                                    $('.end').hide()
                                    setTimeout(function () {
                                        window.location.href = "regist.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name");
                                    }, 2000);
                                } else {
                                    $('.start').hide()
                                    $('.end').show()
                                    setTimeout(function () {
                                        window.location.href = "regist.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name");
                                    }, 2000);
                                }
                                return false
                            } else {
                                $(".fail").show()
                            }
                        }
                        upload(fd, url, fn)

                    }
                }

            }
            upload(json, url, fn)
        } else if (res.data.length == 0) {
            $('.offbtn').hide()
            messagecontent.innerHTML = '暂无该医生信息';
        } else {
            $('.offbtn').hide()
            messagecontent.innerHTML = '该医生不属于本科室无法打卡';

        }
    };
    upload(fd, url, fn);
}
$('.repeat').click(function () {
    window.history.go(0)
})
function upload(fd, url, fn) {
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        cache: true,
        async: false,
        data: fd,
        datatype: "json",
        success: fn,
        error: function error(err) {
            //请求出错处理
            // console.error(err.statusText);
            // alert("出情况了");
        }
    });
}
// connectOther(getUser);
var id = window.sessionStorage.getItem('doctor');
if (id) {
    // window.sessionStorage.removeItem('doctor')
    getUser(id)
}