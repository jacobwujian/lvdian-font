export default {
        path: 'verification',
        component: () => import('@/views/verification/manage.vue'),
        name: 'cancelAfterVerificationManagement',
        meta: {
          title: '核销管理',
          icon: 'barcode'
        },
        order: 7,
        children: [
          {
            path: 'detail/:id',
            props: true,
            component: () => import('@/views/verification/detail.vue'),
            name: 'verificationdetail',
            meta: { title: '核销详情' },
            hidden: true
          }
        ]
      }

