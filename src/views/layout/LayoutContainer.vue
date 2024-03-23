<script setup>
  //导入相应模块
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { createApp } from 'vue';
  import { Tabbar, TabbarItem } from 'vant';
  const router = useRouter();
  const activeTab = ref('analyse');
  const showSlideIn = ref(false);
  const isActiveI = ref(true)
  const isActiveII = ref(false)
  const isActiveIII = ref(false)
  const active = ref(0);
  const icon = {
    active: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
    inactive:
      'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
  };
  //底部导航跳转路由设置
  const change = (tab) => {
    if (tab == 'analyse') {
      isActiveI.value = true
      isActiveII.value = false
      isActiveIII.value = false
      console.log(tab)
      console.log(isActiveI.value)
    }
    else if (tab == 'history') {
      isActiveI.value = false
      isActiveII.value = true
      isActiveIII.value = false
      console.log(tab)
      console.log(isActiveI.value)
    }
    else if (tab == 'mymsg') {
      isActiveI.value = false
      isActiveII.value = false
      isActiveIII.value = true
      console.log(tab)
      console.log(isActiveI.value)
    }
  }

</script>
<template>
  <div>
    <el-container class="layout-container">
      <!-- 顶部栏目 -->
      <el-header class="header-up">


        <div style="color:  rgb(58, 148, 184);">欢迎您使用CalliSmart!</div>
      </el-header>
      <van-divider />
      <!-- 主题部分，路由展示部分 -->
      <el-main>
        <!-- <keep-alive :include="history"> -->
        <router-view>
        </router-view>

        <!-- </keep-alive> -->

      </el-main>
      <!-- 底部栏设置 -->
      <el-footer>
        <van-tabbar route>
          <van-tabbar-item replace to="/calli/history" icon="search">历史记录</van-tabbar-item>
          <van-tabbar-item replace to="/calli/analyse" icon="home-o">书法分析</van-tabbar-item>
          <van-tabbar-item replace to="/calli/usermsg" icon="manager-o">个人中心</van-tabbar-item>
        </van-tabbar>
      </el-footer>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
  .layout-container {
    height: 100vh;

    .bottom-nav {
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: dimgray;
      /* Black background color */
      padding: 10px 0;
      overflow-x: hidden;
      /* Hide the overflow */
      transition: transform 0.3s ease;
      /* Add a transition effect */
    }

    .nav-item {
      text-align: center;
      flex-grow: 1;
      position: relative;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: darkorange;
      text-decoration: none;
      /* Gray color for unselected items */
    }

    .no-underline {
      text-decoration: none;
      /* Remove the underline */
    }

    .active {
      color: brown;
      display: block;
      /* Yellow color for selected item */
    }

    .nav-highlight {
      position: absolute;
      bottom: 0;
      height: 2px;
      background-color: rgb(0, 140, 255);
      /* Yellow color for highlight */
      transition: transform 0.3s ease;
      /* Add a transition effect */
      /* Initial position */
    }
  }

  .header-up {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: center;
    /* 水平居中 */
    background-color: rgb(231, 226, 226);
    color: darkorange;
    height: 50px;
    /* 调整头部高度 */
  }

  .welcome-message {
    font-size: 18px;
  }
</style>