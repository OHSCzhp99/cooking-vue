<script setup>
import { Guide, Dish, Location, Edit, User, CaretBottom, Paperclip } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import avatar from '../../assets/avatar.png'

//1.从Pinia中获取用户数据（Pinia中已经调用了获取用户数据的接口）
const userStore = useUserStore()
userStore.getUser()

//2.下拉菜单切换
const router = useRouter()
const handleCommand = async (key) => {
  if (key == 'logout') {
    //退出登录操作
    await ElMessageBox.confirm('你真的要退出吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '是的',
      cancelButtonText: '手滑了'
    })
    //清除本地的数据（token + user信息）
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    //跳转操作
    router.push(`/manage/user/${key}`)
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 1. 侧边栏 -->
      <el-aside width="200px" class="containe-aside">
        <!-- 1.1 菜单Menu -->
        <el-menu
          :default-active="$route.path"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#434343"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          style="height: 100vh"
        >
          <!-- 1.1.1 菜单Menu-item -->
          <el-menu-item index="/manage/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/manage/postcategory">
            <el-icon><Paperclip /></el-icon>
            <span>帖子分类</span>
          </el-menu-item>
          <el-menu-item index="/manage/postedit">
            <el-icon><Edit /></el-icon>
            <span>帖子管理</span>
          </el-menu-item>
          <el-menu-item index="/manage/menu">
            <el-icon><Dish /></el-icon>
            <span>食谱管理</span>
          </el-menu-item>
          <!-- <el-menu-item index="/manage/link">
            <el-icon><Guide /></el-icon>
            <span>友情链接</span>
          </el-menu-item> -->
          <el-sub-menu index="/manage/person">
            <template #title>
              <el-icon><location /></el-icon>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/manage/user/profile">基本资料</el-menu-item>
            <el-menu-item index="/manage/user/avatar">更换头像</el-menu-item>
            <el-menu-item index="/manage/user/password">重置密码</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 2. 展示区域 -->
      <el-container>
        <!-- 2.1 头 -->
        <el-header class="container-header">
          <div class="header-user">
            当前用户：<strong>{{ userStore.user.nickname || userStore.user.username || "请先登录"}}</strong>
          </div>
          <!-- 2.1.1 下拉菜单 -->
          <el-dropdown placement="bottom-end" @command="handleCommand" class="header-dropdown">
            <span class="el-dropdown-link">
              <el-avatar :src="userStore.user.userPic || avatar" />
              <el-icon class="el-icon--right">
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar">更换头像</el-dropdown-item>
                <el-dropdown-item command="password">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <!-- 主内容 -->
        <el-main><RouterView></RouterView></el-main>
        <!-- 脚 -->
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.container-header {
  /* background-color: rgb(86, 161, 177); */
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgb(230, 228, 228);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.header-user {
  /* background-color: rgb(91, 74, 74); */
  width: 300px;
}
.header-dropdown {
  /* background-color: rgb(85, 35, 35); */
  height: 40px;
  padding-top: 10px;
  padding-right: 20px;
}
</style>
