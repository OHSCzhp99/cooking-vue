import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userInfoService, userInfoFrontService } from '../../api/user'

export const useUserStore = defineStore('userStoe', () => {
  //1.用户登录时 - 保存token（token setToken removeToken）
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }

  //2.获取用户数据时 - 保存用户数据
  const user = ref({})
  const getUser = async () => {
    const res = await userInfoService()
    const resFront = await userInfoFrontService()
    user.value = res.data //将管理员信息存储本地Pinia
    user.value = resFront.data //将用户信息存储本地Pinia
  }
  //清空本地Pinia的用户信息，赋值空对象即可
  const setUser = (obj) => {
    user.value = obj
  }

  return {
    token,
    setToken,
    removeToken,
    user,
    getUser,
    setUser
  }
})
