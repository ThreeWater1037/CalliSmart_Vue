<script setup>
  //引入相应模块
  import { computed } from 'vue'
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const route = useRoute();
  const word = ref(route.query.word);
  const font = ref(route.query.font);
  const time = ref(route.query.time);
  const score = ref(parseFloat(route.query.score));
  const fontlist = ref([])
  const comment = ref('')
  const remark = ref([])
  //评价内容
  remark.value = [
    '笔法松散，不规范，字形不清晰，错漏较多，整体呈现出较低的书写水平。',
    '笔画较为勉强，存在断续、不连贯的情况，字形整体尚可，但细节有待提高。',
    '笔画基本连贯，但可能存在一些瑕疵和不够圆润的笔画，整体表现较为稳定但仍有欠缺之处。',
    '笔法流畅，结构清晰，字形端庄，整体表现较为优秀，但可能存在个别细微错误。',
    '笔法精湛，字形工整规范，结构严谨，线条流畅自然，体现出高超的书法技艺和审美水平。'

  ]
  //根据得分对应评价
  const getComment = (num) => {
    console.log('num is ', num)
    if (num < 0.6) {
      // console.log('内部：', remark.value[0])
      return remark.value[0];
    } else if (num < 0.7) {
      return remark.value[1];
    } else if (num < 0.8) {
      return remark.value[2];
    } else if (num < 0.9) {
      return remark.value[3];
    } else {
      return remark.value[4];
    }
  }
  comment.value = getComment(score.value);
  //编号对应字体
  fontlist.value[1] = "楷书"
  fontlist.value[2] = "隶书"
  fontlist.value[3] = "行书"
  fontlist.value[4] = "草书"
  const imageurl = ref(route.query.picture);
  //跳转函数
  const onClickLeft = () => {
    router.push('/calli/history')
  }
  //百分制转换
  const change = computed(() => {
    return score.value.toFixed(2) * 100
  })
  const getFontName = (fontNumber) => {
    console.log(fontNumber)
    return fontlist.value[fontNumber] || '未知字体';
  };
</script>
<template>
  <van-nav-bar title="详细记录" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="detail-container">
    <div class="image-container">
      <img :src="imageurl" alt="">
    </div>
    <!-- <van-divider /> -->
  </div>
  <van-cell-group>
    <van-cell title="分析的字" :value="word" />
    <van-cell title="字体" :value="getFontName(parseInt(font))" />
    <van-cell title="分析时间" :value="time" />
    <van-cell title="得分" :value="change" />
    <van-cell title="评价" :value="comment" />
  </van-cell-group>
  <!-- <div>汉字：{{ word }}</div>
      <div>字体：{{ font }}</div>
      <div>时间：{{ time }}</div>
      <div>得分：{{ score }}</div> -->

</template>
<style scoped>
  .page-wrapper {
    position: relative;
    top: 30vh;
  }

  .detail-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 50px
      /* height: 100vh; 使整个页面充满屏幕高度 */
  }

  .image-container {
    text-align: center;
    margin-bottom: 20px;
  }

  .image-container img {
    max-width: 100%;
    max-height: 100%;
  }

  .info-container {
    text-align: center;
  }
</style>