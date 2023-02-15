<template>
  <div class="info-card">
    <div class="ant-descriptions-title">
      项目资产
    </div>

    <a-tabs
      type="card"
      default-active-key="1"
    >
      <a-tab-pane
        key="1"
        tab="产出"
      >
        <c-page
          ref="outputBase"
          :can-search="false"
          :columns="outputColumnsFormat"
          :data="outputList"
          @fetch="outputFetch"
        />
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="注销"
      >
        <c-page
          ref="checkBase"
          :can-search="false"
          :columns="offColumnsFormat"
          :data="checkList"
          @fetch="checkFetch"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
const outputColumns = [
  {
    title: '产出时间',
    dataIndex: 'outputTime',
    scopedSlots: { customRender: 'outputTime', type: 'time' },
    width: '25%'
  }, {
    title: '产出数量',
    dataIndex: 'outputTotal',
    scopedSlots: { customRender: 'precisionNum' }
  }, {
    title: '设备ID',
    dataIndex: 'deviceId'
  }, {
    title: '品牌',
    dataIndex: 'brand'
  }
]

const offColumns = [
   {
    title: '注销时间',
    dataIndex: 'verificationTime',
    scopedSlots: { customRender: 'verificationTime', type: 'time' },
    width: '25%'
  }, {
    title: '注销数量',
    dataIndex: 'checkCount',
    scopedSlots: { customRender: 'precisionNum' }
  }, {
    title: '注销企业',
    dataIndex: 'companyName'
  }, {
    title: '所属地区',
    dataIndex: 'projectArea',
    scopedSlots: { customRender: 'projectArea', type: 'area' }
  }
]

export default {
  props: {
    projectId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      outputList: [],
      checkList: []
    }
  },
  computed: {
    outputColumnsFormat() {
      return outputColumns.map(it => ({
        ...it,
        align: it.align || 'center',
        ellipsis: it.ellipsis || true
      }))
    },
    offColumnsFormat() {
      return offColumns.map(it => ({
        ...it,
        align: it.align || 'center',
        ellipsis: it.ellipsis || true
      }))
    }
  },
  watch: {
    projectId() {
      this.outputFetch()
    }
  },
  methods: {
    // 产出信息查询
    outputFetch(params) {
      if (!this.projectId) return false

      this.$api.project.outputList({
        projectId : this.projectId,
        ...params
      }).then(res => {
        if(!res) res = {list: [], total: 0}
        const { list, total } = res
        if (Array.isArray(list)) this.outputList = list
        this.$refs.outputBase.fetchSuccess(total)
      }).finally(() => {
        this.$refs.outputBase.fetchFinally()
      })
    },
    // 注销信息查询
    checkFetch(params) {
      if (!this.projectId) return false

      this.$api.project.writeOffList({
        projectId : this.projectId,
        ...params
      }).then(res => {
        if(!res) res = {list: [], total: 0}
        const { list, total } = res
        if (Array.isArray(list)) this.checkList = list
        this.$refs.checkBase.fetchSuccess(total)
      }).finally(() => {
        this.$refs.checkBase.fetchFinally()
      })
    }
  }
}
</script>
