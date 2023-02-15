<!-- 积分兑换 -->
<template>
  <div v-if="$route.name == 'couponManagement'">
    <c-page
      ref="base"
      :search-type="searchType"
      :columns="columns"
      :data="data"
      @fetch="fetch"
    >
      <!-- 代金卷图片 -->
      <template
        slot="voucherImgUrl"
        slot-scope="{record}"
      >
        <img
          style="width:83px;height:62px"
          :src="record.voucherImgUrl"
          alt=""
        >
      </template>
      <!-- 代金卷状态 -->
      <template
        slot="shelfStatus"
        slot-scope="{record}"
      >
        <a-button
          :type="record.shelfStatus ? 'primary' : 'text'"
          @click="showConfirm(record.shelfStatus ? 'up' : 'down',record.id, record.shelfStatus)"
        >
          {{ record.shelfStatus ? '上架中' : '下架中' }}
        </a-button>
      </template>
      <!-- 操作 -->
      <template slot="headerLeft">
        <a-button
          type="primary"
          @click="showModal('add')"
        >
          添加
        </a-button>
      </template>
      <template
        slot="commodityType"
        slot-scope="{ record }"
      >
        {{ record.commodityType == 0 ? "兑换码" : (record.commodityType == 1 ? "专属链接" : "核销码") }}
      </template>
      <template
        slot="action"
        slot-scope="{ record }"
      >
        <a-button
          type="link"
          @click="
            $router.push(`${$cPath}/mall/coupon/detail/${record.id}`)
          "
        >
          管理兑换码
        </a-button>
        <a-button
          type="link"
          @click="showModal('edit', record)"
        >
          编辑
        </a-button>
        <a-button
          type="link"
          @click="showConfirm('del', record.id)"
        >
          删除
        </a-button>
      </template>
    </c-page>

    <a-modal
      v-model="modalVisible"
      :title="modal.title"
      :width="580"
      :footer="null"
      :destroy-on-close="true"
    >
      <component
        :is="modal.component"
        :ref="modal.component"
        :form-type="modalName"
        :detail="detail"
        @close="close"
      />
    </a-modal>
  </div>
  <router-view v-else />
</template>

<script>
import EditForm from './components/EditForm'
import AddForm from './components/AddForm'
import { voucherStatus } from '@/utils/typeEnum'
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
const searchType = [
  {
    type: 'input',
    label: '优惠券名称',
    params: 'voucherName'
  },
  {
    type: 'input',
    label: '合作企业',
    params: 'jointVenture'
  },
  {
    type: 'select',
    label: '状态',
    params: 'shelfStatus',
    data: voucherStatus
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  },
//   {
//     title: '兑换时间',
//     dataIndex: 'exchangeTime',
//     scopedSlots: { customRender: 'createTime', type: 'time' }
//   },
  {
    title: '优惠券名称',
    dataIndex: 'voucherName'
  },
  {
    title: '图片',
    dataIndex: 'voucherImgUrl',
    scopedSlots: { customRender: 'voucherImgUrl', type: 'image' }
  },
  {
    title: '单价',
    dataIndex: 'voucherRequiredPoints'
  },
  {
    title: '类型',
    dataIndex: 'commodityType',
    scopedSlots: { customRender: 'commodityType' }
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
    title: '合作企业',
    dataIndex: 'jointVenture'
  },
  {
    title: '状态',
    dataIndex: 'shelfStatus',
    scopedSlots: { customRender: 'shelfStatus', type: 'shelfStatus' }
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
    api: 'deleteVoucher',
    title: '删除',
    content: '您是否要删除此商品，删除之后，商城中不再展示'
  },
  up: {
    api: 'editStatus',
    title: '下架'
  },
  down: {
    api: 'editStatus',
    title: '上架'
  }
}

export default {
  components: {
    EditForm,
    AddForm
  },
  data() {
    return {
      searchType,
      data,
      columns,
      modalName: '', // add- 新增 edit- 修改
      detail: {}, // 选中数据详情,用于修改
      modalVisible: false
    }
  },
  computed: {
    modal() {
      const actionTypes = ['add', 'edit']

      let obj = {
        title: '',
        component: ''
      }

      if (this.modalName === 'add') {
        obj.title = '添加优惠券商品'
        obj.component = 'AddForm'
      }

      if (this.modalName === 'edit') {
        obj.title = '修改优惠券商品'
        obj.component = 'EditForm'
      }

      return obj
    }
  },
  methods: {
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params) {
      let _this = this
      this.$api.mall
        .findVoucher(params)
        .then((res) => {
          if (!res) res = { list: [], total: 0 }
          this.data = res.list.filter(e => { return _this.downImg(e) })
          console.log(this.data)
          this.$refs.base.fetchSuccess(res.total)
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
        .findByVoucherId(params)
        .then((res) => {
          this.modalVisible = true
          this.detail = res
        })
        .finally(() => {
          this.$refs.base.fetchFinally()
        })
    },
    /**
     * 修改/导入弹窗
     * @param {String} type 操作类型
     * @param {String} detail 数据详情
     */
    showModal(type, detail) {
      this.modalName = type
      if(!detail) {
          this.modalVisible = true
          this.detail = {}
      }
      if (detail) this.findVoucherId({ voucherStockId: detail.id })
    },
    /**
     * 确认弹窗
     * @param {string} type 操作类型
     * @param {string} id
     */
    showConfirm(type, id, shelfStatus) {
      const title = confirmTypes[type].title
      const content = confirmTypes[type].content || `是否确定${title}该优惠券？`
      const that = this
      this.$confirm({
        title: `${title}提示`,
        content: content,
        onOk() {
          that.confirmActions(type, id, shelfStatus)
        },
        onCancel() {}
      })
    },
    // 确认操作
    confirmActions(type, id, shelfStatus) {
      if(['up', 'down'].includes(type)) shelfStatus = shelfStatus ? 0 : 1
      const apiName = confirmTypes[type].api
      apiName && this.$api.mall[apiName]({ 'voucherStockId': id, shelfStatus: shelfStatus })
        .then(res => {
          this.$message.success('操作成功')
          this.$refs.base.fetch()
        })
    },
    close(isFetch = false) {
      this.modalVisible = false
      if (isFetch) this.$refs.base.fetch()
    },
    downImg(e) {
      const endPre = e.voucherImgUrl.substring(e.voucherImgUrl.indexOf('.'), e.voucherImgUrl.length)
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
        urls: [e.voucherImgUrl]
      }))
      var file1 = null
      oReq.onreadystatechange = function() {

        if (oReq.readyState == 4) {
          if (oReq.status == 200 || oReq.status == 0) {
            file1 = new Blob([oReq.response], {
              type: type
            })
            blobToBase64(file1, this).then(res => {
              // 转化后的base64
              e.voucherImgUrl = res
            })
          }
        }
      }
      return e
    }
  }
}
</script>
