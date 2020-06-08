"use strict";

function _axios() {
  var para = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    url: url,
    json: json,
    fn: fn
  };

  $.ajax({
    type: "POST",
    url: para.url,
    contentType: "application/json",
    cache: true,
    async: true,
    data: para.json,
    dataType: 'json',
    success: function success(res) {
      if (para.fn) {
        para.fn(res);
      }
    },
    error: function error(err) {
      //请求出错处理
      console.error(err.statusText);
      // alert("出情况了");
    }
  });
}
// var baseURL = "http://192.168.3.123:82/medicalcare/";
//oracle版本
var baseURL = "http://153.153.153.183:8080/medicalcare/";

var webSocket_url = "ws://153.153.153.183:8080/medicalcare/";
// var url = "http://192.168.3.135:8081/play-control/"
// var webSocket_url = baseURL
var url = baseURL
var api = {
  departmentList: baseURL + 'department/list_page',
  departmentlist: baseURL + 'department/list',
  doctorList: baseURL + 'doctor/list',
  doctor_list_page: baseURL + 'doctor/list_page',
  findUser: baseURL + 'user/find',
  doctorFind: baseURL + 'doctor/find',
  newAppoint: baseURL + 'register/save',
  departmentFind: baseURL + 'department/find',
  recommand_depart: baseURL + 'user/list_user_department',
  control_carema: url + 'ws/sendmsg1'
};
var pub = {
  // 公共接口地址
  _url: baseURL,
  // 详细接口api地址
  _DetailApi: {
    docInfo: "doctor/find",     //查询医生信息
    jobInfo: "post/find",       //查询职务信息
    guaList: "register/list",   //挂号列表
    addgua: "register/save",    //添加挂号信息
    docList: "doctor/list",      //查询医生的列表
    userInfo: "user/find",       //患者信息查询
    departInfo: "department/find",//部门信息查询
    doctorfind: "doctor/find",//医生信息查询
    find_wait: 'register/find_wait'
  },
  /**
   * op 形参
   * @param {*} that this指向
   * @param {*} _url 公共接口地址
   * @param {*} ur 具体接口地址
   * @param {*} data 形参
   * @param {*} cbk 回调
   */
  _InitAjax(op) {
    $.ajax({
      type: "POST",
      // timeout : 1000, //超时时间设置，单位毫秒
      contentType: "application/json",
      url: op._url + op.ur,
      data: JSON.stringify(op.data),
      error: function (request) {

      },
      success: function (res) {
        op.cbk(res);
      },

      fail: function (r) {


      }
    });
  },
  _InitAxios(op) {
    var _op = op;
    axios({
      url: op._url + op.ur,
      method: "post",
      data: JSON.stringify(op.data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (res) {
        _op.cbk(res.data);
      })
      .catch(function (cat) {

      });
  },

  /**
   *  截取页面链接中的参数
   *  window.location
   *  window的location对象
   *  search
   *  得到的是url中query部分
   *  substr()
   *  返回一个从指定位置开始的指定长度的子字符串
   *  这里设置为1，是为了把url中的?号去掉
   *  split()
   *  将一个字符串分割为子字符串，然后将结果作为字符串数组返回
   *  这里就是把query部分以&为分割符，分割
   */
  _LinkParm: function (variable) {
    var query = window.location.search.substring(1);//截取查询字符串?后面的参数
    // console.log(variable);
    var vars = query.split("&");   // 用&符号将其分割起来
    // console.log(vars);
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // console.log(pair);
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
    var query1 = window.location.search.s;
  },

  /**
   * @param {*} event 输入框的值
   * @param {*} tgt 输入框绑定的值
   */
  _CheckPhone(event, tgt) {

    var phone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    if (!phone.test(tgt)) {
      alert("输入正确的手机号！");
      tgt = "";
    }
  },

  /**
   * 数组转对象
   */
  _change_obj(arr) {
    var _obj = {};
    for (var it = 0; it < arr.length; it++) {
      for (var item in arr[it]) {
        _obj[item] = arr[it][item];
      }
    }
    return _obj;
  },

  /**
   *
   * @param {*} old_r 原有数组
   * @param {*} new_r 新数组 需要连接到原有数组之上
   */
  _Arr_concat(old_r, new_r) {
    var arr = old_r;
    var _r = new_r;
    var _c = arr.concat(_r);
    old_r = _c;

    return old_r;
  },

  /**
   * 判断是否为空字符串
   * @param {*} obj  传入形参 即需要判断的字符串
   */
  _isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  }

};
//获取URL参数
function getQueryVariable(variable) {
  var index;
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { index = i }
  }
  console.log(index)
  if (index >= 0) {
    return vars[index].split("=")[1];
  } else {
    return "";
  }
}