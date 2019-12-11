<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <Row class="login-content" type="flex" align="middle" justify="space-around">
        <Col span="6">
          <div class="col-sm-7 left-login-text">
            <h3>美粤文化</h3>
            <h5>欢迎使用 应范管理系统</h5>
            <ul class="list">
              <li><Icon type="md-arrow-round-forward" />供应商管理</li>
              <li><Icon type="md-arrow-round-forward" />商品管理</li>
              <li><Icon type="md-arrow-round-forward" />订单管理</li>
              <li><Icon type="md-arrow-round-forward" />支付管理</li>
              <li><Icon type="md-arrow-round-forward" />售前/售后管理</li>
            </ul>
            <p class="footer">© 2017 All Rights Reserved.</p>
          </div>
        </Col>
        <Col span="9">
           <div class="col-sm-7 login-con">
            <div icon="log-in" title="欢迎登录" :bordered="false">
              <h3 class="text-center">用户登录</h3>
              <h5 class="text-center">欢迎登录应范后台管理系统</h5>
              <div class="form-con">
                <login-form @on-success-valid="handleSubmit"></login-form>
                <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
              </div>
              <div class="outside-login">
                <div class="outside-login-tit">
                  <span>登录进入系统</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
    </Row>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { login, userMemu, doAllBtn } from '@/api/login'
import Cookies from 'js-cookie'
import { mapActions } from 'vuex'
import router from '@/router'
import { initRouter, appRouter, routers } from '@/router/routers'
import { getMenuByRouter } from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      menusList: [],
      menuList: [],
      appRouter: []
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getuserMenuInit'
    ]),
    async handleSubmit ({ userName, password }) {
      let data = {
        userName,
        passWord: password
      }
      let res = await login(data)
      if (res.data.code === 0) {
        Cookies.set('access_token', res.data.content.token)
        Cookies.set('userId', res.data.content.userId)
        Cookies.set('username', res.data.content.username)
        Cookies.set('sessionId', res.data.content.sessionId)
        this.userMemu()
        this.getAllBtn()
      }
    },
    async userMemu () {
      let res = await userMemu()
      if (res.data.code === 0) {
        let menus = JSON.stringify(res.data.content.menus)
        this.menusList = []
        this.forGetTitle(res.data.content.menus)
        // console.log('res.data.content.menus', this.menusList)
        // return;
        sessionStorage.setItem('menus', JSON.stringify(this.menusList))
        this.getuserMenuInit()
        sessionStorage.setItem('isfirst', '1')
        this.$router.push({
          name: this.$config.homeName
        })
      }
    },
    // 获取按钮权限
    async getAllBtn () {
      let res = await doAllBtn()
      if (res.data.code === 0) {
        sessionStorage.setItem('buttenpremissions', JSON.stringify(res.data.content))
      }
    },
    routerFor (arr1, arr) {
      arr1.forEach((item1, index) => {
        arr.forEach((item, index) => {
          if (item.meta.title === item1.title) {
            item.meta.hideInMenu = item1.hideMenu === 1
          }
          if (item.children) {
            item.children.forEach((value, index) => {
              if (value.meta.title === item1.title) {
                value.meta.hideInMenu = item1.hideMenu === 1
              }
            })
          }
        })
      })
      return arr
    },
    forGetTitle (arr) {
      arr.forEach(item => {
        this.menusList.push(
          {
            icon: item.attributes.icon,
            title: item.text,
            hideMenu: item.showMenu === 1 ? 0 : 1
          }
        )
        if (item.children && item.children.length > 0) {
          this.forGetTitle(item.children)
        }
      })
    }
  }
}
</script>

<style>

</style>
