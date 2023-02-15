<template>
  <div class="org-form">
    <p v-if="formType === 'review'" class="text-center fs-16">审核类型（{{ checkTypeInfo }}）</p>
    <a-form-model ref="editForm" :model="form" :rules="rules" v-bind="formItemLayout">
      <a-row :gutter="16">
        <a-col v-for="(item, index) in baseFormType" :key="index" :span="8">
          <a-form-model-item :label="item.label" :prop="item.params" :label-col="item.labelCol || formItemLayout.labelCol" :wrapper-col="item.wrapperCol || formItemLayout.wrapperCol">
            <a-input v-if="item.type === 'input'" v-model.trim="form[item.params]" :max-length="item.max || -1" :placeholder="`请输入${item.label}`" allow-clear :disabled="notEditable || item.disabled" />

            <a-textarea v-if="item.type === 'textarea'" v-model.trim="form[item.params]" :auto-size="{ minRows: 3, maxRows: 5 }" :placeholder="`请输入${item.label}`" :disabled="notEditable" />

            <a-select v-if="item.type === 'select'" v-model="form[item.params]" :placeholder="`请选择${item.label}`" allow-clear :disabled="notEditable">
              <a-select-option v-for="(op, i) in item.data" :key="`${i}-${op.value}`" :value="op.value">
                {{ op.name }}
              </a-select-option>
            </a-select>

            <div v-if="item.type === 'upload'">
              <CUpload ref="cUpload" :disabled="notEditable" :file-id="item.params && form[item.params]" @on-success="onUploadSuccess" />
            </div>

            <a-rate v-if="item.type === 'rate'" v-model="form[item.params]" :disabled="notEditable" />

            <a-date-picker v-if="item.type === 'datePicker'" v-model="form[item.params]" type="date" :placeholder="`请选择${item.label}`" :disabled="notEditable" style="width: 100%;" />

            <a-range-picker v-if="item.type === 'dateRangePicker'" v-model="form[item.params]" :disabled="notEditable" />

            <a-cascader v-if="item.type === 'areaPicker'" v-model="form[item.params]" :options="areaOptions" :placeholder="`请选择${item.label}`" :disabled="notEditable" />
          </a-form-model-item>
        </a-col>
        <a-col v-if="isShowApproveResult" :span="8">
          <a-form-model-item label="审核结果" prop="approveResult">
            <a-radio-group v-model="form.approveResult" :disabled="formType === 'edit'">
              <a-radio v-for="(op, i) in reviewType" :key="`${i}-${op.value}`" :value="op.value">
                {{ op.name }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>

        <a-col v-if="isShowApproveRemark" :span="8">
          <a-form-model-item label="审核备注" prop="approveRemark">
            <a-textarea v-model.trim="form.approveRemark" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请输入审核备注" :disabled="formType === 'edit'" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-divider />

      <a-row class="btns-row">
        <a-col class="text-center">
          <a-space size="large">
            <a-button type="primary" html-type="submit" :loading="loading" @click="submitForm">
              提交
            </a-button>
            <a-button type="primary" @click="resetForm">
              重置
            </a-button>
            <a-button @click="$emit('close')">
              取消
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CUpload from '@/components/base/c-upload'
import { validateZhEnNum, validatePhone, validateSocialCode } from '@/utils/validate'
import { ZJoptions } from '@/utils/cascader-address-options'
import { energyType, reviewType, projectType } from '@/utils/typeEnum'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

export default {
  components: {
    CUpload
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    formType: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      formItemLayout,
      areaOptions: ZJoptions,
      reviewType,
      form: {
        projectName: '',
        companyName: '',
        socialCreditCode: '',
        applicationDate: undefined,
        certificationAuthority: '',
        energyType: undefined,
        projectArea: [],
        period: [],
        methodology: '',
        contact: '',
        contactWay: '',
        authenticationLevel: 0,
        imgUrl: '',
        projectDesc: '本项目当前仅支持线下交易；',
        approveResult: undefined,
        approveRemark: '',
        projectType: '' //项目类型
      },
      loading: false,
      auditType: undefined, // 审核类型 others-项目审核 4-项目修改审核
      detail: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    }),
    checkTypeInfo() {
      if (this.auditType === 4) return '项目修改审核'
      return '项目审核'
    },
    baseFormType() {
      return [
        {
          type: 'input',
          label: '项目名称',
          params: 'projectName',
          max: 80
        },
        {
          type: 'input',
          label: '机构名称',
          params: 'companyName',
          max: 60,
          disabled: this.formType === 'edit' || this.formType === 'add'
        },
        {
          type: 'input',
          label: '统一社会信用代码',
          params: 'socialCreditCode',
          max: 18,
          disabled: this.formType === 'edit' || this.formType === 'add',
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        },
        {
          type: 'datePicker',
          label: '申报日期',
          params: 'applicationDate'
        },
        {
          type: 'input',
          label: '认证机构',
          params: 'certificationAuthority'
        },
        {
          type: 'select',
          label: '能源类型',
          params: 'energyType',
          data: energyType
        },
        {
          type: 'areaPicker',
          label: '项目地区',
          params: 'projectArea'
        },
        {
          type: 'dateRangePicker',
          label: '项目周期',
          params: 'period'
        },
        {
          type: 'input',
          label: '方法学',
          params: 'methodology'
        },
        {
          type: 'input',
          label: '联系人',
          params: 'contact',
          max: 20
        },
        {
          type: 'input',
          label: '联系方式',
          params: 'contactWay',
          max: 11
        },
        {
          type: 'rate',
          label: '认证等级',
          params: 'authenticationLevel'
        },
        {
          type: 'upload',
          label: '项目图片',
          params: 'imgUrl'
        },
        {
          type: 'textarea',
          label: '项目介绍',
          params: 'projectDesc'
        },
        {
          type: 'select',
          label: '项目类型',
          params: 'projectType',
          data: projectType
        }
      ]
    },
    rules() {
      return this.formType === 'review' ? this.reviewRules : this.baseRules
    },
    baseRules() {
      return {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { validator: validateZhEnNum, trigger: 'blur' }
        ],
        companyName: [{ required: this.formType === 'add', message: '请输入机构名称', trigger: 'blur' }],
        socialCreditCode: [
          { required: this.formType === 'add', message: '请输入统一社会信用代码', trigger: 'blur' },
          { validator: validateSocialCode, trigger: 'blur' }
        ],
        energyType: [{ required: true, message: '请选择能源类型', trigger: 'change' }],
        projectArea: [{ type: 'array', required: true, message: '请选择项目地区', trigger: 'change' }],
        contact: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: validateZhEnNum, trigger: 'blur' }
        ],
        contactWay: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        authenticationLevel: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择认证等级'))
                return false
              }
              callback()
            },
            required: true,
            trigger: 'change'
          }
        ],
        imgUrl: [{ required: true, message: '请上传项目图片', trigger: 'change' }],
        projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }]
      }
    },
    reviewRules() {
      return {
        approveResult: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
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
  watch: {
    userInfo: {
      handler(newVal) {
        if (this.formType === 'add') {
          // 主管部门无需填充机构信息
          if (newVal.id !== 1) {
            this.form.companyName = newVal.companyName
            this.form.socialCreditCode = newVal.socialCreditCode
          }

          this.form.contact = newVal.contact
          this.form.contactWay = newVal.contactWay
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.id) this.getDetail()
  },
  methods: {
    // 获取项目详情
    getDetail() {
      this.loading = true

      this.$api.project
        .projectDetail({
          projectId: this.id
        })
        .then(res => {
          this.loading = false
          if (res && Object.keys(res).length) {
            if (this.formType === 'review' && res.auditType === 4) {
              // 项目修改审核 时详情使用 auditParam
              this.auditType = res.auditType
              this.detail = {
                ...JSON.parse(res.auditParam),
                companyName: res.companyName,
                socialCreditCode: res.socialCreditCode
              }
            } else {
              this.detail = res
            }
            this.initForm()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 初始化表单
    initForm() {
      for (const key in this.form) {
        if (key in this.detail) {
          const val = this.detail[key]
          if (key === 'applicationDate') {
            if (val) this.form[key] = this.$dayjs(val)
            continue
          }

          if (key === 'authenticationLevel') {
            this.form[key] = +val
            continue
          }

          if (key === 'projectArea') {
            if (val) this.form[key] = val.split(',')
            continue
          }

          // 审核时无需填充审核信息
          if ((key === 'approveResult' || key === 'approveRemark') && this.formType === 'review') {
            continue
          }

          this.form[key] = val
          continue
        }

        if (key === 'period' && this.detail.periodTimeStart && this.detail.periodTimeEnd) {
          const period = [this.$dayjs(this.detail.periodTimeStart), this.$dayjs(this.detail.periodTimeEnd)]
          this.form.period.push(...period)
        }
      }
    },
    // 格式化form参数
    getParams() {
      let params = {}
      for (const key in this.form) {
        const val = this.form[key]
        // 机构名称/代码 不可修改
        if ((key === 'companyName' || key === 'socialCreditCode') && this.formType === 'edit') {
          continue
        }

        if (key === 'applicationDate') {
          if (val) {
            params[key] = this.$dayjs(val).format('YYYY-MM-DD HH:mm:ss')
          }
          continue
        }

        if (key === 'period') {
          if (val.length) {
            params[`${key}TimeStart`] = val[0] && this.$dayjs(val[0]).format('YYYY-MM-DD 00:00:01')
            params[`${key}TimeEnd`] = val[1] && this.$dayjs(val[1]).format('YYYY-MM-DD 23:59:59')
          }
          continue
        }

        if (key === 'projectArea') {
          params[key] = val.join(',')
          continue
        }

        if ((key === 'approveResult' || key === 'approveRemark') && this.formType !== 'review') continue

        params[key] = val
      }

      return params
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        if (this.formType === 'review') this.review()
        else if (this.formType === 'edit') this.edit()
        else this.add()
      })
    },
    add() {
      const params = this.getParams()

      this.loading = true

      this.$api.project
        .addProject(params)
        .then(res => {
          this.$message.success('新增成功')
          this.$emit('close', true)
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    },
    edit() {
      const params = this.getParams()

      this.loading = true

      this.$api.project
        .editProject({
          id: this.id,
          ...params
        })
        .then(res => {
          const message = this.userInfo.userType === 0 ? '修改成功' : '提交审核成功'
          this.$message.success(message)
          this.$emit('close', true)
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    },
    review() {
      this.loading = true

      let apiName = 'checkProject'
      if (this.auditType === 4) {
        apiName = 'editCheckProject'
      }

      this.$api.project[apiName]({
        id: this.id,
        approveResult: this.form.approveResult,
        approveRemark: this.form.approveRemark
      })
        .then(res => {
          this.$message.success('审核成功')
          this.$emit('close', true)
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 上传成功
     * @param {Object} data 上传结果
     */
    onUploadSuccess(data) {
      this.form.imgUrl = data
      this.$refs.editForm.validateField('imgUrl')
    },
    resetForm() {
      if (this.formType === 'review') {
        this.form.approveResult = undefined
        this.form.approveRemark = ''
      } else {
        this.$refs.editForm.resetFields()
        this.$refs.cUpload && this.$refs.cUpload[0].reset()

        this.$nextTick(() => {
          if (this.formType === 'edit') {
            this.initForm()
            this.$refs.editForm.validateField('imgUrl')
          }
        })
      }
    }
  }
}
</script>
