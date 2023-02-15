<template>
  <div class="info-card">
    <div class="ant-descriptions-title">
      设备信息
    </div>

    <a-table
      :columns="columnsFormat"
      :data-source="dataSource"
      :pagination="false"
      bordered
      :row-key="record=>record.deviceId"
      size="middle"
    >
      <template
        slot="installTime"
        slot-scope="text"
      >
        {{ text && $dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <template
        slot="precisionNum"
        slot-scope="text"
      >
        {{ (text || 0) / 100 }}
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '设备ID',
    dataIndex: 'deviceId'
  }, {
    title: '品牌',
    dataIndex: 'brand'
  }, {
    title: '型号',
    dataIndex: 'typeCode'
  }, {
    title: '安装日期',
    dataIndex: 'installTime',
    scopedSlots: { customRender: 'installTime' }
  }, {
    title: '累计读数',
    dataIndex: 'outputTotal',
    scopedSlots: { customRender: 'precisionNum' }
  }
]

export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    columnsFormat() {
      return columns.map(it => ({
        ...it,
        align: it.align || 'center',
        ellipsis: it.ellipsis || true
      }))
    }
  }
}
</script>

<style>

</style>