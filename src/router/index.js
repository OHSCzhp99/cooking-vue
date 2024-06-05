import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/modules/user'

//路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //登录路由(管理端)
    { path: '/login', component: () => import('@/views/login/Login.vue') },
    //登录路由(访问端)
    // { path: '/loginUser', component: () => import('@/views/login/loginUser.vue') },
    

    //用户端布局路由
    {
      path:'/user',
      component: ()=>import('@/views/layout/LayoutUser/LayoutUser.vue'),
      redirect: '/user/home',
      children:[
        {
          path: '/user/home',
          component:()=>import('@/views/user/userHome.vue')
        },
        {
          path: '/user/detail',
          component:()=>import('@/views/user/userDetail.vue')
        },
        {
          path: '/user/my',
          component:()=>import('@/views/user/userMy.vue')
        },
        {
          path: '/user/menu',
          component:()=>import('@/views/user/userMenu.vue')
        },
        {
          path: '/user/addpost',
          component:()=>import('@/views/user/userAddPost.vue')
        },
        {
          path: '/user/addmenu',
          component:()=>import('@/views/user/userAddMenu.vue')
        },
        {
          path: '/user/menudetail',
          component:()=>import('@/views/user/userMenuDetail.vue')
        }
        
      ],
    },
    
    //管理端的布局路由
    {
      path: '/',
      component: () => import('@/views/layout/LayoutManage.vue'),
      redirect: '/manage/user',
      children: [
        {
          path: '/manage/user',
          component: () => import('@/views/manage/ManageUser.vue')
        },
        {
          path: '/manage/user/profile',
          component: () => import('@/views/manage/ManageUserProfile.vue')
        },
        {
          path: '/manage/user/avatar',
          component: () => import('@/views/manage/ManageUserAvatar.vue')
        },
        {
          path: '/manage/user/password',
          component: () => import('@/views/manage/ManageUserPassword.vue')
        },
        {
          path: '/manage/postcategory',
          component: () => import('@/views/manage/ManagePostCategory.vue')
        },
        {
          path: '/manage/postedit',
          component: () => import('@/views/manage/ManagePostEdit.vue')
        },
        {
          path: '/manage/menu',
          component: () => import('@/views/manage/ManageMenu.vue')
        },
        {
          path: '/manage/link',
          component: () => import('@/views/manage/ManageLink.vue')
        },
        {
          path: '/manage/person',
          component: () => import('@/views/manage/ManagePerson.vue')
        }
      ]
    }
  ]
})

//登录拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})
//登录拦截
// router.beforeEach((to) => {
//   const userStore = useUserStore()
//   if (!userStore.token && to.path !== '/loginUser') return '/loginUser'
// })
export default router
