// 能源类型
export const energyType = [
  {
    name: '光伏',
    value: 0
  },
  {
    name: '风电',
    value: 1
  },
  {
    name: '水电',
    value: 2
  }
]
// 审核状态
export const checkStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '待审核',
    value: 0
  },
  {
    name: '审核通过',
    value: 1
  },
  {
    name: '审核拒绝',
    value: 2
  }
]
// 交易类型
export const dealType = [
  {
    name: '购买',
    value: 0
  },
  {
    name: '核销',
    value: 1
  }
]
// 交易状态
export const dealStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '待审核',
    value: 0
  },
  {
    name: '交易成功',
    value: 1
  },
  {
    name: '交易失败',
    value: 2
  },
  {
    name: '交易中',
    value: 3
  }
]
// 充值状态
export const payStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '失败',
    value: 0
  },
  {
    name: '成功',
    value: 1
  },
  {
    name: '交易中',
    value: 2
  }
]

// 启用、停用状态
export const switchStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '启用',
    value: 1
  },
  {
    name: '停用',
    value: 0
  }
]

// 账户状态
export const accountStatus = [
  {
    name: '未生效',
    value: 0
  },
  {
    name: '启用',
    value: 1
  },
  {
    name: '停用',
    value: 2
  }
]

export const deviceStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '启用',
    value: 1
  },
  {
    name: '停用',
    value: 2
  },
  {
    name: '吊销',
    value: 0
  }
]

export const projectStatus = [
  {
    name: '全部',
    value: ''
  },
  {
    name: '待审核',
    value: 0
  },
  {
    name: '审核通过',
    value: 1
  },
  {
    name: '项目暂停',
    value: 2
  },
  {
    name: '审核未通过',
    value: 3
  },
  {
    name: '已终止',
    value: 4
  },
  {
    name: '待删除审核',
    value: 5
  }
]

export const assetStatus = [
  {
    name: '持有',
    value: 1
  },
  {
    name: '核销中',
    value: 2
  },
  {
    name: '核销成功',
    value: 3
  },
  {
    name: '核销失败',
    value: 4
  },
  {
    name: '资产售出',
    value: 5
  },
  {
    name: '资产锁定',
    value: 9
  },
  {
    name: '消耗资产',
    value: 10
  }
]
// 上链状态
export const chainStatus = [
  {
    name: '未上链',
    value: 'notKey'
  },
  {
    name: '上链中',
    value: 0
  },
  {
    name: '上链成功',
    value: 1
  },
  {
    name: '上链失败',
    value: 2
  }
]

export const orgTypes = [
  {
    name: '超级管理员',
    value: 0
  },
  {
    name: '耗能企业',
    value: 1
  },
  {
    name: '能源企业',
    value: 2
  }
]

export const reviewType = [
  {
    name: '通过',
    value: 1
  },
  {
    name: '驳回',
    value: 0
  }
]

// 发布类型
export const publishType = [
  {
    name: '请选择',
    value: ''
  },
  {
    name: '初始化',
    value: 0
  },
  {
    name: '在售',
    value: 1
  },
  {
    name: '已售出',
    value: 2
  },
  {
    name: '发布撤回',
    value: 3
  }
]
// 核销
// export const verificationType = [
//   {
//     name: '请选择',
//     value: ''
//   }, {
//     name: '资产初始化',
//     value: 0
//   }, {
//     name: '未核销',
//     value: 1
//   }, {
//     name: '核销资产中',
//     value: 2
//   }, {
//     name: '核销成功',
//     value: 3
//   }, {
//     name: '核销失败',
//     value: 4
//   }, {
//     name: '无效资产',
//     value: 10
//   }
// ]

export const verificationType = [
  {
    name: '待审核',
    value: 0
  },
  {
    name: '审核通过',
    value: 1
  },
  {
    name: '审核拒绝',
    value: 2
  }
]

// 核销管理审核
export const verificationAuditType = [
  {
    name: '请选择',
    value: ''
  },
  {
    name: '待审核',
    value: 0
  },
  {
    name: '审核通过',
    value: 1
  },
  {
    name: '审核拒绝',
    value: 2
  },
  {
    name: '资产回退',
    value: 3
  }
]

// 交易类型
export const orderType = [
  {
    name: '线上订单',
    value: 0
  },
  {
    name: '手机端订单',
    value: 1
  },
  {
    name: '协议订单',
    value: 2
  }
]

export const statusTypeColor = (item, type) => {
  const colorType = {
    在售: '#02A7F0',
    已售出: '#70B603',
    发布中: '#02A7F0',
    发布失败: '#D9001B',
    已撤回: '#D9001B',
    未核销: '#279DFE',
    核销成功: '#D9001B',
    核销资产中: '#D9001B'
  }
  return {
    [type || 'color']: colorType[item]
  }
}

// 浙江城市code
export const cityCode = [
  {
    name: '杭州市',
    value: 3301
  },
  {
    name: '宁波市',
    value: 3302
  },
  {
    name: '温州市',
    value: 3303
  },
  {
    name: '嘉兴市',
    value: 3304
  },
  {
    name: '湖州市',
    value: 3305
  },
  {
    name: '绍兴市',
    value: 3306
  },
  {
    name: '金华市',
    value: 3307
  },
  {
    name: '衢州市',
    value: 3308
  },
  {
    name: '舟山市',
    value: 3309
  },
  {
    name: '台州市',
    value: 3310
  },
  {
    name: '丽水市',
    value: 3311
  }
]

// 代金卷状态
export const voucherStatus = [
  {
    name: '下架中',
    value: 0
  },
  {
    name: '上架中',
    value: 1
  }
]

// 资讯状态
export const informationStatus = [
  {
    name: '可见',
    value: 1
  },
  {
    name: '不可见',
    value: 2
  }
]

// 资讯类型
export const informationType = [
  {
    value: 1,
    name: '普通资讯'
  },
  {
    value: 2,
    name: '活动资讯'
  },
  {
    value: 3,
    name: '公益活动'
  }
]

export const projectType = [
  {
    value: 1,
    name: '认证项目'
  },
  {
    value: 2,
    name: '非认证项目'
  }
]

export const EnumMap = (arr, key) => {
  if ((!arr || !key) && key !== 0) return null

  let map = new Map()
  arr.forEach(({ value, name }) => map.set(value, name))
  return map.get(key)
}
