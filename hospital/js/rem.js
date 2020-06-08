"use strict";

;(function (win, doc) {
  var docEl = doc.documentElement,
      resizeEvent = "orientationchange" in window ? "orientationchange" : "resize",
      resizeHandle = function resizeHandle() {
    var WIDTH = docEl.clientWidth;
    var size = 100 * (WIDTH / 750);
    window.fsize = size;
    docEl.style.fontSize = size + "px";
  };

  window.addEventListener(resizeEvent, resizeHandle, false);
  resizeHandle();
})(window, document);

// WIDTH 是设计图的大小
// 将7行的算式运行之后得出 100  即在量出的实际尺寸之后直接除以100 加上rem 就可以作为rem页面布局的尺寸
// 字体是12px 默认为0.12rem