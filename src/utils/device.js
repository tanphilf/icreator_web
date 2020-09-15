/* 
 设备适配响应式方案
 1、 rem + viewport：
*/
(function (doc, win) {
  if (doc)
  {
    var viewPortEl = doc.querySelector('meta[name="viewport"]')
    var isIos = win.navigator.appVersion.match(/iphone/gi)
    // 针对ios的Retina屏显示按倍率缩放
    var _scale = isIos ? parseInt(1 / Math.min(win.devicePixelRatio, 3)) : 1
    if (!viewPortEl)
    {
      viewPortEl = doc.createElement('meta')
    }

    viewPortEl.setAttribute('name', 'viewport')
    viewPortEl.setAttribute('content', 'width=device-width,initial-scale=' + _scale + ',maximum-scale=' + _scale + ',minimum-scale=' + _scale + ',user-scalable=no')
    doc.firstElementChild.appendChild(viewPortEl)

    // 设计稿:750px <--> 7.5rem；
    const designSize = 750;
    const fontRatio = 100;

    var docEl = doc.documentElement;
    var calc = function () {
      var docW = docEl.clientWidth;
      if (docW)
      {
        docEl.style.fontSize = (docW >= designSize ? fontRatio : fontRatio * (docW / designSize)) + 'px';
      }
    };

    calc();

    if (doc.addEventListener)
    {
      win.addEventListener("orientationchange" in window ? "orientationchange" : "resize", calc, false);
      doc.addEventListener("DOMContentLoaded", calc, false);
    }
  }

})(document, window);