<template>
  <Layout class="layout" theme="light">
    <PageHeader>
      <template #default>
        <Logo />
        <AsideMenu />
      </template>
    </PageHeader>
    <Layout.Content class="layout-content">
      <div class="layout-content-wide">
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <transition name="fade-transform" mode="out-in" appear>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </template>
        </router-view>
      </div>

    </Layout.Content>
  </Layout>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';
import { Layout } from 'ant-design-vue';
import Logo from './logo/index.vue';
import AsideMenu from './menu/menu.vue';
import PageHeader from './header/index.vue';
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    flex: none;
    position: relative;
    margin: @margin-lg;
  }

  .layout-content-wide {
    max-width: @screen-xl;
    margin: 0 auto;
  }

  .ion-page {
    padding: 24px;
    background: #fff;
  }
}
</style>
