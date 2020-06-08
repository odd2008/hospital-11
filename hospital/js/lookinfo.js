const date = document.getElementsByClassName('date')[0];
const day = document.getElementsByClassName('day')[0];
const time = document.getElementsByClassName('time')[0];
date.innerText =  TIME.Year + '年' + (TIME.Month) + '月' +(TIME.date)+'日';
day.innerText = "周"+week_arr[TIME.Day];
time.innerText = (TIME.Hours) + ": " +(TIME.Minute);
const goback = document.getElementsByClassName('goback')[0];
goback.onclick = function(){
    window.history.go(-1);
}