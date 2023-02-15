import request from '@/utils/request'
const obj = {}

/**
 * 绿色电力积分核发量分时图
 * @method
 * @name electricTimeFrameQuantity
 * @param {integer} before -
 * @param {string} beforeDate -
 */
obj.electricTimeFrameQuantity=function(params) {
  return request({
    url: '/api/monitor/electricTimeFrameQuantity',
    method: 'get',
    params
  })
}

/**
 * 绿色电力能源占比(右上统计图)
 * @method
 * @name greenOfPower

 */
obj.greenOfPower=function(params) {
  return request({
    url: '/api/monitor/greenOfPower',
    method: 'get',
    params
  })
}

/**
 * 绿色电力积分发行数量(中上统计图)
 * @method
 * @name publishCountOfPower

 */
obj.publishCountOfPower=function(params) {
  return request({
    url: '/api/monitor/publishCountOfPower',
    method: 'get',
    params
  })
}

/**
 * 绿色电力积分月份核发量
 * @method
 * @name stockMonthTotal

 */
obj.stockMonthTotal=function(params) {
  return request({
    url: '/api/monitor/stockMonthTotal',
    method: 'get',
    params
  })
}

/**
 * 右下图
 * @method
 * @name totalWindPower
 * @param {integer} energyType -energyType
 */
obj.totalWindPower=function(params) {
  return request({
    url: '/api/monitor/totalWindPower',
    method: 'get',
    params
  })
}

/**
 * 左下 各地市交易量
 * @method
 * @name tradeCountOfCity

 */
obj.tradeCountOfCity=function(params) {
  return request({
    url: '/api/monitor/tradeCountOfCity',
    method: 'get',
    params
  })
}

export default obj