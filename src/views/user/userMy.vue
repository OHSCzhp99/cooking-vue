<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useUserStore } from '@/stores'
import { userUpdateInfoFrontService, userUpdatePasswordFrontService, userUpdateAvatarFrontService } from '@/api/user'
import { useRouter } from 'vue-router'
import { Plus, Upload, Delete, Edit, KnifeFork, Key } from '@element-plus/icons-vue'
import { baseURL } from '@/utils/request'


//1.准备数据模板
const formRef = ref()
//在pinia仓库解构出数据
const { user: { email, id, nickname, username }, getUser } = useUserStore()
const form = ref({
  id,
  nickname,
  email
})

//2.表单修改规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { pattern: /^\S{2,15}$/, message: '昵称必须是2-15位的非空字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

//3.提交
const submitForm = async () => {
  //等待校验结果
  await formRef.value.validate()
  //提交修改
  await userUpdateInfoFrontService(form.value)
  //通知 user 模块，进行数据的更新
  getUser()
  //提示用户
  ElMessage.success('修改成功')
}
//------------------------------------------------------------


const formRef2 = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkDifferent = (rule, value, callback) => {
  // 校验新密码和原密码不能一样
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  // 校验确认密码必须和新密码一样
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}
const rules2 = ref({
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 3, max: 15, message: '原密码长度在3-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 3, max: 15, message: '新密码长度在3-15位之间', trigger: 'blur' },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 3, max: 15, message: '确认密码长度在3-15位之间', trigger: 'blur' },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const userStore = useUserStore()
const router = useRouter()

const submitForm2 = async () => {
  await formRef2.value.validate()
  await userUpdatePasswordFrontService(pwdForm.value)
  ElMessage.success('密码修改成功')

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}

const resetForm = () => {
  formRef2.value.resetFields()
}
//-------------------------------------------------------


//1.从本地仓库拿到头像
// const userStore = useUserStore()
//将头像拼接上后台地址，以便能够回显
const imgUrl = ref(baseURL + "/image/" + userStore.user.userPic)
// imgUrl.value = baseURL + "/image/" + imgUrl
const uploadRef = ref()
const formModel = ref({
  avatar: ''
})
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //这个由前端提供的预览图片
  formModel.value.avatar = uploadFile.raw
  console.log(avatar, 'avatar');
}

const onUpdateAvatar = async () => {
  //formData对象还要另外创建
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发送请求更新头像
  await userUpdateAvatarFrontService(fd)
  // userStore 重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('头像更新成功')
}

//----------------------------------------------------
import { cateGetMyListService, cateDelService } from '@/api/cate'
import { commentGetMyListService, commentDeleteService } from '@/api/comment'
import { likesGetListService, likesDeleteService } from '@/api/likes'
import { menuGetMyMenuService, menuGetMyPayMenuService, menuDeleteService } from '@/api/menu'


const activeName = ref('first')


//1.1 获取自己的帖子
const MyPostList = ref({})
const getMyPostList = async () => {
  const res = await cateGetMyListService(userStore.user.id)
  MyPostList.value = res.data
  console.log(MyPostList.value, '帖子编辑回显');
}
getMyPostList()
//1.2 删除自己的贴子
const deleteCate = async (e) => {
  await ElMessageBox.confirm('你确定要删除该帖子吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  const res = await cateDelService(e)
  ElMessage.success('删除成功')
  getMyPostList()
}

//2.1 获取自己的评论
const MyCommentList = ref({})
const getMyCommentList = async () => {
  const res = await commentGetMyListService(userStore.user.id)
  MyCommentList.value = res.data
  console.log(res.data);
}
getMyCommentList()

//2.2 删除自己的评论
const deleteComment = async (e) => {
  await ElMessageBox.confirm('你确定要删除该评论吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  const res = await commentDeleteService(e)
  ElMessage.success('删除成功')
  getMyCommentList()
}

//3.1 获取自己的收藏夹
const MyLikesList = ref({})
const getMyLikesList = async () => {
  const res = await likesGetListService(userStore.user.id)
  MyLikesList.value = res.data
  console.log(res.data, '收藏夹');
  console.log(MyLikesList.value.postId, '收藏夹');
}
getMyLikesList()

//3.2 删除收藏夹
const delLikeFormModel = ref({
  userId: userStore.user.id,
  postId: ''
})
const deleteLike = async (e) => {
  await ElMessageBox.confirm('你确定要取消该收藏吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  delLikeFormModel.value.postId = e
  const res = await likesDeleteService(delLikeFormModel.value)
  ElMessage.success('删除成功')
  getMyLikesList()
}

//3.1 获取自己创建 和 购买的食谱
const myMenuList = ref({})
const mypayMenuList = ref({})
const getMyAndPayMneuList = async () => {
  const res1 = await menuGetMyMenuService();
  console.log(res1, '我是创建的食谱');
  myMenuList.value = res1.data
  const res2 = await menuGetMyPayMenuService();
  mypayMenuList.value = res2.data
  console.log(res2, '我是购买的食谱');
}
getMyAndPayMneuList()

//3.2 删除食谱
const deleteMenu = async (e) => {
  console.log(e, 'eeeeeeee');
  await ElMessageBox.confirm('你确定要删除该食谱吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await menuDeleteService(e)
  ElMessage.success('删除成功')
  getMyAndPayMneuList()
}
</script>

<template>
  <div class="container">
    <div class="container-son">
      <div class="my">
        <img :src="baseURL + '/image/' + userStore.user.userPic" alt="">
        <span>{{ userStore.user.nickname }}</span>
      </div>
      <div class="select">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="">
          <el-tab-pane label="我的帖子" name="first">
            <div class="my-post">
              <div class="my-post-detail-for" v-for="item in MyPostList" :key="item.id">
                <RouterLink :to="{ path: '/user/detail', query: { id: item.id } }" class="post-router">
                  <div class="my-post-detail">
                    <img :src="baseURL + '/image/' + item.coverImg" alt="">
                    <div class="post-content">
                      <span class="post-title">{{ item.title }}</span>
                      <span class="post-text">{{ item.content }}</span>
                      <span class="post-time">{{ item.time }}</span>
                    </div>
                  </div>
                </RouterLink>
                <div class="post-button">
                  <RouterLink :to="{ path: '/user/addpost', query: { id: item.id } }">
                    <el-button :icon="Edit" circle type="primary"></el-button>
                  </RouterLink>
                  <el-button :icon="Delete" circle type="danger" @click="deleteCate(item.id)"></el-button>
                </div>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="我的评论" name="second">
            <div class="my-comment">
              <div class="my-comment-detail-for" v-for="item in MyCommentList" :key="item.id">
                <RouterLink :to="{ path: '/user/detail', query: { id: item.postId } }" class="comment-router">
                  <div class="my-comment-detail">
                    <div class="comment-top">
                      <span class="comment-text"><b>我的评论：</b>
                      </span>
                      <span style="font-size: 15px;">{{ item.content }}</span>
                    </div>
                    <div class="comment-cut">
                      <span class="cut-line"></span>
                      <span class="comment-time">{{ item.createTime }}</span>
                    </div>
                    <div class="comment-bottom">
                      <span class="comment-title">{{ item.title || '该食谱已被作者删除' }}</span>
                      <span class="comment-text" style="font-size: 14px;">{{ item.catecontent }}</span>
                    </div>
                  </div>
                </RouterLink>
                <div class="comment-button">
                  <el-button :icon="Delete" circle type="danger" @click="deleteComment(item.id)" />
                </div>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="我的收藏夹" name="third">
            <div class="my-like">
              <div class="my-like-detail" v-for="item in MyLikesList" :key="item.id">
                <RouterLink :to="{ path: '/user/detail', query: { id: item.postId } }" class="comment-router">
                  <div class="like-top">
                    <img :src="baseURL + '/image/' + item.coverImg" alt="">
                    <span class="like-title">{{ item.title || '该帖子已被作者删除' }}</span>
                    <div class="like-time">
                      <span><b>收藏于：</b></span>
                      <span class="">{{ item.createTime }}</span>
                    </div>
                  </div>
                </RouterLink>
                <div class="delete">
                  <el-button type="danger" :icon="Delete" circle @click="deleteLike(item.postId)" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我创建和购买的食谱" name="fourth">
            <div class="my-menu">
              <div class="my-menu-detail">
                <div class="left-shuoming">
                  <b>我创建的食谱：</b>
                  <div class="menu-left">
                    <div class="menu-left-detail-for" v-for="item in myMenuList" :key="item.id">
                      <RouterLink :to="{ path: '/user/menudetail', query: { id: item.id } }">
                        <div class="menu-left-detail">
                          <div class="left-title">
                            <div class="left-title-detail"><b>{{ item.title }}</b></div>
                            <el-button :icon="KnifeFork" circle class="left-button" />
                          </div>
                          <img :src="baseURL + '/image/' + item.coverImg" alt="">
                          <div class="left-step">
                            <span><b>做法步骤：</b></span>
                            <div class="left-step-detail">{{ item.step }}</div>
                          </div>
                        </div>
                      </RouterLink>
                      <div class="menu-delete">
                        <el-button type="danger" :icon="Delete" circle @click="deleteMenu(item.id)" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="menu-right">
                  <div class="right-shuoming">
                    <b>我购买的食谱：</b>
                    <div class="menu-right">
                      <div class="menu-right-detail-for" v-for="item in mypayMenuList" :key="item.id">
                        <RouterLink :to="{ path: '/user/menudetail', query: { id: item.menuId } }">
                          <div class="menu-right-detail">
                            <div class="right-title">
                              <div class="right-title-detail"><b>{{ item.title || '该食谱已被作者删除' }}</b></div>
                              <el-button :icon="Key" circle class="right-button" />
                            </div>
                            <img :src="baseURL + '/image/' + item.coverImg" alt="">
                            <div class="right-step">
                              <span><b>做法步骤：</b></span>
                              <div class="right-step-detail">{{ item.step }}</div>
                            </div>
                          </div>
                        </RouterLink>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="个人中心" name="fifth">
            <div class="my-center">
              <div class="my-center-detail">
                <div class="center-data">
                  <div><b>基本资料：</b></div>
                  <div class="data-top">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                      <el-form-item label="登录名称">
                        <el-input v-model="form.username" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="form.nickname"></el-input>
                      </el-form-item>
                      <el-form-item label="个人邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="submitForm">提交修改</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="center-password">
                  <div><b>修改密码：</b></div>
                  <div class="password-top">
                    <el-form ref="formRef2" :model="pwdForm" :rules="rules2" label-width="100px">
                      <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="pwdForm.old_pwd" show-password></el-input>
                      </el-form-item>
                      <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="pwdForm.new_pwd" show-password></el-input>
                      </el-form-item>
                      <el-form-item label="确认密码" prop="re_pwd">
                        <el-input v-model="pwdForm.re_pwd" show-password></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="submitForm2">修改密码</el-button>
                        <el-button @click="resetForm">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div class="center-avatar">
                  <div><b>修改头像：</b></div>
                  <div class="avatar-top">
                    <el-upload ref="uploadRef" :auto-upload="false" class="avatar-uploader" :show-file-list="false"
                      :on-change="onSelectFile">
                      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                      </el-icon>
                    </el-upload>
                    <br />
                    <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary" :icon="Plus"
                      size="large">选择图片</el-button>
                    <el-button @click="onUpdateAvatar" type="success" :icon="Upload" size="large">上传头像</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 三级路由 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-son {
  // background-color: rgb(235, 224, 224);
  width: 1200px;
  margin: 0 auto;
  margin-top: 50px;

  .my {
    img {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      vertical-align: middle;
      object-fit: cover;
      // border: 1px solid rgb(234, 233, 233);
    }

    span {
      margin-left: 20px;
      font-weight: bold;
      font-size: 20px;
    }

  }

  .select {
    // background-color: rgb(227, 236, 216);
    margin-top: 20px;

    // padding-left: 20px;
    .my-post {

      // background-color: rgb(158, 101, 101);
      .my-post-detail-for {
        display: flex;

        a {
          text-decoration: none;
          color: rgb(70, 68, 68);
        }

        .post-button {
          display: flex;
          flex-direction: column;
          // background-color: rgb(206, 173, 173);
          margin-left: 20px;
          margin-top: 30px;

          button {
            margin: 15px auto;
          }
        }
      }

      .my-post-detail {
        background-color: rgb(241, 241, 241);
        display: flex;
        margin-top: 15px;
        padding: 20px;
        border-radius: 10px;
        border: 1px rgb(175, 176, 172) solid;

        img {
          width: 130px;
          height: 150px;
          object-fit: cover;
        }

        .post-content {
          // background-color: rgb(128, 174, 117);
          width: 900px;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          border-left: 2px rgb(208, 206, 204) solid;
          margin-left: 25px;
          padding-left: 25px;

          .post-title {
            font-size: 18px;
            font-weight: bold;
          }

          .post-text {
            margin-top: 10px;
            font-size: 14px;
          }

          .post-time {
            margin-top: 15px;
            font-size: 14px;
          }

        }
      }
    }

    .my-comment {

      // background-color: rgb(221, 218, 218);
      .my-comment-detail-for {
        display: flex;

        a {
          text-decoration: none;
          color: #000;
        }

        .comment-button {
          margin-top: 20px;
          margin-left: 20px;
        }
      }

      .my-comment-detail {
        background-color: rgb(241, 241, 241);
        width: 1090px;
        // height: 100px;
        padding: 15px;
        margin-top: 15px;
        border-radius: 10px;
        border: 1px rgb(175, 176, 172) solid;


        .comment-top {
          display: flex;

          .comment-text {
            width: 110px;
          }
        }

        .comment-cut {
          display: flex;

          .cut-line {
            border-bottom: 3px rgb(186, 190, 190) solid;
            width: 500px;
            margin: 13px 0;

          }

          .comment-time {
            margin-left: 20px;
            font-size: 14px;
            padding-top: 3px;
            color: rgb(129, 131, 131);
          }
        }

        .comment-bottom {
          display: flex;
          flex-direction: column;

          .comment-title {
            // font-size: 16px;
            font-weight: bold;
            color: rgb(91, 174, 195);
          }

          .comment-text {
            font-size: 15px;
            margin-top: 3px;
            color: rgb(169, 163, 163);
          }
        }
      }
    }

    .my-like {
      display: flex;
      margin-top: 15px;

      a {
        text-decoration: none;
        color: #000;
      }

      .my-like-detail {
        width: 200px;
        margin-right: 30px;

        .like-top {
          background-color: rgb(241, 241, 241);
          border: 1px rgb(175, 176, 172) solid;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          text-align: center;

          img {
            width: 150px;
            margin: 0 auto;
            height: 130px;
            object-fit: cover;
            margin-top: 10px;
          }

          .like-title {
            font-weight: bold;
            margin-top: 10px;
            overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
          }

          .like-time {
            font-size: 14px;
            margin-top: 10px;
          }

        }

        .delete {
          margin-top: 10px;
          margin-left: 70px;
        }
      }
    }

    .my-menu {

      // background-color: rgb(154, 91, 91);
      .my-menu-detail {
        // background-color: rgb(148, 130, 28);
        margin-top: 15px;
        display: flex;

        .left-shuoming {

          width: 580px;
        }

        .menu-left {
          // background-color: rgb(74, 68, 68);
          width: 580px;
          display: flex;
          flex-wrap: wrap;

          margin-top: 15px;

          .menu-left-detail-for {
            margin-right: 30px;
            margin-bottom: 30px;

            a {
              text-decoration: none;
              color: #000;
            }

            .menu-left-detail {
              background-color: rgb(241, 241, 241);
              width: 250px;
              height: 320px;
              text-align: center;
              border-radius: 10px;
              border: 1px rgb(175, 176, 172) solid;

              .left-title {
                font-size: 18px;
                margin-top: 8px;
                // width: 200px;
                // margin: 0 auto;
                // display: flex;
                // text-align: center;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .left-button {
                  position: absolute;
                  top: -3px;
                  right: 25px;
                  background-color: rgb(212, 228, 245);
                }
              }

              img {
                width: 200px;
                height: 200px;
                object-fit: cover;
                margin-top: 8px;
                // margin: a auto;
                padding: 13px;
                border: 1px rgb(175, 176, 172) solid;
                // border-radius: 10px;
                box-sizing: border-box;
              }

              .left-step {
                .left-step-detail {
                  // background-color: rgb(158, 130, 130);
                  width: 230px;
                  height: 40px;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 14px;
                  margin: 0 auto;
                  // padding-bottom: 10px;
                }
              }
            }

            .menu-delete {
              margin-top: 10px;
              margin-left: 110px;

            }
          }
        }

        .right-shuoming {
          // border-left: 1px solid #000;
          border-left: 3px solid rgb(147, 144, 144);
          width: 580px;
          margin-top: -15px;
          padding-left: 40px;
        }

        .menu-right {
          // background-color: rgb(74, 68, 68);
          width: 580px;
          display: flex;
          flex-wrap: wrap;
          // padding-left: 10px;
          margin-top: 15px;

          .menu-right-detail-for {
            margin-right: 30px;
            margin-bottom: 30px;

            a {
              text-decoration: none;
              color: #000;
            }

            .menu-right-detail {
              background-color: rgb(241, 241, 241);
              width: 250px;
              height: 320px;
              text-align: center;
              border-radius: 10px;
              border: 1px rgb(175, 176, 172) solid;

              .right-title {
                font-size: 18px;
                margin-top: 8px;
                // display: flex;
                // text-align: center;
                position: relative;

                .right-button {
                  position: absolute;
                  top: -3px;
                  right: 25px;
                  background-color: rgb(241, 221, 171);
                }
              }

              img {
                width: 200px;
                margin-top: 8px;
                height: 200px;
                object-fit: cover;
                // margin: a auto;
                padding: 13px;
                border: 1px rgb(175, 176, 172) solid;
                // border-radius: 10px;
                box-sizing: border-box;
              }

              .right-step {
                .right-step-detail {
                  // background-color: rgb(158, 130, 130);
                  width: 230px;
                  height: 40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 14px;
                  margin: 0 auto;
                  // padding-bottom: 10px;
                }
              }
            }

            .menu-delete {
              margin-top: 10px;
              margin-left: 110px;

            }
          }
        }
      }
    }

    .my-center {
      height: 800px;

      .my-center-detail {
        // background-color: rgb(212, 205, 205);
        margin-top: 15px;
        display: flex;
        flex-flow: row wrap;

        .center-data {
          width: 500px;
          background-color: rgb(241, 241, 241);
          padding: 20px;
          border-radius: 10px 10px 0 0;
          border: 1px rgb(175, 176, 172) solid;

          .data-top {
            margin-left: -25px;
            margin-top: 20px;
            width: 500px;
          }
        }

        .center-password {
          width: 500px;
          background-color: rgb(241, 241, 241);
          padding: 20px;
          border-radius: 10px;
          margin-left: 60px;
          border: 1px rgb(175, 176, 172) solid;

          .password-top {
            margin-left: -25px;
            margin-top: 20px;
            width: 500px;

          }
        }

        .center-avatar {
          width: 500px;
          background-color: rgb(241, 241, 241);
          padding: 20px;
          border-radius: 0 0 10px 10px;
          margin-top: -20px;
          border: 1px rgb(175, 176, 172) solid;
          border-top: none;

          .avatar-top {
            // margin-left: -25px;
            margin-top: 20px;
            width: 500px;
            // margin: 0 auto;
          }
        }
      }
    }
  }
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
