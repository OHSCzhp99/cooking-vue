<script setup>
import { watch, ref } from 'vue'
import { User, Lock, Aim } from '@element-plus/icons-vue'
import { userRegisterService, userLoginService, userRegisterFrontService, userLoginFrontService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

//1.控制注册和登录来回切换（切换逻辑直接在标签上方法改为false）
const isRegister = ref(false) //是注册还是登录
const isFront = ref(false) //是前台还是后台

//2.表单需要的校验字段
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
//3.表单需要的校验规则
// 非空校验 required: true，message消息提示，trigger触发校验的时机 blur(失焦) change(改变)
// 长度校验 min:xx，max: xx
// 正则校验 pattern(正则规则)
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 5,
      max: 16,
      message: '用户名必须是5-16位',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{5,16}$/,
      message: '密码必须是5-16位',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '重新输入密码以确认', trigger: 'blur' },
    {
      pattern: /^\S{5,16}$/,
      message: '密码必须是5-16位',
      trigger: 'blur'
    },
    {
      //这是ElementPlus的校验方法，去官网找就行
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
}

//4.监听注册和登录来回切换时清空输入的字符
watch(isRegister, () => {
  ruleForm.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
watch(isFront, () => {
  ruleForm.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

//5.要操作form表单的值，需在注册和登录的el-form标签加上 ref="form" 指定命名
const form = ref()
//6.1 注册按钮的操作
const register = async () => {
  await form.value.validate() //validate()是element提供的预检测（看看这几个输入框是否符合要求才能继续）
  await userRegisterService(ruleForm.value) //6.1.1 调用接口
  ElMessage.success('注册成功') //这里element按需导入需要在eslint说明一下
  isRegister.value = false //6.1.2 注册成功切换回登录
}
const registerFront = async () => {
  await form.value.validate() //validate()是element提供的预检测（看看这几个输入框是否符合要求才能继续）
  await userRegisterFrontService(ruleForm.value) //6.1.1 调用接口
  ElMessage.success('注册成功') //这里element按需导入需要在eslint说明一下
  isRegister.value = false //6.1.2 注册成功切换回登录
}

//6.2 登录按钮的操作 - 导入Pinia中的登录保存token方法，和路由跳转
const userStore = useUserStore()
const router = useRouter()
//6.2 登录按钮的操作
const login = async () => {
  await form.value.validate()
  const result = await userLoginService(ruleForm.value) //6.2.1 调用接口
  userStore.setToken(result.data) //6.2.2 将token存到本地Pinia
  ElMessage.success('登录成功')
  router.push('/') //6.2.3 登录成功直接进入
}
const loginFront = async () => {
  await form.value.validate()
  const result = await userLoginFrontService(ruleForm.value) //6.2.1 调用接口
  userStore.setToken(result.data) //6.2.2 将token存到本地Pinia
  ElMessage.success('登录成功')
  router.push('/user/home') //6.2.3 登录成功直接进入
}
</script>

<template>
  <el-row class="father">
    <el-col class="father-header">
      <RouterLink to="/user/home">
        <img src="@/assets/userLogo.png" alt="">
        <span>烹饪论坛</span>
      </RouterLink>
      <RouterLink class="entry" to="/user/home">
        进入网站首页
        <i class="iconfont icon-angle-right"></i>
        <i class="iconfont icon-angle-right"></i>
      </RouterLink>
    </el-col>
    <el-col class="bg"></el-col>
    <!-- 后台登录注册 -->
    <el-col v-if="isFront">
      <el-col :span="6" :offset="14" class="son">
        <!-- 注册页切换 -->
        <el-form :model="ruleForm" :rules="rules" ref="form" v-if="isRegister">
          <el-col class="title">后台管理系统注册</el-col>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input v-model="ruleForm.repassword" :prefix-icon="Aim" />
          </el-form-item>
          <el-form-item class="button" type="primary" auto-insert-space>
            <el-button @click="register">注册</el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" @click="isRegister = false">去登录</el-link>
            <el-link type="primary" @click="isFront = false" style="margin-left: 160px;">切换到前台用户登录页</el-link>
          </el-form-item>
        </el-form>
        <!-- 登录页切换 -->
        <el-form :model="ruleForm" :rules="rules" ref="form" v-else>
          <el-col class="title">后台管理系统登录</el-col>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item class="button" type="primary" auto-insert-space>
            <el-button @click="login">登录</el-button>
          </el-form-item>
          <el-form-item class="swap">
            <el-link type="primary" @click="isRegister = true">去注册</el-link>
            <el-link type="primary" @click="isFront = false" style="margin-left: 160px;">切换到前台用户登录页</el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <!-- 前台登录注册 -->
    <el-col v-else>
      <el-col :span="6" :offset="14" class="son">
        <!-- 注册页切换 -->
        <el-form :model="ruleForm" :rules="rules" ref="form" v-if="isRegister">
          <el-col class="title">前台用户访问注册</el-col>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input v-model="ruleForm.repassword" :prefix-icon="Aim" />
          </el-form-item>
          <el-form-item class="button" type="primary" auto-insert-space>
            <el-button @click="registerFront">注册</el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" @click="isRegister = false">去登录</el-link>
            <el-link type="primary" @click="isFront = true" style="margin-left: 160px;">切换到后台管理登录页</el-link>
          </el-form-item>
        </el-form>
        <!-- 登录页切换 -->
        <el-form :model="ruleForm" :rules="rules" ref="form" v-else>
          <el-col class="title">前台用户访问登录</el-col>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item class="button" type="primary" auto-insert-space>
            <el-button @click="loginFront">登录</el-button>
          </el-form-item>
          <el-form-item class="swap">
            <el-link type="primary" @click="isRegister = true">去注册</el-link>
            <el-link type="primary" @click="isFront = true" style="margin-left: 160px;">切换到后台管理登录页</el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.father-header {
  // background-color: rgb(110, 92, 92);
  height: 130px;
  font-size: 28px;
  padding-top: 30px;
  padding-left: 300px;
  border-bottom: 1px solid rgb(214, 208, 208);

  img {
    vertical-align: middle;
  }

  a {
    color: rgb(9, 9, 9);
    text-decoration: none;
  }

  span {
    margin-left: 20px;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;
    margin-left: 500px;

    i {
      font-size: 14px;
      color: rgb(72, 70, 70);
      letter-spacing: -5px;
    }
  }
}

.bg {
  // width: 100vw;
  // height: 100vh;
  // position: absolute;
  // background-image: url('@/assets/manageBg.jpg');
  // background-position: 0;
  // background-size: cover;
  // z-index: -1;
  background: url('@/assets/userBg.jpg') no-repeat center / cover;
  height: 700px;
  position: relative;
  z-index: -11;
}

.son {
  background-color: rgb(40, 106, 153);
  width: 600px;
  padding: 40px;
  margin-top: 250px;
  border-radius: 20px;
  position: absolute;
  // left: 5%;
  top: 54px;
}

.title {
  font-size: 25px;
  padding-bottom: 15px;
  text-align: center;
  color: rgb(99, 190, 204);
  /* background-color: rgb(26, 49, 76); */
}</style>
