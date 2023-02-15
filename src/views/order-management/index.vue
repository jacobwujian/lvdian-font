<!-- 订单管理 -->
<template>
  <div class="home-container">
    <div class="title">
      我的订单
    </div>
    <c-page
      ref="base"
      class="pb-20"
      :columns="columns"
      :data="data"
      :search-type="searchType"
      @fetch="fetch"
    >
      <template
        slot="action"
        slot-scope="{record}"
      >
        <span
          class="cur-pointer"
          @click="openDetail(record)"
        >
          详情
        </span>
      </template>
    </c-page>
    <a-modal
      v-model="visible"
      title="项目详情"
      width="820px"
      :destroy-on-close="true"
      :footer="null"
    >
      <Detail
        ref="FormModel"
        :record-data="recordData"
        @close="visible = false"
      />
    </a-modal>
  </div>
</template>

<script>
import Detail from './components/detail'
import {dealStatus, dealType, EnumMap, energyType, orderType} from '@/utils/typeEnum'

export default {
  components: {
    Detail
  },
  data() {
    return {
      visible: false,
      searchType: [
        {
          type: 'input',
          params: 'projectName',
          placeholder: '请输入',
          label: '项目名称'
        },
        {
          type: 'select',
          params: 'orderType',
          placeholder: '请选择',
          label: '订单类型',
          data: orderType
        },
        {
          type: 'select',
          params: 'energyType',
          placeholder: '请选择',
          label: '能源类型',
          data: energyType
        },
        {
          type: 'select',
          params: 'orderStatus',
          placeholder: '请选择',
          label: '状态',
          data: dealStatus
        },
        {
          type: 'datePicker',
          params: 'trade',
          placeholder: '请选择时间',
          label: '交易时间'
        }
      ],
      columns: [
        {
          title: '编号',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '能源类型',
          dataIndex: 'energyType',
          scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
        },
        {
          title: '交易时间',
          dataIndex: 'tradeTime',
          scopedSlots: { customRender: 'tradeTime', type: 'time' },
          width: 160
        },
        {
          title: '交易数量',
          dataIndex: 'tradeCount',
          scopedSlots: { customRender: 'precisionNum' }
        },
        {
          title: '单价(RMB)',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price', type: 'price' }
        },
        {
          title: '订单金额(RMB)',
          dataIndex: 'totalPrice',
          scopedSlots: { customRender: 'totalPrice', type: 'price' }
        },
        {
          title: '订单类型',
          dataIndex: 'orderType',
          scopedSlots: { customRender: 'orderType', type: 'select', data: orderType }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status', type: 'select', data: dealStatus }
        },
        {
          title: '操作',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      recordData: null
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    fetch(params) {
      this.$api.trade.orderList(params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this.data = res.list
          this.$refs.base.fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    openDetail(record) {
      this.recordData = record
      this.visible = true
    }
  }
}
</script>
<style lang='less' scoped>
.title{
  font-size: 18px;
  margin: 15px 0;
}
</style>