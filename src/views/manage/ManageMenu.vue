<script setup>
import PageContainer from "../../components/PageContainer.vue";
import { ref } from 'vue'
import { menuGetListService,menuStateService } from '../../api/menu'
import { Edit, Delete } from '@element-plus/icons-vue'
import CategoryEdit from './components/CategoryEdit.vue'
import { formatTime } from '../../utils/format'

//获取前台全部用户数据
const allMenuList = ref([])
const getAllMenuList = async()=>{
  const res = await menuGetListService();
  allMenuList.value = res.data
  console.log(res,'全部食谱数据');
}
getAllMenuList()

//按钮操作
//违规操作
const menuStateModel = ref({
  menuState: '',
  id: ''
})
const ban = async(row)=>{
  menuStateModel.value.menuState = "下架" 
  menuStateModel.value.id = row.id
  console.log(row.id);
  await ElMessageBox.confirm('你确定要封禁该食谱吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await menuStateService(menuStateModel.value)
  ElMessage.success("操作成功")
  getAllMenuList()
}
//恢复操作
const recovery = async(row)=>{
  menuStateModel.value.menuState = "正常" 
  menuStateModel.value.id = row.id
  await ElMessageBox.confirm('你确定要恢复该食谱吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await menuStateService(menuStateModel.value)
  ElMessage.success("操作成功")
  getAllMenuList()
}

</script>

<template>
  <page-container title="食谱管理">
    <template #extra>
     <el-button type="primary">食谱管理</el-button>
    </template>

    <!-- 2. 卡片的主体内容 -->
    <el-table v-loading="loading" :data="allMenuList" style="width: 100%" stripe>
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="title" label="标题" width="200px"></el-table-column>
      <el-table-column prop="nickname" label="作者" width="200px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200px">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="menuState" label="状态" width="100px"></el-table-column>
      <el-table-column label="操作">
        <!-- row是每一项，$index是下标 -->
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            plain
            @click="recovery(row, $index)"
          >恢复</el-button>
          <el-button
            type="danger"
            plain
            @click="ban(row, $index)"
          >下架</el-button>
        </template>
      </el-table-column>
      <!-- 空数据时的效果 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>
