<script setup>
  import { computed, ref } from 'vue'//引入计算属性，ref处理插件
  import { ElMessage } from 'element-plus'//从Element plus中引入Message插件
  //引入element-plus中引入相应的css文件
  import 'element-plus/theme-chalk/el-loading.css';
  import 'element-plus/theme-chalk/el-message.css';
  import { useUserStore } from '@/stores'//引入仓库
  const userStore = useUserStore()//注册仓库
  //注册相关的变量
  const imageUrl = ref(null)//存储图片url
  const file = ref(null)//存储文件
  const score = ref(null)//存储得分
  const fileInput = ref(null)//存储填入的照片文件
  const selectedFont = ref(null)//存储选择的字体
  const percentage = ref('')
  const duration = computed(() => Math.floor(percentage.value / 10))
  const isActive = ref(true)
  const newUrl = ref('')
  const comment = ref('')
  const columns = [
    { text: '楷书', value: 1 },
    { text: '隶书', value: 2 },
    { text: '行书', value: 3 },
    { text: '草书', value: 4 },
  ];
  const fieldValue = ref('');
  const showPicker = ref(false);
  const isRight = ref(0)//控制进度条是否显示
  const remark = ref([])
  //评价数组
  remark.value = [
    '笔法松散，不规范，字形不清晰，错漏较多，整体呈现出较低的书写水平。',
    '笔画较为勉强，存在断续、不连贯的情况，字形整体尚可，但细节有待提高。',
    '笔画基本连贯，但可能存在一些瑕疵和不够圆润的笔画，整体表现较为稳定但仍有欠缺之处。',
    '笔法流畅，结构清晰，字形端庄，整体表现较为优秀，但可能存在个别细微错误。',
    '笔法精湛，字形工整规范，结构严谨，线条流畅自然，体现出高超的书法技艺和审美水平。'

  ]
  //函数：获得评论
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
  //函数获得随机数
  function getRandomInt (min, max) {
    min = Math.ceil(min); // 向上取整，确保最小值为整数
    max = Math.floor(max); // 向下取整，确保最大值为整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //函数让percent变量随机增长
  function percentageIncrease () {//随机让percentage增加
    const random = ref('')
    random.value = getRandomInt(0, 15)
    console.log('-----', random.value)
    percentage.value += random.value
    if (percentage.value > 100) {
      percentage.value = 100
    }
  }
  //设置percentage变量为零
  percentage.value = 0
  //设置ElMessage距离
  ElMessage.offset = 50;
  //函数：点击后可以选择文件
  const triggerFileInput = () => {
    score.value = null
    fileInput.value.click()
  }
  // 当用户选择了文件后，这个函数会获取用户选择的文件，并将文件存储到 file 变量中，同时创建一个临时的URL，用于在页面中预览用户选择的图片。
  const handleFileChange = event => {
    const files = event.target.files
    newUrl.value = ''
    if (files.length === 0) return
    file.value = files[0]
    imageUrl.value = URL.createObjectURL(files[0])
  }
  //上传图片
  const uploadImage = async () => {
    //如果用户没有上传图片
    if (!file.value) {
      ElMessage({
        message: '请选择一张照片',
        type: 'warning',
      })
      return
    }
    //如果用户没有选择字体
    if (!selectedFont.value) {
      ElMessage({
        message: '请选择字体',
        type: 'warning',
      })
      return
    }
    const id = userStore.userid//获取仓库中登录用户的id
    const formData = new FormData()//创建formData
    //添加发送请求的数据
    formData.append('font', selectedFont.value)
    formData.append('image', file.value)
    isActive.value = false
    isRight.value = 1
    // console.log('isright:', isRight)
    const timer = setInterval(percentageIncrease, 1000);//设置进度条
    console.log(parseInt(id))
    //开始发送请求
    try {
      const response = await fetch(`http://172.20.4.189:8080/upload/${parseInt(id)}`, {
        method: 'POST',
        body: formData,
      })
      //返回响应处理
      console.log('response is ', response)
      //如果相应成功
      if (response.ok) {
        clearInterval(timer); // 停止计时器
        percentage.value = 100
        const resData = await response.json()//获得相应数据
        console.log(resData.msg)
        console.log('resData is ', resData)
        //如果相应为success
        if (resData.msg === 'success') {
          // console.log('-------------------')
          score.value = resData.data.score
          comment.value = getComment(score.value)
          score.value = score.value.toFixed(2) * 100
          newUrl.value = resData.data.reimage
          //此处改动，修改原来照片的url地址
          imageUrl.value = newUrl.value
          ElMessage({
            message: '上传成功',
            type: 'success',
          })
          isActive.value = true
          clearInterval(timer)
          percentage.value = 0
        }
        //否则：相应信息为空
        else {
          isActive.value = true
          clearInterval(timer)
          percentage.value = 0
          ElMessage({
            message: '非常抱歉，您练习的字目前还没有录入字库中',
            type: 'warning',
          })
        }
      }
      //没有收到相应信息
      else {
        isActive.value = true
        clearInterval(timer)
        percentage.value = 0
        ElMessage({
          message: '上传失败',
          type: 'error'
        })
      }
    }
    //出现其他异常情况
    catch (error) {
      isActive.value = true
      clearInterval(timer)
      percentage.value = 0
      // console.error('上传出错:', error)
      ElMessage({
        message: '抛出异常',
        type: 'warning',
      })
    }
  }
  //字体对应
  const onConfirm = ({ selectedOptions }) => {
    showPicker.value = false;
    fieldValue.value = selectedOptions[0].text;
    console.log(fieldValue.value)
    if (fieldValue.value == '楷书') {
      selectedFont.value = 1
    }
    else if (fieldValue.value == '隶书') {
      selectedFont.value = 2
    }
    else if (fieldValue.value == '行书') {
      selectedFont.value = 3
    }
    else if (fieldValue.value == '草书') {
      selectedFont.value = 4
    }
  };
</script>
<template>
  <!-- <div class="container"> -->
  <div class="image-preview">
    <div class="container">
      <p v-if="newUrl!==''">上传成功的图片：</p>
      <img v-if="imageUrl" :src="imageUrl" alt="Image preview" class="uploaded-image"
        style="height: 40% ;width: 40%;" />
    </div>
  </div>
  <div :class="{active:isActive}">
    <p class=" showup" style="color: dodgerblue;">AI正在为您分析中....</p>
    <el-progress :percentage="percentage" :stroke-width="15" status="success" striped striped-flow :duration="10" />
  </div>
  <div v-if="score !== null" class="score">
    <van-cell title="您的分数是：" :value="score" />
    <van-cell title="评价" :value="comment" />
  </div>
  <van-space direction="vertical" fill>
    <input type="file" @change="handleFileChange" ref="fileInput" style="display:none" />
    <div class="button-group">
      <van-button type="primary" @click="triggerFileInput">
        <van-icon name="photograph" />
        选择您的书法照片</van-button>
    </div>
    <van-field direction="vertical" v-model="fieldValue" is-link readonly label="字体" placeholder="选择字体"
      @click="showPicker = true" />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
    <div class="button-group">
      <van-button type="success" @click="uploadImage"> <van-icon name="back-top" />上传并分析</van-button>
    </div>
  </van-space>
  <!-- </div> -->

</template>
<style>
  .active {
    display: none;
  }

  .uploaded-image {
    width: 150px;
    height: auto;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 调整按钮组与其他内容的间距 */
  }
</style>