<script setup>
import { onBeforeMount } from 'vue';
import { ref, onMounted } from 'vue'
// import mitter from '../../mitt/mitt.js'
import { useRoute, useRouter } from "vue-router"
import { cateDetailService } from '@/api/cate.js'
import { commentGetListService, commentPostService } from '@/api/comment.js'
import { likesAddService, likesExistService, likesDeleteService } from '@/api/likes.js'
import { Star } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'

//路由传值
const route = useRoute()
console.log(route.query.id);
const post_id = route.query.id


//获取美食帖子详细
const postDetail = ref()
const createUserId = ref('')
const getCateDetail = async () => {
  const res = await cateDetailService(post_id)
  postDetail.value = res.data
  createUserId.value = res.data.createUserId
  console.log(res, '帖子详细')
  console.log(postDetail.value.coverImg, '图片');
}
getCateDetail()

//获取某条帖子的全部评论
const commentList = ref()
const getCommentList = async () => {
  const res = await commentGetListService(post_id)
  commentList.value = res.data
  console.log(res, '评论者的用户信息')
  console.log(post_id, 'post_id');
  console.log(commentList.value.userPic, 'userPic');
}
getCommentList()

//提交评论
//传给后端的参数
const formModel = ref({
  postId: null, //帖子id
  content: '', //内容
  toUserId: null //创帖子的人
})
//input提交评论按钮操作
const msg = ref('')
const post = async () => {
  formModel.value.postId = post_id
  formModel.value.content = msg.value
  formModel.value.toUserId = createUserId.value
  const res = await commentPostService(formModel.value)
  getCommentList()

}


const userStore = useUserStore()
//查看是否已收藏
const likeFlag = ref('')  //收藏标记
const existLikeFormModel = ref({
  userId: userStore.user.id,
  postId: post_id
})
const existLike = async () => {
  console.log(existLikeFormModel.value.userId, '====');
  console.log(existLikeFormModel.value.postId, '----');
  const res = await likesExistService(existLikeFormModel.value);
  if (res.data == 0) {
    likeFlag.value = ''
  } else {
    likeFlag.value = 'warning'
  }
}
existLike()

//添加收藏模板
const addLikeFormModel = ref({
  userId: userStore.user.id,
  postId: ''
})
//取消收藏模板
const delLikeFormModel = ref({
  userId: userStore.user.id,
  postId: ''
})

const addOrDelLike = async (e) => {

  if (likeFlag.value == '') {
    //添加收藏
    addLikeFormModel.value.postId = e
    await likesAddService(addLikeFormModel.value)
    ElMessage.success('收藏成功')
    likeFlag.value = 'warning'
    existLike()
  } else {
    //取消收藏
    await ElMessageBox.confirm('你确定要取消收藏吗', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '手滑了'
    })
    delLikeFormModel.value.postId = e
    const res = await likesDeleteService(delLikeFormModel.value)
    ElMessage.success('取消收藏成功');
    likeFlag.value = ''
    existLike()
  }

}



</script>

<template>
  <div class="container">
    <div class="container-son">
      <div class="detail">
        <div class="detail-post">
          <div class="img">
            <img :src="baseURL + '/image/' +postDetail.coverImg" alt="">
          </div>
          <div class="text">
            <div class="title">{{ postDetail.title }}</div>
            <div class="content">{{ postDetail.content }}</div>
            <div class="author">By：{{ postDetail.nickname }}</div>
            <div class="like">
              <el-button :type="likeFlag" :icon="Star" circle @click="addOrDelLike(postDetail.id)" />
            </div>
          </div>

        </div>
        <div class="detail-comment">
          <div class="comment-input">
            <img :src="baseURL + '/image/' +userStore.user.userPic" alt="">
            <form class="form" @submit.prevent="post">
              <input type="text" placeholder="输入评论..." v-model="msg">
              <button>提交</button>
            </form>
          </div>

          <div class="comment-show" v-for="item in commentList" :key="item.id">
            <img :src="baseURL + '/image/' +item.userPic" alt="">
            <div class="comment-show-content">
              <div class="content-author">
                {{ item.nickname }}
              </div>
              <div class="content-text" >
                {{ item.content }}
              </div>
              <div class="content-time">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-son {
  // background-color: rgb(164, 124, 124);
  width: 1200px;
  // height: 600px;
  margin: 0 auto;
  border-bottom: 1px solid rgb(228, 227, 225);

  .detail {
    // background-color: rgb(92, 177, 110);
    // width: 1100px;
    height: 400px;

    .detail-post {
      display: flex;
      // justify-content: space-between;

      .img {
        // background-color: rgb(126, 183, 198);
        width: 400px;
        height: 400px;

        // margin-left: -27px;
        img {
          width: 400px;
          height: 400px;
          object-fit:cover;
        }
      }

      .text {
        margin-top: 30px;
        margin-left: 50px;
        width: 500px;

        .title {
          font-size: 20px;
          // margin-top: 20px;
          // background-color: rgb(210, 114, 114);
          width: 500px;
          height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;

        }

        .content {
          font-size: 15px;
          margin-top: 20px;
          // background-color: rgb(46, 39, 39);
          // width: 230px;
          // height: 100px;
          -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
        }

        .author {
          font-size: 14px;
          margin-top: 30px;
          font-weight: bold;
          color: rgb(83, 137, 224);
          // background-color: rgb(102, 67, 67);
        }
      }

      .like {
        margin-top: 30px;
      }
    }

    .detail-comment {
      // background-color: rgb(68, 108, 117);
      margin-top: 30px;

      .comment-input {
        margin-top: 10px;
        // margin-bottom: 10px;
        height: 70px;
        // background-color: rgb(38, 25, 25);
        display: flex;

        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          vertical-align: middle;
          margin-left: 10px;
          border: 1px rgb(164, 163, 156) solid;
        }

        form {
          // background-color: rgb(168, 145, 145);
          margin-top: 5px;
        }

        input {
          width: 900px;
          height: 35px;
          margin-left: 10px;
          border-radius: 5px;
          padding-left: 10px;
          border: none;
          border-bottom: 1px rgb(155, 153, 152) solid;
          background-color: rgb(247, 246, 246);
        }

        button {
          width: 70px;
          height: 35px;
          margin-left: 20px;
          // margin-top: 5px;
          background-color: rgb(152, 214, 246);
          // border: 1px solid rgb(154, 149, 145);
          border: none;
          border-radius: 10px;
          color: rgb(255, 255, 255);
          font-size: 16px;
        }
      }

      .comment-show {
        display: flex;
        margin-top: 20px;
        margin-left: 30px;
        // background-color: rgb(156, 154, 197);
        border-left: 1px solid rgb(223, 220, 220);

        // border-right: 1px solid rgb(223, 220, 220);
        img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          margin-top: 10px;
          margin-left: 20px;
          border: 1px rgb(164, 163, 156) solid;
        }

        .comment-show-content {
          margin-left: 20px;
          width: 1000px;
          border-bottom: 1px solid rgb(188, 185, 183);
        }

        .content-author {
          margin-top: 5px;
          font-weight: bold;
        }

        .content-text {
          font-size: 15px;
          margin-top: 5px;

        }

        .content-time {
          font-size: 14px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
