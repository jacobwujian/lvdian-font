<template>
  <a-descriptions
    layout="vertical"
    title="基础信息"
    :column="4"
  >
    <a-descriptions-item
      v-for="(item, index) in itemsIn"
      :key="index"
      :label="item.label"
    >
      <template v-if="item.type === 'date'">
        {{ detail[item.key] && $dayjs(detail[item.key]).format('YYYY-MM-DD') }}
      </template>
      <template v-else-if="item.type === 'dateRange' && detail[item.key[0]] && detail[item.key[1]]">
        {{ $dayjs(detail[item.key[0]]).format('YYYY-MM-DD') }}
        至
        {{ $dayjs(detail[item.key[1]]).format('YYYY-MM-DD') }}
      </template>

      <template v-else-if="item.type === 'map'">
        {{ EnumMap(item.mapSource, detail[item.key]) }}
      </template>

      <Star
        v-else-if="item.type === 'rate'"
        :count="detail[item.key] || 0"
      />

      <template v-else-if="item.type === 'number'">
        {{ ((item.key && detail[item.key]) || 0) / 100 }}
      </template>

      <template v-else-if="item.type === 'areas'">
        {{ codeToText(detail[item.key]) }}
      </template>

      <span
        v-else
        class="breakText"
      >
        {{ item.key && detail[item.key] }}
      </span>
      <template v-if="item.unit">
        {{ item.unit }}
      </template>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
import Star from '@/components/base/c-star'

import { energyType, projectStatus, EnumMap, projectType } from '@/utils/typeEnum'
import { codeToText } from '@/utils/cascader-address-options'

const detailItems = [
  {
    key: 'projectName',
    label: '项目名称'
  },
  {
    key: 'companyName',
    label: '所属单位'
  },
  {
    key: 'projectCode',
    label: '项目编号'
  },
  {
    key: 'applicationDate',
    label: '申报日期',
    type: 'date'
  },
  {
    key: 'energyType',
    label: '能源类型',
    type: 'map',
    mapSource: energyType
  },
  {
    key: 'projectArea',
    label: '项目地区',
    type: 'areas'
  },
  {
    key: 'status',
    label: '当前状态',
    type: 'map',
    mapSource: projectStatus
  },
  {
    key: ['periodTimeStart', 'periodTimeEnd'],
    label: '项目周期',
    type: 'dateRange'
  },
  {
    key: 'contact',
    label: '联系人'
  },
  {
    key: 'contactWay',
    label: '联系方式'
  },
  {
    key: 'authenticationLevel',
    label: '认证等级',
    type: 'rate'
  },
  {
    key: 'certificationAuthority',
    label: '认证机构'
  },
  {
    key: 'outputTotal',
    label: '累计凭证产出',
    type: 'number',
    unit: '张'
  },
  {
    key: 'checkCount',
    label: '累计注销',
    type: 'number',
    unit: '张'
  },
  {
    key: 'methodology',
    label: '方法学'
  },
  {
    key: 'projectType',
    label: '项目类型',
    type: 'map',
    mapSource: projectType
  }
]

export default {
  components: {
    Star
  },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
	itemsIn:{
		type: Array,
		default: () => detailItems
	}
  },
  data() {
    return {
      energyType,
      projectStatus,
      EnumMap,
      codeToText,
      detailItems
    }
  }
}
</script>
