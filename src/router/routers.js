import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export const initRouter = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
export const appRouter = [
  {
    path: '/dict',
    name: 'dict',
    meta: {
      icon: 'ios-list',
      title: '基础管理',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'common',
        name: 'common',
        meta: {
          icon: '',
          title: '数据字典管理',
          hideInMenu: true
        },
        component: () => import('@/view/dict/common.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '测试EXCEL',
          hideInMenu: false
        },
        component: () => import('@/view/dict/export-excel.vue')
      }
    ]
  },
  {
    path: '/sys',
    name: 'sys',
    meta: {
      icon: 'ios-stats',
      title: '系统管理',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: '',
          title: '用户管理',
          hideInMenu: true
        },
        component: () => import('@/view/sys/user.vue')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: '',
          title: '角色管理',
          hideInMenu: true
        },
        component: () => import('@/view/sys/role.vue')
      },
      {
        path: 'menu',
        name: 'menu',
        meta: {
          icon: '',
          title: '系统菜单',
          hideInMenu: true
        },
        component: () => import('@/view/sys/menu.vue')
      },
      {
        path: 'dept',
        name: 'dept',
        meta: {
          icon: '',
          title: '角色管理',
          hideInMenu: true
        },
        component: () => import('@/view/sys/dept.vue')
      }
      // {
      //   path: 'export-excel',
      //   name: 'export-excel',
      //   meta: {
      //     icon: '',
      //     title: '导出EXCEL'
      //   },
      //   component: () => import('@/view/sys/export-excel.vue')
      // }
    ]
  },
  {
    path: '/goodsManage',
    name: 'goodsManage',
    meta: {
      icon: 'ios-stats',
      title: '商品管理',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'goodsPub',
        name: 'goodsPub',
        meta: {
          icon: '',
          title: '商品发布',
          hideInMenu: true
        },
        component: () => import('@/view/goods-manage/goodsPub.vue')
      },
      {
        path: 'goodsList',
        name: 'goodsList',
        meta: {
          icon: '',
          title: '商品列表',
          hideInMenu: true
        },
        component: () => import('@/view/goods-manage/goodsList.vue')
      }
    ]
  },
  {
    path: '/goodsNature',
    name: 'goodsNature',
    meta: {
      icon: 'ios-stats',
      title: '商品属性管理',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'categoryManger',
        name: 'categoryManger',
        meta: {
          icon: '',
          title: '类目管理',
          hideInMenu: true
        },
        component: () => import('@/view/goods-nature/categoryManger.vue')
      },
      {
        path: 'attrTemp',
        name: 'attrTemp',
        meta: {
          icon: '',
          title: '属性模板管理',
          hideInMenu: true
        },
        component: () => import('@/view/goods-nature/attrTemp.vue')
      },
      {
        path: 'brandList',
        name: 'brandList',
        meta: {
          hideInMenu: true,
          icon: '',
          title: '品牌管理'
        },
        component: () => import('@/view/goods-nature/brandList.vue')
      }
    ]
  },
  {
    path: '/orderManage',
    name: 'orderManage',
    meta: {
      hideInMenu: true,
      icon: 'ios-stats',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: 'orderList',
        name: 'orderList',
        meta: {
          hideInMenu: true,
          icon: 'ios-stats',
          title: '商城订单'
        },
        component: () => import('@/view/order-manage/orderList.vue')
      },
      {
        path: 'afterSaleOrder',
        name: 'afterSaleOrder',
        meta: {
          hideInMenu: true,
          icon: 'ios-stats',
          title: '售后订单'
        },
        component: () => import('@/view/order-manage/afterSaleOrder.vue')
      }
    ]
  },
  {
    path: '/financeManage',
    name: 'financeManage',
    meta: {
      hideInMenu: true,
      icon: 'ios-stats',
      title: '财务管理'
    },
    component: Main,
    children: [
      {
        name: 'payList',
        path: 'payList',
        meta: {
          hideInMenu: true,
          icon: 'ios-stats',
          title: '交易流水'
        },
        component: () => import('@/view/finance-manage/payList.vue')
      }
    ]
  },
  {
    path: '/supplierManager',
    name: 'supplierManager',
    meta: {
      icon: 'ios-stats',
      title: '供应商',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'supplier',
        name: 'supplier',
        meta: {
          icon: 'ios-stats',
          title: '供应商管理',
          hideInMenu: true
        },
        component: () => import('@/view/supplier/supplier.vue')
      },
      {
        path: 'addsupr',
        name: 'addsupr',
        meta: {
          icon: '',
          title: '供应商添加',
          hideInMenu: true
        },
        component: () => import('@/view/supplier/add-supplier.vue')
      }
    ]
  },
  {
    path: '/thematicManager',
    name: 'thematicManager',
    meta: {
      icon: 'ios-stats',
      title: '专题管理',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'thematicList',
        name: 'thematicList',
        meta: {
          icon: '',
          title: '专题活动列表',
          hideInMenu: true
        },
        component: () => import('@/view/thematic-activities/thematicList.vue')
      },
      {
        path: 'thematicPub',
        name: 'thematicPub',
        meta: {
          icon: '',
          title: '专题活动发布',
          hideInMenu: true
        },
        component: () => import('@/view/thematic-activities/thematicPub.vue')
      }
    ]
  },
  {
    path: '/multilevel',
    name: 'multilevel',
    meta: {
      icon: 'md-menu',
      title: '多级菜单',
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '二级-1',
          hideInMenu: true
        },
        component: () => import('@/view/multilevel/level-2-1.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin'],
          icon: 'md-funnel',
          showAlways: true,
          hideInMenu: true,
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'md-funnel',
              title: '三级',
              hideInMenu: true
            },
            component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
          },
          {
            path: 'level_2_2_2',
            name: 'level_2_2_2',
            meta: {
              icon: 'md-funnel',
              title: '三级',
              hideInMenu: true
            },
            component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'md-funnel',
          title: '二级-3',
          hideInMenu: true
        },
        component: () => import('@/view/multilevel/level-2-3.vue')
      }
    ]
  }
]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...initRouter,
  ...appRouter
]
