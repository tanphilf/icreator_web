/**
 * COMMONUTIL v1.0.0
 * A util for data & algorithm & io & document
 * @tanphilf 2020-4-11 19:50:25
 */

(function (global, factory) {
  "use strict";

  if (typeof module == 'object' && typeof module.exports == 'object')
  {
    module.exports = factory(global)
  } else
  {
    factory(global)
  }

})(window || this, function (global, noGlobal) {
  "use strict";

  var doget = {
    time (t) {
      return {
        format (ft = 'xxxx-xx-xx xx:xx:xx') {
          if (!t)
          {
            return ''
          }
          var o = new Date(t);

          // 按照预定格式转换时间字符串s
          var pattern = ft.toString().match(/(\d+|\w+){2,4}/gi);
          var prefix = function (str, n = 2) {
            var len = str.toString().length, a = [];
            return len >= n ? str : a.length = n - len + 1, (Array.prototype.join.call(a, '0')) + str;
          }
          var _f = function (p = 0, str) {
            // 字符位补足 + 间隔符
            return !pattern[p] || !str ? '' : prefix(str, pattern[p].length) + (ft[pattern.slice(0, p + 1).join().length] || '');
          }
          return _f(0, o.getFullYear()) + _f(1, o.getMonth() + 1) + _f(2, o.getDate()) + _f(3, o.getHours()) + _f(4, o.getMinutes()) + _f(5, o.getSeconds());
        }
      }
    },
    color () {

    },

    data (value) {
      return {
        // 将from进制数字num转换为to进制
        formatRadix (num, from = 10, to = 10) {
          num = num || value;
          var _t = typeof num;
          if (!(_t == 'string' || _t == 'number'))
          {
            return null;
          }
          return parseInt(num.toString(), from).toString(to);
        },
        toHex (radix = 10) {
          return this.formatRadix(value, radix, 16);
        },
        toDecimal (radix = 10) {
          return this.formatRadix(value, radix, 10);
        },
        toOctal (radix = 10) {
          return this.formatRadix(value, radix, 8);
        },

        guuid () {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          })
        },
        isPhoneNumber (d) {
          d = value || d;
          return /^1[3|4|5|8][0-9]\d{4,8}$/gi.test(d);
          // return /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7[^29\D](?(?<=4)(?:0\d|1[0-2]|9\d)|\d{2})|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/gi.test(d)
        },
      }
    },

    web () {
      return {
        isOnline () {
          return window.navigator.onLine
        },
        isMobile () {
          return navigator.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        },
        isAndroid () {
          return /(Android)/i.test(navigator.userAgent)
        },
        isIOS () {
          return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
        },
        isWxWebview () {
          return window.navigator.userAgent.toLocaleLowerCase().match(/MicroMessenger/i) == 'micromessenger'
        },
        isSafariWebview () {
          var bn = navigator.userAgent.toLowerCase();
          return /webkit/i.test(bn) && !(/chrome/i.test(bn) && /webkit/i.test(bn) && /mozilla/i.test(bn))
        },
        isIEWebview () {
          var bn = navigator.userAgent.toLowerCase();
          return /msie/i.test(bn) && !/opera/.test(bn)
        },
        getDomain () {
          return document.domain
        }

      }
    }
  };
  global.doget = doget;
})