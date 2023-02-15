import request from '@/utils/request'
const obj = {}

/**
 * 删除设备
 * @method
 * @name deleteDevice
 * @param {} request -request
 */
obj.deleteDevice = function(data) {
  return request({
    url: '/api/device/deleteDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 修改设备
 * @method
 * @name editDevice
 * @param {} editDeviceDto -editDeviceDto
 */
obj.editDevice = function(data) {
  return request({
    url: '/api/device/editDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 条件查询设备列表-->外部对接使用
 * @method
 * @name getDevList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} deviceId -设备ID
 * @param {string} deviceCertificate -设备证书编号
 * @param {integer} energyType -能源类型 0 光伏 1 风电 2 水电
 * @param {integer} status -状态 -1吊销 0待部署 1启动 2暂停
 * @param {string} installTimeStart -开始日期
 * @param {string} installTimeEnd -结束日期
 * @param {string} companyName -机构名称
 * @param {string} projectName -项目名称
 * @param {integer} companyId -所在公司
 */
obj.getDevList = function(params) {
  return request({
    url: '/api/device/getDevList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 条件查询设备列表
 * @method
 * @name getDeviceList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} deviceId -设备ID
 * @param {string} deviceCertificate -设备证书编号
 * @param {integer} energyType -能源类型 0 光伏 1 风电 2 水电
 * @param {integer} status -状态 -1吊销 0待部署 1启动 2暂停
 * @param {string} installTimeStart -开始日期
 * @param {string} installTimeEnd -结束日期
 * @param {string} companyName -机构名称
 * @param {string} projectName -项目名称
 * @param {integer} companyId -所在公司
 */
obj.getDeviceList = function(params) {
  return request({
    url: '/api/device/getDeviceList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 设备导入
 * @method
 * @name importDevice
 * @param {file} file -file
 */
obj.importDevice = function(data) {
  return request({
    url: '/api/device/importDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 协议购买
 * @method
 * @name protocolBuy
 * @param {file} file -file
 */
obj.protocolBuy = function(data) {
  return request({
    url: '/api/trade/protocolBuy',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 启用设备
 * @method
 * @name launchDevice
 * @param {} request -request
 */
obj.launchDevice = function(data) {
  return request({
    url: '/api/device/launchDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 吊销设备
 * @method
 * @name revokeDevice
 * @param {} request -request
 */
obj.revokeDevice = function(data) {
  return request({
    url: '/api/device/revokeDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 停用设备
 * @method
 * @name stopDevice
 * @param {} request -request
 */
obj.stopDevice = function(data) {
  return request({
    url: '/api/device/stopDevice',
    method: 'post',
    data,
    domain: 'cw'
  })
}

export default obj
