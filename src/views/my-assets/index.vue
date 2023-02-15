<!-- 订单管理 -->
<template>
  <div class="home-container">
    <div class="title">
      发布资产
    </div>
    <c-page
      ref="Pbase"
      :columns="Pcolumns"
      :data="Pdata"
      :search-type="PsearchType"
      @fetch="fetch($event, 'P')"
    >
      <template
        slot="numdetail"
        slot-scope="{record}"
      >
        <a-popover
          placement="leftBottom"
          trigger="click"
          @visibleChange="publishvisible($event, record)"
        >
          <template slot="content">
            <div class="pop-num">
              <p>总数量: {{ (publishRecord.assetAmount || 0) / 100 }}</p>
              <p>已售出: {{ (publishRecord.soldOutAmount || 0) / 100 }}</p>
              <p>已撤回: {{ (publishRecord.recallAmount || 0) / 100 }}</p>
              <p>在售: {{ (publishRecord.soldAmount || 0) / 100 }}</p>
            </div>
          </template>
          <span class="cur-pointer">【查看】</span>
        </a-popover>
      </template>
      <template
        slot="action"
        slot-scope="{record}"
      >
        <span
          class="cur-pointer"
          @click="openDetail('Publishdetail', record)"
        >
          详情
        </span>
        <span
          v-if="record.stock"
          class="cur-pointer"
          @click="action('withdraw',record)"
        >
          撤回
        </span>
        <!-- <span
          v-if="record.status == 1 || record.status == 0"
          class="cur-pointer"
          @click="openDetail('Withdraw', record)"
        >
          撤回
        </span> -->
      </template>
    </c-page>
    <div class="title">
      拥有资产
    </div>
    <c-page
      ref="Ybase"
      class="pb-20"
      :columns="Ycolumns"
      :data="Ydata"
      :search-type="YsearchType"
      @fetch="fetch($event, 'Y')"
    >
      <template
        slot="numdetail"
        slot-scope="{record}"
      >
        <a-popover
          placement="leftBottom"
          trigger="click"
          @visibleChange="visibleChange($event, record)"
        >
          <template slot="content">
            <div class="pop-num">
              <p>总数量: {{ (popoverRecord.assetAmount || 0) / 100 }}</p>
              <p>已发布: {{ (popoverRecord.publishAmount || 0) / 100 }}</p>
              <p>已核销: {{ (popoverRecord.verificationAmount || 0) / 100 }}</p>
              <p>核销待审批: {{ (popoverRecord.stayVerificationAmount || 0) / 100 }}</p>
              <p>可支配数量: {{ (popoverRecord.amount || 0) / 100 }}</p>
            </div>
          </template>
          <span class="cur-pointer">【查看】</span>
        </a-popover>
      </template>
      <template
        slot="action"
        slot-scope="{record}"
      >
        <span
          class="cur-pointer"
          @click="openDetail('Owndetail', record)"
        >
          详情
        </span>
        <span
          v-if="record.amount"
          class="cur-pointer"
          @click="openDetail('Verification', record)"
        >
          核销
        </span>
        <span
          v-if="record.amount && record.assetType==0"
          class="cur-pointer"
          @click="openDetail('Publish', record)"
        >
          发布
        </span>
      </template>
    </c-page>
    <a-modal
      v-model="show"
      :title="openItem.title"
      :width="openItem.width"
      :destroy-on-close="true"
      :footer="null"
    >
      <component
        :is="openItem.type"
        :record-data="recordData"
        @close="show = false"
        @refresh="refresh"
      />
    </a-modal>
  </div>
</template>

<script>
import Publishdetail from './components/publishdetail'
import Owndetail from './components/owndetail'
import Verification from './components/verification'
import Publish from './components/publish'
import Withdraw from './components/withdraw'
import {Modal} from 'ant-design-vue'
import {energyType} from '@/utils/typeEnum'
export default {
  components: {
    Owndetail,
    Publishdetail,
    Verification,
    Publish,
    Withdraw
  },
  data() {
    return {
      show: false,
      popoverRecord: {},
      publishRecord: {},
      modalList: [
        {
          type: 'Verification',
          title: '资产核销',
          width: 500
        },
        {
          type: 'Publishdetail',
          title: '资产详情',
          width: 1200
        },
        {
          type: 'Owndetail',
          title: '资产详情',
          width: 1200
        },
        {
          type: 'Publish',
          title: '资产发布',
          width: 500
        },
        {
          type: 'Withdraw',
          title: '资产撤回',
          width: 500
        }
      ],
      openType: 'Owndetail',
      detailType: '',
      actionType: {
        withdraw: {
          title: '撤回提示',
          content: '是否确定撤回所有未售出的',
          okText: '确定',
          cancelText: '取消'
        }
      },
      PsearchType: [
        {
          type: 'input',
          params: 'projectName',
          placeholder: '请输入',
          label: '项目名称'
        },
        {
          type: 'input',
          params: 'companyName',
          placeholder: '请输入',
          label: '关联公司'
        },
        {
          type: 'select',
          params: 'energyType',
          placeholder: '请选择',
          label: '能源类型',
          data: energyType
        }
      ],
      Pcolumns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'no' },
          width: 55
        },
        {
          title: '项目名称',
          dataIndex: 'assetSaleName'
        },
        {
          title: '关联公司',
          dataIndex: 'companyName'
        },
        {
          title: '能源类型',
          dataIndex: 'energyType',
          scopedSlots: { customRender: 'energyType', type: 'select', data: energyType }
        },
        {
          title: '总数量',
          dataIndex: 'stockAmount',
          scopedSlots: { customRender: 'precisionNum'}
        },
        {
          title: '在售数量',
          dataIndex: 'stock',
          scopedSlots: { customRender: 'precisionNum'}
        },
        {
          title: '数量详情',
          dataIndex: 'numdetail',
          width: 100,
          scopedSlots: { customRender: 'numdetail'}
        },
        {
          title: '操作',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      Pdata: [],
      YsearchType: [
        {
          type: 'input',
          params: 'projectName',
          placeholder: '请输入',
          label: '项目名称'
        },
        {
          type: 'input',
          params: 'companyName',
          placeholder: '请输入',
          label: '关联公司'
        },
        {
          type: 'select',
          params: 'energyType',
          placeholder: '请选择',
          label: '能源类型',
          data: energyType
        }
      ],
      Ycolumns: [
        {
          title: '序号',
          width: 55,
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '关联公司',
          dataIndex: 'companyName'
        },
        {
          title: '能源类型',
          dataIndex: 'energyType',
          scopedSlots: {
            customRender: 'energyType',
            type: 'select',
            data: energyType
          }
        },
        {
          title: '总数量',
          dataIndex: 'assetAmount',
          scopedSlots: { customRender: 'precisionNum'}
        },
        {
          title: '可支配数量',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'precisionNum'}
        },
        {
          title: '数量详情',
          dataIndex: 'numdetail',
          width: 100,
          scopedSlots: { customRender: 'numdetail'}
        },
        {
          title: '操作',
          key: 'operation',
          width: 170,
          scopedSlots: { customRender: 'action' }
        }
      ],
      Ydata: [],
      recordData: null
    }
  },
  computed: {
    openItem() {
      return this.modalList.find(it => it.type == this.openType)
    }
  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    async visibleChange(visible, record) {
      if(visible){
          try {
            const res = await this.$api.trade.assetAmountDetail({
              assetId: record.id
            })
            this.popoverRecord = {
              ...res,
              id: record.id
            }
          } catch {
            this.popoverRecord = {}
          }
      }
    },
    async publishvisible(visible, record) {
      if(visible){
          try {
            const res = await this.$api.trade.assetSaleDetailAmount({
              assetSaleId: record.id
            })
            this.publishRecord = {
              ...res,
              id: record.id
            }
          } catch {
            this.publishRecord={}
          }
      }
    },
    refresh(type) {
      if(type=='publish'){
        this.$refs.Pbase.fetch()
        this.$refs.Ybase.fetch()
      }else{
        this.$refs.Ybase.fetch()
      }
    },
    fetch(params, type) {
      const apiType = {
        P: 'saleAssetList',
        Y: 'ownAssetList'
      }
      this.$api.trade[apiType[type]](params)
        .then(res => {
          if(!res) res = {list: [], total: 0}
          this[type+'data'] = res.list
          this.$refs[type+'base'].fetchSuccess(res.total)
        })
        .finally(() => {
          this.$refs[type+'base'].fetchFinally()
        })
    },
    openDetail(type, data, detailType) {
      this.recordData = data
      this.openType = type
      this.show = true
    },
    action(type, data) {
      const {title, content, okText, cancelText} = this.actionType[type]
      const that = this
      Modal.confirm({
        title: title,
        content: content,
        okText: okText || '确定',
        cancelText: cancelText || '取消',
        onOk() {
          if(typeof that[type] == 'function'){
            that[type](data)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 撤回
    async withdraw(data){
      const res = await this.$api.trade.withDrawPublishAsset({
            assetSaleId: data.id
          })
      if(res){
        this.$refs.Pbase.fetch()
        this.$refs.Ybase.fetch()
      }
    }
  }
}
</script>
<style lang='less' scoped>
.title{
  font-size: 18px;
  margin: 15px 0;
}
.pop-num{
  p{
    margin: 4px auto;
  }
}
</style>