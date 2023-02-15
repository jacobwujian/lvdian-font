<template>
  <div
    class="index-home"
    style="padding: 20px 100px;"
  >
    <div class="org-detail">
      <!-- 基础信息 S -->
      <Description
        :detail="outerDetail"
        :items-in="detailItems"
      />
      <!-- 基础信息 E -->

      <!--      <a-divider />
 -->
      <!-- 设备信息 S -->
      <!--      <DeviceInfo :data-source="deviceInfoDtos" />
 -->      <!-- 设备信息 E -->

      <!--      <a-divider />
 -->
      <!-- 项目发证数量统计 S -->
      <StatisticsCard :project-id="id" />
      <!-- 项目发证数量统计 S -->

      <a-divider />

      <!-- 项目资产 S -->
      <!-- <AssetsInfo :project-id="id" /> -->
      <!-- 项目资产 E -->

      <!--     <a-divider />

      <div class="info-card">
        <div class="ant-descriptions-title">
          资产信息
        </div>

        <c-page
          ref="base"
          :search-type="searchType"
          :columns="assetColumns"
          :data="list"
          @fetch="fetch"
        >
          <template
            slot="action"
            slot-scope="{ record }"
          >
            <a-button
              v-if="$auth('projectAssetDetail')"
              type="link"
              @click="showModal('view', record)"
            >
              详情
            </a-button>
            <a-button
              v-if="record.status === 1 && $auth('projectVerification')"
              type="link"
              @click="showModal('verification', record)"
            >
              核销
            </a-button>
          </template>
        </c-page>
      </div>

      <a-divider /> -->

      <div class="text-center">
        <a-button
          type="primary"
          @click="$router.go(-1)"
        >
          返回
        </a-button>
      </div>

      <a-modal
        v-model="modalVisible"
        :title="modal.title"
        :width="modal.width"
        :footer="null"
        :destroy-on-close="true"
      >
        <component
          :is="modal.component"
          :id="assetItemDetail && assetItemDetail.id"
          :ref="modal.component"
          :form-type="modalName"
          :detail="assetItemDetail"
          @close="close"
        />
      </a-modal>
    </div>
  </div>
</template>
<script>
import Description from './components/detail/Description'
import DeviceInfo from './components/detail/DeviceInfo'
import AssetDetail from './components/AssetDetail'
import AssetVerification from './components/AssetVerification'
import StatisticsCard from './components/detail/StatisticsCard'
import AssetsInfo from './components/detail/AssetsInfo'

const detailItems = [
  {
    key: 'projectName',
    label: '项目名称'
  },
  {
    key: 'projectArea',
    label: '项目地区',
    type: 'areas'
  },
  {
    key: 'outputTotal',
    label: '累计凭证产出',
    type: 'number',
    unit: '张'
  }
]

const searchType = [
  {
    type: 'input',
    label: '公司名称/账户',
    params: 'companyName'
  }
]

const assetColumns = [
  {
    title: '持有方',
    dataIndex: 'companyName'
  },
  {
    title: '统一社会信用证代码',
    dataIndex: 'socialCreditCode'
  },
  {
    title: '总数量',
    dataIndex: 'assetAmount',
    scopedSlots: { customRender: 'precisionNum' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    Description,
    DeviceInfo,
    AssetDetail,
    AssetVerification,
    StatisticsCard,
    AssetsInfo
  },
  data() {
    return {
      searchType,
      assetColumns,
	  detailItems,
      id: '',
	  code: '',
      detail: {},
      deviceInfoDtos: [],
      list: [], // 资产列表
      modalName: '', // view- 详情 verification- 核销
      modalVisible: false,
      assetItemDetail: {} // 资产详情
    }
  },
  computed: {
    modal() {
      let obj = {
        title: '',
        component: '',
        width: 0
      }

      if (this.modalName === 'view') {
        obj.title = '资产详情'
        obj.component = 'AssetDetail'
        obj.width = 800
      }

      if (this.modalName === 'verification') {
        obj.title = `资产核销`
        obj.component = 'AssetVerification'
        obj.width = 500
      }

      return obj
    },
	outerDetail(){
		console.log(this.detail)
		let obj = {
			projectName:this.detail['projectName'],
			projectArea:this.detail['projectArea'],
			outputTotal:this.detail['outputTotal']
		}
		return obj
	}
  },
  created() {
	  let dateTi = new Date(Number(this.$route.query.timestamp))
	  if(this.$route.query&&this.$route.query.serverName&&this.$route.query.timestamp){
		  if(this.$route.query.serverName!='KZSNY001'){
			   this.$message.warning('非法系统禁止访问！')
		  }else{
			 if(dateTi.toDateString('yyyyMMdd') !== new Date().toDateString('yyyyMMdd')){
			 			   this.$message.warning('失效的链接！')
			 }else{
			 			 if (this.$route.params.projectNumber) {
			 			   this.code = this.$route.params && this.$route.params.projectNumber
			 			   this.getDetail()
			 			 }
			 }
		  }
	  }else{
		  this.$message.warning('serverName或timestamp缺失！')
	  }

  },
  methods: {
    getDetail() {
      this.$api.project
        .projectBaseInfoByCode({
          code: this.code
        })
        .then(res => {
          if (res && Object.keys(res).length) {
            this.detail = res
			this.id = res.id
			if(this.id == undefined){
				this.$message.warning('projectNumber不存在！')
			}
/* 			this.fetch()
 */ // 获取设备列表
            this.deviceInfoDtos = this.detail.deviceInfoDtos
          }
        })
    },
    // 资产信息查询
    fetch(params) {
      if (!this.id) return false

      this.$api.asset
        .selectAssetList({
          id: this.id,
          ...params
        })
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
     * @param {String} detail 该条数据detail
     */
    showModal(type, detail) {
      this.modalName = type
      this.assetItemDetail = detail
      this.modalVisible = true
    },
    close(isFetch = false) {
      this.modalVisible = false
      if (isFetch) this.$refs.base.fetch()
    }
  }
}
</script>
<style lang='less' scoped>
	.index-home{
	background: url(../../static/home/bgsy.png) repeat center;
	}
</style>