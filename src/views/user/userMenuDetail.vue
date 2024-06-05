<script setup>
import { Plus, Upload, Delete, Dish, Lock} from '@element-plus/icons-vue'
import { ref } from 'vue';
import { menuGetDetailService } from '@/api/menu.js'
import { useRoute, useRouter } from "vue-router"
import { baseURL } from '@/utils/request'

const route = useRoute()
const menu_id = route.query.id
const Menudetail = ref({})

const getMenuDetail = async()=>{
  console.log(menu_id,'eeee');
  const res = await menuGetDetailService(menu_id);
  Menudetail.value = res.data;
  console.log(res,'www');
  
}
getMenuDetail()
</script>

<template>
  <div class="container">
    <div class="container-son">
      <div class="menu">
        <div class="menu-son" v-for="item in Menudetail" :key="item.id">
          <div class="menu-title">
            {{ item.title }}
            <el-button type="warning" :icon="Lock" circle class="el-button"/>
          </div>
          <img :src="baseURL + '/image/' +item.coverImg" alt="">
          <div class="menu-step">
            <span><b>做法步骤：</b></span>
            <div class="menu-step-content">
              {{ item.step }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {

  // background-color: rgb(80, 28, 28);
  .container-son {
    // background-color: rgb(126, 103, 103);
    // width: 1200px;
    // margin: 0 auto;
    // padding: 0 0 0 10px;
    margin-top: 15px;


    .menu {
      // background-color: rgb(221, 141, 141);
      border-left: 1px rgb(213, 214, 209) solid;
      border-right: 1px rgb(213, 214, 209) solid;

      width: 900px;
      margin: 0 auto;
      // margin-top: 15px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding-left: 40px;
      padding-right: 40px;
      padding-top: 30px;

      // border: 1px saddlebrown solid;
      .menu-son {
        background-color: rgb(241, 241, 241);
        width: 530px;
        // text-align: center;
        // margin: 0 auto;
        margin-bottom: 20px;
        padding: 20px;
        border: 1px rgb(175, 176, 172) solid;
        border-radius: 10px;
        margin: 0 auto;
        .menu-title {
          // background-color: rgb(140, 162, 152);
          font-size: 18px;
          font-weight: bold;
          width: 500px;
          height: 30px;
          line-height: 30px;
          // padding-top: 10px;
          margin: 0 auto;
          text-align: center;
          // margin-right: 20px;
          position: relative;
          .el-button{
          margin-right: 0px;
          height: 30px;
          width: 30px;
          position: absolute;
          right: 0;
        }
        }
        
        img {
          width: 530px;
          height: 400px;
          margin-top: 10px;
          object-fit:cover;
          padding: 30px;
          border: 1px rgb(175, 176, 172) solid;
          // border-radius: 10px;
          box-sizing: border-box;
        }

        .menu-need {
          // background-color: rgb(169, 190, 226);
          margin-top: 15px;

          span {
            margin-left: 0;
          }

          .menu-need-detail {
            display: flex;
            flex-wrap: wrap;
            // margin-left: 5px;
          }

          .menu-need-detail-for {
            background-color: #838dbe;
            display: flex;
            justify-content: space-between;
            width: 245px;
            // margin: 0 auto;
            font-size: 15px;
            margin-left: 8px;
            margin-top: 10px;
            padding: 4px;
            // user-select: none;
            // filter: blur(4px);
          }
        }

        .menu-step {
          // background-color: rgb(135, 173, 179);
          margin-top: 15px;

          .menu-step-content {
            // width: 270px;
            // margin: 0 auto;
            margin-left: 8px;
            margin-top: 10px;
            font-size: 15px;
            background-color: #838dbe;
            width: 515px;
            user-select: none;
            // filter: blur(4px);
            padding: 5px;
          }

        }
      }
    }
  }
}</style>
