var date = document.getElementsByClassName('date')[0];
var day = document.getElementsByClassName('day')[0];
var time = document.getElementsByClassName('time')[0];
date.innerText =  TIME.Year + '年' + TIME.Month + '月' +(TIME.date)+'日';
day.innerText = "周"+week_arr[TIME.Day];
time.innerText = (TIME.Hours) + " : " +(TIME.Minute);
	var goback = document.getElementsByClassName('goback')[0];
function getTime1(){
	 var TIME = getTime()
	date = document.getElementsByClassName('date')[0];
	day = document.getElementsByClassName('day')[0];
	time = document.getElementsByClassName('time')[0];
	date.innerText =  TIME.Year + '年' + TIME.Month + '月' +(TIME.date)+'日';
	day.innerText = "周"+week_arr[TIME.Day];
	time.innerText = (TIME.Hours) + " : " +(TIME.Minute);
	var goback = document.getElementsByClassName('goback')[0];
}
setInterval(function(){

	getTime1();
},1000)