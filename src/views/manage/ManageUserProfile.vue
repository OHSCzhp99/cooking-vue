<script setup>
import PageContainer from '../../components/PageContainer.vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus';

//1.准备数据模板
const formRef = ref()
//在pinia仓库解构出数据
const { user: { email, id, nickname, username }} = useUserStore()
// const userStore = useUserStore()
const form = ref({
  id,
  username,
  nickname,
  email
})

//2.表单修改规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '昵称必须是2-10位的非空字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

//3.提交
const submitForm = async () => {
  //等待校验结果
  await formRef.value.validate()
  //提交修改
  await userUpdateInfoService(form.value)
  //通知 user 模块，进行数据的更新
  // getUser()
  //提示用户
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单内容 -->
    <template #default>
      <el-row>
        <el-col :span="12">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="登录名称">
              <el-input v-model="form.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="个人邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交修改</el-button>
            </el-form-item>
          </el-form></el-col>
      </el-row>
    </template>
  </page-container>
</template>
 