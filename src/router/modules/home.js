export default [
  {
    path: 'home',
    name: 'home',
    meta: {
      title: '首页',
      noPermission: true
    },
    component: () => import('@/views/home/index.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'home/detail/:id',
    name: 'homedetail',
    meta: {
      title: '交易详情'
    },
    component: () => import('@/views/home/detail.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'myaccount',
    name: 'myaccount',
    meta: {
      title: '我的账户'
    },
    component: () => import('@/views/my-account/index.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'ordermanagement',
    name: 'ordermanagement',
    meta: {
      title: '订单管理'
    },
    component: () => import('@/views/order-management/index.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'myassets',
    name: 'myassets',
    meta: {
      title: '我的资产'
    },
    component: () => import('@/views/my-assets/index.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'about',
    name: 'about',
    meta: {
      title: '了解我们',
      noPermission: true
    },
    component: () => import('@/views/knows/about.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'help',
    name: 'help',
    meta: {
      title: '新手帮助',
      noPermission: true
    },
    component: () => import('@/views/knows/help.vue'),
    hidden: true,
    noPermission: true
  },
  {
    path: 'contact',
    name: 'contact',
    meta: {
      title: '联系我们',
      noPermission: true
    },
    component: () => import('@/views/knows/contact.vue'),
    hidden: true,
    noPermission: true
  }
]

