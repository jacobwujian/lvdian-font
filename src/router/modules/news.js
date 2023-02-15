export default {
  path: 'news',
  name: 'newsManagement',
  meta: {
    title: '资讯管理',
    icon: 'file',
    noTouch: true
  },
  order: 12,
  component: () => import('@/views/newsManagement/index.vue')
  // children: [
  //   {
  //     path: 'detail/:id',
  //     props: true,
  //     component: () => import('@/views/newsManagement/newsDetail.vue'),
  //     name: 'newsdetail',
  //     meta: { title: '优惠卷详情' },
  //     hidden: true
  //   }
  // ]
}
