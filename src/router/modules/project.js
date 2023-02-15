export default {
  path: 'project',
  component: () => import('@/views/project/manage.vue'),
  name: 'projectManagement',
  meta: {
    title: '项目管理',
    icon: 'calendar'
  },
  order: 2,
  children: [
    {
      path: 'detail/:id',
      props: true,
      component: () => import('@/views/project/detail.vue'),
      name: 'projectdetail',
      meta: { title: '项目详情' },
      hidden: true
    }
  ]
}

