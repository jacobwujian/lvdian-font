<!-- 交易详情 -->
<template>
  <div>
    <c-detail :form="form" />
    <div
      class="back"
    >
      <a-button
        v-if="formType === 'view'"
        type="primary"
        @click="$router.go(-1)"
      >
        返回
      </a-button>
      <a-button
        v-if="formType === 'review'"
        type="primary"
        @click="register"
      >
        提交
      </a-button>
      <a-button
        v-if="formType === 'review'"
        type="primary"
        @click="reset"
      >
        重置
      </a-button>
      <a-button
        v-if="formType === 'review'"
        type="primary"
        @click="$emit('close',true)"
      >
        取消
      </a-button>
    </div>
  </div>
</template>

<script>
import {formFlag} from '@/utils/means'
import {energyType, reviewType} from '@/utils/typeEnum'

export default {
  components: {},
  props: {
    id:{
      type: String,
      default: ''
    },
    formType:{
      type: String,
      default: 'view'
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
              label: '',
              key: '',
              value: '',
              type: ''
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
              formType: this.formType,
              value: null
            }, {
              key: 'approveRemark',
              label: '审核备注',
              type: 'approveRemark',
              formType: this.formType,
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
    if (this.$store.state.orderType!==2){
      this.form.splice(3, 1)
    }
    this.reset()
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    register(){
      if (this.form[3].list[0].value!==null){
        let obj = {
          id: this.id,
          approveResult: this.form[3].list[0].value,
          approveRemark: this.form[3].list[1].value
        }
        this.$api.exchange.approveOrder(obj)
            .then(res => {
              this.$emit('close', res)
            })
      }else {
        return this.$message.error('审批结果不能为空')
      }
    },
    reset(){
      this.$api.exchange.getExchangeDetail({
        id: this.id
      })
          .then(res => {
            formFlag(this.form, res)
          })
    }
  }
}
</script>
<style lang='less' scoped>
.back{
  width: 100%;
  text-align: center;
}
 button{
  margin-right: 30px;
}
</style>