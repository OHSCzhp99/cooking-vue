<script setup>
// import { rowContextKey } from 'element-plus'
// import { Upload } from '@element-plus/icons-vue/dist/types'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import CategorySelect from './CategorySelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { cateAddService, cateEditService,cateDetailService } from '@/api/cate.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
// import axios from 'axios'
//控制抽屉显示隐藏
const visibleDrawer = ref(false)

//1.准备默认数据，和图片处理逻辑
const formModel = ref({
  title: '', //标题
  categoryId: null, //分类ID
  coverImg: '', //封面
  content: '', //内容
  state: '', //状态（已发布 或 草稿）
  createFlag: ''
})
const defaultForm = ref({ 
  title: '', //标题
  categoryId: null, //分类ID
  coverImg: '', //封面
  content: '', //内容
  state: '', //状态（已发布 或 草稿）
  createFlag: '' 
})

const imgUrl = ref('')
//这个方法由elementplus提供的
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //这个由前端提供的预览图片
  formModel.value.coverImg = uploadFile.raw
}

//1.1 存储请求数据
// const editorRef = ref() //富文本编辑器的ref
//1.2整体思路跟弹窗的思路差不多
const open = async (row) => {
  visibleDrawer.value = true //显示抽屉
  console.log(row, '抽屉open')
  if (row.id) {
    //美食帖子编辑回显
    console.log(row.id,'row.id1')
    //需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await cateDetailService(row.id)
    formModel.value = res.data
    console.log(formModel,'formModel.value')
    // 图片需要单独处理回显
    imgUrl.value = baseURL + "/image/" + formModel.value.coverImg
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    // const file = await imageUrlToFileObject(imgUrl.value, formModel.value.cover_img)
    // formModel.value.coverImg = file
  } else {
    console.log(row.id,'row.id2')
    //美食帖子添加
    formModel.value = { defaultForm } //基于默认数据重置form数据
    //重置抽屉表单里的图片
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

//2.美食帖子添加的提交按钮：
const emit = defineEmits(['success']) //通知父组件
const onAdd = async (state) => {
  //将已发布还是草稿状态 存入formModel
  formModel.value.state = state
  //formData对象还要另外创建
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    //编辑操作
    await cateEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    //添加操作
    console.log(formModel.value);
    console.log(fd);
    formModel.value.createFlag = 2
    await cateAddService(fd)
    // console.log(formModel.value.title);
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

//3.输入框失灵（可能嵌套太深）
// const changeMessage = (e) => {
//   formModel.value.title = e.targer.value
// }

// 将网络图片地址转换为 File 对象的函数
// async function imageUrlToFileObject(imageUrl, filename) {
//   try {
//     // 使用 Axios 下载图片数据
//     const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

//     // 将下载的数据转换成 Blob 对象
//     const blob = new Blob([response.data], {
//       type: response.headers['content-type']
//     })

//     // 创建 File 对象
//     const file = new File([blob], filename, {
//       type: response.headers['content-type']
//     })

//     return file
//   } catch (error) {
//     console.error('Error converting image URL to File object:', error)
//     return null
//   }
// }

defineExpose({
  open
})
</script>

<template>
  <!-- 1. 抽屉 -->

  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑帖子':'新增帖子'" direction="rtl" size="50%">
    <!-- 1.1 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="美食标题" prop="title">
        <el-input
          v-model="formModel.title"
          placeholder="请输入标题"
          @input="changeMessage"
        ></el-input>
      </el-form-item>
      <el-form-item label="美食分类" prop="categoryId">
        <category-select v-model="formModel.categoryId" width="100%"> </category-select>
      </el-form-item>
      <el-form-item label="美食封面" prop="coverImg">
        <!-- 1.1.1 文件上传 -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="美食内容" prop="content">
        <!-- 富文本编辑器用到组件vue-quill，需要用pnpm包下载 -->
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAdd('已发布')" type="primary">发布</el-button>
        <el-button @click="onAdd('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
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
