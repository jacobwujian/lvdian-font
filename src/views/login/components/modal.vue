<!-- formModal -->
<template>
  <div>
    <div>
      <a-form-model
        ref="editForm"
        layout="vertical"
        :model="form"
        :rules="rules"
      >
        <a-row :gutter="[16, 16]">
          <template v-for="item in formList">
            <a-col
              v-if="!item.noShow"
              :key="item.params"
              :span="8"
            >
              <a-form-model-item
                :ref="item.params"
                :label="item.label"
                :prop="item.params"
              >
                <a-input
                  v-if="item.type === 'input'"
                  v-model.trim="form[item.params]"
                  :placeholder="item.placeholder"
                  :type="item.miss || 'text'"
                />
                <a-select
                  v-if="item.type === 'select'"
                  v-model="form[item.params]"
                  :placeholder="item.placeholder"
                >
                  <a-select-option
                    v-for="sitem in item.data"
                    :key="sitem.value"
                    :value="sitem.value"
                  >
                    {{ sitem.name }}
                  </a-select-option>
                </a-select>
                <a-range-picker
                  v-if="item.type === 'datePicker'"
                  v-model="form[item.params]"
                />
                <template v-if="item.type === 'upload'">
                  <CUpload
                    ref="cUpload"
                    :file-id="item.params && form[item.params]"
                    @on-success="uploadSuccess"
                  />
                </template>
                <a-cascader
                  v-if="item.type === 'areaPicker'"
                  v-model="form[item.params]"
                  :options="areaOptions"
                  :placeholder="item.placeholder"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              v-if="item.noShow && item.params === 'annual' && form['type'] == '1'"
              :key="item.params"
              :span="8"
            >
              <a-form-model-item
                :ref="item.params"
                :label="item.label"
                :prop="item.params"
              >
                <a-input
                  v-model.trim="form[item.params]"
                  :placeholder="item.placeholder"
                  :type="item.miss || 'text'"
                />
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
    </div>
    <div class="model-footer">
      <a-space size="large">
        <a-button
          type="primary"
          @click="handleOk"
        >
          提交
        </a-button>
        <a-button
          type="primary"
          @click="resetForm"
        >
          重置
        </a-button>
        <a-button @click="$emit('close', false)">
          取消
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import CUpload from '@/components/base/c-upload'
import {validateIdCard, validatePhone, validateEmail} from '@/utils/validate.js'
import { ZJoptions } from '@/utils/cascader-address-options'
import Base64JS from 'base-64'

export default {
  components: {
    CUpload
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data() {
    const regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')
    const payRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')

    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.password !== '') {
          this.$refs.editForm.validateField('confirmpwd')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('密码输入不正确'))
      } else {
        callback()
      }
    }

    let payvalidatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入支付密码'))
      } else {
        if (this.form.payPassword !== '') {
          this.$refs.editForm.validateField('confirmPayPassword')
        }
        callback()
      }
    }
    let payvalidatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入支付密码'))
      } else if (value !== this.form.payPassword) {
        callback(new Error('支付密码输入不正确'))
      } else {
        callback()
      }
    }
    return {
      areaOptions: ZJoptions,
      loading: false,
      imageUrl: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        type: '1'
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: regex, message: '密码需包含大写字母小写字母特殊字符数字,长度8-30位,列如Yhh@2918', trigger: 'blur'}
        ],
        confirmpwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
          { pattern: regex, message: '请输入符合格式的密码', trigger: 'blur'}
        ],
        payPassword: [
          { validator: payvalidatePass, trigger: 'blur' },
          { required: true, message: '请输入支付密码', trigger: 'blur' },
          { pattern: payRegex, message: '密码需包含大写字母小写字母特殊字符数字,长度8-30位,列如Yhh@2918', trigger: 'blur'}
        ],
        confirmPayPassword: [
          { required: true, message: '请确认支付密码', trigger: 'blur' },
          { validator: payvalidatePass2, trigger: 'blur' },
          { pattern: payRegex, message: '请输入8位数字支付密码', trigger: 'blur'}
        ],
        companyName: [
          { required: true, message: '请填写公司名称', trigger: 'blur' },
          { pattern: /^\S{1,60}$/, message: '请输入正确的公司名称', trigger: 'blur'}
        ],
        companyArea: [
          { type: 'array', required: true, message: '请选择公司地区', trigger: 'change' }
        ],
        address: [
          { pattern: /^\S{1,80}$/, message: '请输入正确的公司地址', trigger: 'blur'}
        ],
        businessLicense: [
          { required: true, message: '请上传营业执照', trigger: 'blur'}
        ],
        mail: [
          { max: 20, message: '位数不能超过20位', trigger: 'change' },
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        legalPersonIdCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        contactWay: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      formList: [
        {
          type: 'input',
          params: 'companyName',
          placeholder: '请填写公司名称',
          label: '公司名称',
          required: true
        },
        {
          type: 'input',
          params: 'socialCreditCode',
          placeholder: '请填写统一社会信用证代码',
          label: '统一社会信用证代码',
          required: true,
          reg: 'en-18-off'
        },
        {
          type: 'areaPicker',
          params: 'companyArea',
          placeholder: '请选择公司地区',
          label: '公司地区',
          required: true
        },
        {
          type: 'input',
          params: 'address',
          placeholder: '请填写公司地址',
          label: '公司地址'
        },
        {
          type: 'input',
          params: 'legalPerson',
          placeholder: '请填写法人姓名',
          label: '法人姓名',
          required: true,
          reg: 'enz-20'
        },
        {
          type: 'input',
          params: 'legalPersonIdCard',
          placeholder: '请填写法人身份证号',
          label: '法人身份证号',
          required: true
        },
        {
          type: 'upload',
          params: 'businessLicense',
          placeholder: '请填写营业执照',
          label: '营业执照',
          required: true
        },
        {
          type: 'input',
          params: 'contact',
          placeholder: '请填写联系人姓名',
          label: '联系人姓名',
          required: true,
          reg: 'enz-20'
        },
        {
          type: 'input',
          params: 'contactWay',
          placeholder: '请填写联系方式',
          label: '联系方式',
          required: true
        },
        {
          type: 'input',
          params: 'mail',
          placeholder: '请填写邮箱',
          label: '邮箱',
          required: true
        },
        {
          type: 'select',
          params: 'type',
          placeholder: '请选择',
          label: '机构类型',
          data: [
            {value: '1', name:'耗能企业'},
            {value: '2', name:'能源企业'}
          ],
          required: true
        },
        {
          type: 'input',
          params: 'annual',
          placeholder: '请填写年度配额值',
          label: '本年度配额（MW·h）',
          required: true,
          noShow: true,
          reg: 'n'
        },
        {
          type: 'input',
          params: 'username',
          placeholder: '请填写登录用户名',
          label: '登录用户名',
          required: true,
          reg: 'enz-20'
        },
        {
          type: 'input',
          params: 'password',
          placeholder: '请填写登录密码',
          label: '登录密码',
          required: true,
          miss: 'password'
        },
        {
          type: 'input',
          params: 'confirmpwd',
          placeholder: '请再次填写密码',
          label: '密码确认',
          required: true,
          miss: 'password'
        },
        {
          type: 'input',
          params: 'payPassword',
          placeholder: '请填写支付密码',
          label: '支付密码',
          required: true,
          miss: 'password'
        },
        {
          type: 'input',
          params: 'confirmPayPassword',
          placeholder: '请确认支付密码',
          label: '支付密码确认',
          required: true,
          miss: 'password'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.initForm()
    this.initRules()
    if(this.$route.path.indexOf(this.$cPath) !== 0){
      const index = this.formList.findIndex(item => item.params === 'type')
      this.formList.splice(index, 1)
    }
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    initForm() {
      this.formList.forEach(item => {
        if(item.params in this.form) return

        if (item.type === 'areaPicker') {
          this.$set(this.form, item.params, [])
        } else {
          this.$set(this.form, item.params, '')
        }
      })
    },
    initRules() {
      const ruleType = {
        enz: `([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_])`,
        en: `([a-zA-Z0-9_])`,
        n: `([0-9])`
      }
      this.formList.forEach(item => {
        if(this.rules[item.params]) return
        let list = []
        if(item.required){
          list.push({ required: true, message: item.placeholder, trigger: 'blur' })
        }
        if(item.reg){
          const regArr = item.reg.split('-')
          // 正则位数判断
          const bit = regArr.length === 1 ? '*' : `{${regArr.length === 3 ? '' : '0,'}${regArr[1]}}`
          // 错误提示文案
          const msg = item.placeholder.slice(0, 3)+'正确的'+(regArr.length === 1 ? '' : (regArr.length === 3 ? `长度为${regArr[1]}位的` : `不超过${regArr[1]}位的`))+item.placeholder.slice(3)
          const regex = new RegExp(`^${ruleType[regArr[0]]}${bit}$`)
          list.push({ pattern: regex, message: msg, trigger: 'blur'})
        }
        this.rules[item.params] = list
      })
    },
    handleOk() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.form.password =Base64JS.encode(this.form.password)
          this.form.confirmpwd =Base64JS.encode(this.form.confirmpwd)
          this.form.payPassword =Base64JS.encode(this.form.payPassword)
          this.form.confirmPayPassword =Base64JS.encode(this.form.confirmPayPassword)

          this.$api.user.registerUser({
            ...this.form,
            annual: this.form.annual * 100,
            companyArea: this.form.companyArea.join(',')
          })
          .then(res => {
            this.$message.success('注册成功, 请等待管理员审核')
            this.$emit('close')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadSuccess(data) {
      this.form.businessLicense = data
      this.$refs.editForm.validateField('businessLicense')
    },
    resetForm() {
      this.$refs.editForm.resetFields()
      this.$refs.cUpload && this.$refs.cUpload[0].reset()
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.ant-form-vertical .ant-form-item{
  padding-bottom: 0;
}
</style>