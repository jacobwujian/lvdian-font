<!-- 核销详情 -->
<template>
  <div>
    <c-detail :form="form" />
    <div class="back">
      <a-button
        type="primary"
        @click="$router.go(-1)"
      >
        返回
      </a-button>
    </div>
  </div>
</template>

<script>
import {formFlag} from '@/utils/means'
import {energyType} from '@/utils/typeEnum'

export default {
  components: {},
  props: {
    id:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: [
        {
          title: '',
          list: [
            {
              label: '核销时间',
              key: 'checkTime',
              type: 'time',
              value: ''
            }
          ]
        },
        {
          title: '申请公司信息',
          flag: 'checkCompanyVo',
          list: [
            {
              label: '统一社会信用代码',
              key: 'socialCreditCode',
              value: ''
            },
            {
              label: '公司名称',
              key: 'companyName',
              value: ''
            },
            {
              label: '核销凭证量',
              key: 'checkCount',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '核销申报数',
              key: 'checkApplicationNum',
              value: '',
              unit: 'MW·h',
              type: 'precisionNum'
            }
          ]
        },
        {
          title: '发行方信息',
          flag: 'sellerCompanyVo',
          list: [
            {
              label: '统一社会信用代码',
              key: 'socialCreditCode',
              value: ''
            },
            {
              label: '公司名称',
              key: 'companyName',
              value: ''
            },
            {
              label: '项目编号',
              key: 'projectCode',
              value: ''
            },
            {
              label: '项目名称',
              key: 'projectName',
              value: ''
            },
            {
              label: '能源类型',
              key: 'energyType',
              type: 'select',
              data: energyType,
              value: ''
            },
            {
              label: '采集设备编号',
              key: 'deviceCodes',
              value: '',
              type: 'array'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$api.cancelAfterVerification.getCancelAfterVerificationDetail({
      id: this.id
    })
    .then(res => {
      formFlag(this.form, res)
    })
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {}
}
</script>
<style lang='less' scoped>
.back{
  width: 100%;
  text-align: center;
}
</style>