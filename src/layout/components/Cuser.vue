<!-- 用户信息 -->
<template>
  <div>
    <router-link :to="$cPath">
      杭钢集团
    </router-link>
    <div class="admin-user">
      <a-icon
        class="trigger"
        type="user"
        @click="exit"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    }),
    menus() {
      if ([0, 3].includes(this.$store.state.user.userInfo.userType)){
        return [
          {
            name: '监控大屏',
            path: '/screen'
          }, {
            name: '交易中心',
            path: '/home'
          }
        ]
      }else {
        return [
          {
            name: '交易中心',
            path: '/home'
          }
        ]
      }

    }
  },
  watch: {},
  created() {},
  mounted() {
    //document.getElementById('companyName').onmouseenter = this.onmouseenter
    //document.getElementById('companyName').onmouseleave = this.onmouseleave

  },
  destroyed() {},
  activated() {},
  methods: {
    onmouseenter(e){
      console.log(e)
    },
    onmouseleave(e){
      console.log(e)
    },
    exit() {
      this.$store.dispatch('user/logout')
      this.$api.user.logout().then( res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.admin-user {
	height: 60px;
	display: inline;
	margin-left: 1650px;
}

</style>
