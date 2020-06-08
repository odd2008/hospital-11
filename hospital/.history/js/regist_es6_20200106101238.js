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
                 console.log("查询医生信息:"+res.data.length);
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
								console.log("czy:"+JSON.stringify(res));
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
            var oImgs = document.getElementById("ul-imgs"); //不知道为什么获取不到
            console.log(oImgs);
            var i = 0; //当前轮播的第几张图片
            var liWidth = 100; //每张图片的宽度
            var liCount = 5; //轮播指示灯的个数,也相当于用户实际看到图片的个数
            var DURATION = 1000; //轮播间隔时间
            var startPos = {}; //开始位置
            var endPos = {}; //结束位置
            var touch; //记录触碰节点
            var scrollDirection; //滚动方向
            oImgs.ontouchstart = function (event) {
                if(timer!=undefined){
                    clearInterval(timer);
                }
                touch = event.targetTouches[0]; //取得第一个touch的坐标值
                startPos = { x: touch.pageX, y: touch.pageY };
                scrollDirection = 0;
            };
            oImgs.ontouchmove = function (event) {     
                if(timer!=undefined){
                    clearInterval(timer);
                }
                // 如果有多个地方滑动，我们就不发生这个事件
                if (event.targetTouches.length > 30) {
                    return;
                }
                touch = event.targetTouches[0];
                endPos = { x: touch.pageX, y: touch.pageY
                    // 判断出滑动方向，向右为1，向左为-1
                };scrollDirection = touch.pageX - startPos.x > 0 ? 1 : -1;
            };

            oImgs.ontouchend = function () {
                if(timer!=undefined){
                    clearInterval(timer);
                }
                if (scrollDirection == 1) {
                    move(-1);
                } else if (scrollDirection == -1) {
                    move(1);
                }
                timer = setInterval(function () {
                    moveTo();
                }, 3000);
            };

            // 定义的轮播函数
            function moveTo(to) {
                // 如果不给轮播图传参数的话,默认是向右边移动一次
                if (to == undefined) to = i + 1;
                if (i == 0) {
                    // 如果是第一张图片的情况下,添加过渡效果
                    if (to > i) {
                        $('#ul-imgs').addClass('transition');
                    } else {
                        // 第一张图片的情况下,用户点击往左边走的话,欺骗用户,去掉过渡效果,把整体
                        // 右移动,调到最后,
                        $('#ul-imgs').removeClass('transition');
                        //    $('#ul-imgs').css('margin-left',-liCount*liWidth+'%');
                        $('#ul-imgs').css('margin-left', -liCount * liWidth + '%');

                        // 使用定时器,制造时间间隔,使用户看不到突然向右边移动的效果
                        setTimeout(function () {
                            moveTo(liCount - 1);
                        }, 100);
                        return;
                    }
                }
                // 如果有参数传进来的情况下,将参数值赋值给to
                i = to;
                // 将图片向右边移动相互对应的间隔
                $('#ul-imgs').css('margin-left', -i * liWidth + '%');
                // 如果轮播图图片到了最后一张的情况下,将i设置成0,重新将整体图片位置调整到左边起始位置
                if (i == liCount) {
                    i = 0;
                    setTimeout(function () {
                        // 去掉过度效果,让用户看不到,图片整体右移动
                        $('#ul-imgs').removeClass('transition');
                        $('#ul-imgs').css('margin-left', '0');
                    }, 0);
                }
                $('#ul-idxs>li').eq(i).addClass('active').siblings().removeClass('active');
                // 给下面相对应的指示器点亮
            }
            // 定义的函数,传进一个参数,移动相对应的位置
            function move(n) {
                moveTo(i + n);
            }
            var timer = setInterval(function () {
                moveTo();
            }, 6000);
            // 点击下面的指示器,轮播到对应的指示灯上去,并且点亮
            $('#ul-idxs').on('click', 'li', function () {
                if (canClick) {
                    if ($(this).prop('className') != 'active') {
                        // 找到那个点击的指示灯
                        var i = $('#ul-idxs>li').index($(this));
                        // 轮播到那个指示灯所对应的图片的位置
                        moveTo(i);
                    }
                    // 设置时间间隔防止恶意点击
                    setTimeout(function () {
                        canClick = true;
                    }, 500);
                }
            });
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