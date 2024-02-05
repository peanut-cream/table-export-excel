<template>
    <AppHeader />
    <div class="app-main">
        <RouterView />
    </div>
</template>
<script setup lang="ts">
import AppHeader from "./header.vue"
</script>
<style scoped lang="less">
.app-main{
    height: calc(100vh - @HeaderHeight);
    overflow: auto;
}
</style>
