<!--  -->
<template>
  <div>
    <c-detail
      :form="form"
      :column="2"
      :hidedivider="true"
    />
    <a-descriptions
      title="发布绿证记录"
    >
      <a-descriptions-item>
        <c-page
          ref="Pbase"
          :can-search="false"
          :columns="Pcolumns"
          :data="Pdata"
          @fetch="fetch($event, 'P')"
        >
          <template
            slot="quantity"
            slot-scope="{record}"
          >
            <span>{{ record.symbol > 0 ? '-' : '+' }}{{ (record.quantity || 0) / 100 }}</span>
          </template>
        </c-page>
      </a-descriptions-item>
    </a-descriptions>
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
import {energyType, publishType} from '@/utils/typeEnum'
export default {
  components: {},
  props: {
    value: {
      type: Boolean
    },
    recordData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      Pdata: [],
        Pcolumns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '流水号',
          dataIndex: 'recordId'
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime', type: 'time' }
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          scopedSlots: { customRender: 'quantity' }
        },
        {
          title: '单价',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price', type: 'price' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status', type: 'select', data: publishType}
        }
      ],
      form: [
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
          title: '在售绿证',
          list: [
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
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
      this.$api.trade.assetSaleDetail({
        assetSaleId: this.recordData.id
      })
      .then(res => {
        formFlag(this.form, res)
      })
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    fetch(params, type) {
      const apiType = {
        P: 'assetSaleRecordDetail'
      }
      this.$api.trade[apiType[type]]({
        ...params,
        assetSaleId: this.recordData.id
      })
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this[type + 'data'] = res.list
          this.$refs[type + 'base'].fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs[type + 'base'].fetchFinally()
        })
    }
  }
}
</script>
<style lang='less' scoped>
</style>