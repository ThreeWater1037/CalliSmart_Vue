<script setup>
  //导入相应模块
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import * as echarts from "echarts";
  import axios from 'axios'
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores'
  import { showToast } from 'vant';
  import { showSuccessToast, showFailToast } from 'vant';
  const chartWidth = ref('90vw')
  const chartHeight = ref('40vh')
  const userStore = useUserStore()
  const list = ref([]) // 用于存储从服务器获取的数据
  const len = ref(0) // 数据长度
  const username = ref('')
  username.value = userStore.getUsername()
  let id = userStore.userid // 拿到id
  const router = useRouter();
  //退出登录函数
  const Quit = () => {
    router.push('/login')
    userStore.removeToken()
    userStore.removeUsername()
  }

  // 从服务器获取数据
  const getlist = async () => {
    try {
      const response = await axios.get(`http://172.20.4.189:8080/list/${id}`)
      list.value = response.data.data // 将从服务器获取的数据存储到 list 中
      len.value = list.value.length // 获取数据长度
      if (len.value == 0) {
        showFailToast('历史记录为空');
      }
      initChart(); // 数据获取成功后初始化图表
    } catch (error) {
      if (len.value == 0) {
        showFailToast('历史记录为空');
      }
      console.log(error)
      showFailToast('服务异常');
    }
  }

  let myChart = null; // 用于存储ECharts实例的变量

  // 初始化图表
  function initChart () {
    const chartDom = document.getElementById("myEcharts");
    if (chartDom) {
      myChart = echarts.init(chartDom, "dark");

      // 使用从服务器获取的数据设置图表的 xAxis 和 series
      myChart.setOption({
        xAxis: { type: "category", data: list.value.map(item => item.word) }, // 使用 date 字段作为 x 轴数据
        yAxis: { type: "value", data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
        series: [{ data: list.value.map(item => item.score.toFixed(2) * 100), type: "line", smooth: true }] // 使用 value 字段作为 y 轴数据
      });

      window.onresize = myChart.resize; // 确保图表自适应窗口大小
    }
  }

  onMounted(() => {
    getlist() // 获取数据
  });

  onBeforeUnmount(() => {
    if (myChart) {
      myChart.dispose(); // 销毁ECharts实例
      myChart = null;
    }
    window.onresize = null; // 清除窗口resize监听
  });
</script>


<template>
  <h1>个人中心</h1>
  <p>这里是您的个人信息以及练习曲线</p>
  <div style="padding: 10px;">
    <van-cell-group inset>
      <van-cell title="用户名" :value="username" label="用户名可以用于您的登录" />
    </van-cell-group>
  </div>
  <!-- 配置折线图部分 -->
  <div class="echarts-box">
    <div id="myEcharts" :style="{ width: chartWidth, height: chartHeight }"></div>
  </div>
  <div style="padding: 10px;">
    <van-sticky :offset-bottom="50" position="bottom">
      <van-button type="primary" size="large" @click="Quit()">退出登录</van-button>
    </van-sticky>
  </div>
</template>
<style>
  /* 调整为移动优先的样式 */
  .echarts-box {
    width: 100%;
    /* 宽度调整为100%，确保在移动设备上占满可用宽度 */
    height: auto;
    /* 高度自适应 */
  }

  /* 针对大屏幕的样式调整 */
  @media (min-width: 768px) {
    .echarts-box {
      width: 80vw;
      /* 在大屏幕上调整宽度，例如80%的视口宽度 */
      height: 60vh;
      /* 在大屏幕上调整高度，提供更好的展示效果 */
    }
  }
</style>