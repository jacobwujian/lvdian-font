export default {
  path: 'order',
  name: 'orderManagement',
  meta: {
    title: '订单管理',
    icon: 'account-book',
    noTouch: true
  },
  order: 8,
  component: () => import('@/views/base/index.vue'),
  children: [
    {
      path: 'points',
      component: () => import('@/views/mini-order/points.vue'),
      name: 'greenElectricityManagement',
      meta: { title: '绿电积分' },
      children: [
        {
          path: 'detail/:id',
          props: true,
          component: () => import('@/views/mini-order/pointsDetail.vue'),
          name: 'pointsdetail',
          meta: { title: '绿电积分详情' },
          hidden: true
        }
      ]
    },
    {
      path: 'exchange',
      component: () => import('@/views/mini-order/exchange.vue'),
      name: 'pointManagement',
      meta: { title: '积分兑换' },
      children: [
        {
          path: 'detail/:id',
          props: true,
          component: () => import('@/views/mini-order/exchangeDetail.vue'),
          name: 'exchangedetail',
          meta: { title: '积分兑换详情' },
          hidden: true
        }
      ]
    }
  ]
}

