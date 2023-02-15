<!--  -->
<template>
  <div>
    <router-view v-if="$route.name == 'projectdetail'" />

    <c-page
      v-else
      ref="base"
      :search-type="searchType"
      :columns="columns"
      :scroll="{ x:1300 }"
      :data="list"
      @fetch="fetch"
    >
      <template slot="headerLeft">
        <a-button
          v-if="$auth('deviceImport')"
          type="primary"
          @click="showModal('import')"
        >
          设备导入
        </a-button>
      </template>

      <div
        slot="action"
        slot-scope="{record}"
        @click.ctrl.exact.self="isShowLZ = !isShowLZ"
      >
        <a-button
          v-if="record.status === 1 && $auth('deviceStop')"
          type="link"
          @click="showConfirm('stop', record.id)"
        >
          停用
        </a-button>
        <a-button
          v-if="record.status === 2 && $auth('deviceLaunch')"
          type="link"
          @click="showConfirm('start', record.id)"
        >
          启用
        </a-button>
        <!-- revoke: 停用 & 非上链中 -->
        <a-button
          v-if="record.status === 2 && record.chainStatus !== 0 && $auth('deviceRevoke')"
          type="link"
          @click="showConfirm('revoke', record.id)"
        >
          吊销
        </a-button>
        <a-button
          v-if="record.status === 0 && $auth('deviceDelete')"
          type="link"
          @click="showConfirm('del', record.id)"
        >
          删除
        </a-button>
        <!-- edit: 停用 & 非上链中 -->
        <a-button
          v-if="record.status === 2 && record.chainStatus !== 0 && $auth('deviceEdit')"
          type="link"
          @click="showModal('edit', record)"
        >
          修改
        </a-button>
        <a-button
          v-if="record.status === 1 && isShowLZ"
          type="link"
          @click="testModel(record)"
        >
          绿证
        </a-button>
      </div>
    </c-page>

    <a-modal
      v-model="modalVisible"
      :title="modal.title"
      :width="500"
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
    <a-modal
      title="绿证"
      :visible="testShow"
      :width="300"
      @ok="testAdd(test)"
      @cancel="testShow = false"
    >
      <a-input v-model="testinput" />
    </a-modal>
  </div>
</template>

<script>
import EditForm from './components/EditForm'
import ImportForm from './components/ImportForm'
import { energyType, deviceStatus, chainStatus } from '@/utils/typeEnum'

const searchType = [
  {
    type: 'input',
    label: '设备ID',
    params: 'deviceId'
  }, {
    type: 'input',
    label: '设备证书编号',
    params: 'deviceCertificate'
  }, {
    type: 'select',
    label: '能源类型',
    params: 'energyType',
    data: energyType
  }, {
    type: 'select',
    label: '状态',
    params: 'status',
    data: deviceStatus
  }, {
    type: 'datePicker',
    label: '安装时间',
    params: 'install'
  }, {
    type: 'input',
    label: '机构名称',
    params: 'companyName'
  }, {
    type: 'input',
    label: '项目名称',
    params: 'projectName'
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  }, {
    title: '设备ID',
    width: 150,
    dataIndex: 'deviceId'
  }, {
    title: '设备公钥',
    width: 380,
    dataIndex: 'publicKey'
  }, {
    title: '设备证书编号',
    width: 130,
    dataIndex: 'deviceCertificate'
  }, {
    title: '机构名称',
    width: 150,
    dataIndex: 'companyName'
  }, {
    title: '项目名称',
    width: 150,
    dataIndex: 'projectName'
  }, {
    title: '发行数量',
    width: 100,
    dataIndex: 'outputTotal',
    scopedSlots: { customRender: 'precisionNum' }
  }, {
    title: '能源类型',
    width: 100,
    dataIndex: 'energyType',
    scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
  }, {
    title: '安装时间',
    dataIndex: 'installTime',
    width: 160
  }, {
    title: '上链情况',
    width: 100,
    dataIndex: 'chainStatus',
    scopedSlots: { customRender: 'chainStatus', type: 'select', data: chainStatus }
  }, {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status', type: 'select', data: deviceStatus }
  }, {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    width: 260,
    scopedSlots: { customRender: 'action' }
  }
]

const confirmTypes = {
  stop: {
    api: 'stopDevice',
    title: '停用'
  },
  start: {
    api: 'launchDevice',
    title: '启用'
  },
  revoke: {
    api: 'revokeDevice',
    title: '吊销',
    content: '是否确定吊销？项目如果吊销，将无法重启'
  },
  del: {
    api: 'deleteDevice',
    title: '删除'
  }
}

export default {
  components: {
    EditForm,
    ImportForm
  },
  data() {
    return {
      energyType,
      deviceStatus,
      searchType,
      columns,
      list: [],
      modalName: '', // add- 新增 review- 审核 edit- 修改
      detail: '', // 选中数据详情,用于修改
      modalVisible: false,
      test: null,
      testShow: false,
      testinput: '',
      isShowLZ: false
    }
  },
  computed: {
    modal() {
      let obj = {
        title: '',
        component: ''
      }

      if (this.modalName === 'import') {
        obj.title = '设备关联'
        obj.component = 'ImportForm'
      }

      if (this.modalName === 'edit') {
        obj.title = '修改设备信息'
        obj.component = 'EditForm'
      }

      return obj
    }
  },
  methods: {
    testModel(record) {
      this.test = record
      this.testShow = true
    },
    testAdd(record) {
      this.$api.trade.flushAsset({
        deviceId: record.deviceId,
        projectId: record.projectId,
        amount: this.testinput * 100
      }).then(res => {
        if(res) {
          this.testShow = false
          this.$message.success('增加测试资产成功')
          this.$refs.base.fetch()
        }
      })
    },
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params) {
      this.$api.device.getDeviceList(params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          const { list, total } = res
          if (Array.isArray(list)) this.list = list
          this.$refs.base.fetchSuccess(total)
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
      this.modalVisible = true
      if (detail) this.detail = detail
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
      apiName && this.$api.device[apiName]({ id })
        .then(res => {
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
<style lang='less' scoped>
</style>