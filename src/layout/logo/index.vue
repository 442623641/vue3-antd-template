<template>
  <div class="logo">
    <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
    <h1 v-show="!collapsed" class="title">Engineering Center</h1>
  </div>
</template>

<script setup lang="ts">
defineProps({
  collapsed: {
    type: Boolean,
  }
});
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  overflow: hidden;
  align-items: center;
  white-space: nowrap;
  height: @layout-header-height;
  // padding-left: 24px;
  line-height: @layout-header-height;
  img {
    height: 32px;
    margin-right: 8px;
  }

  h1 {
    display: inline-block;
    margin: 0 0 0 12px;
    font-size: 16px;
    vertical-align: top;
    color: @layout-header-color;
  }
}
</style>
