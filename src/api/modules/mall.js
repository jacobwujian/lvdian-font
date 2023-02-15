import request from '@/utils/request'
const obj = {}

/**
 * 查询代金卷列表
 * @method
 * @name findVoucher
 */
obj.findVoucher = function(params) {
  return request({
    url: '/api/voucher/findVoucher',
    method: 'get',
    params
  })
}

/**
 * 代金卷添加
 * @method
 * @name voucherAdd
 */
obj.voucherAdd = function(data) {
  return request({
    url: '/api/voucher/voucherAdd',
    method: 'post',
    data
  })
}

/**
 * 代金卷修改
 * @method
 * @name editVoucher
 */
obj.editVoucher = function(data) {
  return request({
    url: '/api/voucher/editVoucher',
    method: 'post',
    data
  })
}

/**
 * 删除代金卷
 * @method
 * @name deleteVoucher
 */
obj.deleteVoucher = function(params) {
  return request({
    url: '/api/voucher/deleteVoucher',
    method: 'post',
    params
  })
}

/**
 * 修改上架状态
 * @method
 * @name editStatus
 */
obj.editStatus = function(params) {
  return request({
    url: '/api/voucher/editStatus',
    method: 'get',
    params
  })
}

/**
 * 修改数据-根据id查询
 * @method
 * @name findByVoucherId
 */
obj.findByVoucherId = function(params) {
  return request({
    url: '/api/voucher/findByVoucherId',
    method: 'get',
    params
  })
}

/**
 * 代金卷批次导入记录查询
 * @method
 * @name findImportVoucher
 */
obj.findImportVoucher = function(params) {
  return request({
    url: '/api/voucher/findImportVoucher',
    method: 'get',
    params
  })
}

/**
 * 代金券兑换码导入
 * @method
 * @name codeImport
 */
obj.codeImport = function(data) {
  return request({
    url: '/api/voucher/codeImport',
    method: 'post',
    data
  })
}
/**
 * 查询详情 根据id查询
 * @method
 * @name findVoucherDetails
 */
obj.findVoucherDetails = function(params) {
  return request({
    url: '/api/voucher/findVoucherDetails',
    method: 'get',
    params
  })
}

/**
 * 删除导入代金卷兑换码
 * @method
 * @name deleteImportVoucher
 */
obj.deleteImportVoucher = function(params) {
  return request({
    url: '/api/voucher/deleteImportVoucher',
    method: 'post',
    params
  })
}

export default obj
