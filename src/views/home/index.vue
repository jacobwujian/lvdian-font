<!-- 首页 -->
<template>
  <div class="c-home-index pb-50">
    <Banner />

    <div class="index-container">
      <a-row class="charts-warp">
        <a-col
          class="points-count"
          :span="11"
        >
          <Title
            icon="iconfahangzongliang"
            title="绿色电力积分发行总量"
          />
          <a-statistic
            class="num"
            :value="pointsTotal"
            :value-style="{
              fontSize: '36px'
            }"
          />
          <Map
            class="map-item"
            height="560px"
            :chart-data="pointsDataDesc"
          />
        </a-col>
        <a-col
          class="addup-count"
          :span="13"
        >
          <a-tabs default-active-key="0-0">
            <template v-for="(val, key) in multiData">
              <a-tab-pane
                v-for="(v, k, index) of val"
                :key="`${key}-${index}`"
                :tab="`累计${EnumMap(energyType, Number(key))}${multiType[k]}量`"
                class="tab-pane-item"
              >
                <HorizontalBar
                  :id="`${multiIds[key]}${k}Count`"
                  height="520px"
                  :chart-data="v"
                />
              </a-tab-pane>
            </template>
          </a-tabs>
        </a-col>
      </a-row>

      <a-row class="charts-warp">
        <a-col
          class="trade-count"
          :span="12"
        >
          <Title
            icon="icongedishijiaoyiliang"
            title="各地市交易量"
          />

          <a-row
            type="flex"
            justify="space-between"
          >
            <a-col class="bar">
              <VerticalBar
                id="tradeCount"
                height="390px"
                :chart-data="tradeData"
              />
            </a-col>
            <a-col class="legends">
              <div
                v-for="(item, key) in tradeDataDesc"
                :key="`rank-${key}`"
                class="item"
              >
                <span
                  :class="`no${key + 1}`"
                  class="rank"
                >{{ key + 1 }}</span>
                <span class="name">{{ item.name }}</span>
                <span class="num">{{ item.value }}</span>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col
          class="points-ratio"
          :span="12"
        >
          <Title
            icon="iconnengyuanzhanbi"
            title="绿色电力积分能源占比"
          />

          <Rose
            id="pointsRatio"
            height="480px"
            :chart-data="ratioData"
          />
        </a-col>
      </a-row>

      <Flows />

      <a-form-model
        ref="searchForm"
        layout="inline"
        :model="form"
        class="search-form"
      >
        <a-row class="form-row">
          <a-col :span="24">
            <a-form-model-item
              label="能源类型"
              prop="energyType"
            >
              <a-radio-group v-model="form.energyType">
                <a-radio
                  v-for="(op, i) in energyType"
                  :key="`${i}-${op.value}`"
                  :value="op.value"
                >
                  {{ op.name }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :span="24">
            <a-form-model-item
              label="认证等级"
              prop="authenticationLevel"
            >
              <a-radio-group v-model="form.authenticationLevel">
                <a-radio value="">
                  全部
                </a-radio>
                <a-radio
                  v-for="op in LevelList"
                  :key="`level-${op.value}`"
                  :value="op.value"
                >
                  {{ op.name }}
                  <Star :count="1" />
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          class="form-row"
          type="flex"
          align="middle"
        >
          <a-form-model-item
            label="所属公司"
            prop="companyName"
          >
            <a-input
              v-model.trim="form.companyName"
              placeholder="请输入所属公司名称"
              style="width: 300px"
            />
          </a-form-model-item>
          <a-form-model-item
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            label="最早生产日期"
            prop="resourceChain"
          >
            <a-range-picker
              v-model="form.resourceChain"
              style="width: 100%"
            />
          </a-form-model-item>

          <a-space>
            <a-button
              type="primary"
              html-type="submit"
              @click="searchForm"
            >
              查询
            </a-button>
            <a-button @click="resetForm">
              重置
            </a-button>
          </a-space>
        </a-row>
      </a-form-model>

      <a-list
        id="ProductList"
        class="trade-list"
        item-layout="horizontal"
        :loading="loading"
        :data-source="list"
        :pagination="pagination"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item"
          class="item"
        >
          <a-list-item-meta>
            <div
              slot="avatar"
              class="pic-wrap"
            >
              <img :src="item.imgUrl">
            </div>
            <ul
              slot="description"
              class="description"
            >
              <li>{{ item.assetSaleName }}</li>
              <li>发布时间：{{ item.publishTime && $dayjs(item.publishTime).format('YYYY-MM-DD') }}</li>
              <li>所属公司：{{ item.companyName }}</li>
              <li>能源类型：{{ EnumMap(energyType, item.energyType) }}</li>
              <li>
                <Star :count="item.authenticationLevel" />
              </li>
            </ul>
          </a-list-item-meta>
          <div class="actions">
            <ul class="infos text-right">
              <li class="price">
                <span class="unit">￥</span>
                <a-statistic
                  class="price-format inline-block font-bold"
                  :precision="2"
                  :value="item.price / 1000"
                  :value-style="{
                    color: '#ff4d4f',
                    fontSize: '24px'
                  }"
                />
              </li>
              <li>绿证最早生产时间：{{ item.resourceChainTime && $dayjs(item.resourceChainTime).format('YYYY-MM-DD') }}</li>
              <li>库存：{{ (item.stock || 0) / 10 }} 张</li>
            </ul>
            <div class="btns">
              <a-button
                class="buy-btn"
                type="danger"
                @click="$router.push({
                  path: `/home/detail/${item.id}`
                })"
              >
                查看详情
              </a-button>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import Star from '@/components/base/c-star'
import Banner from './components/Banner'
import Title from './components/Title'
import Map from './components/Map'
import HorizontalBar from './components/HorizontalBar'
import VerticalBar from './components/VerticalBar'
import Rose from './components/Rose'
import Flows from './components/Flows'

import { energyType, cityCode, EnumMap } from '@/utils/typeEnum'
import clonedeep from 'lodash.clonedeep'
import Vue from 'vue'
import {baseURL, accessToken} from '@/utils/constant'
const blobToBase64 = function(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
const LevelList = [{
  name: '五颗',
  value: 5
}, {
  name: '四颗',
  value: 4
}, {
  name: '三颗',
  value: 3
}, {
  name: '二颗',
  value: 2
}, {
  name: '一颗',
  value: 1
}]

const multiType = {
  checkCount: '核发',
  publishCount: '挂牌'
}

const multiIds = ['light', 'wind', 'water']

export default {
  components: {
    Star,
    Banner,
    Title,
    Map,
    HorizontalBar,
    VerticalBar,
    Rose,
    Flows
  },
  data() {
    return {
      pointsTotal: 0,
      pointsData: [],
      multiData: {},
      multiType,
      multiIds,
      tradeData: [],
      ratioData: [],
      LevelList,
      energyType,
      EnumMap,
      form: {
        companyName: '',
        resourceChain: [],
        energyType: '',
        authenticationLevel: ''
      },
      list: [],
      loading: false,
      pagination: {
        onChange: current => {
          this.pagination.current = current
          this.fetch()
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = current
          this.pagination.pageSize = pageSize
          this.fetch()
        },
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        size: 'middle'
      }
    }
  },
  computed: {
    pointsDataDesc() {
      let arr = clonedeep(this.pointsData)
      arr.sort((a, b) => b.value - a.value)
      return arr
    },
    tradeDataDesc() {
      let arr = clonedeep(this.tradeData)
      arr.sort((a, b) => b.value - a.value)
      return arr
    }
  },
  watch: {
    'form.energyType':function() {
      this.searchForm()
    },
    'form.authenticationLevel':function() {
      this.searchForm()
    }
  },
  created() {
    this.getChartsData()
    this.timer = setInterval(() => {
      this.getChartsData()
    }, 12 * 60 * 60 * 1000)
    this.searchForm()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  mounted() {
    if(this.$route.query.To){
      window.scrollTo(0, 2600)
    }
  },
  methods: {
    getChartsData() {
      this.getStatisticssendGreenTotal()
      this.getStatisticstotalWindPower()
      this.getStatisticstradeCountOfCity()
      this.getStatisticsgreenOfPower()
    },
    // 绿色电力积分发行总量
    getStatisticssendGreenTotal() {
      this.$api.homePageStatistics.statisticssendGreenTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) {
            return false
          }

          const { total, list } = res

          this.pointsTotal = (total || 0) / 100
          this.pointsData = []

          if (!list || !list.length) {
            return false
          }
          for (const item of res.list) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) continue

            this.pointsData.push({
              name: EnumMap(cityCode, Number(item.area)),
              value: (item.total || 0) / 100
            })
          }
        })
    },
    // 各地城市: 风、光、水电核发量以及挂牌量
    getStatisticstotalWindPower() {
      this.$api.homePageStatistics.statisticstotalWindPower()
        .then(res => {
          if (!res || !Object.keys(res).length) {
            return false
          }

          for (const key in res) {
            this.$set(this.multiData, key, {})
            let checkCount = [],
                publishCount = []
            for (const item of res[key]) {
              if (!item || !Object.keys(item).length) continue

              if (!item.area || !EnumMap(cityCode, Number(item.area))) continue

              // 核发量
              checkCount.push({
                name: EnumMap(cityCode, Number(item.area)),
                value: (item.checkCount || 0) / 100
              })

              // 挂牌量
              publishCount.push({
                name: EnumMap(cityCode, Number(item.area)),
                value: (item.publishCount || 0) / 100
              })
            }
            this.$set(this.multiData[key], 'checkCount', checkCount)
            this.$set(this.multiData[key], 'publishCount', publishCount)
          }
        })
    },
    // 各地市交易量
    getStatisticstradeCountOfCity() {
      this.$api.homePageStatistics.statisticstradeCountOfCity()
        .then(res => {
          if (!res || !res.length) {
            return false
          }

          this.tradeData = []

          for (const item of res) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) continue

            this.tradeData.push({
              name: EnumMap(cityCode, Number(item.area)),
              value: (item.tradeCount || 0) / 100
            })
          }
        })
    },
    // 绿色电力能源占比
    getStatisticsgreenOfPower() {
      this.$api.homePageStatistics.statisticsgreenOfPower()
        .then(res => {
          if (res && res.length) {
            this.ratioData = []
            res.forEach(item => {
              this.ratioData.push({
                name: EnumMap(energyType, item.energyType),
                value: (item.count || 0) / 100,
                percentage: item.percentage
              })
            })
          }
        })
    },
    searchForm() {
      this.pagination.current = 1
      this.fetch()
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.searchForm()
    },
    // 格式化form参数
    getParams() {
      let params = {}

      for (const key in this.form) {
        const val = this.form[key]

        if (key === 'resourceChain' && val.length) {
          params[`${key}TimeStart`] = val[0] && this.$dayjs(val[0]).format('YYYY-MM-DD 00:00:01')
          params[`${key}TimeEnd`] = val[1] && this.$dayjs(val[1]).format('YYYY-MM-DD 23:59:59')
          continue
        }

        params[key] = val
      }

      return params
    },
    fetch() {
      this.loading = true

      const params = this.getParams()
      let _this = this
      this.$api.trade.homePageAssetSale({
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        resourceChainTimeStart: '',
        resourceChainTimeEnd: '',
        ...params
      }).then(res => {
        if(!res) res = {list: [], total: 0}
        const { list, total } = res
        if (Array.isArray(list)) this.list = list.filter(e => { return _this.downImg(e) })
        this.pagination.total = total
      }).finally(() => {
        this.loading = false
      })
    },
  downImg(e) {
    const endPre = e.imgUrl.substring(e.imgUrl.indexOf('.'), e.imgUrl.length)
    let type = 'application/pdf'
    if (endPre.includes('.jpg')) {
      type = 'image/jpg'
    }else if (endPre.includes('.jpeg')){
      type = 'image/jpeg'
    }else if (endPre.includes('.png')){
      type = 'image/png'
    }else {
      type = 'application/pdf'
    }
    var oReq = new XMLHttpRequest()
    oReq.open('POST', baseURL+'/api/common/oss/getOssImageUrls', true)
    oReq.responseType = 'blob'
    oReq.setRequestHeader('Authorization', Vue.ls.get(accessToken))
    oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    oReq.send(JSON.stringify({
      urls: [e.imgUrl]
    }))
    var file1 = null
    oReq.onreadystatechange = function() {

      if (oReq.readyState == 4) {
        if (oReq.status == 200 || oReq.status == 0) {
          file1 = new Blob([oReq.response], {
            type: type
          })
          blobToBase64(file1, this).then(res => {
            // 转化后的base64
            e.imgUrl = res
          })
        }
      }
    }
    return e
  }
  }
}
</script>
<style lang='less' scoped>
.c-home-index {
  background-color: #0B1918;
  background: url(../../static/home/bgsy.png) repeat center;
  .charts-warp {
    + .charts-warp {
      margin-top: 75px;
    }
  }
  .index-container {
    padding: 0 7.8%;
  }
  .points-count {
    .num {
      height: 32px;
      line-height: 32px;
      margin: 60px auto 40px;
      text-align: center;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 8px;
      font-size: 36px;
      font-family: HelveticaNeue-BoldItalic, HelveticaNeue;
      font-weight: bold;
      font-style: italic;
    }
  }
  .addup-count {
    /deep/.ant-tabs-tab {
      height: 56px;
      line-height: 56px;
      padding: 0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 16px;
      &.ant-tabs-tab-active {
        color: #006F6C;
      }
    }
    /deep/.ant-tabs-ink-bar {
      background-color: #006F6C;
    }
    .tab-pane-item {
      margin-top: 150px;
    }
  }
  .trade-count {
    .bar {
      width: calc(100% - 146px);
    }
    .legends {
      width: 136px;
      .item {
        display: flex;
        height: 20px;
        line-height: 20px;
        margin-top: 16px;
        font-size: 12px;
        align-items: center;
        .rank {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 50%;
          background: #F0F2F5;
          text-align: center;
          &.no1 {
            background: #FA6400;
            color: #fff;
          }
          &.no2 {
            background: #F8C026;
            color: #fff;
          }
          &.no3 {
            background: #5891FF;
            color: #fff;
          }
        }
        .name {
          margin: 0 6px 0 16px;
          font-weight: 400;
          color: #000;
        }
        .num {
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          padding-left: 7px;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 11px;
            top: 5px;
            left: 0;
            background: #D9D9D9;
          }
        }
      }
    }
  }

  .search-form {
    .form-row {
      margin-bottom: 22px;
    }
  }
  .trade-list {
    margin-top: 40px;
    .item {
      color: @text-color;
      &:first-child { border-top: 1px solid #e8e8e8; }
    }
    .pic-wrap {
      width: 140px;
      height: 122px;
      line-height: 122px;
      img{
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }

    .description {
      line-height: 24px;
      list-style: none;
      color: @text-color;
      > li {
        min-height: 24px;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      .infos {
        padding-right: 20px;
        margin-right: 20px;
        list-style: none;
        position: relative;
        li + li { margin-top: 15px; }
        .price {
          color: #ff4d4f;
          .unit { font-size: 16px; }
        }
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          border-right: 1px solid #e8e8e8;
        }
      }
      .btns {
        .buy-btn { width: 90px; }
      }
    }
  }

}
</style>