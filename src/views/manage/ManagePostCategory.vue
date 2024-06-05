<script setup>
import PageContainer from '../../components/PageContainer.vue';
import { ref } from 'vue'
import { categoryGetAllService, categoryDelService } from '../../api/category'
import { Edit, Delete } from '@element-plus/icons-vue'
import CategoryEdit from './components/CategoryEdit.vue'

//卡片内容加载效果 loading
const loading = ref(false)

//1.调用获取分类数据接口
const categoryList = ref([])
const getcategoryList = async () => {
  loading.value = true //加载效果打开
  const res = await categoryGetAllService()
  categoryList.value = res.data //保存分类的数据
  loading.value = false //加载效果关闭
}
getcategoryList() //调用

//2.添加、编辑和删除按钮操作
const dialog = ref() //控制弹窗组件
const onAddCategory = () => {
  dialog.value.open({}) //给子组件传空参
}
const onEditCategory = (row) => {
  dialog.value.open(row) //给子组件传参
}
const onDelCategory = async (row) => {
  await ElMessageBox.confirm('你确定要删除该分类吗', '温馨特使', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await categoryDelService(row.id)
  ElMessage.success('删除成功')
  getcategoryList() //删除成功重新刷新
}

//3.弹窗完成后，子组件通知父组件接口刷新
const onSuccess = () => {
  getcategoryList() //重新调用一下就好了
}
</script>

<template>
  <page-container title="帖子分类">
    <!-- 1. 卡片内容的头部  -->
    <template #extra>
      <el-button type="primary" @click="onAddCategory">发布分类</el-button>
    </template>

    <!-- 2. 卡片的主体内容 -->
    <el-table v-loading="loading" :data="categoryList" style="width: 100%" stripe>
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="categoryName" label="名菜" width="200px"></el-table-column>
      <el-table-column prop="categoryType" label="名菜类型" width="200px"></el-table-column>
      <el-table-column label="操作">
        <!-- row是每一项，$index是下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            type="primary"
            plain
            @click="onEditCategory(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="onDelCategory(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 空数据时的效果 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <!-- 3.弹窗小组件 -->
    <category-edit ref="dialog" @success="onSuccess"></category-edit>
  </page-container>
</template>
