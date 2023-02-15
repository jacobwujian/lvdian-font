export default {
	path: 'buy',
	component: () => import('@/views/base/index'),
	name: 'buy',
	meta: {
		title: '采购与付款',
		noLayout: true,
		noTouch: true,
		icon: 'account-book'
	},
	order: 1,
	children: [{
			path: 'buy1',
			component: () => import('@/views/base/index'),
			name: 'buy1',
			meta: {
				title: '供应商管理'
			},
			noTouch: true,
			children: [{
				path: 'buy1c1',
				component: () => import('@/views/base/index'),
				name: 'buy1c1',
				meta: {
					title: '资料不完整供应商清单'
				}
			}, {
				path: 'buy1c2',
				component: () => import('@/views/base/index'),
				name: 'buy1c2',
				meta: {
					title: '资质审核不合规客户清单'
				}
			}, {
				path: 'buy1c3',
				component: () => import('@/views/base/index'),
				name: 'buy1c3',
				meta: {
					title: '供应商业务量异常分析'
				}
			}]
		},
		{
			path: 'buy2',
			component: () => import('@/views/base/index'),
			name: 'buy2',
			meta: {
				title: '授信管理'
			},
			noTouch: true,
			children: [{
				path: 'buy2c1',
				component: () => import('@/views/base/index'),
				name: 'buy2c1',
				meta: {
					title: '授信额度审核不合规客户清单'
				}
			}, {
				path: 'buy2c2',
				component: () => import('@/views/base/index'),
				name: 'buy2c2',
				meta: {
					title: '预付款金额超授信额度客户清单'
				}
			}]
		},
		{
			path: 'buy3',
			component: () => import('@/views/base/index'),
			name: 'buy3',
			meta: {
				title: '合同管理'
			},
			noTouch: true,
			children: [{
				path: 'buy3c1',
				component: () => import('@/views/mini-order/exchange.vue'),
				name: 'buy3c1',
				meta: {
					title: '签订流程不合规合同清单'
				}
			}]
		},
		{
			path: 'buy4',
			component: () => import('@/views/base/index'),
			name: 'buy4',
			meta: {
				title: '履约管理'
			},
			noTouch: true,
			children: [{
				path: 'buy4c1',
				component: () => import('@/views/mini-order/exchange.vue'),
				name: 'buy4c1',
				meta: {
					title: '履约不及时交货记录清单'
				}
			}]
		}
	]
}
