<!-- 资讯管理 -->
<template>
  <div v-if="$route.name == 'newsManagement'">
    <c-page ref="base" :search-type="searchType" :columns="columns" :data="data" @fetch="fetch">
      <!-- 资讯状态 -->
      <template slot="informationStatus" slot-scope="{ record }">
        <a-button :type="record.informationStatus == 1 ? 'primary' : 'text'" @click="showConfirm(record.informationStatus == 1 ? 'up' : 'down', record.id, record.informationStatus)">
          {{ record.informationStatus == 1 ? '可见' : '不可见' }}
        </a-button>
      </template>
      <!-- 操作 -->
      <template slot="headerLeft">
        <a-button type="primary" @click="showModal('add')">
          添加
        </a-button>
      </template>
      <template slot="informationType" slot-scope="{ record }">
        {{ record.informationType == 1 ? '普通资讯' : record.informationType == 2 ? '活动资讯' : record.informationType == 3 ? '公益活动' : record.informationType }}
      </template>
      <template slot="action" slot-scope="{ record }">
        <a-button type="link" @click="showModal('edit', record)">
          编辑
        </a-button>
        <a-button type="link" @click="showConfirm('del', record.id)">
          删除
        </a-button>
      </template>
    </c-page>

    <a-modal v-model="modalVisible" :title="modal.title" :width="580" :footer="null" :destroy-on-close="true">
      <component :is="modal.component" :ref="modal.component" :form-type="modalName" :detail="detail" @close="close" />
    </a-modal>
  </div>
  <router-view v-else />
</template>

<script>
import EditForm from './components/EditForm'
import AddForm from './components/AddForm'
import { informationType, informationStatus } from '@/utils/typeEnum'
// 没用
const blobToBase64 = function(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      resolve(e.target.result)
    }
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
const searchType = [
  {
    type: 'input',
    label: '资讯标题',
    params: 'informationTitle'
  },
  {
    type: 'select',
    label: '资讯类型',
    params: 'InformationType',
    data: informationType
  },
  {
    type: 'select',
    label: '资讯状态',
    params: 'informationStatus',
    data: informationStatus
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  },
  {
    title: '资讯标题',
    dataIndex: 'informationTitle'
  },
  {
    title: '资讯类型',
    dataIndex: 'informationType',
    scopedSlots: { customRender: 'informationType' }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  },
  {
    title: '资讯状态',
    dataIndex: 'informationStatus',
    scopedSlots: { customRender: 'informationStatus' }
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
    api: 'DeleteInformation',
    title: '删除',
    content: '您是否要删除此资讯，删除之后，资讯中不再展示'
  },
  up: {
    api: 'editStatus',
    title: '不可见'
  },
  down: {
    api: 'editStatus',
    title: '可见'
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
      modalVisible: false,
      // 资讯类型
      informationType
    }
  },
  computed: {
    modal() {
      let obj = {
        title: '',
        component: ''
      }

      if (this.modalName === 'add') {
        obj.title = '添加资讯'
        obj.component = 'AddForm'
      }

      if (this.modalName === 'edit') {
        obj.title = '修改资讯'
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
      this.$api.information
        .informationList(params)
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
     * 根据id查询data
     * @param {Object} params 查询参数
     */
    findVoucherId(params) {
      this.$api.information
        .findByInformationId(params)
        .then(res => {
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
      if (!detail) {
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
    showConfirm(type, id, informationStatus) {
      const title = confirmTypes[type].title
      const content = confirmTypes[type].content || `是否确定更改为${title}该资讯？`
      const that = this
      this.$confirm({
        title: `${title}提示`,
        content: content,
        onOk() {
          that.confirmActions(type, id, informationStatus)
        },
        onCancel() {}
      })
    },
    // 确认操作
    confirmActions(type, id, informationStatus) {
      if (['up', 'down'].includes(type)) informationStatus = informationStatus ? 2 : 1
      const apiName = confirmTypes[type].api
      apiName &&
        this.$api.information[apiName]({ voucherStockId: id, informationStatus: informationStatus }).then(res => {
          this.$message.success('操作成功')
          this.$refs.base.fetch()
        })
    },
    close(isFetch = false) {
      this.modalVisible = false
      if (isFetch) this.$refs.base.fetch()
    }
  }
}
</script>
