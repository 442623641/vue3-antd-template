<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<style lang="less"></style>
