<!-- 核销管理 -->
<template>
  <div class="">
    <router-view v-if="$route.name == 'verificationdetail'" />
    <c-page
      v-show="$route.name !== 'verificationdetail'"
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
          v-if="record.status == 0 && $auth('verificationCheck')"
          class="cur-pointer"
          @click="audit(record)"
        >
          审核
        </span>
        <span
          v-if="$auth('verificationDetail')"
          class="cur-pointer"
          @click="$router.push(`${$cPath}/verification/detail/${record.id}`)"
        >
          详情
        </span>
      </template>
    </c-page>
    <a-modal
      v-model="visible"
      title="审核项目"
      width="820px"
      :destroy-on-close="true"
      :footer="null"
    >
      <FormModel
        ref="FormModel"
        :record-data="recordData"
        @close="visible = false"
        @refresh="$refs.base.fetch()"
      />
    </a-modal>
  </div>
</template>

<script>
import FormModel from './components/formModel'
import {chainStatus, verificationAuditType, energyType, dealStatus, EnumMap } from '@/utils/typeEnum'

export default {
  components: {
    FormModel
  },
  data() {
    return {
      visible: false,
      recordData: null,
      searchType: [
        {
          type: 'input',
          params: 'companyName',
          placeholder: '请输入',
          label: '核销企业'
        },
        {
          type: 'datePicker',
          params: 'date',
          label: '核销时间'
        },
        {
          type: 'select',
          params: 'status',
          placeholder: '请选择',
          label: '状态',
          data: verificationAuditType
        },
        {
          type: 'input',
          params: 'relateProject',
          placeholder: '请输入',
          label: '关联项目'
        }
      ],
      columns: [
        {
          title: '序号',
          width: 55,
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '核销企业',
          dataIndex: 'companyName'
        },
        {
          title: '核销数量',
          dataIndex: 'checkCount',
          scopedSlots: { customRender: 'precisionNum' }
        },
        {
          title: '核销时间',
          dataIndex: 'verificationTime',
          scopedSlots: { customRender: 'verificationTime', type: 'time' }
        },
        {
          title: '关联项目',
          dataIndex: 'projectName'
        },
        {
          title: '所属地区',
          dataIndex: 'projectArea',
          scopedSlots: { customRender: 'projectArea', type: 'area' }
        },
        {
          title: '上链情况',
          dataIndex: 'chainStatus',
          scopedSlots: { customRender: 'chainStatus', type: 'select', data: chainStatus }
        }, {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status', type: 'select', data: verificationAuditType }
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 150,
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
    fetch(params) {

      params.startTime = params.dateTimeStart
      params.endTime = params.dateTimeEnd
      this.$api.cancelAfterVerification.getCancelAfterVerificationList(params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this.data = res.list
          this.$refs.base.fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    audit(data) {
      this.recordData = data
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
