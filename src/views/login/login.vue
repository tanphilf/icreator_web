<template>
  <div class="login-wrapper">
    <div class="login-box container content-box flex-col-center">
      <router-link to="/" target="_blank">
        <!-- <ximage :src="require('../../assets/logo.png')" width="60" height="60" mode="aspectFit"></ximage> -->
        <span class="logo-name">ICREATOR</span>
      </router-link>
      <div class="login-operation">
        <ul class="login-input-item">
          <li>用户名/手机号</li>
          <input @input="onInputName" type="text" maxlength="30">
        </ul>
        <ul class="login-input-item">
          <li>密码</li>
          <input @input="onInputPassword" type="password" maxlength="50">
        </ul>
      </div>
      <div class="btns-group">
        <div @click="onSignIn" class="confirm-btn">登陆</div>
        <div @click="onSignUp" class="cancel-btn">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    props: {},
    data()
    {
      return {
        name: '',
        phone: '',
        password: '',
      }
    },

    beforeRouteEnter(to, from, next)
    {
      // 每次重进清空登陆信息
      // gStatus.logout()
      next()
    },

    methods: {
      onInputName(e)
      {
        this.name = e.target.value
      },
      onInputPassword(e)
      {
        this.password = e.target.value
      },
      prepareSign()
      {
        if (!this.name) {
          return UI.showToast({
            content: '请输入用户名',
          });
        }
        if (!this.password) {
          return UI.showToast({
            content: '请输入密码',
          });
        }
        if (this.name.length > 30) {
          return UI.showToast({
            content: '用户名不应超过30个字符',
          })
        }
        return true;
      },
      // 登陆
      onSignIn()
      {
        if (this.prepareSign()) {
          this.$http.post('/user/login', {
            name: this.name,
            password: this.password
          }).then((res) =>
          {
            let { code, msg, data } = res.data
            if (code === 200) {
              let { token, expire, user } = data
              this.loginInit(user, token, expire * 1000)
              this.$router.go(-1)

            } else {
              this.$root.$emit('showToast', {
                content: msg
              })
            }
            console.log('登陆返回：', res)
          })
        }
      },

      loginInit(user, token, expire)
      {
        gStatus.login(token, expire, user, this);
      },
      // 注册
      onSignUp()
      {
        if (this.password.length < 6) {
          return UI.showToast({
            content: '密码最低要求6个字符',
          })
        }
        if (this.prepareSign()) {
          this.$http.post('/user/add', {
            name: this.name,
            password: this.password
          }).then((res) =>
          {
            let { code, data, msg } = res.data
            if (code === 200) {
              let { token, expire } = data
              this.loginInit({
                nickname: this.name,
              }, token, expire * 1000)
              this.$router.go(-1)
            } else {
              UI.showToast({
                content: msg
              })
            }
            console.log('创建用户返回：', res)
          })
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  .login-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #646464;

    .login-box {
      width: 6.4rem;
      padding: 50px 0;
      box-shadow: 0 0 10px rgba(220, 220, 220, 0.32);

      .web-logo-name {
        font-size: 16px;
        font-weight: 600;
        color: slategray;
        margin-top: 20px;
      }

      .logo-name {
        color: #646464;
        font-size: 42px;
        font-weight: 600;
        outline: red invert 1px;
      }

      .login-operation {
        margin-top: 40px;
        width: 100%;
        padding: 0 1rem;

        .login-input-item {
          width: 100%;
          font-size: 14px;
          margin-bottom: 10px;

          input {
            width: 100%;
            border: 1px solid #dcdcdc;
            padding: 6px 10px;
            border-radius: 4px;
            margin: 10px 0;
          }
        }
      }

      .btns-group {
        font-size: 14px;
        width: 100%;
        height: 120px;
        padding: 0 1rem;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }
</style>