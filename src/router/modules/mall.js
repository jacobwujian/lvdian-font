export default {
  path: 'mall',
  name: 'mallManagement',
  meta: {
    title: '商城管理',
    icon: 'shop',
    noTouch: true
  },
  order: 9,
  component: () => import('@/views/base/index.vue'),
  children: [
    {
      path: 'coupon',
      component: () => import('@/views/mall/coupon.vue'),
      name: 'couponManagement',
      meta: { title: '优惠卷' },
      children: [
        {
          path: 'detail/:id',
          props: true,
          component: () => import('@/views/mall/couponDetail.vue'),
          name: 'coupondetail',
          meta: { title: '优惠卷详情' },
          hidden: true
        }
      ]
    }
  ]
}
