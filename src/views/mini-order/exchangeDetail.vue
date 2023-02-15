<!-- 绿电积分详情 -->
<template>
  <div class="exchange-detail-wrap">
    <div class="title">
      订单编号：{{ orderId }}
    </div>
    <div class="intro flex-box">
      <div class="pic-wrap">
        <img :src="ImgUrl">
      </div>
      <div class="infos">
        <p>{{ voucherName }}</p>
        <p>兑换时间：{{ exchangeTime }}</p>
      </div>
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
import Vue from 'vue'
import {baseURL, accessToken} from '@/utils/constant'
const blobToBase64 = function(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
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
              label: '单价',
              key: 'price',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '数量',
              key: 'exchangeTotal',
              value: ''
            },
            {
              label: '总价',
              key: 'exchangeTotalPrice',
              value: '',
              type: 'precisionNum'
            },
            {
              label: '兑换账号',
              key: 'iphone',
              value: ''
            },
            {
              label: '兑换前积分',
              key: 'startPayIntegral',
              value: ''
            },
            {
              label: '剩余积分',
              key: 'EndPayIntegral',
              value: ''
            },
            {
              label: '合作企业',
              key: 'jointVenture',
              value: ''
            },
            {
              label: '券码',
              key: 'voucherRedemptionCode',
              value: '',
              type: 'array'
            }
          ]
        }
      ],
      dataInfo: {},
    ImgUrl: ''
    }
  },
  computed: {
    orderId() {
      return this.dataInfo && this.dataInfo.orderId
    },
    voucherImgUrl() {
      return this.dataInfo && this.dataInfo.voucherImgUrl
    },
    voucherName() {
      return this.dataInfo && this.dataInfo.voucherName
    },
    exchangeTime() {
      const value = this.dataInfo && this.dataInfo.exchangeTime
      return value && this.$dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {},
  created() {
    this.$api.order.selectUserVoucherDetails({
      orderId: this.id
    })
    .then(res => {
      formFlag(this.form, res)
      this.dataInfo = res
      this.downImg()
    })
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
  downImg() {
    const endPre = this.dataInfo.voucherImgUrl.substring(this.dataInfo.voucherImgUrl.indexOf('.'), this.dataInfo.voucherImgUrl.length)
    let type = 'application/pdf'
    if (endPre.includes('.jpg')) {
      type = 'image/jpg'
    }else if (endPre.includes('.jpeg')){
      type = 'image/jpeg'
    }else if (endPre.includes('.png')){
      type = 'image/png'
    }else {
      type = 'application/pdf'
    }
    var oReq = new XMLHttpRequest()
    oReq.open('POST', baseURL+'/api/common/oss/getOssImageUrls', true)
    oReq.responseType = 'blob'
    oReq.setRequestHeader('Authorization', Vue.ls.get(accessToken))
    oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    oReq.send(JSON.stringify({
      urls: [this.dataInfo.voucherImgUrl]
    }))
    var file1 = null
    var _this = this
    oReq.onreadystatechange = function() {

      if (oReq.readyState == 4) {
        if (oReq.status == 200 || oReq.status == 0) {
          file1 = new Blob([oReq.response], {
            type: type
          })
          blobToBase64(file1, this).then(res => {
            // 转化后的base64
            _this.ImgUrl = res
          })
        }
      }
    }
  }
  }
}
</script>
<style lang='less' scoped>
.back{
  width: 100%;
  text-align: center;
}

.exchange-detail-wrap {
  .intro {
    margin: 20px 0;
  }
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
}
</style>