<template>
  <div class="org-form">
    <p
      v-if="formType === 'review'"
      class="text-center fs-16"
    >
      审核类型（{{ checkTypeInfo }}）
    </p>
    <a-form-model
      ref="editForm"
      :model="form"
      :rules="rules"
      v-bind="formItemLayout"
    >
      <a-row :gutter="16">
        <a-col
          v-for="(item, index) in formItems"
          :key="index"
          :span="8"
        >
          <a-form-model-item
            :label="item.label"
            :prop="item.params"
            :label-col="item.labelCol || formItemLayout.labelCol"
            :wrapper-col="item.wrapperCol || formItemLayout.wrapperCol"
          >
            <a-input
              v-if="item.type === 'input'"
              v-model.trim="form[item.params]"
              :max-length="item.max || -1"
              :placeholder="`请输入${item.label}`"
              :disabled="notEditable||item.params === 'socialCreditCode'"
            />

            <a-input-number
              v-if="item.type === 'inputNumber'"
              v-model="form[item.params]"
              :precision="0"
              :placeholder="`请输入${item.label}`"
              style="width: 100%"
            />

            <a-select
              v-if="item.type === 'select'"
              v-model="form[item.params]"
              :placeholder="`请选择${item.label}`"
              :disabled="notEditable||item.params === 'socialCreditCode'"
            >
              <a-select-option
                v-for="(op, i) in item.data"
                :key="`${i}-${op.value}`"
                :value="op.value"
              >
                {{ op.name }}
              </a-select-option>
            </a-select>

            <a-radio-group
              v-if="item.type === 'radio'"
              v-model="form[item.params]"
            >
              <a-radio
                v-for="(op, i) in item.data"
                :key="`${i}-${op.value}`"
                :value="op.value"
              >
                {{ op.name }}
              </a-radio>
            </a-radio-group>

            <div v-if="item.type === 'upload'">
              <CUpload
                ref="cUpload"
                :disabled="notEditable"
                :file-id="item.params && form[item.params]"
                @on-success="onUploadSuccess"
              />
            </div>

            <div
              v-if="item.type === 'info'"
              class="empty-item"
            >
              {{ item.params && form[item.params] }}
            </div>

            <a-cascader
              v-if="item.type === 'areaPicker'"
              v-model="form[item.params]"
              :options="areaOptions"
              :placeholder="`请选择${item.label}`"
              :disabled="notEditable||item.params === 'socialCreditCode'"
            />
          </a-form-model-item>
        </a-col>
        <a-col
          v-if="isShowApproveRemark"
          :span="8"
        >
          <a-form-model-item
            label="审核备注"
            prop="approveRemark"
          >
            <a-textarea
              v-model.trim="form.approveRemark"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              placeholder="请输入审核备注"
              :disabled="formType === 'edit'"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

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
              提交
            </a-button>
            <a-button
              type="primary"
              @click="resetForm"
            >
              重置
            </a-button>
            <a-button
              @click="$emit('close')"
            >
              取消
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import CUpload from '@/components/base/c-upload'
import { validateZhEnNum, validateSocialCode, validateIdCard, validatePhone, validateEmail } from '@/utils/validate'
import { orgTypes, reviewType } from '@/utils/typeEnum'
import { ZJoptions } from '@/utils/cascader-address-options'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const baseFormType = [
  {
    type: 'input',
    label: '公司名称',
    params: 'companyName',
    max: 60
  }, {
    type: 'input',
    label: '统一社会信用代码',
    params: 'socialCreditCode',
    max: 18,
    labelCol: {span: 9},
    wrapperCol: {span: 15}
  }, {
    type: 'areaPicker',
    label: '公司地区',
    params: 'companyArea'
  }, {
    type: 'input',
    label: '公司地址',
    params: 'address',
    max: 80
  }, {
    type: 'input',
    label: '法人姓名',
    params: 'legalPerson',
    max: 20
  }, {
    type: 'input',
    label: '法人身份证号',
    params: 'legalPersonIdCard',
    max: 18,
    labelCol: {span: 9},
    wrapperCol: {span: 15}
  }, {
    type: 'upload',
    label: '营业执照',
    params: 'businessLicense'
  }, {
    type: 'input',
    label: '联系人姓名',
    params: 'contact',
    max: 20
  }, {
    type: 'input',
    label: '联系方式',
    params: 'phone',
    max: 11,
    labelCol: {span: 9},
    wrapperCol: {span: 15}
  }, {
    type: 'input',
    label: '邮箱',
    params: 'mail',
    max: 20
  }
]

const reviewFormType = [
  {
    type: 'inputNumber',
    label: '本年度配额(MW·h)',
    params: 'annual',
    labelCol: {span: 9},
    wrapperCol: {span: 15}
  }, {
    type: 'select',
    label: '机构类型',
    params: 'type',
    data: orgTypes
  }, {
    type: 'info',
    label: '',
    params: ''
  }, {
    type: 'radio',
    label: '审核结果',
    params: 'approveResult',
    data: reviewType
  }
]

const editFormType = [
  {
    type: 'inputNumber',
    label: '本年度配额(MW·h)',
    params: 'annual',
    labelCol: {span: 9},
    wrapperCol: {span: 15}
  }
]

export default {
  components: {
    CUpload
  },
  props: {
    formType: {
      type: String,
      default: 'edit'
    },
    id: {
      type: String,
      default: ''
    },
    orgTypeVal: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      areaOptions: ZJoptions,
      orgTypes,
      formItemLayout,
      form: {
        companyName: '',
        socialCreditCode: '',
        companyArea: [],
        address: '',
        legalPerson: '',
        legalPersonIdCard: '',
        businessLicense: '',
        contact: '',
        phone: '',
        mail: '',
        type: undefined,
        approveResult: '',
        approveRemark: '',
        annual: undefined
      },
      approveType: undefined, // 审核类型 0-项目审核 1-核销审核 2-机构审核 3-机构修改审核
      detail: {},
      loading: false
    }
  },
  computed: {
    checkTypeInfo() {
      let info = ''
      switch (this.approveType) {
        case 0:
          info = '项目审核'
          break
        case 1:
          info = '核销审核'
          break
        case 2:
          info = '机构审核'
          break
        case 3:
          info = '机构修改审核'
          break
        default:
          info = '注册审核'
          break
      }

      return info
    },
    formItems() {
      if (this.formType === 'review') return [...baseFormType, ...reviewFormType]
      else return [...baseFormType, ...editFormType]
    },
    rules() {
      return this.formType === 'review' ? this.reviewRules : this.baseRules
    },
    baseRules() {
      return {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        socialCreditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { validator: validateSocialCode, trigger: 'blur'}
        ],
        companyArea: [
          { type: 'array', required: true, message: '请选择公司地区', trigger: 'change' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' },
          { validator: validateZhEnNum, trigger: 'blur' }
        ],
        legalPersonIdCard: [
          { required: true, message: '请输入法人身份证号', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur'}
        ],
        businessLicense: [
          { required: true, message: '请上传营业执照', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: validateZhEnNum, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur'}
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur'}
        ]
      }
    },
    reviewRules() {
      return {
        approveResult: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      }
    },
    notEditable() {
      return this.formType === 'review'
    },
    // 修改 或 审核 时显示
    isShowApproveResult() {
      return this.formType === 'review' || this.formType === 'edit'
    },
    isShowApproveRemark() {
      return this.isShowApproveResult && this.form.approveResult === 0
    }
  },
  created() {
    if (this.id) this.getDetail()
  },
  methods: {
    // 获取机构详情
    getDetail() {
      this.loading = true

      this.$api.company.baseInfoCompany({
        id: this.id
      }).then(res => {
        if (res && Object.keys(res).length) {
          if (this.formType === 'review' && res.approveType === 3) {
            // 机构修改审核 时详情使用 approveParam
            this.approveType = res.approveType
            this.detail = {
              type: this.orgTypeVal,
              ...JSON.parse(res.approveParam)
            }
          } else {
            this.detail = res
          }
          this.initForm()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initForm() {
      for (const key in this.form) {
        if (key === 'type') {
          this.form.type = +this.detail.type
          continue
        }

        if (key === 'companyArea') {
          if (this.detail[key]) this.form[key] = this.detail[key].split(',')
          continue
        }

        // 审核时无需填充审核信息
        if ((key === 'approveResult' || key === 'approveRemark') && this.formType === 'review') {
          continue
        }

        // 本年度配额单位为分
        if (key === 'annual') {
          let annual = this.detail[key]
          if (annual || !isNaN(annual)) {
            annual = annual / 100
          }
          this.form[key] = annual
          continue
        }

        if (key in this.detail) {
          this.form[key] = this.detail[key]
        }
      }
    },
    // 格式化form参数
    getParams() {
      let params = {}
      for (const key in this.form) {
        if (
          (key === 'approveResult' || key === 'approveRemark')
          && this.formType !== 'review'
        ) continue

        if (key === 'companyArea') {
          params[key] = this.form[key].join(',')
          continue
        }

        if (key === 'annual') {
          let annual = this.form[key]
          if (annual || !isNaN(annual)) {
            annual = annual * 100
          }

          params[key] = annual
          continue
        }

        params[key] = this.form[key]
      }

      return params
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false

        if (this.formType === 'review') this.review()
        else this.edit()
      })
    },
    // 修改
    edit() {
      const params = this.getParams()

      this.loading = true

      this.$api.company.updateCompany({
        id: this.id,
        ...params
      }).then(res => {
        this.$message.success('修改成功')
        this.$emit('close', true)
      }).finally(() => {
        this.loading = false
      })
    },
    // 审核
    review() {
      this.loading = true

      let apiName = 'checkCompany'
      if (this.approveType === 3) {
        apiName = 'auditUpdateCompany'
      }

      this.$api.company[apiName]({
        id: this.id,
        annual: this.form.annual * 100,
        approveResult: this.form.approveResult,
        approveRemark: this.form.approveRemark
      }).then(res => {
        this.$message.success('审核成功')
        this.$emit('close', true)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 上传成功
     * @param {Object} data 上传结果
     */
    onUploadSuccess(data) {
      this.form.businessLicense = data
      this.$refs.editForm.validateField('businessLicense')
    },
    resetForm() {
      if (this.formType === 'review') {
        this.form.annual = undefined
        this.form.approveResult = undefined
        this.form.approveRemark = ''
      } else {
        this.$refs.editForm.resetFields()
        this.$refs.cUpload && this.$refs.cUpload[0].reset()

        this.$nextTick(() => {
          if (this.formType === 'edit') {
            this.initForm()
            this.$refs.editForm.validateField('businessLicense')
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.org-form {
  .empty-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>
