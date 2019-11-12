<template>
  <Layout style="height: 100%" class="main" v-show="isfirst == '0'">
      <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="getMenusList">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <div class="logo-con" :class="{'logon-con-height': !collapsed}">
            <img v-show="!collapsed" :src="minLogo" key="max-logo" />
            <h1 v-show="!collapsed" class="title-text">应悦汇管理系统</h1>
            <img v-show="collapsed" :src="minLogo" key="min-logo" />
          </div>
        </side-menu>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
            <user :message-unread-count="unreadCount" :user-avatar="minLogo" :userName="userName"/>
            <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
            <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>
            <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          </header-bar>
        </Header>
        <Content class="main-content-con">
          <Layout class="main-layout-con">
            <div class="tag-nav-wrapper">
              <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
            </div>
            <Content class="content-wrapper">
              <keep-alive :include="cacheList">
                <router-view/>
              </keep-alive>
              <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            </Content>
          </Layout>
        </Content>
      </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import Cookies from 'js-cookie'
import { routers } from '@/router/routers'
import minLogo from '@/assets/images/photo_s.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      isFullscreen: false,
      getMenusList: [],
      isfirst: '0',
      spinShow: false,
      userName: ''
    }
  },
  computed: {
    ...mapGetters([
      'errorCount',
      'getMenusListes'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      // const list = ['ParentView', ...this.tagNavList.length ? [] : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount',
      'getuserMemu'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
    // getMenusList: { //监听指定位置勾选
    //   handler: function (val, oldval) {
    //       console.log('val+++++++++++',val);
    //     if (val != oldval) {
    //       this.$nextTick(() => {
    //         this.getMenusList = val;
    //       })
    //     } else {
    //       this.$nextTick(() => {
    //         this.getMenusList = oldval;
    //       })
    //     }
    //   },
    //   immediate: true, //关键
    //   deep: true
    // },
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.userName = Cookies.get('username')
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    this.getUnreadMessageCount()
    this.getuserMemu()
    let menus = sessionStorage.getItem('menus')
    if (!menus) {
      Cookies.remove('access_token')
      Cookies.remove('userId')
      Cookies.remove('username')
      sessionStorage.removeItem('menus')
      this.$router.replace({
        path: '/login'
      })
    }
    let isfirst = sessionStorage.getItem('isfirst')
    this.isfirst = isfirst
    if (isfirst == '1') {
      this.$router.go(0)
      sessionStorage.setItem('isfirst', '0')
    }
    this.$nextTick(() => {
      this.getMenusList = [...this.getMenusListes]
      console.log('sessionStorage.getMenusLists', this.getMenusList)
    })
    this.$forceUpdate()
  }
}
</script>
