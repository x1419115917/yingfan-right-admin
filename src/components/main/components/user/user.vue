<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount" class="avatar">
        <!-- <Avatar :src="userAvatar"/> -->
        <span class="user-name">{{userName}}</span>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { logoutFn } from '@/api/login'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    },
    userName: {
      type: String,
      default: 'admin'
    }
  },
  // data() {
  //   return {
  //     userName: ''
  //   }
  // },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    async logout () {
      let res = await logoutFn({})
      if (res.data.code === 0) {
        Cookies.remove('access_token')
        Cookies.remove('userId')
        Cookies.remove('username')
        sessionStorage.setItem('menus', JSON.stringify([]))
        this.$forceUpdate()
        this.$router.replace({
          name: 'login'
        })
      }
      // this.handleLogOut().then(() => {
      //   this.$router.push({
      //     name: 'login'
      //   })
      // })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
