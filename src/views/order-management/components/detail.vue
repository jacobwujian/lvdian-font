<!--  -->
<template>
  <div>
    <c-detail
      :form="form"
      :column="2"
      :hidedivider="true"
    />
    <div class="model-footer">
      <a-space size="large">
        <a-button
          type="primary"
          html-type="submit"
          @click="$emit('close', false)"
        >
          确定
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import {formFlag} from '@/utils/means'
import {energyType, reviewType} from '@/utils/typeEnum'
export default {
  components: {},
  props: {
    recordData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: [
        {
          title: '',
          list: [
            {
              label: '交易时间',
              key: 'tradeTime',
              type: 'time',
              value: ''
            },
            {
              label: '交易数量',
              key: 'tradeCount',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '交易单价',
              key: 'price',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '资产最近到期日',
              key: 'assetRecentDate',
              type: 'time',
              value: ''
            },
            {
              label: '一个月内到期资产数',
              key: 'oneMonthAsset',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '1-3个月内到期资产数',
              key: 'oneToThreeMonthAsset',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '3-6个月内到期资产数',
              key: 'threeToSixMonthAsset',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '6个月以上内到期资产数',
              key: 'moreThanSixMonthAsset',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '协议与付款凭证',
              key: 'fileInfos',
              value: null,
              type: 'fileInfos'
            }
          ]
        },
        {
          title: '交易方企业信息',
          children: [
            {
              title: '买方',
              flag: 'purchaserCompanyVo',
              list: [
                {
                  label: '统一社会信用代码',
                  key: 'socialCreditCode',
                  value: ''
                },
                {
                  label: '企业名称',
                  key: 'companyName',
                  value: ''
                },
                {
                  label: '所属地区',
                  key: 'address',
                  value: ''
                }
              ]
            },
            {
              title: '卖方',
              flag: 'sellerCompanyVo',
              list: [
                {
                  label: '统一社会信用代码',
                  key: 'socialCreditCode',
                  value: ''
                },
                {
                  label: '企业名称',
                  key: 'companyName',
                  value: ''
                },
                {
                  label: '所属地区',
                  key: 'address',
                  value: ''
                }
              ]
            }
          ]
        },
        {
          title: '关联企业信息',
          flag: 'relateCompanyVo',
          list: [
            {
              label: '统一社会信用代码',
              key: 'socialCreditCode',
              value: ''
            },
            {
              label: '企业名称',
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
              type: 'select',
              data: energyType,
              key: 'energyType',
              value: ''
            },
            {
              label: '采集设备编号',
              key: 'deviceCodes',
              value: '',
              type: 'array'
            },
            {
              label: '项目所属地区',
              key: 'projectArea',
              value: '',
              type: 'area'
            },
            {
              label: '项目能源等级',
              key: 'authenticationLevel',
              value: 0,
              type: 'rate'
            }
          ]
        },
        {
          title: '审核信息',
          list: [
            {
              key: 'approveResult',
              label: '审核结果',
              dataSource: reviewType,
              type: 'radio',
              formType: 'view',
              value: null
            }, {
              key: 'approveRemark',
              label: '审核备注',
              type: 'approveRemark',
              formType: 'view',
              value: ''
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$api.trade.orderDetail({
      orderId: this.recordData.orderId
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
</style>