<script setup>
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import CategorySelect from '../manage/components/CategorySelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { categoryGetAllService } from '@/api/category.js'
import { cateAddService, cateEditService, cateDetailService } from '@/api/cate.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import { useRoute, useRouter } from "vue-router"


//1.编辑进来的：根据路由跳转得到具体帖子id，获取美食帖子详细进行回显
const route = useRoute()
// console.log(route.query.id);
const post_id = route.query.id
const postDetail = ref({
  title: '', //标题
  categoryId: '', //分类ID
  coverImg: '', //封面
  content: '', //内容
  state: '', //状态（已发布 或 草稿）
  createFlag: 1
})
const createUserId = ref('')
const getCateDetail = async () => {
  const res = await cateDetailService(post_id)
  postDetail.value = res.data
  //图片需要单独处理回显
  imgUrl.value = baseURL + "/image/" + postDetail.value.coverImg
  createUserId.value = res.data.createUserId
  console.log(res, 'res')
  console.log(postDetail.value, '帖子');
}
if (post_id != null) {
  getCateDetail()
}

const imgUrl = ref('')
//这个方法由elementplus提供的
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //这个由前端提供的预览图片
  postDetail.value.coverImg = uploadFile.raw
}


//2.美食帖子添加的提交按钮：
// const emit = defineEmits(['success']) //通知父组件
const onAdd = async (state) => {
  //将已发布还是草稿状态 存入formModel
  postDetail.value.state = state
  postDetail.value.content = postDetail.value.content.replace(/<[^>]+>/g,"")
  //formData对象还要另外创建
  const fd = new FormData()
  for (let key in postDetail.value) {
    fd.append(key, postDetail.value[key])
  }
  if (postDetail.value.id) {
    //编辑操作
    await cateEditService(fd)
    ElMessage.success('修改成功')
    // emit('success', 'edit')
  } else {
    //添加操作
    console.log(postDetail.value);
    console.log(fd);
    postDetail.value.createFlag = 1
    await cateAddService(fd)
    // console.log(formModel.value.title);
    ElMessage.success('添加成功')
    // emit('success', 'add')
  }
}
</script>

<template>
  <div class="container">
    <div class="container-son">
      <!-- 1.1 发表文章表单 -->
      <el-form :model="postDetail" ref="formRef" label-width="100px">
        <el-form-item label="美食标题" prop="title">
          <el-input v-model="postDetail.title" placeholder="请输入标题" @input="changeMessage"></el-input>
        </el-form-item>
        <el-form-item label="美食分类" prop="categoryId">
          <category-select v-model="postDetail.categoryId" width="100%"> </category-select>
        </el-form-item>
        <el-form-item label="美食封面" prop="coverImg">
          <!-- 1.1.1 文件上传 -->
          <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onSelectFile">
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="美食内容" prop="content">
          <!-- 富文本编辑器用到组件vue-quill，需要用pnpm包下载 -->
          <div class="editor">
            <quill-editor ref="editorRef" theme="snow" v-model:content="postDetail.content" content-type="html">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="onAdd('已发布')" type="primary">发布</el-button>
          <el-button @click="onAdd('草稿')" type="info">草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 1000px;
  border-left: 1px solid rgb(226, 220, 220);
  border-right: 1px solid rgb(226, 220, 220);
  margin: 0 auto;
  padding: 30px;
  margin-top: 20px;
}

.container-son {
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
