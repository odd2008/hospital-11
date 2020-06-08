'use strict';

var app = new Vue({
    el: "#app",
    data: {
        show: -1,
        jiance: 0, //监听面部识别
		timer:'',//页面定时器
        isActive: 0,
        user: '', //患者id
        numList: [], //部门医生下面患者数量
		
        num: '', //    //每个医生下面的患者数量
        time: '',
        docInfo: '', //医生信息
        jobInfo: '', //职务信息
        patInfo: { user_name: '检测中...' }, //患者信息
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
		department:{department_id:2,department_name:"内科"}
     },
    created: function created() {
        var _this2 = this;
        this.tomove();
        this.connectOther(); //调用websocket查询面部识别 用户id
        this.time = TIME.Year + '年' + TIME.Month + '月' + TIME.date + '日';
         this.getInit();
          },
    watch: {
        //监听患者id是否发生变化
        user: function user(val) {
           // console.log(1);
            if (val != '') {
                //console.log(2);
                //console.log(val);
                var _this = this;
                //获取当前日期
                var date = TIME.Year + '-' + TIME.Month + '-' + TIME.date;
                _this.gua.user_id = val;
                //查询患者今天是否挂号
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.guaList,
                    data: {
                        "user_id": "" + val,
                        "department_id": this.department.department_id,
                        "add_time": "" + date,
                        "register_status_id": "1not_checked"
                    },
                    cbk: function cbk(res) {

                       // console.log(res.data);
                        if (res.data.length == 0) {
                         console.log(3);
                            pub._InitAxios({
                                _url: pub._url,
                                ur: pub._DetailApi.userInfo,
                                data: { "user_id": val },
                                cbk: function cbk(res) {
                                    _this.jiance = 1;
									clearInterval(_this.timer);
                             
                                    _this.patInfo = res.data;
                                    _this.user = "";
                                }
                            });
                        } else {
                           console.log(4);
                            _this.jiance = 2;
							clearInterval(_this.timer);
                            _this.patInfo = res.data[0];
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
		doctorDetailed:function doctorDetailed(doctor_id,deciveId){
			 window.location.href="xiang_qing.html?doctor_id="+doctor_id+"&deciveId="+deciveId;
		},
		getInit:function getInit(){
			var _this2=this;
			
			pub._InitAxios({
            //查询医生信息
            _url: pub._url,
            ur: pub._DetailApi.docList,
            data: { "department_id": _this2.department.department_id,doctor_online_id:"on_line"},
            cbk: function cbk(res) {
                //  console.log("查询医生信息:"+res.data.length);
                _this2.docList = res.data;
                _this2.gua.doctor_id = res.data[0].doctor_id;
				_this2.changeList(0, res.data[0].doctor_id)
                //轮播图调用
                setTimeout(function () {
                    _this2.lunbo(res.data.length);
                }, 100);
						
            }
        });
		},
        // 点击医生名字 切换下面的排队人员数量
        changeList: function changeList(index, doctor_id) {
		   
			var _this=this;
            this.isActive = index;
            this.gua.doctor_id = doctor_id;
			 pub._InitAxios({
                            _url: pub._url,
                            ur: pub._DetailApi.guaList,
                            data: { "doctor_id":doctor_id ,
                                "department_id": _this.department.department_id
                            },
                            cbk: function cbk(res) {
								// console.log("czy:"+JSON.stringify(res));
                                _this.num = res.data.length;
                            }
                        });
            
            //console.log(this.numList);
        },

        //清空val值,改show的状态
        changeStatus: function changeStatus() {
			var _this=this;
			if(this.timer!=''){
				clearInterval(this.timer);
			}
            _this.user = '';
            _this.show = 1;
			_this.getInit();
            _this.patInfo.user_name = '检测中...';	
			
			_this.timer=setInterval(function(){
				if(_this.user==''){
					_this.jiance=4;
				}
			},10000)
        },
        shut: function shut() {
            this.show = -1;
            this.jiance = 0;
            console.log(this.jiance);
        },

        success: function success() {
            var _this3 = this;
            pub._InitAxios({
                _url: pub._url,
                ur: pub._DetailApi.addgua,
                data: { "user_id": this.gua.user_id,
                    "department_id": "" + this.department.department_id,
                    "doctor_id": "" + this.gua.doctor_id,
                    "register_type_id": "expert"
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
            var carouselUl=document.getElementById('ul-imgs');
            var left = $('#ul-imgs li').length - 1;
            var center = 0;
            var right = 1;
            var timer=null;
            var screenWidth=$("#ul-imgs").width();
            // return;
            // 归位（多次使用，封装成函数）
	        setTransform();

            // 调用定时器
	        timer = setInterval(showNext, 2000);

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
                if (right >  $('#ul-imgs li').length- 1) {
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
        timer = setInterval(showNext, 3000);
      }
      // 设置过渡
      function setTransition(a, b, c) {
        if (a) {
          $('#ul-imgs li').eq(left).style.transition = 'transform 1s';
        } else {
          $('#ul-imgs li').eq(left).style.transition = 'none';
        }
        if (b) {
          $('#ul-imgs li').eq(center).style.transition = 'transform 1s';
        } else {
          $('#ul-imgs li').eq(center).style.transition = 'none';
        }
        if (c) {
          $('#ul-imgs li').eq(right).style.transition = 'transform 1s';
        } else {
          $('#ul-imgs li').eq(right).style.transition = 'none';
        }
      }
   
      //　封装归位
      function setTransform(dx) {
        dx = dx || 0;
        $('#ul-imgs li').eq(left).style.transform = 'translateX(' + (-screenWidth + dx) + '%)';
        $('#ul-imgs li').eq(center).style.transform = 'translateX(' + dx + '%)';
        $('#ul-imgs li').eq(right).style.transform = 'translateX(' + (screenWidth + dx) + '%)';
      }
      // 动态设置小圆点的active类
        $
    //   var pointsLis = points.querySelectorAll('li');
       
      function setPoint() {
        for (var i = 0; i < $('#ul-imgs li').length; i++) {
            $('#ul-imgs li').eq(i).removeClass('active');
        }
        $('#ul-imgs li')[center].addClass('active');
      }
        },
        connectOther: function connectOther() {
            var _this = this;

            var currentUser = getQueryVariable("deciveId");
           // alert("czy:" + currentUser);
            if (currentUser != null && currentUser != "") {

                if ('WebSocket' in window) {
                    //console.log(1);
                    ws = new WebSocket("ws://192.168.35.246:81/msghandle/socketServer/" + currentUser); //对应后端地址
                } else if ('MozWebSocket' in window) {
                    ws = new MozWebSocket("ws://192.168.35.246:81/msghandle/socketServer/" + currentUser);
                } else {
                    alert("该浏览器不支持websocket");
                }
                ws.onmessage = function (evt) {
                    //接受消息

                    var data = JSON.parse(evt.data);
                    var strs = new Array(); //定义一数组
                        strs = data.message.split(","); //字符分割
						if("patient"==strs[1]){
						 _this.user = strs[0]; //当前用户编号
						}else{
							window.location.href="punch_clock.html?deciveId="+currentUser;
						}
                   
                    //console.log(_this.user);
                    //    startTimerOperation(getQueryVariable("userId"),user);
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
                    data: { "department_id": _this4.department.department_id },
                    cbk: function cbk(res) {
                        _this4.resBody = res.data[0];
                        // console.log(res.data);
                        _this4.uuid = res.data[0].uuid;
                        //医生信息查
                    }
                }),
                //病人状态查询   未检查状态
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.guaList,
                    data: {
                        "department_id": _this4.department.department_id,
                        "register_status_id": '1not_checked'
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
                        "department_id": _this4.department.department_id,
                        "register_status_id": '0ready'
                    },
                    cbk: function cbk(res) {
                        //   console.log(res.data);
                        // this.jiuZhen=res.data;
                        var newArr = [];
                        for (var i = 0; i < res.data.length; i++) {
                            var targe = res.data[i];
                            newArr.push(targe);
                            _this4.newArr = newArr;
                        }
                        _this4.jiuzhen = _this4.newArr;
                        //   console.log(this.jiuzhen) 
                    }
                });
                //已检查完
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.guaList,
                    data: {
                        "department_id": _this4.department.department_id,
                        "register_status_id": '3checked'
                    },
                    cbk: function cbk(res) {
                        // console.log(res.data);

                    }
                });
            }, 5000);
        }
    }

});