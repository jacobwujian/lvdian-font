<!--  -->
<template>
  <div id="editorCoupon" />
</template>

<script>
import E from 'wangeditor'

export default {
  components: {},
  props: {
    'value': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const editor = new E('#editorCoupon')
    const that = this
	editor.config.menus = [
	    'head',
	    'bold',
	    'fontSize',
	    'fontName',
	    'italic',
	    'underline',
	    'strikeThrough',
	    'indent',
	    'lineHeight',
	    'foreColor',
	    'backColor',
	    'link',
	    'list',
	    'todo',
	    'justify',
	    'quote',
	    'emoticon',
	    'image',
	    'table',
	    'code',
	    'splitLine',
	    'undo',
	    'redo'
	]
    // 配置 onchange 回调函数
    editor.config.onchange = function(newHtml) {
      that.$emit('input', newHtml)
      // console.log('change 之后最新的 html', newHtml)
    }
    // 配置触发 onchange 的时间频率，默认为 200ms
    editor.config.onchangeTimeout = 500 // 修改为 500ms

    // 配置 server 接口地址
    editor.config.uploadImgShowBase64 = true
    editor.create()

    this.editor = editor

    editor.txt.html(this.value)
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  activated() {},
  methods: {}
}
</script>
<style lang='less' scoped>
#editorCoupon{
  width: 375px;
}
</style>