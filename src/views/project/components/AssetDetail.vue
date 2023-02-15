<template>
  <div class="asset-detail">
    <template v-for="(item, index) in detailItems">
      <a-descriptions
        :key="index"
        :title="item.title"
        :column="2"
      >
        <a-descriptions-item
          v-for="(child, i) in item.children"
          :key="`${index}-${i}`"
          :label="child.label"
        >
          <template v-if="child.type === 'time'">
            {{ detail[child.key] && $dayjs(detail[child.key]).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-else-if="child.type === 'precisionNum'">
            {{ (detail[child.key] || 0) / 100 }}
          </template>
          <template v-else>
            <template v-if="child.plevel">
              {{ detail[child.plevel] && detail[child.plevel][child.key] }}
            </template>
            <template v-else>
              {{ detail[child.key] }}
            </template>
          </template>
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <a-divider />

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button
            type="primary"
            html-type="submit"
            @click="$emit('close')"
          >
            确认
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const detailItems = [
  {
    title: '',
    children: [
      {
        key: 'assetAmount',
        label: '总数量',
        type: 'precisionNum'
      }, {
        key: 'verificationAmount',
        label: '已核销',
        type: 'precisionNum'
      }, {
        key: 'verificationWaitAmount',
        label: '核销待审核',
        type: 'precisionNum'
      }, {
        key: 'availableAmount',
        label: '可支配数量',
        type: 'precisionNum'
      }, {
        key: 'recentTradeTime',
        label: '最近交易时间',
        type: 'time'
      }
    ]
  }, {
    title: '可支配绿证',
    children: [
      {
        key: 'assetRecentDate',
        label: '资产最近到期日',
        type: 'time'
      }, {
        key: 'oneMonthAsset',
        label: '一个月内到期资产数',
        type: 'precisionNum'
      }, {
        key: 'oneToThreeMonthAsset',
        label: '1-3个月内到期资产数',
        type: 'precisionNum'
      }, {
        key: 'threeToSixMonthAsset',
        label: '3-6个月到期资产数',
        type: 'precisionNum'
      }, {
        key: 'moreThanSixMonthAsset',
        label: '6个月以上到期资产数',
        type: 'precisionNum'
      }
    ]
  }
]

export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      detailItems,
      detail: {}
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      if (!this.id) return false

      this.$api.asset.getAssetDetail({
        id: this.id
      }).then(res => {
        if (Object.keys(res).length) {
          this.detail = res
        }
      })
    }
  }
}
</script>
