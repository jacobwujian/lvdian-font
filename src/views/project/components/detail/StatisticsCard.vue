<template>
  <div class="statistics-card">
    <div class="ant-descriptions-title">
      项目发证数量统计
    </div>

    <a-form-model
      ref="searchForm"
      layout="inline"
      :model="form"
      class="search-form"
    >
      <!-- 下拉框 -->
      <a-form-model-item
        label="查询维度"
        prop="conditions"
      >
        <a-select
          v-model="conditions"
          style="width: 150px"
          @change="selectChange"
        >
          <a-select-option
            v-for="item in conditionList"
            :key="item.id"
            :value="item.value"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <!-- 日期框 -->
      <!-- 日 -->
      <a-form-model-item
        v-if="conditions == '按天查询'"
        label="发证时间"
        prop="daytime"
      >
        <a-date-picker
          v-model="form.daytime"
          placeholder="请选择您要查询的日期"
        />
      </a-form-model-item>
      <!-- 月 -->
      <a-form-model-item
        v-else-if="conditions == '按月查询'"
        label="发证时间"
        prop="monthtime"
      >
        <a-month-picker
          v-model="form.monthtime"
          placeholder="请选择您要查询的月份"
        />
      </a-form-model-item>
      <!-- 年 -->
      <a-form-model-item
        v-else
        label="发证时间"
        prop="yeartime"
      >
        <a-date-picker
          v-model="form.yeartime"
          mode="year"
          placeholder="请选择您要查询的年份"
          format="YYYY"
          :open="yearShowOne"
          @openChange="openChangeOne"
          @panelChange="panelChangeOne"
        />
      </a-form-model-item>

      <a-space class="btns">
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          @click="searchForm"
        >
          查询
        </a-button>
        <a-button @click="resetForm">
          重置
        </a-button>
      </a-space>
    </a-form-model>

    <div class="chart-wrap">
      <VerticalBar
        id="projecStatisticstBar"
        unit="单位：个"
        :prop-labels="labels"
        :prop-values="values"
        trend-line
      />
    </div>
  </div>
</template>

<script>
import VerticalBar from '@/components/charts/VerticalBar'

export default {
  name: 'ProjecStatisticst',
  components: {
    VerticalBar
  },
  props: {
    projectId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      // 年限
      yearShowOne: false,
      // 默认为1
      typeId: 1,
      // 下拉框
      conditions: '',
      conditionList: [
        { id: 1, value: '按天查询' },
        { id: 2, value: '按月查询' },
        { id: 3, value: '按年查询' }
      ],
      form: {
        daytime: null,
        monthtime: null,
        monthtimeList: [],
        yeartime: null,
        yeartimeList: []
      },
      labels: [],
      values: [],
      loading: false
    }
  },
  computed: {},
  watch: {
    projectId() {
      this.searchForm()
    }
  },
  created() {
    if (this.projectId) {
      this.searchForm()
    }

    // 设置下拉框默认值
    this.conditions = this.conditionList[0].value
  },
  methods: {
    // 当下拉框变化时
    selectChange() {
      ;(this.form.daytime = null), (this.form.monthtime = null), (this.form.monthtimeList = []), (this.form.yeartime = null), (this.form.yeartimeList = []), (this.values = [])

      // 执行查询
      this.searchForm()
    },
    // 年份
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      //status是打开或关闭的状态
      if (status) {
        this.yearShowOne = true
      } else {
        this.yearShowOne = false
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.form.yeartime = value
      this.yearShowOne = false
    },

    searchForm() {
      let params = {}
      if (this.conditions == '按年查询') {
        console.log('走的年')
        if (this.form.yeartime == null) {
          this.form.yeartimeList[0] = new Date(new Date().getFullYear(), 0, 1)
          this.form.yeartimeList[1] = new Date(new Date().getFullYear(), 12, 0)
        } else {
          this.form.yeartimeList[0] = new Date(this.form.yeartime._d.getFullYear(), 0, 1)
          this.form.yeartimeList[1] = new Date(this.form.yeartime._d.getFullYear(), 12, 0)
        }
        params.startTime = this.$dayjs(this.form.yeartimeList[0]).format('YYYY-MM-DD 00:00:00')
        params.endTime = this.$dayjs(this.form.yeartimeList[1]).format('YYYY-MM-DD 23:59:59')
        this.typeId = this.conditionList[2].id
      } else if (this.conditions == '按月查询') {
        console.log('走的月')
        if (this.form.monthtime == null) {
          this.form.monthtimeList[0] = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          this.form.monthtimeList[1] = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        } else {
          console.log('输出月')
          console.log(this.form.monthtime)
          // 找到选择月的第一天和最后一天  存到数组
          this.form.monthtimeList[0] = new Date(this.form.monthtime._d.getFullYear(), this.form.monthtime._d.getMonth(), 1)
          this.form.monthtimeList[1] = new Date(this.form.monthtime._d.getFullYear(), this.form.monthtime._d.getMonth() + 1, 0)
        }
        // 格式化 准备发送后台
        params.startTime = this.$dayjs(this.form.monthtimeList[0]).format('YYYY-MM-DD 00:00:00')
        params.endTime = this.$dayjs(this.form.monthtimeList[1]).format('YYYY-MM-DD 23:59:59')
        this.typeId = this.conditionList[1].id
      } else if (this.conditions == '按天查询') {
        if (this.form.daytime !== null) {
          params.startTime = this.$dayjs(this.form.daytime).format('YYYY-MM-DD 00:00:00')
          params.endTime = this.$dayjs(this.form.daytime).format('YYYY-MM-DD 23:59:59')
        }
        this.typeId = this.conditionList[0].id
      }

      this.loading = true

      this.$api.project
        .stockStatistics({
          projectId: this.projectId,
          typeId: this.typeId,
          ...params
        })
        .then(res => {
          console.log('输出res')
          console.log(res)
          if (!res || !Object.keys(res).length) return

          const { time, data } = res

          if (Array.isArray(time)) {
            if (this.typeId === 1) {
              this.labels = time.map(val => val && this.$dayjs(val).format('H时'))
            } else if (this.typeId === 2) {
              this.labels = time.map(val => val && this.$dayjs(val).format('DD日'))
            } else if (this.typeId === 3) {
              this.labels = time.map(val => val && this.$dayjs(val).format('yyyy-MM'))
            }
          }
          if (Array.isArray(data)) {
            // data
            this.values = data.map(item => (item && item.total) || undefined)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.searchForm()
    }
  }
}
</script>

<style lang="less" scoped>
.statistics-card {
  .btns {
    height: 40px;
  }
}
</style>
