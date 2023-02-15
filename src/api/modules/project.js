import request from '@/utils/request'
const obj = {}

/**
 * 新增项目
 * @method
 * @name addProject
 * @param {} addProjectDto -addProjectDto
 */
obj.addProject=function(data) {
  return request({
    url: '/api/project/addProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 审核项目
 * @method
 * @name checkProject
 * @param {} checkDto -checkDto
 */
obj.checkProject=function(data) {
  return request({
    url: '/api/project/checkProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 删除项目
 * @method
 * @name deleteProject
 * @param {} request -request
 */
obj.deleteProject=function(data) {
  return request({
    url: '/api/project/deleteProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 修改审核项目
 * @method
 * @name editCheckProject
 * @param {} checkDto -checkDto
 */
obj.editCheckProject=function(data) {
  return request({
    url: '/api/project/editCheckProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 修改项目
 * @method
 * @name editProject
 * @param {} editProjectDto -editProjectDto
 */
obj.editProject=function(data) {
  return request({
    url: '/api/project/editProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 条件查询项目列表
 * @method
 * @name getProjectList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {string} projectName -项目名称
 * @param {string} projectCode -项目编号
 * @param {integer} energyType -能源类型 0 光伏 1 风电 2 水电
 * @param {integer} status -项目状态 0 待审核 1 审核通过 2 审核未通过
 * @param {string} deliveryTimeStart -报送开始时间
 * @param {string} deliveryTimeEnd -报送结束时间
 * @param {integer} companyId -所属公司
 * @param {string} companyName -机构名称
 * @param {string} socialCreditCode -社会统一信用代码
 */
obj.getProjectList=function(params) {
  return request({
    url: '/api/project/getProjectList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 启动项目
 * @method
 * @name launchProject
 * @param {} request -request
 */
obj.launchProject=function(data) {
  return request({
    url: '/api/project/launchProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 项目明细-产出列表
 * @method
 * @name outputList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {integer} projectId -项目Id
 */
obj.outputList=function(params) {
  return request({
    url: '/api/project/outputList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 项目详情
 * @method
 * @name projectBaseInfo
 * @param {integer} id -id
 */
obj.projectBaseInfo=function(params) {
  return request({
    url: '/api/project/projectBaseInfo',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 项目详情
 * @method
 * @name projectBaseInfoByCode
 * @param {string} code -code
 */
obj.projectBaseInfoByCode =function(params) {
  return request({
    url: '/api/project/projectBaseInfoByCode',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 审核时项目详情
 * @method
 * @name projectDetail
 * @param {integer} projectId -projectId
 */
obj.projectDetail=function(params) {
  return request({
    url: '/api/project/projectDetail',
    method: 'get',
    params,
    domain: 'cw'
  })
}

/**
 * 统计项目发证情况
 * @method
 * @name stockStatistics
 * @param {integer} projectId -项目Id
 * @param {string} startTime -开始时间 格式：yyyy-MM-dd HH:mm:ss
 * @param {string} endTime -结束时间 格式：yyyy-MM-dd HH:mm:ss
 */
obj.stockStatistics=function(data) {
  return request({
    url: '/api/project/stockStatistics',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 暂停项目
 * @method
 * @name stopProject
 * @param {} request -request
 */
obj.stopProject=function(data) {
  return request({
    url: '/api/project/stopProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 终止项目
 * @method
 * @name terminationProject
 * @param {} request -request
 */
obj.terminationProject=function(data) {
  return request({
    url: '/api/project/terminationProject',
    method: 'post',
    data,
    domain: 'cw'
  })
}

/**
 * 项目明细-注销列表
 * @method
 * @name writeOffList
 * @param {integer} id -id
 * @param {integer} pageNum -起始页
 * @param {integer} pageSize -每页显示条数
 * @param {integer} projectId -项目Id
 */
obj.writeOffList=function(params) {
  return request({
    url: '/api/project/writeOffList',
    method: 'get',
    params,
    domain: 'cw'
  })
}

export default obj