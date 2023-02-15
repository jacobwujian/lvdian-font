<template>
  <div>
    <div style="height: 60px;background-color: #3FA9B3;font-size: 20px;color: white;font-weight: 400;line-height: 60px;padding-left: 70px;">
      <Cuser style="height: 60px;background-color: #3FA9B3;font-size: 20px;color: white;font-weight: 400;line-height: 60px;" />
    </div>

    <a-layout
      id="components-layout-demo-custom-trigger"
      class="c-layout-index"
    >
      <Cside
        :collapsed="collapsed"
        style="margin-right: 14px;"
      />
      <a-layout>
        <a-layout-header class="layout-header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <Cbreadcrumb class="brm" />
        </a-layout-header>

        <a-layout-content class="c-layout-content">
          <transition
            v-if="$route.meta && $route.meta.noLayout"
            name="fade-transform"
            mode="out-in"
          >
            <router-view />
          </transition>
          <a-card
            v-else
            class="c-card"
          >
            <div class="c-card-title">
              {{ $route.meta.title }}
            </div>
            <transition
              name="fade-transform"
              mode="out-in"
            >
              <router-view />
            </transition>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import Cside from './components/Cside'
import Cbreadcrumb from './components/Cbreadcrumb'
import Cuser from './components/Cuser'
export default {
  components: {
    Cside,
    Cbreadcrumb,
    Cuser
  },
  data() {
    return {
      collapsed: false
    }
  },
  created() {}
}
</script>

<style scoped lang="less">
.c-layout-index {
  .c-layout-content {
    height: calc(100vh - 92px);
	padding-top: 1px;
    overflow: initial;
  }
  .c-card {
    min-height: calc(100% - 32px);
    .c-card-title {
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
}

#components-layout-demo-custom-trigger {
  height: calc(100vh - 60px);
  .layout-header {
    background: #fff;
    padding: 0;
    display: flex;
    padding: 0 24px;
  }
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}
.brm {
  font-size: 14px;
  line-height: 64px;
  font-weight: 600;
  position: relative;
}
#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}
</style>
