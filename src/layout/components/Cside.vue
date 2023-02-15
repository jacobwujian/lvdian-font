<template>
  <a-layout-sider
    v-model="collapsed"
    :trigger="null"
    collapsible
  >
    <a-menu
      theme="dark"
      :default-selected-keys="[$route.path]"
      :default-open-keys="[$route.path]"
      mode="inline"
    >
      <template v-for="Mitem in menulist">
        <a-sub-menu
          v-if="Mitem.children"
          :key="Mitem.path"
        >
          <span slot="title">
            <a-icon :type="Mitem.icon" />
            <span>{{ Mitem.name }}</span>
          </span>
          <template v-for="Mitem2 in Mitem.children">
            <a-sub-menu
              v-if="Mitem2.children"
              :key="Mitem2.path"
            >
              <span slot="title">
                <span>{{ Mitem2.name }}</span>
              </span>
              <a-menu-item
                v-for="Sitem in Mitem2.children"
                :key="Sitem.path"
                @click="alink(Sitem.path)"
              >
                <a-popover placement="right">
                  <template
                    #content
                  >
                    {{ Sitem.name }}
                  </template>
                  {{ Sitem.name }}
                </a-popover>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item
              v-else
              :key="Mitem2.path"
              @click="alink(Mitem2.path)"
            >
              <a-icon :type="Mitem2.icon" />
              <span>{{ Mitem2.name }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
        <a-menu-item
          v-else
          :key="Mitem.path"
          @click="alink(Mitem.path)"
        >
          <a-icon :type="Mitem.icon" />
          <span>{{ Mitem.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	props: {
		collapsed: {
			type: Boolean
		}
	},
	computed: {
		...mapGetters({
			menulist: 'menu/menulist'
		})
	},
	methods: {
		alink(data) {
			console.log(this.menulist)
			this.$router.push(data)
		}
	}
}
</script>

<style scoped>
.logo {
	height: 32px;
	margin: 16px;
	line-height: 32px;
	color: #988a21;
	overflow: hidden;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
}
/deep/ .ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
	background-color: #fdd672;
	color: #8d763a;
}
/deep/ .ant-menu-dark .ant-menu-submenu-selected,
.ant-menu-dark .ant-menu-submenu-title:hover {
	color: #8d763a;
}
/deep/ div.ant-menu-submenu-title:hover {
	color: #8d763a;
}
</style>
