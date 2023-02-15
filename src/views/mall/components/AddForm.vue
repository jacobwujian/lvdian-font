<template>
  <a-form-model
    ref="editForm"
    :model="form"
    :rules="rules"
    v-bind="formItemLayout"
  >
    <template v-for="(item, index) in formItems">
      <a-form-model-item
        v-if="hideType(item)"
        :key="index"
        :label="item.label"
        :prop="item.params"
      >
        <a-input
          v-if="item.type === 'input'"
          v-model.trim="form[item.params]"
          :max-length="item.max || -1"
          :disabled="item.disabled || false"
          :placeholder="`请输入${item.label}`"
        />

        <a-input-number
          v-if="item.type === 'inputNumber'"
          v-model.trim="form[item.params]"
          :formatter="formatter"
          :min="0"
          :max="9999999999"
        />
        <span
          v-if="item.type === 'inputNumber'"
        >
          绿电积分/个
        </span>

        <CUpload
          v-if="item.type === 'upload'"
          ref="cUpload"
          :file-id="item.params && form[item.params]"
          @on-success="onUploadSuccess"
        />

        <!-- <a-input
        v-if="item.type === 'textarea'"
        v-model.trim="form[item.params]"
        :type="item.type"
        :disabled="item.disabled || false"
        :autosize="{ minRows: 3, maxRows: 6}"
        :placeholder="`请输入${item.label}`"
      /> -->
        <WangEdit
          v-if="item.type === 'textarea'"
          v-model.trim="form[item.params]"
          :disabled="item.disabled || false"
        />
        <a-select
          v-if="item.type === 'select'"
          v-model="form[item.params]"
          :placeholder="`请选择${item.label}`"
        >
          <a-select-option
            v-for="cu in item.data"
            :key="cu.value"
            :value="cu.value"
          >
            {{ cu.name }}
          </a-select-option>
        </a-select>
        <div
          v-if="item.type === 'customUse'"
        >
          <a-radio-group v-model="form.customUse">
            <a-radio
              value="1"
              class="wailianzu"
            >
              <a-form-model-item
                label="外链"
                class="wailian"
              >
                <a-input
                  v-model="form.externalLink"
                  :disabled="form.customUse == 2"
                  placeholder="请输入外链地址, 只支持H5"
                />
              </a-form-model-item>
            </a-radio>
            <a-radio
              value="2"
              class="wailianzu"
            >
              <a-form-model-item
                label="弹窗提示"
                class="wailian"
              >
                <a-input
                  v-model="form.prompt"
                  type="textarea"
                  :disabled="form.customUse == 1"
                  placeholder="请输入弹窗提示内容"
                />
              </a-form-model-item>
            </a-radio>
          </a-radio-group>
        </div>
      </a-form-model-item>
    </template>

    <a-divider />

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            @click="submitForm"
          >
            添加
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
        voucherName: '',
        imgUrlName: '',
        voucherRequiredPoints: '',
        jointVenture: '',
        exchangeNotes: '',
        externalLink: '',
        commodityType: '',
        customUse: '',
        prompt: ''
      },
      list: [],
      loading: false,
      imageUrl: '',
      inputNumber:'',
      rules: {
        voucherName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { pattern: regex, message: '最多16个字符', trigger: 'blur'}
        ],
        imgUrlName: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        voucherRequiredPoints: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        jointVenture: [
          { required: true, message: '请输入合作企业', trigger: 'blur' },
          { pattern: regex, message: '最多16个字符', trigger: 'blur'}
        ],
        exchangeNotes: [
          { required: true, message: '请输入兑换须知', trigger: 'blur' }
        ],
        commodityType: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          type: 'select',
          label: '商品类型',
          params: 'commodityType',
          data: [
            {
              value: 0,
              name: '兑换码'
            },
            {
              value: 1,
              name: '链接领取'
            },
            {
              value: 2,
              name: '核销码'
            }
          ]
        },
        {
          type: 'input',
          label: '优惠券名称',
          params: 'voucherName'
        },
        {
          type: 'upload',
          label: '优惠券图片',
          params: 'imgUrlName'
        },
        {
          type: 'inputNumber',
          label: '设置单价',
          params: 'voucherRequiredPoints'
        },
        {
          type: 'input',
          label: '合作企业',
          params: 'jointVenture'
        },
        {
          type: 'customUse',
          label: '使用方式',
          params: 'customUse',
          showType: [
            {
              params: 'commodityType',
              val: 0
            }
          ]
        },
        {
          type: 'textarea',
          label: '兑换须知',
          params: 'exchangeNotes'
        }
      ]
    }
  },
  watch: {
    'form.commodityType'(val) {
      if(val == 1) {
        this.form.prompt = ''
        this.form.externalLink = ''
      }
    },
    'form.customUse'(val) {
      if(val == '1') {
        this.form.prompt = ''
      }else{
        this.form.externalLink = ''
      }
    }
  },
  created() {
    this.list = [
      {
        id: this.detail.projectId,
        projectName: this.detail.projectName
      }
    ]
    this.form.customUse = this.detail.prompt ? '2' : '1'
    this.initForm()
  },
  methods: {
    // 根据值判断隐藏
    hideType(item) {
      if(Array.isArray(item.showType)) {
        return item.showType.some(elem => this.form[elem.params] === elem.val)
      }else{
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
      this.$refs.editForm.validate((valid) => {
        if (!valid) return false

        this.loading = true

        this.$api.mall
          .voucherAdd({ ...this.form })
          .then((res) => {
            this.$message.success('添加成功')
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
      this.form.imgUrlName = data
      this.$refs.editForm.validateField('imgUrlName')
    },
    formatter(value) {
      let exportValue = this.inputNumber
      let pattern = new RegExp(/^\d+$/).test(value)
      if(pattern) {
        this.inputNumber = value
        return value
      }else {
        if(value === '') {
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
/deep/.wailianzu{
  >span{
    display: inline-block;
  }
  >.ant-radio{
    transform: translateY(8px);
  }
  .wailian{
    display: inline-block;
    .ant-col-6{
      width: 30%;
      text-align: left;
    }
    .ant-form-item-control-wrapper{
      width: 240px;
      margin-left: 30%;
    }
  }
}
</style>