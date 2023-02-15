<!-- header -->
<template>
  <div class="index-main">
    <div class="header flex-box home-container">
      <div class="logo flex-box">
        <img
          class="logo-img"
          src="../../static/home/logo_01.png"
          alt="logo"
        >
        <span class="name">浙江省绿色电力积分认购平台</span>
      </div>

      <transition
        name="fade-transform"
        mode="out-in"
      >
        <a-menu
          v-if="isShowMenus"
          :selected-keys="currentPath"
          class="menus"
          mode="horizontal"
        >
          <a-menu-item
            v-for="item of menuList"
            :key="`menu-${item.enname}`"
            class="item"
          >
            <router-link :to="item.path">
              {{ item.name }}
            </router-link>
          </a-menu-item>

          <a-sub-menu
            key="menu-system"
            class="item"
            popup-class-name="menus-popup"
          >
            <span @click="exit" slot="title">退出系统</span>
          </a-sub-menu>
        </a-menu>
      </transition>

      <div class="user flex-box">
        <i
          class="iconfont iconlist i-list"
          @click="isShowMenus = !isShowMenus"
        />
        <i
          class="iconfont iconuser i-avatar"
        />
        <a-tooltip placement="left">
          <template slot="title">
            <span>{{ userInfo && userInfo.companyName }}</span>
          </template>
          <span
              id="companyName"
              class="name textover"
          >{{ userInfo && userInfo.companyName }}</span>
        </a-tooltip>
      </div>
    </div>

    <ul class="sub-header home-container">
      <li
        v-for="(item, key) of subMenuList"
        :key="`sub-menu-${key}`"
        :class="subMenuCurrent === key ? 'active' : ''"
      >
        <router-link :to="item.path" class="item">
          {{ item.name }}
        </router-link>
      </li>
    </ul>

    <div class="sub-user flex-box home-container">
      <div class="name flex-1">
        <div class="title">
          用户
        </div>
        <div class="content">
          {{ companyName }}
        </div>
      </div>
      <div class="account flex-1 text-right">
        <div class="title">
          账户余额
        </div>
        <div class="content">
          {{ balance }}<span class="unit">RMB</span>
        </div>
      </div>
      <div class="account flex-3 text-right">
        <div class="title">
          资产数量
        </div>
        <div class="content">
          {{ credentials }}<span class="unit">张</span>
        </div>
      </div>
    </div>
    <a-modal
      v-model="isChangePwd"
      title="忘记密码"
      width="500px"
      :destroy-on-close="true"
      :footer="null"
    >
      <Modal @close="isChangePwd = false" />
    </a-modal>
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import Modal from './components/modal'
import {mapGetters} from 'vuex'
import {localeString} from '@/utils/means'

export default {
  components: {
    Modal
  },
  data() {
    return {
      localeString,
      isChangePwd: false,
      isShowMenus: true,
      subMenuCurrent: 0,
      menuList: [
        {
          name: '首页',
          enname: 'home',
          path: '/home'
        },
        {
          name: '我的账户',
          enname: 'myaccount',
          path: '/myaccount'
        },
        {
          name: '订单管理',
          enname: 'ordermanagement',
          path: '/ordermanagement'
        },
        {
          name: '我的资产',
          enname: 'myassets',
          path: '/myassets'
        },
        {
          name: '管理中心',
          enname: 'glzx',
          path: '/adm/index'
        }
      ],
      subMenuList: [
        {
          name: '首页',
          path: '/home'
        }, {
          name: '统计数据',
          path: ''
        }, {
          name: '积分榜',
          path: ''
        }, {
          name: '可再生消纳量',
          path: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    }),
    currentPath() {
      const menusCode = this.menuList.map(item => item.enname)
      const currentPathName = this.$route.name
      if (menusCode.includes(currentPathName)) {
        return [`menu-${this.$route.name}`]
      }
      return ['menu-home']
    },
    balance() {
      if (!this.userInfo || !this.userInfo.balance) {
        return '--'
      }

      return localeString(this.userInfo.balance / 100)
    },
    credentials() {
      if (!this.userInfo || !this.userInfo.credentials) {
        return '--'
      }

      return localeString(this.userInfo.credentials / 100)
    },
    companyName() {
      if (!this.userInfo || !this.userInfo.companyName) {
        return '--'
      }

      return this.userInfo.companyName
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  activated() {},
  methods: {
    exit() {
      this.$store.dispatch('user/logout')
      this.$api.user.logout().then( res => {
      })
    },
    login() {
      this.$router.replace('/login')
    }
  }
}
</script>
<style lang='less' scoped>
.index-main{
  // padding-bottom: 20px;
  .header{
    height: 98px;
    padding: 0 6.25vw;
    justify-content: space-between;
    background-color: #FBFBFB;

    .logo {
      width: 400px;
      align-items: center;
      .logo-img {
        width: 85px;
      }
      .name {
        margin-left: 1.25vw;
        font-size: 22px;
        color: #006F6C;
      }
    }

    .menus {
      margin-left: auto;
      background-color: transparent;
      border-bottom: 0;
      font-size: 16px;
      color: #000;
      .item {
        height: 98px;
        line-height: 98px;
        + .item {
          margin-left: 1.04vw;
        }
      }

      /deep/.ant-menu-item,
      /deep/.ant-menu-submenu,
      /deep/.ant-menu-submenu-title {
        &:hover {
          color: #006F6C;
          border-bottom-color: #006F6C;
        }
        > a {
          color: #000;
          &:hover {
            color: #006F6C;
          }
        }
      }

      /deep/.ant-menu-submenu-active,
      /deep/.ant-menu-item-selected {
        color: #006F6C;
        border-bottom-color: #006F6C;
      }
    }

    .user {
      margin-left: 5.21vw;
      align-items: center;
      .i-list { font-size: 20px; }
      .i-avatar {
        margin: 0 16px 0 32px;
        font-size: 24px;
      }
      .name {
        display: inline-block;
        max-width: 112px;
        font-size: 16px;
        color: #000;
      }
    }

    @media (max-width: 1366px) {
      .user {
        margin-left: 50px;
      }
    }
  }

  .sub-header {
    height: 66px;
    box-shadow: 0px 2px 4px 0px rgba(0, 145, 255, 0.1);
    li {
      position: relative;
      top: 1px;
      display: inline-block;
      height: 66px;
      line-height: 66px;
      margin-right: 96px;
      border-bottom: 3px solid transparent;
      border-radius: 3px;
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, .6);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      &.active,
      &:hover {
        border-color: #006F6C;
        font-weight: 600;
      }
    }
  }

  .sub-user {
    height: 108px;
    border-bottom: 1px solid #E9E9E9;
    align-items: center;
    justify-content: space-between;

    .title {
      height: 22px;
      line-height: 22px;
      margin-bottom: 10px;
      color: rgba(0, 0, 0, 0.45);
    }
    .content {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
    }
    .account {
      .content {
        font-size: 18px;
        letter-spacing: 4px;
      }
      .unit {
        height: 24px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 24px;
      }
      padding-left: 45px;
    }
  }
}
</style>