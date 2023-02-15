<!--  -->
<template>
  <div>
    <c-page
      ref="base"
      :search-type="searchType"
      :columns="columns"
      :scroll="{ x:1300 }"
      :data="list"
      @fetch="fetch"
    >
      <template
        slot="action"
        slot-scope="{record}"
      >
        <!-- 上链失败 => 重新上链 权限与审核一致 -->
        <a-button
          v-if="record.chainStatus === 2 && $auth('organizationCheck')"
          type="link"
          @click="reChain(record.id)"
        >
          重试
        </a-button>
        <a-button
          v-if="record.status === 0 && $auth('organizationCheck')"
          type="link"
          @click="showModal('review', record)"
        >
          审核
        </a-button>
        <a-button
          v-if="(record.status === 0 || record.status === 1) && $auth('organizationDetail')"
          type="link"
          @click="showModal('view', record)"
        >
          详情
        </a-button>
        <a-button
          v-if="(record.status === 1 || record.status === 2) && $auth('organizationEdit')"
          type="link"
          @click="showModal('edit', record)"
        >
          修改
        </a-button>
      </template>
    </c-page>

    <a-modal
      v-model="modalVisible"
      :title="modal.title"
      :width="1200"
      :footer="null"
      :destroy-on-close="true"
    >
      <component
        :is="modal.component"
        :id="detail.id"
        :ref="modal.component"
        :form-type="modalName"
        :org-type-val="detail.type"
        @close="close"
      />
    </a-modal>
  </div>
</template>

<script>
import Detail from './components/Detail'
import Form from './components/Form'
import { checkStatus, orgTypes, chainStatus, EnumMap } from '@/utils/typeEnum'

const searchType = [
  {
    type: 'input',
    label: '统一社会信用代码',
    params: 'socialCreditCode'
  }, {
    type: 'input',
    label: '机构名称',
    params: 'companyName'
  }, {
    type: 'select',
    label: '审核状态',
    params: 'status',
    data: checkStatus
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  }, {
    title: '统一社会信用代码',
    width:200,
    dataIndex: 'socialCreditCode'
  }, {
    title: '机构名称',
    width:150,
    dataIndex: 'companyName'
  }, {
    title: '联系人',
    // width:150,
    dataIndex: 'realName'
  }, {
    title: '联系方式',
    width: 120,
    dataIndex: 'contactWay'
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime', type: 'time' }
  }, {
    title: '角色权限',
    dataIndex: 'roleName'
  }, {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status', type: 'select', data: checkStatus }
  }, {
    title: '上链情况',
    dataIndex: 'chainStatus',
    scopedSlots: { customRender: 'chainStatus', type: 'select', data: chainStatus }
  }, {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    Detail,
    Form
  },
  data() {
    return {
      checkStatus,
      searchType,
      list: [],
      columns,
      modalName: '', // view- 详情 review- 审核 edit- 修改
      detail: '', // 选中数据detail
      modalVisible: false
    }
  },
  computed: {
    modal() {
      const titleInfo = EnumMap(orgTypes, this.detail.type)

      let obj = {
        title: '',
        component: ''
      }

      if (this.modalName === 'view') {
        obj.title = '企业详情'
        obj.component = 'Detail'
      }
      if (this.modalName === 'review') {
        obj.title = `审核机构信息（${titleInfo}）`
        obj.component = 'Form'
      }
      if (this.modalName === 'edit') {
        obj.title = `修改机构信息（${titleInfo}）`
        obj.component = 'Form'
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
      this.$api.company.findCompany(params)
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
     * 弹窗open
     * @param {String} type 操作类型
     * @param {String} detail 该条数据detail
     */
    showModal(type, detail) {
      this.modalName = type
      this.detail = detail
      this.modalVisible = true
    },
    // 重新上链
    reChain(id) {
      const that = this
      this.$confirm({
        title: '上链提示',
        content: '是否确定重新上链？',
        onOk() {
          that.$api.company.retryToChain({ id })
            .then(res => {
              that.$message.success('操作成功')
              that.$refs.base.fetch()
            })
        },
        onCancel() {}
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