
/**
 * 全局totast、modal等复用ui
 */
import ajax from '@/utils/ajax'

window.UI = {
  root: null,
  init (context) {
    if (context && context.$root)
    {
      this.root = context.$root
    }
  },
  showToast ({
    content,
    type,
  }) {
    if (content)
    {
      this.root.$emit('showToast', {
        content,
        type
      })
    }
  }
}

const domain = process.env.NODE_ENV === 'production' ? 'http://139.196.158.77' : 'localhost'

window.gStatus = {
  // 若禁用cookie，启用storage
  enableCookie: navigator.cookieEnabled,
  userData: {},
  token: '',
  expire: 0,
  context: null,
  islogin () {
    if (this.enableCookie)
    {
      let ckArr = document.cookie.split(';')
      let tokenStr = ckArr.find(ck => ck.indexOf('uid=') !== -1)
      return tokenStr;
    } else
    {
      return localStorage.getItem('uid')
    }
  },
  // 需要及时更新用户信息的地方调用
  shoudUpdateUserInfo (context) {
    this.context = context
    let dt = new Date().getTime();
    if (this.expire < dt)
    {
      let token = this.getToken()
      if (token)
      {
        ajax.get('/user/getInfo', {
          token
        }).then(res => {
          let { code, data } = res.data
          if (code === 200)
          {
            gStatus.initUser(data)
            context.$store.dispatch('setUser', data)
          } else
          {
            // token不存在或状态过期，清理
            this.logout();
          }
        })
      }
    }
  },

  initUser (data, context) {
    if (data)
    {
      this.userData = data;
      if (context)
      {
        // 全局更新user
        context.$store.dispatch('setUser', data)
      }
    }
  },

  loginLockCheck () {
    return !!this.userData.nickname;
  },

  clearCookie () {
    var keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys)
    {
      for (var i = keys.length; i >= 0; i--)
      {
        document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}`
        document.cookie = `${keys[i]}=0;path=/setting;expires=${new Date(0).toUTCString()}`
        document.cookie = `${keys[i]}=0;path=/publish;expires=${new Date(0).toUTCString()}`
        document.cookie = `${keys[i]}=0;path=/detail;expires=${new Date(0).toUTCString()}`
        document.cookie = `${keys[i]}=0;path=/;domain=${document.domain};expires=${new Date(0).toUTCString()}`
        document.cookie = `${keys[i]}=0;path=/;domain=${domain};expires=${new Date(0).toUTCString()}`
      }
    }
    this.token = '';
    this.expire = 0;
  },

  logout () {
    this.clearCookie()
    this.initUser({}, this.context)
  },

  // 登陆初始化
  login (token, expire, user, context) {
    this.setToken(token, expire)
    if (user)
    {
      this.initUser(user, context)
    }
  },

  getToken () {
    if (this.enableCookie)
    {
      let ckArr = document.cookie.split(';')
      let tokenStr = ckArr.find(ck => ck.indexOf('uid=') !== -1)
      if (tokenStr)
      {
        let tokenArr = tokenStr.split('=');
        if (tokenArr.length)
        {
          tokenArr.splice(0, 1);
          return tokenArr.join('=')
        }
      }
    } else
    {
      return localStorage.getItem('uid');
    }
  },

  setToken (token, expire = new Date().getTime() + 24 * 3600 * 1000) {
    if (this.enableCookie)
    {
      this.clearCookie()
      document.cookie = 'uid=' + token + ';expires=' + expire
    } else
    {
      localStorage.setItem('uid', {
        token,
        expire
      });
    }
    this.token = token;
    this.expire = expire;
  },
}