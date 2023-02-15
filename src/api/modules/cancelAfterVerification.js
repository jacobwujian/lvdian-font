import request from '@/utils/request'
const obj = {}

/**
 * 核销审核
 * @method
 * @name getCancelAfterVerificationCheck
 * @param {} checkDto -checkDto
 */
obj.getCancelAfterVerificationCheck=function(data) {
  return request({
    url: '/api/cancelAfterVerification/getCancelAfterVerificationCheck',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 核销详情
 * @method
 * @name getCancelAfterVerificationDetail
 * @param {integer} id -id
 */
obj.getCancelAfterVerificationDetail=function(params) {
  return request({
    url: '/api/cancelAfterVerification/getCancelAfterVerificationDetail',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 条件查询核销列表
 * @method
 * @name getCancelAfterVerificationList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} companyName -核销企业
 * @param {string} startTime -开始时间
 * @param {string} endTime -结束时间
 * @param {integer} status -核销状态：0待审核 1审核通过 2审核拒绝
 * @param {string} relateProject -关联项目
 */
obj.getCancelAfterVerificationList=function(params) {
  return request({
    url: '/api/cancelAfterVerification/getCancelAfterVerificationList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

export default obj