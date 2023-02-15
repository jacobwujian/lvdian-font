<!-- formModal -->
<template>
  <div>
    <a-form-model
      ref="verificationForm"
      :model="form"
      :rules="rules"
      v-bind="formItemLayout"
    >
      <a-form-model-item
        label="核销数量"
        prop="num"
      >
        <a-input-number
          v-model="form.num"
          placeholder="请输入核销数量"
          :precision="0"
          :min="1"
          :max="maxAmount"
          style="width: 100%"
        />
      </a-form-model-item>
    </a-form-model>

    <a-row class="btns-row">
      <a-col class="text-center">
        <a-space size="large">
          <a-button
            :disabled="!form.num"
            type="primary"
            html-type="submit"
            @click="submitForm"
          >
            提交
          </a-button>
          <a-button
            @click="resetForm"
          >
            取消
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

export default {
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formItemLayout,
      form: {
        num: ''
      }
    }
  },
  computed: {
    maxAmount() {
      return Math.floor((this.detail.amount || 0) / 100)
    },
    rules() {
      return {
        num: [
          { required: true, message: '请输入核销数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.verificationForm.validate(valid => {
        if (!valid) return false

        this.loading = true
        this.$api.asset.checkAssetInfo({
          assetId: this.detail.id,
          verificationAmount: this.form.num * 100
        }).then(res => {
          this.$message.success('核销成功')
          this.$emit('close', true)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    resetForm() {
      this.$emit('close')
      this.$refs.verificationForm.resetFields()
    }
  }
}
</script>
