<script setup>
import { Plus, Upload, Delete, Dish, Lock,Unlock} from '@element-plus/icons-vue'
import { menuGetListService,menuPayFlagService,menuPayService } from '@/api/menu.js'
import { ref } from 'vue';
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'



const userStore = useUserStore()
userStore.getUser()

// const menuExist = ref({
//   userId: '',
//   menuId: ''
// })


//获取全部食谱
const allMenuList = ref({})
const getAllMenuList = async()=>{
  const res1 = await menuGetListService();
  allMenuList.value = res1.data
}
getAllMenuList()

//购买视食谱
const payFormModel = ref({
  menuId: '',
  userId: userStore.user.id
})
const pay = async(e)=>{
  payFormModel.value.menuId = e
  console.log(payFormModel.value.userId,'userId');
  console.log(payFormModel.value.menuId,'menuId');
  await ElMessageBox.confirm('你确定要购买该食谱吗 (模拟支付)', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '手滑了'
  })
  await menuPayService(payFormModel.value)
  ElMessage.success('购买成功')
}

  
// if(payFlag==0){
//   payFlagBgc.value = ''
//   payFlagIcon.value = 'Lock'
// }else{
//   payFlagBgc.value = 'warning'
//   payFlagIcon.value = 'Unlock'
// }

</script>

<template>
  <div class="container">
    <div class="container-son">
      <div class="menu">
        <div class="menu-son" v-for="item in allMenuList" :key="item.id">
          <div class="menu-title">{{ item.title }} 
            <el-button type="warning" :icon="Lock" circle class="el-button" @click="pay(item.id)" />
          </div>
          <img :src="baseURL + '/image/' +item.coverImg" alt="">
          <!-- <div class="menu-need">
            <span><b>所需食材：</b></span>
            <div class="menu-need-detail">
              <div class="menu-need-detail-for">
                <div class="material">八角</div>
                <div class="load">10g</div>
              </div>
              <div class="menu-need-detail-for">
                <div class="material">八角</div>
                <div class="load">10g</div>
              </div>
              <div class="menu-need-detail-for">
                <div class="material">八角</div>
                <div class="load">10g</div>
              </div>
            </div>
          </div> -->
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

      width: 1200px;
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
          padding: 35px;
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
            user-select: none;
            filter: blur(4px);
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
            filter: blur(4px);
          }

        }
      }
    }
  }
}</style>
