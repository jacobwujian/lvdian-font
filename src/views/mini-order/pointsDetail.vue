<!-- 绿电积分详情 -->
<template>
  <div class="points-detail-wrap">
    <div class="intro flex-box">
      <div class="pic-wrap">
        <img :src="imgUrl">
      </div>
      <div class="infos">
        <p>{{ projectName }}</p>
        <p>交易时间：{{ tradeTime }}</p>
        <p>交易账号：{{ iphone }}</p>
      </div>
    </div>
    <div class="sub-intro">
      <p class="item flex-box">
        <span class="label">
          单价
        </span>
        <span class="val">
          ￥{{ unitPrice }}
        </span>
      </p>
      <p class="item flex-box">
        <span class="label">
          数量
        </span>
        <span class="val">
          x {{ tradeCount }}
        </span>
      </p>
      <p class="item flex-box">
        <span class="label">
          总价
        </span>
        <span class="val">
          ￥{{ totalPrice }}
        </span>
      </p>
    </div>
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
          title: '关联企业',
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
              label: '交易时间',
              key: 'tradeTime',
              type: 'time',
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
              label: '资产最近到期日',
              key: 'assetRecentDate',
              type: 'time',
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
      ],
      dataInfo: {}
    }
  },
  computed: {
    imgUrl() {
      return this.dataInfo && this.dataInfo.imgUrl
    },
    projectName() {
      return this.dataInfo && this.dataInfo.projectName
    },
    tradeTime() {
      const value = this.dataInfo && this.dataInfo.tradeTime
      return value && this.$dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    },
    iphone() {
      return this.dataInfo && this.dataInfo.iphone
    },
    unitPrice() {
      const value = this.dataInfo && this.dataInfo.price
      return (value || 0) / 100
    },
    totalPrice() {
      const value = this.dataInfo && this.dataInfo.totalPrice
      return (value || 0) / 100
    },
    tradeCount() {
      return this.dataInfo && this.dataInfo.tradeCount
    }
  },
  created() {
    this.$api.order.integralOrderDetails({
      orderId: this.id
    })
    .then(res => {
      formFlag(this.form, res)
      this.dataInfo = res
    })
  }
}
</script>
<style lang='less' scoped>
.back{
  width: 100%;
  text-align: center;
}
.points-detail-wrap {
  .pic-wrap {
    width: 200px;
    height: 160px;
    line-height: 160px;
    img{
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .infos {
    margin-left: 20px;
  }
  .sub-intro {
    margin: 20px 0;
    .label {
      width: 150px;
      font-weight: 600;
    }
  }
}
</style>