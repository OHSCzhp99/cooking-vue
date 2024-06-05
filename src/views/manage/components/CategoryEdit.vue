<script setup>
//这是给分类的添加和编辑弹窗的封装小组件

import { ref } from 'vue'
import { categoryEditService, categoryAddService } from '@/api/category.js'
//弹窗（true开，false关）
const dialogVisible = ref(false)

//1.弹窗绑定数据
const formModel = ref({
  categoryName: '',
  categoryType: ''
})
//2.弹窗的数据规则
const rules = {
  categoryName: [
    { required: true, message: '请输入名菜', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '名菜必须是1-10位的非空字符', trigger: 'blur' }
  ],
  categoryType: [
    { required: true, message: '请输入类型', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '类型必须是1-10位的非空字符', trigger: 'blur' }
  ]
}

//3.定义一个方法，根据是否有传参来判断是添加还是编辑（添加无参，编辑有参）
const open = (row) => {
  dialogVisible.value = true
  //添加则默认输出文字，编辑则传名菜和类型过来拼接
  formModel.value = { ...row }
}

//4.对form表单进行操作
const formRef = ref()
const emit = defineEmits(['success']) //下面要用到子传父
const onSubmit = async () => {
  //点确认按钮后
  await formRef.value.validate() //表单校验
  const isEdit = formModel.value.id //如果有id证明是编辑
  console.log(formModel.value.id)
  if (isEdit) {
    await categoryEditService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await categoryAddService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false //关闭弹窗
  emit('success') //告诉父组件监听success方法
}

//向外暴露方法
defineExpose({
  open
})
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="22%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="名菜" prop="categoryName">
        <el-input v-model="formModel.categoryName" placeholder="请输入名菜"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="categoryType">
        <el-input v-model="formModel.categoryType" placeholder="请输入类型"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">手滑了</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
