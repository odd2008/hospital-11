'use strict';

var app = new Vue({
  el: '#app',
  data: {
    resBody: null,
	deciveId:null
  },
  created: function created() {
	
    var _this = this;
        _this.deciveId= getQueryVariable("deciveId");
    
	var id = pub._LinkParm('doctor_id');
    //医生信息查询
    pub._InitAxios({
      _url: pub._url, //公共接口
      ur: pub._DetailApi.docList,
      data: { "DOCTOR_ID": "" + id,"CHECKING_ID":checkId
    },
      // `${id}`  
      cbk: function cbk(res) {
       
        _this.resBody = res.data[0];
       
      }
    });
  },

  methods: {
    goOff: function goOff() {
		  var _this = this;
		//alert(_this.deciveId)
      //window.location.href = 'regist.html?deciveId='+_this.deciveId;
	   window.history.go(-1);
    }
  }
});