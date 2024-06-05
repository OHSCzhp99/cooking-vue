<script setup>
import PageContainer from '../../components/PageContainer.vue';
import { Edit, Delete } from '@element-plus/icons-vue'
import CategorySelect from './components/CategorySelect.vue'
import CateEdit from './components/CateEdit.vue'
import { ref } from 'vue'
import { cateGetListService,cateDelService } from '@/api/cate.js'
import { formatTime } from '../../utils/format'

//2.用接口数据的id跟子组件做互动（用v-model绑定）,同时也是请求接口参数对象
const category = ref({
  pageNum: 1,
  pageSize: 5,
  createUser: null,
  state: null,
  createFlag: 1
})

//3.获取美食帖子接口
const cateList = ref([]) //美食帖子数据
const total = ref(0) //总条数
const loading = ref(false) //loading加载效果
const getCateList = async () => {
  loading.value = true
  const res = await cateGetListService(category.value)
  cateList.value = res.data.items
  total.value = res.data.total
  console.log(res, '美食帖子')
  console.log(cateList.value, 'cateList.value')
  loading.value = false
}
getCateList()

//4.分页的操作
const onSizeChange = (size) => {
  //切换当前页显示页数时重新渲染
  category.value.pageNum = 1
  category.value.pageSize = size
  getCateList()
}
const onCurrentChange = (page) => {
  //更新当前页
  category.value.page = page
  getCateList()
}

//5.搜索和重置的操作
const onSearch = () => {
  category.value.pageNum = 1
  getCateList()
}
const onReset = () => {
  category.value.pageNum = 1
  category.value.createUser = null
  category.value.createUser = null
  getCateList()
}

//6.添加编辑删除按钮的操作
//6.1 准备请求数据
const cateEditRef = ref() //响应式抽屉
const onAddCate = () => {
  cateEditRef.value.open({})
}
const onEditCate = (row) => {
  cateEditRef.value.open(row)
  console.log(row, '编辑按钮')
}
const onDelCate = async (row) => {
  await ElMessageBox.confirm('你确定要删除该分类吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await cateDelService(row.id) //删除
  ElMessage.success('删除成功')
  getCateList()
}

//7.添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    //如果是添加，则渲染第一页（后端接口sql语句倒序查询就行）
    category.value.pageNum = 1
  }
  //无论添加或编辑完成后 都刷新
  getCateList()
}
</script>
<template>
  <page-container title="帖子编辑">
    <!-- 1. 卡片内容的头部  -->
    <template #extra>
      <el-button type="primary" @click="onAddCate">发布帖子</el-button>
    </template>

    <!-- 2.1 卡片的主体内容 - 表单(搜索) -->
    <el-form inline>
      <el-form-item label="美食分类：">
        <!-- Vue3 => v-model 等于 :modelValue 和 @update:modelValue 的简写 -->
        <category-select v-model="category.createUser"></category-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="category.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 2.2 卡片的主体内容 - 表格 -->
    <el-table :data="cateList" v-loading="loading">
      <el-table-column label="标题" prop="categoryName">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" prop="categoryType"></el-table-column> -->
      <el-table-column label="作者" prop="nickname"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime">
        <template #default="{ row }">
          {{ formatTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button :icon="Edit" type="primary" plain @click="onEditCate(row)"></el-button>
          <el-button :icon="Delete" circle type="danger" plain @click="onDelCate(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 2.3 卡片的底部 - 分页 -->
    <el-pagination
      v-model:current-page="category.pageNum"
      v-model:page-size="category.pageSize"
      :page-sizes="[5, 7, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 3. 抽屉 -->
    <cate-edit ref="cateEditRef" @success="onSuccess"></cate-edit>
  </page-container>
</template>
