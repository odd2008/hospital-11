'use strict';
var url_msg = window.location.search.substr(1).split('&').map(item=>item.split('='));
var msgObj = {};
for(var i = 0 ; i < url_msg.length ; i ++){
    msgObj[url_msg[i][0]] = url_msg[i][1]
}
var app = new Vue({
    el: "#app",
    data: {
        show: false,
        isActive: 0,
        user: '', //患者id
        numList: [], //部门医生下面患者数量
        num: '', //    //每个医生下面的患者数量
        time: '',
        docInfo: '', //医生信息
        jobInfo: '', //职务信息
        patInfo: '', //患者信息
        docList: '', //医生列表  
        departInfo: '', //部门信息
        jiuzhen: '',
        arr: [],
        jiuZhen: []
    },
    created: function created() {
        var _this2 = this;

        this.tomove();
        this.connectOther(); //调用websocket查询面部识别 用户id
        this.time = TIME.Year + '年' + TIME.Month + '月' + TIME.date + '日';
        pub._InitAxios({
            //查询医生信息
            _url: pub._url,
            ur: pub._DetailApi.docList,
            data: { "DEPARTMENT_ID": msgObj.DEPARTMENT_ID },
            cbk: function cbk(res) {
                // console.log(res.data);
		var arr = [];
		for(var i  = 0 ; i <6;i++){
arr.push(res.data[0])}
console.log(arr)
                _this2.docList = arr;
                //轮播图调用
                window.setTimeout(function () {
console.log('执行settimeout')
                    _this2.lunbo();
                }, 100);
                var promiseAll = []; //存储每个医生下面的挂号列表信息
                var result = Array.from(res.data);
                // console.log(result);
                for (var i = 0; i < result.length; i++) {
                    //获取文章id
                    var doctor_name = result[i].DOCTOR_NAME;
                    //获取一个医生name发送请求
                    promiseAll.push(new Promise(function (resolve) {
                        pub._InitAxios({
                            _url: pub._url,
                            ur: pub._DetailApi.guaList,
                            data: { "DOCTOR_NAME": '' + doctor_name,
                                "BY_ORDER": "true"
                            },
                            cbk: function cbk(res) {
                                resolve(res.data);
                            }
                        });
                    }));
                }
                Promise.all(promiseAll).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        _this2.numList.push(res[i].length);
                    }
                    _this2.num = _this2.numList[0];
                });
            }
        });
    },

    watch: {
        //监听患者id是否发生变化
        user: function user(val) {
            var _this3 = this;

            if (val != '') {
                console.log(val);
                pub._InitAxios({
                    _url: pub._url,
                    ur: pub._DetailApi.userInfo,
                    data: { "USER_ID": val },
                    cbk: function cbk(res) {
                        // console.log(res.data);
                        _this3.patInfo = res.data;
                    }
                });
            }
        }
    },
    methods: {
        // 点击医生名字 切换下面的排队人员数量
        changeList: function changeList(index) {
            this.isActive = index;
            this.num = this.numList[index];
            console.log(this.numList);
        },

        success: function success() {
            pub._InitAxios({
                _url: pub._url,
                ur: pub._DetailApi.addgua,
                data: { "USER_ID": "4",
                    "DEPARTMENT_ID": "1",
                    "DOCTOR_ID": "0",
                    "REGISTER_TYPE_ID": "expert"
                },
                cbk: function cbk(res) {
                    if (res.stateCode == 200) {
                        window.location.href = "./regist_success.html";
                    } else {
                        window.location.href = "./regist_fail.html";
                    }
                }
            });
        },
        lunbo: function lunbo() {
            var oImgs = document.getElementById("ul-imgs"); //不知道为什么获取不到
            console.log(oImgs);
            var i = 0; //当前轮播的第几张图片
            var liWidth = 100; //每张图片的宽度
            var liCount = 4; //轮播指示灯的个数,也相当于用户实际看到图片的个数
            var DURATION = 1000; //轮播间隔时间
            var startPos = {}; //开始位置
            var endPos = {}; //结束位置
            var touch; //记录触碰节点
            var scrollDirection; //滚动方向
            var timer=null;
            oImgs.ontouchstart = function (event) {
                console.log(1);
                clearInterval(timer);
                touch = event.targetTouches[0]; //取得第一个touch的坐标值
                startPos = { x: touch.pageX, y: touch.pageY };
                scrollDirection = 0;
            };
            oImgs.ontouchmove = function (event) {
                clearInterval(timer);
                // 如果有多个地方滑动，我们就不发生这个事件
                if (event.targetTouches.length > 1) {
                    return;
                }
                touch = event.targetTouches[0];
                endPos = { x: touch.pageX, y: touch.pageY
                    // 判断出滑动方向，向右为1，向左为-1
                };scrollDirection = touch.pageX - startPos.x > 0 ? 1 : -1;
            };

            oImgs.ontouchend = function () {
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
            timer = setInterval(function () {
                moveTo();
            }, 3000);
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
        // 定时
        tomove: function tomove() {
            var _this4 = this;

            timer = setInterval(function () {
                //确定部门id  DEPARTMENT_ID
                pub._InitAxios({
                    _url: pub._url, //公共接口
                    ur: pub._DetailApi.docList,
                    data: { "DEPARTMENT_ID": "2" },
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
                        "DEPARTMENT_ID": "2",
                        "REGISTER_STATUS_ID": '1not_checked'
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
                        "DEPARTMENT_ID": "2",
                        "REGISTER_STATUS_ID": '0ready'
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
                        "DEPARTMENT_ID": "2",
                        "REGISTER_STATUS_ID": '3checked'
                    },
                    cbk: function cbk(res) {
                        // console.log(res.data);

                    }
                });
            }, 5000);
        }
    }

});
// connectOther: 
var user;
function connectOther() {
    // var _this = this;
    var currentUser = getQueryVariable("deciveId");
    if (currentUser != null && currentUser != "") {
        if ('WebSocket' in window) {
            ws = new WebSocket("ws://192.168.35.246:81/msghandle/socketServer/" + currentUser); //对应后端地址
        } else if ('MozWebSocket' in window) {
            ws = new MozWebSocket("ws://192.168.35.246:81/msghandle/socketServer/" + currentUser);
        } else {
            alert("该浏览器不支持websocket");
        }
        ws.onmessage = function (evt) {
            //接受消息
            var data = JSON.parse(evt.data);
            user = data.message; //当前用户编号
            console.log(user);
            //    startTimerOperation(getQueryVariable("userId"),user);
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
connectOther();
