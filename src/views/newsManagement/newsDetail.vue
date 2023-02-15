<!-- 积分兑换 -->
<template>
  <div>
    <a-row>
      <a-col :span="3">
        <h3>优惠券名称</h3>
      </a-col>
      <a-col :span="3">
        <h3>图片</h3>
      </a-col>
      <a-col :span="2">
        <h3>单价</h3>
      </a-col>
      <a-col :span="2">
        <h3>未兑数量</h3>
      </a-col>
      <a-col :span="2">
        <h3>已兑数量</h3>
      </a-col>
      <a-col :span="3">
        <h3>合作企业</h3>
      </a-col>
    </a-row>
    <div style="padding-bottom:10px">
      <a-row type="flex" justify="start" align="middle">
        <a-col :span="3">
          {{ detail.voucherName }}
        </a-col>
        <a-col :span="3">
          <img style="width:83px;height:62px" :src="detail.voucherImgUrl" alt="" />
        </a-col>
        <a-col :span="2">
          {{ detail.voucherRequiredPoints }}
        </a-col>
        <a-col :span="2">
          {{ detail.unredeemedQuantity }}
        </a-col>
        <a-col :span="2">
          {{ detail.quantityRedeemed }}
        </a-col>
        <a-col :span="3">
          {{ detail.jointVenture }}
        </a-col>
        <a-col :span="3">
          <a-button type="primary" size="small">
            <a :href="openUrl">导出{{ titleType[detail.commodityType] }}</a>
          </a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" size="small" @click="download">
            模板导出
          </a-button>
        </a-col>
        <a-col :span="3">
          <CUpload :file-type="fileType" :file-suffix="['xlsx']" :is-auto-upload="false" file-remove @on-file="getFile">
            <a-button slot="upload" type="primary" size="small"> <a-icon type="upload" /> 导入{{ titleType[detail.commodityType] }} </a-button>
            <!-- <span slot="tip">请上传设备信息，支持Excel文件</span> -->
            <span slot="tip">{{ '' }}</span>
          </CUpload>
        </a-col>
      </a-row>
    </div>
    <c-page ref="base" :search-type="searchType" :columns="columns" :can-search="false" :data="data" @fetch="fetch">
      <template slot="action" slot-scope="{ record }">
        <a-button type="link" :disabled="record.status ? true : false" @click="showConfirm('del', record.id)">
          {{ record.status ? '已删除' : '删除' }}
        </a-button>
      </template>
    </c-page>
  </div>
</template>

<script>
import CUpload from '@/components/base/c-upload'
import Vue from 'vue'
import { baseURL, accessToken } from '@/utils/constant'
const blobToBase64 = function(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
const searchType = [
  {
    type: 'input',
    label: '兑换账号',
    params: 'iphone'
  },
  {
    type: 'datePicker',
    label: '兑换时间',
    params: 'exchange'
  },
  {
    type: 'input',
    label: '订单编号',
    params: 'orderId'
  },
  {
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
  },
  {
    title: '上传时间',
    dataIndex: 'createTime'
  },
  {
    title: '兑换码数量',
    dataIndex: 'countVoucher'
  },
  {
    title: '未兑数量',
    dataIndex: 'unredeemedQuantity'
  },
  {
    title: '已兑数量',
    dataIndex: 'quantityRedeemed'
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

const data = []

const confirmTypes = {
  del: {
    api: 'deleteImportVoucher',
    title: '删除',
    content: '您是否要删除此组兑换码？删除之后，库存将减少，请谨慎操作'
  }
}

export default {
  components: {
    CUpload
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchType,
      data,
      columns,
      fileType: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      file: {},
      // 优惠卷详情
      detail: {},
      openUrl: '',
      titleType: ['兑换码', '专属链接', '核销码']
    }
  },
  created() {
    this.findVoucherId({ voucherStockId: this.id })
    this.getExportCode()
  },
  methods: {
    download() {
      window.open(`${window.location.origin}/${this.titleType[this.detail.commodityType]}上传模板.xlsx`)
    },
    // 获取导出兑换码
    getExportCode() {
      console.log('导出')
      let prod = false
      let openUrl = ''
      // 后台调试下载地址
      let localUrl = 'http://localhost:8081'
      let url = '/api/voucher/download?id=' + this.id
      if (process.env.NODE_ENV === 'production') {
        prod = true
      }
      if (!prod) {
        openUrl = localUrl + url
        console.log('openUrl1', openUrl)
        return (this.openUrl = openUrl)
      }
      openUrl = baseURL + url
      this.openUrl = openUrl
      console.log('openUrl2', openUrl)
    },
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params) {
      this.$api.mall
        .findImportVoucher({ ...params, voucherStockId: this.id })
        .then(res => {
          if (!res) res = { list: [], total: 0 }
          this.data = res.list
          this.$refs.base.fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    /**
     * 确认弹窗
     * @param {string} type 操作类型
     * @param {string} id
     */
    showConfirm(type, id) {
      const title = confirmTypes[type].title
      const content = confirmTypes[type].content || `是否确定${title}该设备？`
      const that = this
      this.$confirm({
        title: `${title}提示`,
        content: content,
        onOk() {
          that.confirmActions(type, id)
        },
        onCancel() {}
      })
    },
    // 确认操作
    confirmActions(type, id) {
      const apiName = confirmTypes[type].api
      apiName &&
        this.$api.mall[apiName]({ id }).then(res => {
          this.$message.success('操作成功')
          this.$refs.base.fetch()
          this.findVoucherId({ voucherStockId: this.id })
        })
    },
    getFile(file) {
      if (file) this.file = file
      this.uploadFile()
    },
    uploadFile(data) {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('id', this.id)
      this.$api.mall
        .codeImport(formData)
        .then(res => {
          console.log(res)
          this.$refs.base.fetch()
          this.findVoucherId({ voucherStockId: this.id })
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    /**
     * 根据id查询data
     * @param {Object} params 查询参数
     */
    findVoucherId(params) {
      this.$api.mall
        .findVoucherDetails(params)
        .then(res => {
          this.detail = res

          this.downImg()
          // 修改表头
          const titieRow = this.columns.find(item => item.dataIndex === 'countVoucher')
          titieRow && (titieRow.title = (this.titleType[this.detail.commodityType] || '') + '数量')
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    downImg() {
      const endPre = this.detail.voucherImgUrl.substring(this.detail.voucherImgUrl.indexOf('.'), this.detail.voucherImgUrl.length)
      let type = 'application/pdf'
      if (endPre.includes('.jpg')) {
        type = 'image/jpg'
      } else if (endPre.includes('.jpeg')) {
        type = 'image/jpeg'
      } else if (endPre.includes('.png')) {
        type = 'image/png'
      } else {
        type = 'application/pdf'
      }
      var oReq = new XMLHttpRequest()
      oReq.open('POST', baseURL + '/api/common/oss/getOssImageUrls', true)
      oReq.responseType = 'blob'
      oReq.setRequestHeader('Authorization', Vue.ls.get(accessToken))
      oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      oReq.send(
        JSON.stringify({
          urls: [this.detail.voucherImgUrl]
        })
      )
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
              _this.detail.voucherImgUrl = res
            })
          }
        }
      }
    }
  }
}
</script>
