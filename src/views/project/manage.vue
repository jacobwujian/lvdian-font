<!--  -->
<template>
  <div>
    <router-view v-if="$route.name == 'projectdetail'" />

    <c-page v-else ref="base" :search-type="searchType" :columns="columns" :scroll="{ x: 1500 }" :data="list" @fetch="fetch">
      <template slot="headerLeft">
        <a-button v-if="$auth('projectAdd')" type="primary" @click="showModal('add')">
          新增项目
        </a-button>
      </template>
      <template slot="authenticationLevel" slot-scope="{ text }">
        {{ text }}
        <Star :count="1" />
      </template>
      <template slot="action" slot-scope="{ record }">
        <!-- review 待审核 或 待删除审核 -->
        <a-button v-if="(record.status === 0 || record.status === 5) && $auth('projectCheck')" type="link" @click="showModal('review', record.id)">
          审核
        </a-button>
        <a-button v-if="record.status > 0 && record.status < 4 && $auth('projectEdit')" type="link" @click="showModal('edit', record.id)">
          修改
        </a-button>
        <a-button v-if="record.status !== 3 && $auth('projectDetail')" type="link" @click="$router.push(`${$cPath}/project/detail/${record.id}`)">
          详情
        </a-button>

        <a-button v-if="(record.status === 1 || record.status === 2) && $auth('projectTermination')" type="link" @click="showConfirm('end', record.id)">
          终止
        </a-button>
        <a-button v-if="record.status === 1 && $auth('projectStop')" type="link" @click="showConfirm('stop', record.id)">
          暂停
        </a-button>
        <a-button v-if="record.status === 2 && $auth('projectLaunch')" type="link" @click="showConfirm('start', record.id)">
          启动
        </a-button>
        <a-button v-if="(record.status === 3 || record.status === 4) && $auth('projectDelete')" type="link" @click="showConfirm('del', record.id)">
          删除
        </a-button>
      </template>
    </c-page>

    <a-modal v-model="modalVisible" :title="modalTitle" :width="1200" :footer="null" :destroy-on-close="true">
      <Form :id="id" ref="projectForm" :form-type="modalName" @close="close" />
    </a-modal>
  </div>
</template>

<script>
import Star from '@/components/base/c-star'
import Form from './components/Form'
import { energyType, projectStatus, projectType } from '@/utils/typeEnum'

const searchType = [
  {
    type: 'input',
    label: '项目名称',
    params: 'projectName'
  },
  {
    type: 'input',
    label: '项目编号',
    params: 'projectCode'
  },
  {
    type: 'input',
    label: '机构名称',
    params: 'companyName'
  },
  {
    type: 'input',
    label: '统一社会信用代码',
    params: 'socialCreditCode'
  },
  {
    type: 'select',
    label: '能源类型',
    params: 'energyType',
    data: energyType
  },
  {
    type: 'select',
    label: '状态',
    params: 'status',
    data: projectStatus
  },
  {
    type: 'datePicker',
    label: '报送时间',
    params: 'delivery'
  },
  {
    type: 'select',
    label: '项目类型',
    params: 'projectType',
    data: projectType
  }
]

const columns = [
  {
    title: '序号',
    width: 55,
    scopedSlots: { customRender: 'no' }
  },
  {
    title: '项目名称',
    width: 150,
    dataIndex: 'projectName'
  },
  {
    title: '项目编号',
    width: 300,
    dataIndex: 'projectCode'
  },
  {
    title: '机构名称',
    width: 150,
    dataIndex: 'companyName'
  },
  {
    title: '统一社会信用代码',
    width: 200,
    dataIndex: 'socialCreditCode'
  },
  {
    title: '能源类型',
    dataIndex: 'energyType',
    width: 100,
    scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
  },
  {
    title: '地区',
    width: 200,
    dataIndex: 'projectArea',
    scopedSlots: { customRender: 'projectArea', type: 'area' }
  },
  {
    title: '认证等级',
    dataIndex: 'authenticationLevel',
    width: 100,
    scopedSlots: { customRender: 'authenticationLevel' }
  },
  {
    title: '报送时间',
    dataIndex: 'applicationDate',
    scopedSlots: { customRender: 'applicationDate', type: 'time', format: 'YYYY-MM-DD' }
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    width: 100,
    scopedSlots: { customRender: 'projectType', type: 'select', data: projectType }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    scopedSlots: { customRender: 'status', type: 'select', data: projectStatus }
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    width: 260,
    scopedSlots: { customRender: 'action' }
  }
]

const confirmTypes = {
  stop: {
    api: 'stopProject',
    title: '暂停'
  },
  start: {
    api: 'launchProject',
    title: '启动'
  },
  end: {
    api: 'terminationProject',
    title: '终止',
    content: '是否确定终止？项目如果终止，将无法重启'
  },
  del: {
    api: 'deleteProject',
    title: '删除'
  }
}

export default {
  components: {
    Star,
    Form
  },
  data() {
    return {
      energyType,
      projectStatus,
      searchType,
      columns,
      list: [],
      modalName: '', // add- 新增 review- 审核 edit- 修改
      id: '', // 选中数据id
      modalVisible: false,
      loading: false
    }
  },
  computed: {
    modalTitle() {
      if (this.modalName === 'add') return '新增项目'
      else if (this.modalName === 'review') return '审核项目'
      else return '修改项目'
    }
  },
  methods: {
    /**
     * 查询table data
     * @param {Object} params 查询参数
     */
    fetch(params) {
      this.$api.project
        .getProjectList(params)
        .then(res => {
          if (!res) res = { list: [], total: 0 }
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
     * @param {String} id 该条数据id
     */
    showModal(type, id) {
      this.modalName = type
      this.modalVisible = true
      this.id = id
    },
    /**
     * 确认弹窗
     * @param {string} type 操作类型
     * @param {string} id
     */
    showConfirm(type, id) {
      const title = confirmTypes[type].title
      const content = confirmTypes[type].content || `是否确定${title}该项目？`
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
        this.$api.project[apiName]({ id }).then(res => {
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
<style lang="less" scoped></style>
