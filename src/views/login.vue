<template>
    <div class="login">
        <p class="title">航线任务系统</p>
        <group>
            <x-input title="用户名：" label-width="100px" name="username" placeholder="username" v-model="userinfo.username" required></x-input>
            <x-input title="密码：" label-width="100px" type="password" name="password" placeholder="password" v-model="userinfo.password" required></x-input>
        </group>

        <box gap="30px 25px">
            <x-button type="primary" @click.native="handlelogin">登录</x-button>
        </box>
    </div>
</template>

<script>
import { XInput, Box, Group, XButton, cookie } from 'vux'
import { loginByUsername } from '@/api/login'
import { showAlertAuto } from '@/utils/index'
export default {
  name: 'login',
  data () {
    return {
      userinfo: {
        username: '',
        password: ''
      },
      position: 'default',
      showToast: false
    }
  },
  components: {
    XInput,
    Box,
    Group,
    XButton
  },
  mounted () {
    this.userinfo.username = cookie.get('username')
  },
  methods: {
    handlelogin () {
      if (this.userinfo.username === '' || this.userinfo.password === '') {
        this.position = 'middle'
        showAlertAuto('提示！', '用户名/密码不能为空！')
      } else {
        this.$store.commit('UPDATE_LOADING_STATUS', true)
        loginByUsername(this.userinfo).then(response => {
          const data = response.data
          this.$store.commit('UPDATE_LOADING_STATUS', false)
          if (data.result === 'success') {
            this.$store.commit('UPDATE_LOGIN', true)
            this.$store.commit('SET_USER_ID', data.userid)
            this.$store.commit('SET_USER_NAME', data.realname)
            this.$store.commit('SET_USER_ROLES', data.rolelist)
            cookie.set('username', this.userinfo.username)
            cookie.set('userid', data.userid)
            this.$router.push({ path: '/index/mytask' })
            // 把userid发送到后台 绑定jpush
            window.postMessage('login:' + data.userid, '*')
            data.password = this.userinfo.password
            data.username = this.userinfo.username
            // 把登录人账号密码离线存储
            window.postMessage('newlogin:' + JSON.stringify(data), '*')
          } else {
            showAlertAuto('提示！', data.errormsg)
          }
        }).catch((error) => {
          this.$store.commit('UPDATE_LOADING_STATUS', false)
          showAlertAuto('提示！', '登录发生错误，联系管理员！')
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
.login {
  padding-top: 100px;
}
.title {
  text-align: center;
  font-family: inherit;
  font-size: 25px;
  font-weight: bold;
  padding-bottom: 50px;
}
</style>