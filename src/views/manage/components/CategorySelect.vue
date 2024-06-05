<script setup>
import { categoryGetAllService } from '../../../api/category'
import { ref } from 'vue'

//1.调用显示分类的接口
const categoryList = ref([])
const getcategoryList = async () => {
  const res = await categoryGetAllService()
  categoryList.value = res.data
  console.log(categoryList.value, '分类')
}
getcategoryList()

//2.子组件这里要完成跟父组件之间的 接收和传递 数据
//2.1 接收父数据
defineProps({
  modelValue: {
    type: [Number, String]
  },
  //让父组件修改样式
  width: {
    type: String
  }
})
//2.2 传递数据给父
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <!-- 将v-model 拆解：:modelValue 和 @update:modelValue -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <!-- key用来循环的 label是展示给用户看的，value是提交给后端的 -->
    <el-option
      v-for="category in categoryList"
      :key="category.id"
      :label="category.categoryName"
      :value="category.id"
    ></el-option>
  </el-select>
</template>
