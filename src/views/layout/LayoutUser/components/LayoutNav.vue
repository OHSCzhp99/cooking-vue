<script setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

//1.从Pinia中获取用户数据（Pinia中已经调用了获取用户数据的接口）
const userStore = useUserStore()
userStore.getUser()

const router = useRouter()
const confirm =()=>{
  //清除本地的数据（token + user信息）
  userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
}
</script>

<template>
    <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="true">
          <li><a href="javascript:;" @click="router.push('/user/my')"><i class="iconfont icon-user"></i>{{ userStore.user.nickname || userStore.user.username || "请先登录"}}</a></li>
          <li>
            <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          
        </template>
        <template v-else>
          <li><a href="javascript:;">请先登录</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.app-topnav {
  background: rgb(240, 240, 240);
  margin-top: -16px;
  margin-bottom: -16px;
  ul {
    display: flex;
    height: 40px;
    justify-content: flex-end;
    align-items: center;
    list-style: none;
    li {
      a {
        padding: 0 15px;
        color: #2b2a2a;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: rgb(168, 163, 154);
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
