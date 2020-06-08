'use strict';
var local_department_id = '2';
var app = new Vue({
    el: "#app",
    data: {
        show: -1,
        jiance: 0, //监听面部识别
        timer: '',//页面定时器
        isActive: 0,
        user: '', //患者id
        numList: [], //部门医生下面患者数量

        num: 0, //    //每个医生下面的患者数量
        time: '',
        docInfo: '', //医生信息
        jobInfo: '', //职务信息
        patInfo: {
            DEPARTMENT_NAME: '',
            USER_NAME: ''
        }, //患者信息
        docList: '', //医生列表  
        departInfo: '', //部门信息,
        jiuzhen: '',
        arr: [],
        jiuZhen: [],
        gua: { //挂号参数
            user_id: '',
            department_id: 2,
            doctor_id: ""
        },
        i: 0,
        department: {},
        deny: '',
        tipshow: false,
        tiptitle:'',
        tipmsg: '',
        getid:false,
        user1:'',
        record_user:'',
        start:false
    },
    created: function created() {
        var _this2 = this;
        _this2.department.department_id = getQueryVariable("department_id");
        _this2.getDepartment(_this2.department.department_id)
        this.tomove();
        // setTimeout(() => {
        //     _this2.connectOther(); //调用websocket查询面部识别 用户id
        // }, 5000);
        this.time = TIME.Year + '年' + TIME.Month + '月' + TIME.date + '日';
        this.getInit();
    },
    watch: {
        //监听患者id是否发生变化
        user: function user(val) {
            if (val != '') {
                var _this = this;
                //获取当前日期
                var date = TIME.Year + '-' + TIME.Month + '-' + TIME.date;
                _this.gua.user_id = val;
                //查询患者今天是否挂号
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.guaList,
                    data: {
                        // "USER_ID": "" + 1,
                        "USER_ID": "" + val,
                        "DEPARTMENT_ID": _this.department.department_id,
                        "ADD_TIME": "" + date,
                        "REGISTER_STATUS_ID": "1not_checked",
                        "CHECKING_ID":checkId
                    },
                    cbk: function cbk(res) {


                        if (res.data.length == 0) {


                            if (_this.deny == "register_worker") {

                                var obj = {
                                    _url: pub._url,
                                    ur: pub._DetailApi.doctorfind,
                                    data: {
                                        DOCTOR_ID: val,
                                        "CHECKING_ID":checkId
                                    },
                                    cbk: function (res) {
                                        if (res.stateCode == '200') {

                                            if (res.data.DEPARTMENT_ID == _this.department.department_id) {

                                                if (_this.show !== 1) {
                                                    window.location.href = "punch_clock.html?deciveId=" + getQueryVariable("deciveId") + "&department_id=" + getQueryVariable("department_id") ;
                                                    // break;
                                                }
                                            } else {
                                                // 用户编号为医生编号，挂号类型为职工挂号
                                                _this.jiance = 1;

                                                clearInterval(_this.timer);
                                                //_this.patInfo = res.data;
                                                //_this.patInfo.USER_NAME = res.data.DOCTOR_NAME;
                                                delete (_this.patInfo, 'USER_NAME')
                                                _this.$set(_this.patInfo, 'USER_NAME', res.data.DOCTOR_NAME)

                                                _this.patInfo.DEPARTMENT_NAME = _this.department.department_name;
                                                _this.find_wait()
                                                _this.forceUpdate()

                                                _this.user = "";
                                            }
                                        }
                                    }
                                }
                                pub._InitAjax(obj)

                            } else {

                                pub._InitAxios({
                                    _url: pub._url,
                                    ur: pub._DetailApi.userInfo,
                                    data: {
                                        "USER_ID": val,
                                        "CHECKING_ID":checkId
                                        // "USER_ID": 1
                                    },
                                    cbk: function cbk(res) {
                                        _this.jiance = 1;
                                        clearInterval(_this.timer);
                                        //_this.patInfo = res.data;
                                        delete (_this.patInfo, 'USER_NAME')
                                        _this.$set(_this.patInfo, 'USER_NAME', res.data.USER_NAME)
                                        console.log(res.data.USER_NAME)
                                        _this.patInfo.DEPARTMENT_NAME = _this.department.department_name;
                                        _this.find_wait()
                                        _this.forceUpdate()
                                        _this.user = "";
                                    }
                                });
                            }
                        } else {

                            _this.jiance = 2;
                            clearInterval(_this.timer);
                            _this.patInfo = res.data[0];
                            delete (_this.patInfo, 'USER_NAME')
                            _this.$set(_this.patInfo, 'USER_NAME', res.data[0].USER_NAME)
                            console.log(res.data[0].USER_NAME)
                            _this.patInfo.DEPARTMENT_NAME = _this.department.department_name;
                            _this.find_wait()
                            _this.forceUpdate()

                            console.log(_this.patInfo)
                            _this.user = "";
                        }
                    }
                });

                // pub._InitAxios({
                //     _url:pub._url,
                //     ur:pub._DetailApi.userInfo,
                //     data:{"user_id":val},
                //     cbk:(res)=>{
                //        console.log(res.data);
                //         this.patInfo=res.data;
                //     }
                // })
            }
        }
    },
    methods: {
        cancle: function () {
            window.history.go(0)
        },
        doctorDetailed: function doctorDetailed(doctor_id) {
            window.location.href = "xiang_qing.html?doctor_id=" + doctor_id;
        },
        getInit: function getInit() {
            var _this2 = this;


            pub._InitAxios({
                //查询医生信息
                _url: pub._url,
                ur: pub._DetailApi.docList,
                data: { "DEPARTMENT_ID": _this2.department.department_id, DOCTOR_ONLINE_ID: "on_line" ,"CHECKING_ID":checkId},
                cbk: function cbk(res) {
                    //  console.log("查询医生信息:"+res.data.length);

                    _this2.docList = res.data;
                    _this2.gua.doctor_id = res.data[0].DOCTOR_ID;
                    _this2.changeList(0, res.data[0].DOCTOR_ID)
                    //轮播图调用
                    if (_this2.i == 0) {
                        setTimeout(function () {
                            _this2.lunbo(res.data.length);
                        }, 100);
                    }
                    _this2.i++;
                    if (_this2.i >= 1000) {
                        _this2.i = 1;
                    }



                }
            });
        },
        // 点击医生名字 切换下面的排队人员数量
        changeList: function changeList(index, doctor_id) {

            var _this = this;
            this.isActive = index;
            //this.gua.doctor_id = doctor_id;
            console.log(doctor_id)
            this.$set(this.gua, 'doctor_id', doctor_id)
            this.find_wait()


            //console.log(this.numList);
        },
        find_wait: function () {
            console.log('查询排队')
            var _this = this;
            var date = TIME.Year + '-' + TIME.Month + '-' + TIME.date;
            if (this.jiance == 1) {
                console.log('执行list查询')
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.guaList,
                    data: {
                        "DOCTOR_ID": _this.gua.doctor_id,
                        "REGISTER_STATUS_ID": '1not_checked',
                        "DEPARTMENT_ID": _this.department.department_id,
                        "ADD_TIME":date,
                        "CHECKING_ID":checkId
                    },
                    cbk: function cbk(res) {
                        console.log(res)
                        //_this.num = res.data.length;

                        _this.$set(_this, 'num', res.data.length)

                        //_this.num = 5
                    }

                });
            } else if (this.jiance == 2) {
                console.log('执行find_wait查询')
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.find_wait,
                    data: {
                        "USER_ID": _this.gua.user_id,
                        "CHECKING_ID":checkId,
                        "DEPARTMENT_ID": _this.department.department_id
                    },
                    cbk: function cbk(res) {
                        //_this.num = res.data.no;

                        _this.$set(_this, 'num', res.data.no)
                        console.log(_this.num, typeof _this.num)
                    }
                });
            }
        },
        //清空val值,改show的状态
        changeStatus: function changeStatus() {
            console.log('该函数执行')
            this.start = true;
            var _this = this;
            if (this.timer != '') {
                clearInterval(this.timer);
            }
            _this.user = '';
            _this.show = 1;
            _this.getInit();
            // 打开摄像机
            _this.controlCarema('open')

            _this.timer = setInterval(function () {
                if (_this.user == '') {
                    _this.jiance = 4;
		_this.controlCarema('close')

                }
            }, 30000)
        },
        controlCarema:function controlCarema(tag){
            var _this = this;
            var device = getQueryVariable('deciveId')
            var json={
                "username":device+"1"
            };
            if(tag=='open'){
                json.msg='camera_start'
            }else if(tag=='close'){
                json.msg='camera_stop'
            }
            var obj = {
                url: api.control_carema,
                json:JSON.stringify(json),
                fn:function(r){
                    if(r.stateCode=='200'){
                        if(tag=='open'){
                            _this.connectOther()
                        }
                    }
                }
            }
            _axios(obj)
        },
        shut: function shut(num) {
            this.show = -1;
            this.jiance = 0;
            if(num==1){
                this.tipshow=false;
            }
            // window.history.go(0)
        },

        success: function success() {
            
            var _this3 = this;
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.addgua,
                    data: {
                        "USER_ID": _this3.gua.user_id,
                        // "USER_ID": 1,
                        "DEPARTMENT_ID": "" + _this3.department.department_id,
                        "DOCTOR_ID": "" + _this3.gua.doctor_id,
                        // "DOCTOR_ID": "" + 12,
                        "REGISTER_TYPE_ID": _this3.deny,
                        "CHECKING_ID":checkId
                    },
                    cbk: function cbk(res) {
                        if (res.stateCode == 200) {
                            _this3.user = '';
                            _this3.jiance = 3;
                            clearInterval(_this3.timer);
                        } else {
                            _this3.jiance = 4;
                        }
                    }
                });
            
        },
        lunbo: function lunbo() {
            // console.log(111);
            // console.log($('#ul-imgs li').length);
            // console.log($("#ul-imgs").width());
            // 初始三个固定的位置
            var carouselUl = document.getElementById('ul-imgs')
            var left = $('#ul-imgs li').length - 1;
            var center = 0;
            var right = 1;
            var timer = null;
            var screenWidth = $("#ul-imgs").width();
            var carouselLis = carouselUl.querySelectorAll('li');
            // return;
            // 归位（多次使用，封装成函数）
            setTransform();

            // 调用定时器
            timer = setInterval(showNext, 6000);

            // 分别绑定touch事件
            var startX = 0; // 手指落点
            var startTime = null; // 开始触摸时间
            carouselUl.addEventListener('touchstart', touchstartHandler); // 滑动开始绑定的函数 touchstartHandler
            carouselUl.addEventListener('touchmove', touchmoveHandler);  // 持续滑动绑定的函数 touchmoveHandler
            carouselUl.addEventListener('touchend', touchendHandeler);  // 滑动结束绑定的函数 touchendHandeler

            // 轮播图片切换下一张
            function showNext() {
                // 轮转下标
                left = center;
                center = right;
                right++;
                //　极值判断
                if (right > $('#ul-imgs li').length - 1) {
                    right = 0;
                }
                //添加过渡（多次使用，封装成函数）
                setTransition(1, 1, 0);
                // 归位
                setTransform();
                // 自动设置小圆点
                setPoint();
            }

            // 轮播图片切换上一张
            function showPrev() {
                // 轮转下标
                right = center;
                center = left;
                left--;
                //　极值判断
                if (left < 0) {
                    left = $('#ul-imgs li').length - 1;
                }
                //添加过渡
                setTransition(0, 1, 1);
                // 归位
                setTransform();
                // 自动设置小圆点
                setPoint();
            }

            // 滑动开始
            function touchstartHandler(e) {
                // 清除定时器
                clearInterval(timer);
                // 记录滑动开始的时间
                startTime = Date.now();
                // 记录手指最开始的落点
                startX = e.changedTouches[0].clientX;
            }
            // 滑动持续中
            function touchmoveHandler(e) {
                // 获取差值 自带正负
                var dx = e.changedTouches[0].clientX - startX;
                // 干掉过渡
                setTransition(0, 0, 0);
                // 归位
                setTransform(dx);
            }
            //　滑动结束
            function touchendHandeler(e) {
                // 在手指松开的时候，要判断当前是否滑动成功
                var dx = e.changedTouches[0].clientX - startX;
                // 获取时间差
                var dTime = Date.now() - startTime;
                // 滑动成功的依据是滑动的距离（绝对值）超过屏幕的三分之一 或者滑动的时间小于300毫秒同时滑动的距离大于30
                if (Math.abs(dx) > screenWidth / 3 || (dTime < 300 && Math.abs(dx) > 30)) {
                    // 滑动成功了
                    // 判断用户是往哪个方向滑
                    if (dx > 0) {
                        // 往右滑 看到上一张
                        showPrev();
                    } else {
                        // 往左滑 看到下一张
                        showNext();
                    }
                } else {
                    // 添加上过渡
                    setTransition(1, 1, 1);
                    // 滑动失败了
                    setTransform();
                }

                // 重新启动定时器
                clearInterval(timer);
                // 调用定时器
                timer = setInterval(showNext, 6000);
            }
            // 设置过渡
            function setTransition(a, b, c) {
                if (a) {
                    carouselLis[left].style.transition = 'transform 3s';
                } else {
                    carouselLis[left].style.transition = 'none';
                }
                if (b) {
                    carouselLis[center].style.transition = 'transform 3s';
                } else {
                    carouselLis[center].style.transition = 'none';
                }
                if (c) {
                    carouselLis[right].style.transition = 'transform 3s';
                } else {
                    carouselLis[right].style.transition = 'none';
                }
            }

            //　封装归位
            function setTransform(dx) {
                dx = dx || 0;
                $('#ul-imgs li')[left].style.transform = 'translateX(' + (-screenWidth) + 'px)';
                $('#ul-imgs li')[center].style.transform = 'translateX(' + dx + 'px)';
                $('#ul-imgs li')[right].style.transform = 'translateX(' + (screenWidth) + 'px)';
            }
            // 动态设置小圆点的active类
            var points = document.querySelector("#ul-idxs");
            var pointsLis = points.querySelectorAll('li');

            function setPoint() {
                for (var i = 0; i < pointsLis.length; i++) {
                    pointsLis[i].classList.remove('active');
                }
                pointsLis[center].classList.add('active');
            }
        },
        connectOther: function connectOther() {
            var _this = this;

            var currentUser = getQueryVariable("deciveId");
            // alert("czy:" + currentUser);
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
                    console.log(users)
                         if(users.length==0){

                                        _this.tipshow = true;
                                        _this.tiptitle = '人脸识别失败'
                                        _this.tipmsg = '抱歉！人脸识别失败，请到导医处进行建档！';
                                        _this.controlCarema('close')


                          return "";

                         }
                   
                    console.log(_this.record_user)
                   
                         if(users.length>0){
                        _this.controlCarema('close')
                    }
                    if (users.length > 1 || "doctor" == users[0].group_id) {
                        //双重身份 或者只有医生身份
                        _this.deny = "register_worker"
                        // for (var i = 0; i < users.length; i++) {
                        //users[i].user_id 查询


                        //1.考勤
                        //  查询医生是否属于当前部门

                        var obj = {
                            _url: pub._url,
                            ur: pub._DetailApi.doctorfind,
                            data: {
                                DOCTOR_ID: users[0].user_id,
                                "CHECKING_ID":checkId
                            },
                            cbk: function (res) {
                                if (res.stateCode == '200') {
                                    if (res.data.DEPARTMENT_ID == _this.department.department_id) {
                                        window.sessionStorage.setItem('doctor',users[0].user_id)
                                        window.location.href = "face_check.html?deciveId=" + currentUser + "&department_id=" + getQueryVariable("department_id");
                                        // break;

                                    } else {
                                        _this.tipshow = true;
                                        _this.tiptitle = '打卡失败'
                                        _this.tipmsg = '您非本科室医生，请到您所在科室进行打卡';
                                    }
                                }
                            }
                        }
                        pub._InitAjax(obj)
                        //  }




                    } else if (users.length == 1) {//一重身份
                        _this.deny = "register_user"
                        _this.user = users[0].user_id; //当前用户编号
                    }
                };
                ws.onclose = function (evt) {
                    //断开链接时
                    // console.log(2);
                    alert("连接中断");
                };
                ws.onopen = function (evt) {//链接时
                    // alert("连接成功");
                };
            } else {
                alert("请输入您的昵称");
            }
        },

        // 定时
        tomove: function tomove() {
            var _this4 = this;

            var timer = setInterval(function () {
                //确定部门id  department_id
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.docList,
                    data: { "DEPARTMENT_ID": _this4.department.department_id,"CHECKING_ID":checkId },
                    cbk: function cbk(res) {
                        _this4.resBody = res.data[0];
                        // console.log(res.data);
                        _this4.uuid = res.data[0].UUID;
                        //医生信息查
                    }
                }),
                    //病人状态查询   未检查状态
                    pub._InitAxios({
                        _url: pub._url, //公共接口
                        ur: pub._DetailApi.guaList,
                        data: {
                            "DEPARTMENT_ID": _this4.department.department_id,
                            "REGISTER_STATUS_ID": '1not_checked',
                            "CHECKING_ID":checkId
                        },
                        cbk: function cbk(res) {
                            // console.log(res.data);
                            _this4.arr = res.data;
                            // console.log(this.arr);
                        }
                    });
                //病人状态查询   准备检查状态
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.guaList,
                    data: {
                        "DEPARTMENT_ID": _this4.department.department_id,
                        "REGISTER_STATUS_ID": '0ready',
                        "CHECKING_ID":checkId
                    },
                    cbk: function cbk(res) {
                        // this.jiuZhen=res.data;
                        var newArr = [];
                        for (var i = 0; i < res.data.length; i++) {
                            var targe = res.data[i];
                            newArr.push(targe);
                            _this4.newArr = newArr;
                        }
                        _this4.$set(_this4, 'jiuzhen', newArr);
                    }
                });
                //已检查完
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.guaList,
                    data: {
                        "DEPARTMENT_ID": _this4.department.department_id,
                        "REGISTER_STATUS_ID": '3checked',
                        "CHECKING_ID":checkId
                    },
                    cbk: function cbk(res) {
                        // console.log(res.data);

                    }
                });
            }, 5000);
        },
        getDepartment: function getDepartment(id){
            var _this = this
            var query = {
                _url: '',
                ur:api.departmentlist,
                data:{
                    'DEPARTMENT_ID':id,
                    "CHECKING_ID":checkId
                },
                cbk:function(res){
                    if(res.stateCode=='200'){
                        _this.department.department_name = res.data[0].DEPARTMENT_NAME
                    }
                }
            }
            pub._InitAxios(query)
        }
    }

});