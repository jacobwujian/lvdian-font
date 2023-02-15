import request from '@/utils/request'
const obj = {}

/**
 * 绿电积分
 * @method
 * @name AllUserOrder
 */
obj.AllUserOrder=function(params) {
  return request({
    url: '/api/asset/AllUserOrder',
    method: 'get',
    params
  })
}

/**
 * 积分兑换
 * @method
 * @name AllUserVoucherOrder

 */
obj.AllUserVoucherOrder=function(params) {
  return request({
    url: '/api/asset/AllUserVoucherOrder',
    method: 'get',
    params
  })
}

/**
 * 绿电积分详情
 * @method
 * @name integralOrderDetails

 */
 obj.integralOrderDetails=function(params) {
  return request({
    url: '/api/asset/UserOrderDetails',
    method: 'get',
    params
  })
}

/**
 * 积分兑换详情
 * @method
 * @name selectUserVoucherDetails

 */
 obj.selectUserVoucherDetails=function(params) {
  return request({
    url: '/api/asset/UserVoucherDetails',
    method: 'get',
    params
  })
}

export default obj