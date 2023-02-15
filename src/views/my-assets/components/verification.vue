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
        label="核销数量"
        prop="num"
      >
        <a-input-number
          v-model="form.num"
          :placeholder="`最大可核销数量${maxAmount}`"
          :precision="0"
          :min="1"
          :max="maxAmount"
        />
      </a-form-model-item>
    </a-form-model>
    <div class="model-footer">
      <a-space size="large">
        <a-button
          @click="$emit('close', false)"
        >
          取消
        </a-button>
        <a-button
          :disabled="!form.num"
          type="primary"
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
        num: ''
      },
      rules: {
        num: [
          { required: true, message: '请输入核销数量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    maxAmount() {
      return Math.floor((this.recordData.amount || 0) / 100)
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
          Modal.confirm({
            title: '核销提示',
            content: '是否确认核销',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              that.$api.trade.assetWriteOffApplication({
                assetId: that.recordData.id,
                number: that.form.num * 100
              }).then(res => {
                that.$message.success('申请核销成功')
                that.$emit('close', false)
                that.$emit('refresh')
              })
            },
            onCancel() {
              console.log('Cancel')
            }
          })
          // alert('submit!')
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