import request from '@/utils/request'
const obj = {}

/**
 * 绿色电力能源占比
 * @method
 * @name statisticsgreenOfPower

 */
obj.statisticsgreenOfPower=function(params) {
  return request({
    url: '/api/homePage/statistics/greenOfPower',
    method: 'get',
    params
  })
}

/**
 * 绿色电力积分发行总量
 * @method
 * @name statisticssendGreenTotal

 */
obj.statisticssendGreenTotal=function(params) {
  return request({
    url: '/api/homePage/statistics/sendGreenTotal',
    method: 'get',
    params
  })
}

/**
 * 各地城市: 风、光、水电核发量以及挂牌量
 * @method
 * @name statisticstotalWindPower
 * @param {integer} energyType -energyType
 */
obj.statisticstotalWindPower=function(params) {
  return request({
    url: '/api/homePage/statistics/totalWindPower',
    method: 'get',
    params
  })
}

/**
 * 各地市交易量
 * @method
 * @name statisticstradeCountOfCity

 */
obj.statisticstradeCountOfCity=function(params) {
  return request({
    url: '/api/homePage/statistics/tradeCountOfCity',
    method: 'get',
    params
  })
}

export default obj