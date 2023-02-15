<!-- 交易管理 -->
<template>
  <div class="">
    <router-view v-if="$route.name === 'dealdetail'" />
    <c-page
      v-show="$route.name !== 'dealdetail'"
      ref="base"
      :columns="columns"
      :scroll="{ x:1300 }"
      :data="data"
      :search-type="searchType"
      @fetch="fetch"
    >
      <template
        slot="action"
        slot-scope="{record}"
      >
        <span
          v-if="record.status === 0&&$auth('dealDetailCheck')"
          class="cur-pointer"
          @click="showModal('review', record)"
        >
          审核
        </span>
        <span
          v-if="$auth('dealDetail')"
          class="cur-pointer"
          @click="gotoNew(record)"
        >
          详情
        </span>
      </template>
    </c-page>
    <a-modal
      v-model="modalVisible"
      :title="modal.title"
      :width="1200"
      :footer="null"
      :destroy-on-close="true"
    >
      <component
        :is="modal.component"
        :id="id"
        :ref="modal.component"
        :form-type="modalName"
        @close="close"
        @fetch="fetch"
      />
    </a-modal>
  </div>
</template>

<script>
import {energyType, dealStatus, EnumMap, orderType } from '@/utils/typeEnum'
import Detail from './detail'
export default {
  data() {
    return {
      modalVisible: false,
      modal: {
        title: '交易订单审核',
        component: Detail
      },
      id:'',
      modalName: 'review',
      searchType: [
        {
          type: 'input',
          params: 'tradingSide',
          placeholder: '请输入',
          label: '交易方'
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
          params: 'orderStatus',
          placeholder: '请选择',
          label: '状态',
          data: dealStatus
        },
        {
          type: 'datePicker',
          params: 'trading',
          placeholder: '请选择时间',
          label: '交易时间'
        },
        {
          type: 'select',
          params: 'energyType',
          placeholder: '请选择',
          label: '能源类型',
          data: energyType
        },
        {
          type: 'input',
          params: 'relateCompany',
          placeholder: '请输入',
          label: '关联企业'
        }
      ],
      columns: [
        {
          title: '序号',
          width: 55,
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '交易数量',
          width: 80,
          dataIndex: 'tradeCount',
          scopedSlots: { customRender: 'precisionNum' }
        },
        {
          title: '交易单价',
          width: 80,
          dataIndex: 'price',
          scopedSlots: { customRender: 'precisionNum' }
        },
        {
          title: '交易时间',
          width: 160,
          dataIndex: 'tradeTime',
          scopedSlots: { customRender: 'tradeTime', type: 'time' }
        },
        {
          title: '关联项目',
          dataIndex: 'projectName'
        },
        {
          title: '关联企业',
          width: 150,
          dataIndex: 'companyName'
        },
        {
          title: '买方',
          width: 150,
          dataIndex: 'purchaser'
        },
        {
          title: '卖方',
          width: 150,
          dataIndex: 'seller'
        },
        {
          title: '能源类型',
          width: 100,
          dataIndex: 'energyType',
          scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
        },
        {
          title: '订单类型',
          width: 100,
          dataIndex: 'orderType',
          scopedSlots: { customRender: 'orderType', type: 'select', data: orderType }
        },
        {
          title: '状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status', type: 'select', data: dealStatus }
        },
        {
          title: '所属地区',
          width: 200,
          dataIndex: 'projectArea',
          scopedSlots: { customRender: 'projectArea', type: 'area' }
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 130,
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
	  gotoNew(record){
		  this.$store.state.orderType = record.orderType
		  this.$router.push(`${this.$cPath}/deal/detail/${record.id}`)
	  },
    fetch(params) {
      this.$api.exchange.getExchangeList(params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this.data = res.list
          this.$refs.base.fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    close() {
      this.modalVisible = false
      this.$refs.base.fetch()
    },
    showModal(type, detail) {
		this.$store.state.orderType = detail.orderType
      this.modalName = type
      this.modalVisible = true
      this.id = detail.id
    }
  }
}
</script>
<style lang="less" scoped></style>
