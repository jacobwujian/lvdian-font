<!-- 绿证积分 -->
<template>
  <div v-if="$route.name == 'greenElectricityManagement'">
    <c-page
      ref="base"
      :search-type="searchType"
      :columns="columns"
      :data="data"
      @fetch="fetch"
    >
      <template
        slot="action"
        slot-scope="{record}"
      >
        <a-button
          type="link"
          @click="$router.push(`${$cPath}/order/points/detail/${record.orderId}`)"
        >
          详情
        </a-button>
      </template>
    </c-page>
  </div>
  <router-view v-else />
</template>

<script>
import { energyType } from '@/utils/typeEnum'

const searchType = [
  {
    type: 'input',
    label: '交易账号',
    params: 'iphone'
  }, {
    type: 'datePicker',
    label: '交易时间',
    params: 'trade'
  }, {
    type: 'select',
    label: '能源类型',
    params: 'energyType',
    data: energyType
  }, {
    type: 'input',
    label: '关联企业',
    params: 'companyName'
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  }, {
    title: '交易时间',
    dataIndex: 'tradeTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  }, {
    title: '交易账号',
    dataIndex: 'iphone'
  }, {
    title: '交易数量',
    dataIndex: 'tradeCount'
  }, {
    title: '交易金额',
    dataIndex: 'totalPrice',
    scopedSlots: { customRender: 'precisionNum' }
  }, {
    title: '能源类型',
    dataIndex: 'energyType',
    scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
  }, {
    title: '关联企业',
    dataIndex: 'companyName'
  }, {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

const data = []

export default {
  data() {
    return {
      searchType,
      data,
      columns
    }
  },
  methods: {
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params) {
      this.$api.order.AllUserOrder(params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this.data = res.list
          this.$refs.base.fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    }
  }
}
</script>
