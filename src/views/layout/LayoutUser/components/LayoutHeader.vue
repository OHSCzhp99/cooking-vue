<script setup>

</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/user/home">首页</RouterLink>
      </h1>
      <div style="font-size: 24px;">烹饪论坛</div>
      <!-- <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">中菜</RouterLink>
        </li>
        <li>
          <RouterLink to="/">烘焙</RouterLink>
        </li>
        <li>
          <RouterLink to="/">小吃</RouterLink>
        </li>
        <li>
          <RouterLink to="/">其他</RouterLink>
        </li>
      </ul> -->
      <div class="add-post">
        <router-link to="/user/addpost">
          发布帖子
        </router-link>
      </div>
      <div class="add-menu">
        <router-link to="/user/addmenu">
          发布食谱
        </router-link>
      </div>
      <div class="menu">
        <router-link to="/user/menu">
          菜谱专区
        </router-link>
      </div>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 头部购物车 -->

    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  background: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(223, 218, 218);

  .container {
    display: flex;
    align-items: center;
    // justify-content: flex-end;
    height: 60px;
  }

  .logo {
    width: 200px;
    margin-left: 150px;
    margin-right: -60px;

    a {
      display: block;
      height: 45px;
      width: 100%;
      text-indent: -9999px;
      background: url('@/assets/userLogo.png') no-repeat center / contain;
    }
  }

  .app-header-nav {
    width: 420px;
    display: flex;
    padding-left: 40px;
    position: relative;
    z-index: 998;

    li {
      margin-right: 30px;
      width: 38px;
      text-align: center;
      list-style: none;

      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        color: #000;
        text-decoration: none;

        &:hover {
          color: sandybrown;
          border-bottom: 1px solid sandybrown;
        }
      }

      .active {
        color: saddlebrown;
        border-bottom: 1px solid saddlebrown;
      }
    }
  }
  .add-post{
    background-color: rgb(149, 194, 243);
    width: 90px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    margin-left: 400px;
    // margin-left: -50px;
    a{
      text-decoration: none;
      color: #000;
    }
  }
  .add-menu{
    background-color: rgb(149, 194, 243);
    width: 90px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    margin-left: 10px;
    a{
      text-decoration: none;
      color: #000;
    }
  }
  .menu {
    background-color: rgb(244, 209, 149);
    width: 90px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    margin-left: 50px;

    a {
      color: #000;
      text-decoration: none;
    }
  }

  .search {
    width: 200px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    margin-left: 15px;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
      margin-right: 10px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: forestgreen;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
