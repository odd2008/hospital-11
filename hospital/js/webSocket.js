"use strict";

var ws = null;
var user = null;
var time = null;
var webSocket_url = webSocket_url;
//空白页
function connect() {
    var currentUser = getQueryVariable("deciveId");
    if (currentUser != null && currentUser != "") {
        if ('WebSocket' in window) {
            ws = new WebSocket(webSocket_url + "socketServer/" + currentUser); //对应后端地址
        } else if ('MozWebSocket' in window) {
            ws = new MozWebSocket(webSocket_url + "socketServer/" + currentUser);
        } else {
            alert("该浏览器不支持websocket");
        }
        ws.onmessage = function (evt) {


            //接受消息
            var data = JSON.parse(evt.data);
            var users = JSON.parse(data.message);
            for (var i = 0; i < users.length; i++) {

                if ("doctor" == users[i].group_id) {

                    user = users[i].user_id; //当前用户编号
                    go(data.userId, users[i].user_id); //参数1;设备id,参数2：用户id
                    break;
                }
            }

        };
        ws.onclose = function (evt) {
            //断开链接时
            alert("连接中断");
        };
        ws.onopen = function (evt) {//链接时
            // alert("连接成功");
        };
    } else {
        alert("请输入您的昵称");
    }
}

//其他页面
var tag = true
function connectOther(fn) {
    var currentUser = getQueryVariable("deciveId");

    if (currentUser != null && currentUser != "") {
        if ('WebSocket' in window) {
            ws = new WebSocket(webSocket_url + "socketServer/" + currentUser); //对应后端地址
        } else if ('MozWebSocket' in window) {
            ws = new MozWebSocket(webSocket_url + "socketServer/" + currentUser);
        } else {
            alert("该浏览器不支持websocket");
        }
        ws.onmessage = function (evt) {
            //接受消息
            var data = JSON.parse(evt.data);
            var users = JSON.parse(data.message);

            for (var i = 0; i < users.length; i++) {

                if ("doctor" == users[i].group_id) {
                    user = users[i].user_id; //当前用户编号
                    if (user) {
                        tag = fn(user);
                    }
                } else {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({ DOCTOR_ID: user }),
                        url: api.doctorList,
                        success: function (res) {
                            //if(res.data.length==1&&res.data[0].DEPARTMENT_ID==getQueryVariable("department_id"){
                            //	 window.location.href = "regist.html?deciveId=" + getQueryVariable("deciveId")+"&department_id="+getQueryVariable("department_id")+"&department_name="+getQueryVariable("department_name");
                            //	}
                        }
                    })
                }


            }
        };
        ws.onclose = function (evt) {
            //断开链接时
            alert("连接中断");
        };
        ws.onopen = function (evt) {//链接时
            // alert("连接成功");
        };
    } else {
        alert("请输入您的昵称");
    }
}

//获取URL参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
}

function go(deviceId, userId) {
    //参数1;设备id,参数2：用户id
    window.location.href = "registe.html?deciveId=" + deviceId + "&userId=" + userId + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name");;
}

//定时判断 user1空白页用户 ,user当前用户
function startTimerOperation(user1, user) {
    if (user1 == user) {
        window.clearInterval(time);
        time = self.setInterval("operationing()", 30000);
    } else {
        alert("用户不同");
        window.location.href = "webSocket.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name");;
    }
}
//
function operationing() {
    //alert(getQueryVariable("deciveId")+"/"+getQueryVariable("userId"))
    window.location.href = "webSocket.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") + "&department_name=" + getQueryVariable("department_name");;
}