<template>
  <div class="menu-container">
    <Menu v-model:selected-keys="state.selectedKeys" mode="horizontal" :collapsed="props.collapsed"
      collapsible @click="clickMenuItem">
      <MenuItem :route-item="item" v-for="item in permission.menus" :key="item.path" />
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { reactive,watch, type PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, type MenuTheme } from 'ant-design-vue';
import MenuItem from './menu-item.vue';
import { usePermissionStore } from '@/store/modules/permission.store';

const props = defineProps({
  collapsed: {
    // 侧边栏菜单是否收起
    type: Boolean,
  },
  theme: {
    type: String as PropType<MenuTheme>,
  },
});
// 当前路由
const currentRoute = useRoute();
const router = useRouter();
const state = reactive({
  openKeys: [] as string[],
  selectedKeys: [currentRoute.name] as string[],
});

const permission = usePermissionStore();
console.log(permission.routes)
// const routes = computed(() => {
//   return permission.routes.filter((route) => !route.meta?.hidden);
// });
// 根据activeMenu获取指定的menu
const getTargetMenuByActiveMenuName = (activeMenu: string) => {
  return router.getRoutes().find((n) => [n.name, n.path].includes(activeMenu));
};

// // 获取当前打开的子菜单
// const getOpenKeys = () => {
//   const meta = currentRoute.meta;
//   if (meta?.activeMenu) {
//     const targetMenu = getTargetMenuByActiveMenuName(<any>meta.activeMenu);
//     return (targetMenu?.meta?.namePath ?? [meta?.activeMenu]) as string[];
//   }

//   return (
//     meta?.hideInMenu
//       ? state?.openKeys || []
//       : currentRoute.meta?.namePath ?? currentRoute.matched.slice(1).map((n) => n.name)
//   ) as string[];
// };

// 监听菜单收缩状态
watch(
  () => props.collapsed,
  (newVal) => {
    // state.openKeys = newVal ? [] : <any>getOpenKeys();
    state.selectedKeys = [currentRoute.name] as string[];
  },
);

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.name === 'LOGIN_NAME' || props.collapsed) return;
    // state.openKeys = getOpenKeys();
    const meta = currentRoute.meta;
    if (meta?.activeMenu) {
      const targetMenu = getTargetMenuByActiveMenuName(<any>meta.activeMenu);
      state.selectedKeys = [targetMenu?.name ?? meta?.activeMenu] as string[];
    } else {
      state.selectedKeys = [currentRoute.meta?.activeMenu ?? currentRoute.name] as string[];
    }
  },
  {
    immediate: true,
  },
);

// 点击菜单
const clickMenuItem = ({ key }) => {
  if (key === currentRoute.name) return;
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
};
</script>

<style lang="less" scoped>
.menu-container {
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
