<!-- formModal -->
<template>
  <div>
    <a-form-model
      ref="editForm"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :colon="false"
      :rules="rules"
    >
      <a-form-model-item
        label="发布数量"
        prop="publishAmount"
      >
        <a-input-number
          v-model="form.publishAmount"
          :min="1"
          :precision="0"
          :max="maxAmount"
          :placeholder="`最大可发布数量${maxAmount}`"
        />
      </a-form-model-item>
      <a-form-model-item
        label="单价"
        prop="unitPrice"
      >
        <a-input-number
          v-model="form.unitPrice"
          placeholder="请输入单价"
          :precision="1"
        />
      </a-form-model-item>
      <a-form-model-item
        label="描述"
        prop="description"
      >
        <a-textarea
          v-model="form.description"
          placeholder="请输入描述"
        />
      </a-form-model-item>
    </a-form-model>
    <div style="display:flex;justifyContent:flex-end;">
      <a-space size="large">
        <a-button
          @click="$emit('close', false)"
        >
          取消
        </a-button>
        <a-button
          :disabled="!form.publishAmount"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          提交
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import {Modal} from 'ant-design-vue'
export default {
  components: {
  },
  props: {
    value: {
      type: Boolean
    },
    recordData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        publishAmount: '',
        unitPrice: 1.0,
        description: ''
      },
      rules: {
        publishAmount: [
          { required: true, message: '请输入核销数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ]
      },
      loading:false
    }
  },
  computed: {
    maxAmount() {
      return Math.floor((this.recordData.amount || 0) / 10 / 10)
    }
  },
  watch: {},
  created() {
  },
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    handleOk() {
      const that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if(!this.form.unitPrice) return this.$message.error('请输入单价')
          this.loading = true
          this.$api.trade.publishAsset({
            ...this.form,
            publishAmount: this.form.publishAmount * 10 * 10,
            unitPrice: this.form.unitPrice * 10 * 10,
            assetId:this.recordData.id
          }).then(res => {
            this.$message.success('发布成功')
            this.$emit('close', false)
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.$emit('refresh', 'publish')
          }).catch(res => {
            this.loading = false
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
/deep/.ant-input-number{
  width: 100%;
}
</style>