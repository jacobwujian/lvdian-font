import request from '@/utils/request'
const obj = {}

/**
 * 项目详情-核销资产信息
 * @method
 * @name checkAssetInfo
 * @param {} verificationDto -verificationDto
 */
obj.checkAssetInfo=function(data) {
  return request({
    url: '/api/asset/checkAssetInfo',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 项目详情-资产信息详情
 * @method
 * @name getAssetDetail
 * @param {integer} id -id
 */
obj.getAssetDetail=function(params) {
  return request({
    url: '/api/asset/getAssetDetail',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 项目详情-资产信息列表查询
 * @method
 * @name selectAssetList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} companyName -公司名称
 * @param {integer} status -状态
 */
obj.selectAssetList=function(params) {
  return request({
    url: '/api/asset/selectAssetList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

export default obj