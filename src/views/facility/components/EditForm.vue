<template>
  <a-form-model
    ref="editForm"
    :model="form"
    :rules="rules"
    v-bind="formItemLayout"
  >
    <a-form-model-item
      v-for="(item, index) in formItems"
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

      <a-select
        v-if="item.type === 'selectAndSearch'"
        v-model="form[item.params]"
        :placeholder="`请选择${item.label}`"
        :not-fount-content="null"
        allow-clear
        @popupScroll="handlePopupScroll"
      >
        <a-select-option
          v-for="(op, i) in item.data"
          :key="`${i}-${op.id}`"
          :value="op.id"
        >
          {{ op.projectName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

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
        id: '',
        publicKey: '',
        deviceId: '',
        socialCreditCode: '',
        companyName: '',
        projectId: ''
      },
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    }
  },
  computed: {
    formItems() {
      return [
        {
          type: 'input',
          label: '设备公钥',
          params: 'publicKey'
        }, {
          type: 'input',
          label: '设备ID',
          params: 'deviceId',
          disabled: true
        }, {
          type: 'input',
          label: '公司代码',
          params: 'socialCreditCode'
        }, {
          type: 'input',
          label: '公司名称',
          params: 'companyName',
          disabled: true
        }, {
          type: 'selectAndSearch',
          label: '关联项目',
          params: 'projectId',
          data: this.list
        }
      ]
    },
    rules() {
      return {
        publicKey: [
          { required: true, message: '请输入设备公钥', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择关联项目', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.list = [{
      id: this.detail.projectId,
      projectName: this.detail.projectName
    }]
    this.initForm()
    this.getProjectList()
  },
  methods: {
    /* 初始化表单 */
    initForm() {
      for (const key in this.form) {
        if (key in this.detail) {
          this.form[key] = this.detail[key]
        }
      }
    },
    // 获取项目列表用于关联
    getProjectList(val) {
      this.loading = true

      const params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      if (val) params.projectName = val

      this.$api.project.getProjectList(params)
        .then(res => {
          const { list, total } = res
          this.pagination.total = total
          if (Array.isArray(list)) {
            const shiftProject = this.list[0]
            // 过滤已关联项目
            const newList = list.filter(item => item.id !== shiftProject.id)
            this.list.push(...newList)
          }
        }).finally(() => {
          this.loading = false
        })
    },
    handlePopupScroll({ target }) {
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this.list.length < this.pagination.total) {
          this.pagination.pageNum++
          this.getProjectList()
        }
      }
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false

        this.loading = true

        this.$api.device.editDevice({
          id: this.form.id,
          publicKey: this.form.publicKey,
          socialCreditCode: this.form.socialCreditCode,
          projectId: this.form.projectId
        })
          .then(res => {
            this.$message.success('修改成功')
            this.$emit('close', true)
          }).finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
