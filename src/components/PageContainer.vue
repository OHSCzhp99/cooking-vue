<script setup>
//父传子（因为模板是子）
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <!-- 1. 卡片插槽 -->
  <el-card class="page-container">
    <!-- 1.1 头部 -->
    <template #header>
      <div class="header">
        <!-- 1.1.1 标题 -->
        <span>{{ title }}</span>
        <!-- 1.1.2 按钮 -->
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>

    <!-- 2. 内容插槽 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
