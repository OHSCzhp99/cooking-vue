<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { baseURL } from '@/utils/request'

//1.从本地仓库拿到头像
// const userStore = useUserStore()
const { user: { email, id, nickname, username }, getUser } = useUserStore()
const userStore = useUserStore()
const form = ref({
  id,
  username,
  nickname,
  email
})
//将头像拼接上后台地址，以便能够回显
const imgUrl = ref(baseURL + "/image/" + userStore.user.userPic)
// imgUrl.value = baseURL + "/image/" + imgUrl
const uploadRef = ref()
const formModel = ref({
  avatar:''
})
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //这个由前端提供的预览图片
  formModel.value.avatar = uploadFile.raw 
console.log(avatar,'avatar');
}

const onUpdateAvatar = async () => {
  //formData对象还要另外创建
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发送请求更新头像
  await userUpdateAvatarService(fd)
  // userStore 重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('头像更新成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
