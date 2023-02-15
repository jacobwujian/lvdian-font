<!-- 积分兑换 -->
<template>
  <div v-if="$route.name == 'pointManagement'">
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
          @click="$router.push(`${$cPath}/order/exchange/detail/${record.orderId}`)"
        >
          详情
        </a-button>
      </template>
    </c-page>
  </div>
  <router-view v-else />
</template>

<script>

const searchType = [
  {
    type: 'input',
    label: '兑换账号',
    params: 'iphone'
  }, {
    type: 'datePicker',
    label: '兑换时间',
    params: 'exchange'
  }, {
    type: 'input',
    label: '订单编号',
    params: 'orderId'
  }, {
    type: 'input',
    label: '合作企业',
    params: 'jointVenture'
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  }, {
    title: '兑换时间',
    dataIndex: 'exchangeTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  }, {
    title: '兑换账号',
    dataIndex: 'iphone'
  }, {
    title: '兑换商品',
    dataIndex: 'voucherName'
  }, {
    title: '兑换数量',
    dataIndex: 'exchangeTotal'
  }, {
    title: '消费绿电积分',
    dataIndex: 'exchangeTotalPrice'
  }, {
    title: '订单编号',
    dataIndex: 'orderId'
  }, {
    title: '合作企业',
    dataIndex: 'jointVenture'
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
      this.$api.order.AllUserVoucherOrder(params)
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
