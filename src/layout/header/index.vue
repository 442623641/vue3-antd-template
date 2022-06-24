<template>
  <Layout.Header class="layout-header"  theme="light">
    <Space :size="20">
      <slot>
        <Space :size="20">
          <span class="menu-fold" @click="() => emit('update:collapsed', !collapsed)">
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
          </span>
          <Breadcrumb>
            <template v-for="(routeItem, rotueIndex) in menus" :key="routeItem?.path">
              <Breadcrumb.Item>
                <span>{{ routeItem?.meta?.title }}</span>
                <template v-if="routeItem?.children?.length" #overlay>
                  <Menu :selected-keys="getSelectKeys(rotueIndex)">
                    <template v-for="childItem in routeItem?.children" :key="childItem.name">
                      <Menu.Item v-if="!childItem.meta?.hidden && childItem.meta?.breadcrumb !== false"
                        :key="childItem.name" @click="clickMenuItem(childItem)">
                        {{ childItem.meta?.title }}
                        <!-- <TitleI18n :title="childItem.meta?.title" /> -->
                      </Menu.Item>
                    </template>
                  </Menu>
                </template>
              </Breadcrumb.Item>
            </template>
          </Breadcrumb>
        </Space>
      </slot>
    </Space>
    <Space :size="20">
      <Dropdown placement="bottomRight">
        <Avatar :src="userInfo.headImg" :alt="userInfo.name">{{ userInfo.name }}</Avatar>
        <template #overlay>
          <Menu>
            <Menu.Item @click="$router.push({ name: 'account-about' })">
              关于
            </Menu.Item>
            <Menu.Item @click="$router.push({ name: 'account-settings' })">
              个人设置
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <div @click.prevent="doLogout">
                <poweroff-outlined />退出系统
              </div>
            </Menu.Item>
          </Menu>
        </template>
      </Dropdown>
    </Space>
  </Layout.Header>
</template>

<script lang="tsx" setup>
import { computed, nextTick, PropType, type CSSProperties } from 'vue';
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router';
import {
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
} from '@ant-design/icons-vue';
import {
  Layout,
  message,
  Modal,
  Dropdown,
  Menu,
  Space,
  Breadcrumb,
  Avatar,
  type MenuTheme,
} from 'ant-design-vue';

import { useUserStore } from '@/store/modules/user.store';
import { useKeepAliveStore } from '@/store/modules/keepAlive.store'

defineProps({
  collapsed: {
    type: Boolean,
  },
  theme: {
    type: String as PropType<MenuTheme>,
  },
});
const emit = defineEmits(['update:collapsed']);
const userStore = useUserStore();
// const themeStore = useThemeStore();
// const lockscreenStore = useLockscreenStore();
const keepAliveStore = useKeepAliveStore();

const router = useRouter();
const route = useRoute();
const userInfo = computed(() => userStore.userInfo);
// const headerStyle = computed<CSSProperties>(() => {
//   const { navTheme, layout } = themeStore;
//   const isDark = navTheme === 'dark' && layout === 'topmenu';
//   return {
//     backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
//     color: isDark ? 'rgba(255, 255, 255, 0.85)' : '',
//   };
// });

const menus = computed(() => {
  const matched = route.matched.filter(
    (item) => item.meta && item.meta.title
  );
  const first = matched[0];
  // if (!this.isDashboard(first)) {
  //   matched = [
  //     (<any>{ path: "/dashboard", meta: { title: "首页" } }) as RouteRecord,
  //   ].concat(matched);
  // }
  return matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
});

const getSelectKeys = (rotueIndex: number) => {
  return [menus.value[rotueIndex + 1]?.name] as string[];
};

const findLastChild = (route?: RouteRecordRaw) => {
  if (typeof route?.redirect === 'object') {
    const redirectValues = Object.values(route.redirect);
    if (route?.children?.length) {
      const target = route.children.find((n) =>
        redirectValues.some((m) => [n.name, n.path, n.meta?.fullPath].some((v) => v === m)),
      );
      return findLastChild(target);
    }
    return redirectValues.find((n) => typeof n === 'string');
  } else if (typeof route?.redirect === 'string') {
    if (route?.children?.length) {
      const target = route.children.find((n) =>
        [n.name, n.path, n.meta?.fullPath].some((m) => m === route?.redirect),
      );
      return findLastChild(target);
    }
    return route?.redirect;
  }
  return route;
};

// 点击菜单
const clickMenuItem = (menuItem: RouteRecordRaw) => {
  const lastChild = findLastChild(menuItem);
  console.log('lastChild', menuItem, lastChild);

  if (lastChild?.name === route.name) return;
  if (/http(s)?:/.test(lastChild?.name)) {
    window.open(lastChild?.name);
  } else if (lastChild?.name) {
    router.push({ name: lastChild.name });
  }
};

// 退出登录
const doLogout = () => {
  Modal.confirm({
    title: '您确定要退出登录吗？',
    icon: <QuestionCircleOutlined />,
    centered: true,
    onOk: async () => {
      // 如果不是rootadmin，则退出登录
      if (userStore.userInfo.phone !== '13553550634') {
        // logout({})
        await userStore.logout();
      }
      keepAliveStore.clear();
      // 移除标签页
      localStorage.clear();
      message.success('成功退出登录');
      await nextTick();
      router.replace({
        name: 'Login',
        query: {
          redirect: route.fullPath,
        },
      });
    },
  });
};
</script>

<style lang="less" scoped>
.layout-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px 0 rgb(0 21 41 / 12%);
  transition: background .3s, width .2s;
  // color: rgba(0, 0, 0, .85);

  * {
    cursor: pointer;
  }
}
</style>
