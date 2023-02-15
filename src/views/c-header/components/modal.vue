<!-- formModal -->
<template>
  <div>
    <a-form-model
      ref="editForm"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item
        label="原密码"
        prop="oldPassword"
      >
        <a-input-password
          v-model="form.oldPassword"
          placeholder="请输入原密码"
        />
      </a-form-model-item>
      <a-form-model-item
        label="新密码"
        prop="newPassword"
      >
        <a-input-password
          v-model="form.newPassword"
          placeholder="请输入新密码"
        />
      </a-form-model-item>
      <a-form-model-item
        label="再次确认"
        prop="confirmpwd"
      >
        <a-input-password
          v-model="form.confirmpwd"
          placeholder="请输入再次确认"
        />
      </a-form-model-item>
    </a-form-model>
    <div class="model-footer">
      <a-space size="large">
        <a-button
          :disabled="!form.oldPassword || !form.newPassword || !form.confirmpwd"
          type="primary"
          @click="handleOk"
        >
          确定修改
        </a-button>
        <a-button
          @click="$emit('close', false)"
        >
          取消
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    value: {
      type: Boolean
    }
  },
  data() {
    const regex = new RegExp(`^[a-zA-Z0-9_]{5,20}$`)

    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.newPassword !== '') {
          this.$refs.editForm.validateField('confirmpwd')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('密码输入不正确'))
      } else {
        callback()
      }
    }

    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        oldPassword: '',
        newPassword: '',
        confirmpwd: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { pattern: regex, message: '请输入符合格式的密码', trigger: 'blur'}
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: regex, message: '请输入符合格式的密码', trigger: 'blur'}
        ],
        confirmpwd: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: regex, message: '请输入符合格式的密码', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    handleOk() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$api.login.updatePassword(this.form).then(res => {
            if(res) {
              this.$message.success('修改成功')
              this.$store.dispatch('user/logout')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.ant-form-vertical .ant-form-item{
  padding-bottom: 0;
}
</style>