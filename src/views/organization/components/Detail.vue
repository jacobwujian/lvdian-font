<template>
  <div class="org-detail">
    <template v-for="(item, index) in detailItems">
      <a-descriptions
        :key="index"
        :title="item.title"
      >
        <a-descriptions-item
          v-for="(child, i) in item.children"
          :key="`${index}-${i}`"
          :label="child.label"
        >
          <template v-if="child.dataSource && detail[child.key] !== null">
            {{ EnumMap(child.dataSource, +detail[child.key]) }}
          </template>
          <template v-else-if="child.type === 'areas'">
            {{ codeToText(detail[child.key]) }}
          </template>
          <template v-else-if="child.type === 'precisionNum'">
            {{ (detail[child.key] || 0) / 100 }}
          </template>
          <span
            v-else
            class="breakText"
          >
            {{ detail[child.key] }}

            <template v-if="detail[child.key] && child.unit">
              {{ child.unit }}
            </template>

            <a-button
              v-if="child.key === 'businessLicense' && detail[child.key]"
              type="link"
              @click="download(detail[child.key])"
            >
              下载
            </a-button>
          </span>
        </a-descriptions-item>
      </a-descriptions>

      <a-divider
        v-if="index < detailItems.length - 1"
        :key="`d-${index}`"
      />
    </template>

    <a-divider />

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button
            type="primary"
            @click="$emit('close')"
          >
            返回
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { orgTypes, reviewType, EnumMap } from '@/utils/typeEnum'
import { codeToText } from '@/utils/cascader-address-options'
import Vue from 'vue'
import {baseURL, accessToken} from '@/utils/constant'

const detailItems = [
  {
    title: '用能信息',
    children: [
      {
        key: 'annual',
        label: '配额用电量',
        unit: 'MW·h',
        type: 'precisionNum'
      }, {
        key: 'verificationCount',
        label: '已核销用电量',
        unit: 'MW·h',
        type: 'precisionNum'
      }, {
        key: 'remainderAnnual',
        label: '剩余可核销用电量',
        unit: 'MW·h',
        type: 'precisionNum'
      }
    ]
  }, {
    title: '基础信息',
    children: [
      {
        key: 'companyName',
        label: '公司名称'
      }, {
        key: 'socialCreditCode',
        label: '统一社会信用证代码'
      }, {
        key: 'companyArea',
        label: '公司地区',
        type: 'areas'
      }, {
        key: 'address',
        label: '公司地址'
      }, {
        key: 'legalPerson',
        label: '法人姓名'
      }, {
        key: 'legalPersonIdCard',
        label: '法人身份证号'
      }, {
        key: 'businessLicense',
        label: '营业执照'
      }, {
        key: 'contact',
        label: '联系人姓名'
      }, {
        key: 'phone',
        label: '联系方式'
      }, {
        key: 'mail',
        label: '邮箱'
      }, {
        key: 'type',
        label: '机构类型',
        dataSource: orgTypes
      }
    ]
  }, {
    title: '区块链身份信息',
    children: [
      {
        key: 'chainId',
        label: '账户ID'
      }, {
        key: 'publicKeyAddress',
        label: '公钥地址'
      }, {
        key: 'chainAddress',
        label: '身份合约地址'
      }
    ]
  }, {
    title: '审核信息',
    children: [
      {
        key: 'approveResult',
        label: '审核结果',
        dataSource: reviewType
      }, {
        key: 'approveRemark',
        label: '审核备注'
      }
    ]
  }
]

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orgTypes,
      reviewType,
      EnumMap,
      codeToText,
      detailItems,
      detail: {}
    }
  },
  created() {
    if (this.id) this.getDetail()
  },
  methods: {
    getDetail() {
      this.$api.company.baseInfoCompany({
        id: this.id
      }).then(res => {
        if (res && Object.keys(res).length) {
          this.detail = res
        }
      })
    },
    download(file) {
      if (file) {
        const endPre = file.substring(file.indexOf('.'), file.length)
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

        oReq.onload = function() {
          var file1 = new Blob([oReq.response], {
            type: type
          })

          if (navigator.msSaveBlob) {
            return navigator.msSaveBlob(file1, file)
          }

          window.open(window.URL.createObjectURL(file1))

        }
        oReq.send(JSON.stringify({
          urls: [file]
        }))
      }
    }
  }
}
</script>
