<template>
  <div class="charts-wrap">
    <a-row
      :gutter="16"
      class="charts-row"
    >
      <a-col :span="12">
        <a-card
          title="各城市机构注册统计"
          :bordered="false"
        >
          <HorizontalBar
            id="companyBar"
            unit="单位：个"
            :chart-data="companyData"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="绿色电力积分核发数量"
          :bordered="false"
        >
          <GroupBar
            id="groupBar"
            unit="单位：个"
            :chart-data="groupBarValues"
            :labels="groupBarLabels"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="项目申报统计"
          :bordered="false"
        >
          <VerticalBar
            id="projectBar"
            unit="单位：个"
            :prop-labels="projectLabels"
            :prop-values="projectValues"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="设备统计"
          :bordered="false"
        >
          <VerticalBar
            id="deviceBar"
            unit="单位：个"
            :prop-labels="deviceLabels"
            :prop-values="deviceValues"
          />
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card
          title="绿色电力积分核发数量统计"
          :bordered="false"
        >
          <SmoothLine
            id="checkBar"
            unit="单位：个"
            :chart-data="checkValues"
            :labels="checkLabels"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import HorizontalBar from './components/HorizontalBar'
import GroupBar from './components/GroupBar'
import VerticalBar from '@/components/charts/VerticalBar'
import SmoothLine from './components/SmoothLine'

import { cityCode, EnumMap } from '@/utils/typeEnum'

export default {
  name: 'Charts',
  components: {
    HorizontalBar,
    GroupBar,
    VerticalBar,
    SmoothLine
  },
  data() {
    return {
      timer: null,
      companyData: [],
      projectLabels: [],
      projectValues: [],
      deviceLabels: [],
      deviceValues: [],
      checkLabels: [],
      checkValues: {},
      groupBarLabels: [],
      groupBarValues: {}
    }
  },
  computed: {},
  created() {
    this.getChartsData()
    this.timer = setInterval(() => {
      this.getChartsData()
    }, 12 * 60 * 60 * 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    getChartsData() {
      this.getCompanyTotal()
      this.getCityStockTotal()
      this.getProjectTotal()
      this.getDeviceTotal()
      this.getStockTotal()
    },
    // 各城市机构注册统计
    getCompanyTotal() {
      this.$api.system.companyTotal()
        .then(res => {
          if (!res || !res.length) return false

          this.companyData = []
          for (const item of res) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) {
              continue
            }

            this.companyData.push({
              name: EnumMap(cityCode, Number(item.area)),
              value: item.companyCount
            })
          }
        })
    },
    // 绿色电力积分核发数量
    getCityStockTotal() {
      this.$api.system.cityStockTotal()
        .then(res => {
          if (!res || !res.length) return false

          this.groupBarLabels = []
          this.groupBarValues = {}
          for (const item of res) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) {
              continue
            }

            this.groupBarLabels.push(EnumMap(cityCode, Number(item.area)))

            const stockTotalVo = item.stockTotalVo
            for (const key in stockTotalVo) {
              if (!this.groupBarValues[key]) {
                this.$set(this.groupBarValues, key, [])
              }

              this.groupBarValues[key].push((stockTotalVo[key] && stockTotalVo[key].total || 0) / 100)
            }
          }
        })
    },
    // 项目申报统计
    getProjectTotal() {
      this.$api.system.projectTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.projectLabels = []
          this.projectValues = []

          if (Array.isArray(months)) {
            this.projectLabels = months.map(val => val + '月')
          }
          if (Array.isArray(list)) {
            this.projectValues = list.map(item => item && item.projectCount || undefined)
          }
        })
    },
    // 设备统计
    getDeviceTotal() {
      this.$api.system.deviceTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.deviceLabels = []
          this.deviceValues = []

          if (Array.isArray(months)) {
            this.deviceLabels = months.map(val => val + '月')
          }
          if (Array.isArray(list)) {
            this.deviceValues = list.map(item => item && item.deviceCount || undefined)
          }
        })
    },
    // 绿色电力积分核发数量统计
    getStockTotal() {
      this.$api.system.stockTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.checkLabels = []
          this.checkValues = {}

          if (Array.isArray(months)) {
            this.checkLabels = months.map(val => val + '月')
          }

          if (!list || !Object.keys(list).length) return false

          for (const key in list) {
            this.$set(this.checkValues, key, [])
            for (const item of list[key]) {
              this.checkValues[key].push((item && item.total || 0) / 100)
            }
          }
        })
    }
  }
}
</script>

<style lang='less' scoped>
.charts-wrap {
  /deep/.ant-card-head {
    height: 25px;
    line-height: 25px;
    padding-top: 24px;
    border-bottom: 0;
    color: #000;
    font-size: 18px;
    font-weight: 400;
    .ant-card-head-title {
      padding: 0;
    }
  }
  /deep/.ant-card-body {
    padding: 0 24px 18px;
  }
  .charts-row {
    > .ant-col {
      margin-bottom: 25px;
    }
  }
}
</style>
