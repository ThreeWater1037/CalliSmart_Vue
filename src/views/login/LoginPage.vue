<script setup>
  import { User, Lock } from '@element-plus/icons-vue'//导入element-plus插件
  import { ref } from 'vue'//ref的使用
  import { watch } from 'vue'
  import { useUserStore } from '@/stores'//导入
  //导入封装好的注册api接口
  import { userRegisterService, userLoginService } from '@/api/user.js'
  import { useRouter } from 'vue-router'
  const form = ref()
  const isRegister = ref(true)
  //绑定校验
  // 1.创建对象，设置校验的数据
  const formModel = ref({
    username: '',
    password: '',
    // repassword: ''
  })
  //声明表单规则
  //trigger:'blur'  意为失焦时校验,change 实现实时校验
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      //设置长度校验规则
      { min: 5, max: 10, message: '长度需要在5-10位之间', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      //正则表达式的规则设置
      { pattern: /^\S{6,12}$/, message: '密码必须是6-12位非空字符', trigger: 'blur' }
    ],
  }
  const register = async () => {
    await form.value.validate()
    console.log('开始注册请求')
    await userRegisterService(formModel.value)//根据配置好的注册规则进行判断
    // 
    ElMessage.success('注册成功！请您登录')
    isRegister.value = false//切换到登录页面
  }
  //切换的时候数据不保留
  watch(isRegister, () => {
    formModel.value = {
      username: '',
      password: '',
      // repassword: ''
    }
  })
  const userStore = useUserStore()
  const router = useRouter()
  const login = async () => {
    await form.value.validate()//进行预校验
    const res = await userLoginService(formModel.value)//保存返回的结果，结果中有token，需要最终保存到pinia仓库中去
    console.log('登录', res)
    userStore.setToken(res.data.data.jwt)//仓库中存入token
    userStore.setId(res.data.data.id)//仓库中存入id
    userStore.setUsername(formModel.value.username)//存入username
    ElMessage.success('登录成功！')
    router.push('/')//跳转到首页
  }
</script>

<template>
  <el-row class="login-page">
    <!-- <el-col :span="12" class="bg"></el-col> -->
    <!-- 该部分对整体布局进行一个设置，最终可以通过其他插件再次进行移动端的优化 -->
    <el-col :span="12" :offset="6" class="form">
      <!-- formModel配置整个表单对应的数据对象 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1 class="special">注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="formModel.password"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="repassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="formModel.repassword"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            <p style="color: black;font-family: Arial, Helvetica, sans-serif;font-size: large;">← 返回</p>
          </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1 class="special">登录</h1>
        </el-form-item>
        <!-- prop设置使用哪个规则 -->
        <el-form-item prop="username">
          <!-- v-model部分设置绑定哪个数据，子属性 -->
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" name="password" :prefix-icon="Lock" type="password"
            placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <!-- <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div> -->
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            <p style="color: black;font-family: Arial, Helvetica, sans-serif;font-size: large;">注册 -></p>
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .login-page {
    height: 100vh;
    background-color: #fff;
    background-image: url('@/image/betterbg.jpg');

    /* 设置原部分的图片的相关信息 */
    /* .bg {
      background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
        url('@/assets/login_bg.jpg') no-repeat center / cover;
      border-radius: 0 20px 20px 0;
    } */
    .special {
      color: black
    }

    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      user-select: none;

      .title {
        margin: 0 auto;
      }

      .button {
        width: 100%;
      }

      .flex {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-family: Arial, Helvetica, sans-serif;
      }
    }



  }
</style>