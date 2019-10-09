<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <Row class="login-content" type="flex" align="middle" justify="space-around">
        <Col span="6">
          <div class="col-sm-7 left-login-text">
            <h3>美粤文化</h3>
            <h5>欢迎使用 美粤文化后台管理系统</h5>
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
              <h5 class="text-center">欢迎登录美粤文化后台管理系统</h5>
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
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      console.log(this.$config.homeName)
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    }
  }
}
</script>

<style>

</style>
