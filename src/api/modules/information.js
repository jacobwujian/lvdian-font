import request from '@/utils/request'
const obj = {}

// information
/**
 * 查询资讯列表
 * @method
 * @name informationList
 */
obj.informationList = function(params) {
  return request({
    url: '/api/information/selectInformation',
    method: 'get',
    params
  })
}

/**
 * 资讯添加
 * @method
 * @name informationAdd
 */
obj.informationAdd = function(data) {
  return request({
    url: '/api/information/addInformation',
    method: 'post',
    data
  })
}

/**
 * 修改数据-根据id查询
 * @method
 * @name findByInformationId
 */
obj.findByInformationId = function(params) {
  return request({
    url: '/api/information/findByInformationId',
    method: 'get',
    params
  })
}

/**
 * 删除资讯
 * @method
 * @name DeleteInformation
 */
obj.DeleteInformation = function(params) {
  return request({
    url: '/api/information/deleteInformation',
    method: 'post',
    params
  })
}

/**
 * 资讯修改
 * @method
 * @name modifyInformation
 */
obj.modifyInformation = function(data) {
  return request({
    url: '/api/information/updateInformation',
    method: 'post',
    data
  })
}

/**
 * 修改可见状态
 * @method
 * @name editStatus
 */
obj.editStatus = function(params) {
  return request({
    url: '/api/information/editInformation',
    method: 'get',
    params
  })
}

export default obj
