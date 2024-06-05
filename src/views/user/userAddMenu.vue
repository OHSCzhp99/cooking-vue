<script setup>
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import CategorySelect from '../manage/components/CategorySelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// import { categoryGetAllService } from '@/api/category.js'
// import { cateAddService, cateEditService, cateDetailService } from '@/api/cate.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from '@/stores'
import { menuAddService } from '@/api/menu.js'


const userStore = useUserStore()
userStore.getUser()


const route = useRoute()
// console.log(route.query.id);
// const post_id = route.query.id
const MenuDetail = ref({
  title: '', //标题
  coverImg: '', //封面
  step: '', //内容
  userId: ''
})
// const createUserId = ref('')

// const getMenuDetail = async () => {
//   const res = await menuAddService(MenuDetail.value)
//   ElMessage.success('发布成功')
// }

const imgUrl = ref('')
//这个方法由elementplus提供的
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //这个由前端提供的预览图片
  MenuDetail.value.coverImg = uploadFile.raw
}

//食谱添加的提交按钮：
const onAdd = async (state) => {
  MenuDetail.value.userId = userStore.user.id
  MenuDetail.value.step = MenuDetail.value.step.replace(/<[^>]+>/g,"")
  console.log(MenuDetail.value,'MenuDetail.value');
  //formData对象还要另外创建
  const fd = new FormData()
  for (let key in MenuDetail.value) {
    fd.append(key, MenuDetail.value[key])
  }
  console.log(fd);
  await menuAddService(fd)
  ElMessage.success('发布成功')
  }
</script>

<template>
  <div class="container">
    <div class="container-son">
      <!-- 1.1 发表文章表单 -->
      <el-form :model="MenuDetail" ref="formRef" label-width="100px">
        <el-form-item label="食谱标题" prop="title">
          <el-input v-model="MenuDetail.title" placeholder="请输入标题" @input="changeMessage"></el-input>
        </el-form-item>  
        <el-form-item label="食谱封面" prop="coverImg">
          <!-- 1.1.1 文件上传 -->
          <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onSelectFile">
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="食谱内容" prop="content">
          <!-- 富文本编辑器用到组件vue-quill，需要用pnpm包下载 -->
          <div class="editor">
            <quill-editor ref="editorRef" theme="snow" v-model:content="MenuDetail.step" content-type="html">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="onAdd()" type="primary">发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.container{
  width: 1000px;
  border-left: 1px solid rgb(226, 220, 220);
  border-right: 1px solid rgb(226, 220, 220);
  margin: 0 auto;
  padding: 30px;
  margin-top: 20px;
}
.container-son{
  width: 700px;
  margin: 0 auto;
  padding-top: 15px;
  background-color: rgb(250, 250, 250);
  border: 1px rgb(175, 176, 172) solid;
  border-radius: 10px;
  // padding-left: -20px;
  padding-top: 30px;
  padding-right: 30px;
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transtition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-permary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 300px;
  }
}
</style>
