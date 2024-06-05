<script setup>
import { cateGetListService } from '@/api/cate.js'
import { ref } from 'vue'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { baseURL } from '@/utils/request'
// import mitter from '../../mitt/mitt.js'

const formModel = ref({
  pageNum: 1,
  pageSize: 6,
  createUser: null,
  state: null,
  createFlag: 1
})



//1.调用获取美食帖子数据接口
const cateList = ref([])
const total = ref(0) //总条数

const getCateList = async () => {
  const res = await cateGetListService(formModel.value)
  cateList.value = res.data.items
  total.value = res.data.total
  console.log(res, 'res')
  console.log(cateList.value, 'cateList.value-内')
}
getCateList() //调用

//2.分页的操作
const onSizeChange = (size) => {
  //切换当前页显示页数时重新渲染
  formModel.value.pageNum = 1
  formModel.value.pageSize = size
  getCateList()
}
const onCurrentChange = (page) => {
  //更新当前页
  formModel.value.page = page
  getCateList()
}

//3.mitt传值

// const { proxy } = getCurrentInstance()
// const mitt = proxy.$mitt

// const detail = ()=>{
//     mitter.emit('postDetail',cateList.value)
// }
// console.log(cateList.value,'home页面');
</script>
<template>
  <div class="container">
    <div class="bg"></div>
    <div class="show">
      <div class="post">
        <div class="post-son" v-for="item in cateList" :key="item.id">
          <RouterLink :to="{ path: '/user/detail', query: { id: item.id } }" @click="detail">
            <div class="post-content">
              <div class="img">
                <img :src="baseURL + '/image/' + item.coverImg" alt="">
              </div>
              <div class="text">
                <div class="title">{{ item.title }}</div>
                <div class="content">{{ item.content }}</div>
                <div class="author">By：{{ item.nickname }}</div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="formModel.pageNum" v-model:page-size="formModel.pageSize"
          :page-sizes="[5, 7, 10]" :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total"
          @size-change="onSizeChange" @current-change="onCurrentChange"
          style="margin-top: 20px; justify-content: flex-end" />
      </div>

    </div>
  </div>
</template>

<!--  -->

<!--  -->


<style lang="scss" scoped>
.container {
  // width: 100vw;
  height: 1000px;
  // background-color: rgb(124, 108, 108);
  position: relative;

  .show {
    // background-color: rgb(92, 49, 49);
    // width: 1000px;
    position: absolute;
    left: 15%;
  }
}

.bg {
  background: url('@/assets/userBg.jpg') no-repeat center / contain;
  width: 100%;
  height: 645px;
}

.post {
  // margin: auto;
  // background-color: rgb(175, 209, 175);
  width: 1200px;
  // height: 2000px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 30px;
  border-left: 3px solid rgb(204, 200, 200);
  border-right: 3px solid rgb(204, 200, 200);

  a {
    color: #000;
    text-decoration: none;
  }

  .post-son {
    // background-color: rgb(132, 123, 123);
    width: 560px;
    height: 250px;
    margin-bottom: 20px;
    padding-top: 25px;
    padding-left: 30px;

    .post-content {
      display: flex;
      justify-content: space-around;
      // background-color: rgb(142, 53, 53);
    }

    //     border-top: 1px solid rgb(236, 233, 230);
    //     border-bottom: 1px solid rgb(236, 233, 230);
    //     .post-content{
    //         a{
    //             width: 200px;
    //         height: 200px;
    //         background-color: rgb(112, 33, 33);
    //         display: flex;
    //         justify-content: space-around;
    //         }

  }

  .img {
    // background-color: rgb(126, 183, 198);
    width: 250px;
    height: 250px;
    margin-left: -27px;

    // border-radius: 15px;
    img {
      width: 250px;
      height: 250px;
      object-fit: cover;
      // border-radius: 15px;
    }
  }

  .text {
    // display: flex;
    // flex-direction: column;
    // justify-content: space-around;
    margin-top: 20px;

    .title {
      font-size: 20px;
      // margin-top: 20px;
      // background-color: rgb(210, 114, 114);
      width: 230px;
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
      width: 230px;
      // height: 80px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .author {
      font-size: 14px;
      margin-top: 30px;
      color: rgb(83, 137, 224);
      font-weight: bold;
      // background-color: rgb(102, 67, 67);
    }
  }
}

.pagination {
  // background-color: rgb(190, 185, 185);

}
</style>
