<script setup>
  //引入相应模块
  import { ref } from 'vue'
  import { onMounted } from 'vue'
  import { onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { useUserStore } from '@/stores'//导入
  import Detail from './HistoryDetail.vue'//引入子组件
  import { showToast } from 'vant';
  import { showSuccessToast, showFailToast } from 'vant';
  const userStore = useUserStore()
  const router = useRouter()
  const res = ref('')
  const list = ref([])//响应的list
  const len = ref(0)//存储list长度
  const fontlist = ref([])
  const nowUrl = ref('')
  let id = userStore.userid//拿到id
  fontlist.value[1] = "楷书"
  fontlist.value[2] = "隶书"
  fontlist.value[3] = "行书"
  fontlist.value[4] = "草书"
  id = parseInt(id)
  //获取历史记录函数
  const getlist = async () => {
    try {
      const response = await axios.get(`http://172.20.4.189:8080/list/${id}`)
      res.value = response.data.data//包含data,code,msg
      list.value = res.value
      len.value = list.value.length//列表长度，用于v-for循环
      if(len.value==0){
        showFailToast('历史记录为空');
      }
    }
    //处理异常情况
    catch (error) {
      if (len.value == 0) {
        showFailToast('历史记录为空');
      }
      else {
        console.log(error)
        showFailToast('服务异常');
      }
    }
  }
  //钩子函数设置
  onMounted(async () => {
    await getlist()
  })
  //得到字体名称
  const getFontName = (fontNumber) => {
    return fontlist.value[fontNumber] || '未知字体';
  };
  //详情页面发送数据
  const routerChange = (font, word, time, score, picture) => {
    router.push(`/calli/detail?font=${font}&word=${word}&time=${time}&score=${score}&picture=${picture}`)
    // router.push('/calli/detail')
  }
</script>
<template>
  <div class="article-page">
    <div class="article-item" v-for="(item,index) in list" :key="item.id"
      @click="routerChange(item.font,item.word,item.loadtime,item.score,item.reimage)">
      <div class="head">
        <img class="item-image" @click=" console.log(item.reimage)" v-bind:src="item.reimage" alt="图片" />
        <div class="con">
          <!-- <p></p> -->
          <h3 class="title">{{index+1}}.{{item.word}}</h3>
          <p>字体:{{ getFontName(item.font) }}</p>
          <!-- <p class="other">历史记录</p> -->
        </div>
      </div>
      <div class="body">

      </div>
      <div class="foot">时间：{{item.loadtime}}</div>
      <div class="foot" style="font-size: medium; color: brown;">得分：{{item.score.toFixed(2)*100}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .article-page {
    background: #f5f5f5;
  }

  .article-item {
    margin-bottom: 10px;
    background: #fff;
    padding: 10px 15px;

    .head {
      display: flex;


      .con {
        flex: 1;
        overflow: hidden;
        padding-left: 15px;

        p {
          margin: 0;
          line-height: 1.5;

          &.title {
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
            white-space: nowrap;
          }

          &.other {
            font-size: 10px;
            color: #999;
          }
        }
      }
    }

    .body {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .item-image {
      width: 80px;
      /* 设置宽度，保持宽高比 */
      height: 80px;
      /* 设置高度为盒子的80% */
      /* border-radius: 50%; */
      overflow: hidden;
      object-fit: cover;
      /* 保持图片宽高比 */
    }

    .foot {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
  }
</style>