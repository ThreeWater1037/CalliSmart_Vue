<script setup>
  import { ref } from 'vue'
</script>

<template>
  <router-view></router-view>

</template>

<style scoped>
  /* main.css */

  /* 响应式布局 */
  @media (max-width: 768px) {

    /* 在小屏幕上的样式 */
    /* 例如：将导航栏垂直堆叠 */
    .navbar {
      flex-direction: column;
    }
  }
</style>