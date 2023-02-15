<template>
  <a-form-model ref="editForm" :model="form" :rules="rules" v-bind="formItemLayout">
    <template v-for="(item, index) in formItems">
      <a-form-model-item v-if="hideType(item)" :key="index" :label="item.label" :prop="item.params">
        <a-input v-if="item.type === 'input'" v-model.trim="form[item.params]" :max-length="item.max || -1" :disabled="item.disabled || false" :placeholder="`请输入${item.label}`" />

        <a-input-number v-if="item.type === 'inputNumber'" v-model.trim="form[item.params]" :formatter="formatter" :min="0" :max="9999999999" />
        <span v-if="item.type === 'inputNumber'">
          绿电积分/个
        </span>

        <CUpload v-if="item.type === 'upload'" ref="cUpload" :file-id="item.params && form[item.params]" @on-success="onUploadSuccess" />
        <a-button v-if="item.type === 'upload'" type="link" @click="download(detail.informationImgUrl)">
          查看历史图片
        </a-button>

        <WangEdit v-if="item.type === 'textarea'" v-model.trim="form[item.params]" :disabled="item.disabled || false" />

        <a-select v-if="item.type === 'select'" v-model="form[item.params]" :placeholder="`请选择${item.label}`">
          <a-select-option v-for="cu in item.data" :key="cu.value" :value="cu.value">
            {{ cu.name }}
          </a-select-option>
        </a-select>

        <a-radio-group v-if="item.type === 'radio'" v-model="form[item.params]" @change="infoRadioTypeChange">
          <a-radio :value="1">
            外部链接
          </a-radio>
          <a-radio :value="2">
            内容编辑
          </a-radio>
        </a-radio-group>

        <a-form-model-item class="wailian">
          <a-input v-if="item.type === 'wailian'" v-model="form.externalLink" placeholder="请输入外链地址, 只支持H5" />
        </a-form-model-item>
      </a-form-model-item>
    </template>

    <a-divider />

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button type="primary" html-type="submit" :loading="loading" @click="submitForm">
            修改
          </a-button>
          <a-button @click="$emit('close')">
            取消
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import CUpload from '@/components/base/c-upload'
import WangEdit from './WangEdit'
import { informationType } from '@/utils/typeEnum'
import { baseURL, accessToken } from '@/utils/constant'
import Vue from 'vue'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  components: {
    CUpload,
    WangEdit
  },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const regex = new RegExp(`^[a-zA-Z0-9(\\u4e00-\\u9fa5)]{1,16}$`)
    return {
      formItemLayout,
      form: {
        id: '',
        informationTitle: '',
        informationImgUrl: '',
        informationContent: '',
        externalLink: '',
        informationType: '',
        // 资讯引入方式 1 外链 2编辑内容
        linkFlag: ''
      },
      list: [],
      loading: false,
      imageUrl: '',
      rules: {
        informationTitle: [
          { required: true, message: '请输入资讯名称', trigger: 'blur' }
          // { pattern: regex, message: '最多16个字符', trigger: 'blur' }
        ],
        informationImgUrl: [{ required: false, message: '请上传图片', trigger: 'blur' }],
        informationType: [{ required: true, message: '请选择资讯类型', trigger: 'blur' }],
        informationContent: [{ required: true, message: '请输入资讯内容', trigger: 'blur' }],
        externalLink: [{ required: true, message: '请输入外链地址, 只支持H5', trigger: 'blur' }],
        linkFlag: [{ required: true, message: '请选择资讯引入方式', trigger: 'blur' }]
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          type: 'select',
          label: '资讯类型',
          params: 'informationType',
          data: informationType
        },
        {
          type: 'input',
          label: '资讯名称',
          params: 'informationTitle'
        },
        {
          type: 'upload',
          label: '资讯图片',
          params: 'informationImgUrl'
        },
        {
          type: 'radio',
          label: '选择方式',
          params: 'linkFlag'
          // showType: [
          //   {
          //     params: 'informationType',
          //     val: 1
          //   },
          //   {
          //     params: 'informationType',
          //     val: 2
          //   }
          // ]
        },

        {
          type: 'wailian',
          label: '外链',
          params: 'externalLink',
          showType: [
            {
              params: 'linkFlag',
              val: 1
            }
          ]
        },
        {
          type: 'textarea',
          label: '资讯详情',
          params: 'informationContent',
          showType: [
            // 当选择 内容编辑时展示
            {
              params: 'linkFlag',
              val: 2
            }
            // 当 选择公益活动时展示
            // {
            //   params: 'informationType',
            //   val: 3
            // }
          ]
        }
      ]
    }
  },
  watch: {
    // 监听资讯类型
    'form.informationType'(val) {
      // 当 资讯类型是公益活动时
      if (val == 3) {
        // this.form.linkFlag = ''
        this.rules.informationImgUrl[0].required = true
      } else if (val == 1) {
        // this.form.linkFlag = 1
        this.rules.informationImgUrl[0].required = false
      } else if (val == 2) {
        // 活动资讯时
        // this.form.linkFlag = 1
        this.rules.informationImgUrl[0].required = true
      }
    }
    // 监听资讯引入方式
    // 'form.linkFlag'(val) {
    //   // 当是活动资讯时
    //   if (this.form.informationType == 2) {
    //     if (this.form.linkFlag == 2) {
    //       this.rules.informationImgUrl[0].required = true
    //     } else {
    //       this.rules.informationImgUrl[0].required = false
    //     }
    //   }
    // }
  },
  created() {
    this.list = [
      {
        id: this.detail.projectId,
        projectName: this.detail.projectName
      }
    ]
    this.initForm()
  },
  methods: {
    // 资讯内容引入方式切换
    infoRadioTypeChange(e) {
      if (e.target.value == 1) {
        // 清空编辑
        // this.form.informationContent = ''
      } else if (e.target.value == 2) {
        // 清空外链
        // this.form.externalLink = ''
      }
    },
    download(file) {
      if (file) {
        const endPre = file.substring(file.indexOf('.'), file.length)
        let type = 'application/pdf'
        if (endPre.includes('.jpg')) {
          type = 'image/jpg'
        } else if (endPre.includes('.jpeg')) {
          type = 'image/jpeg'
        } else if (endPre.includes('.png')) {
          type = 'image/png'
        } else {
          type = 'application/pdf'
        }
        var oReq = new XMLHttpRequest()
        oReq.open('POST', baseURL + '/api/common/oss/getOssImageUrls', true)
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
        oReq.send(
          JSON.stringify({
            urls: [file]
          })
        )
      }
    },

    // 根据值判断隐藏
    hideType(item) {
      if (Array.isArray(item.showType)) {
        return item.showType.some(elem => this.form[elem.params] === elem.val)
      } else {
        return true
      }
    },
    /* 初始化表单 */
    initForm() {
      for (const key in this.form) {
        if (key in this.detail) {
          this.form[key] = this.detail[key]
        }
      }
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false

        this.loading = true

        this.$api.information
          .modifyInformation({ ...this.form })
          .then(res => {
            this.$message.success('修改成功')
            this.$emit('close', true)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    /**
     * 上传成功
     * @param {Object} data 上传结果
     */
    onUploadSuccess(data) {
      this.form.informationImgUrl = data
      this.$refs.editForm.validateField('informationImgUrl')
    },
    formatter(value) {
      let exportValue = this.inputNumber
      let pattern = new RegExp(/^\d+$/).test(value)
      if (pattern) {
        this.inputNumber = value
        return value
      } else {
        if (value === '') {
          this.inputNumber = ''
          return ''
        }
        return exportValue
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.wailianzu {
  > span {
    display: inline-block;
  }
  > .ant-radio {
    transform: translateY(8px);
  }
}
.wailian {
  display: inline-block;
  .ant-col-6 {
    width: 30%;
    text-align: left;
  }
  .ant-form-item-control-wrapper {
    width: 240px;
    margin-left: 30%;
  }
}
</style>
