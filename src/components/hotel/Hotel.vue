<template>
  <div>
    <Layout :style="{minHeight: '100vh'}">
      <Header class="header">
        <Menu
          mode="horizontal"
          :active-name="currentMenu"
        >
          <div class="layout-logo">
            来客酒店云管家
            <!-- <img src="/logo.png" width="250px" height="60px" /> -->
          </div>
          <div class="layout-logo">
            {{ currHotel && currHotel.hotelName ? currHotel.hotelName : ''}}
          </div>
          <div class="layout-nav">
            <MenuItem
              name="/roomState"
              to="/roomState"
            >房态</MenuItem>
            <MenuItem
              name="/order"
              to="/order"
            >订单</MenuItem>
            <MenuItem
              name="/guest"
              to="/guest"
            >会员</MenuItem>
            <MenuItem
              name="/report"
              to="/report"
            >报表</MenuItem>
            <MenuItem
              name="/setting"
              to="/setting"
            >设置</MenuItem>
          </div>
          <div class="layout-user">
            <a
              @click="myInfo.openIs = true"
              @mousemove="avatarSize='large'"
              @mouseout="avatarSize='default'"
            >
              <Avatar
                :size="avatarSize"
                :style="{background: '#f56a00'}"
              >{{ headText }}</Avatar>
            </a>
          </div>
        </Menu>

      </Header>
      <Content>
        <router-view />
      </Content>
    </Layout>
    <LoginModal />
    <MyInfo
      :open-is="myInfo.openIs"
      @my-info-close="myInfo.openIs = false"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import LoginModal from "./login/LoginModal.vue";
import MyInfo from "./user/MyInfo.vue";
export default {
  name: "HotelPage",
  components: {
    LoginModal,
    MyInfo
  },
  data() {
    return {
      appHeight: window.innerHeight,
      currentMenu: "/roomState",
      myInfo: { openIs: false },
      avatarSize: "default"
    };
  },
  computed: {
    headText() {
      return this.currUser && this.currUser.realName
        ? this.currUser.realName.charAt(0)
        : "囧";
    },
    ...mapState({
      isLogin: state => state.user.isLogin,
      isFirst: state => state.user.isFirst,
      currUser: state => state.user.currUser,
      currHotel: state => state.user.currHotel
    })
  },
  watch: {
    isLogin(isLogin) {
      console.log("isLogin", isLogin);
      console.log("isFirst", this.isFirst);
      if (!isLogin) {
        if (this.isFirst === 0) {
          let url = encodeURIComponent(this.$route.path);
          this.$router.push("/login/" + url);
        } else {
        }
      }
    }
  },
  mounted() {
    this.getCurrUser();
    if (this.$route.path === "/") {
      this.$router.push("roomState");
    }
    this.currentMenu = this.$route.path;

    // 初始化一些数据
    this.loadDic("pay_method");
    this.loadDic("channel");
  },
  methods: {
    ...mapActions({
      getCurrUser: "currUser",
      loadDic: "loadDic"
    })
  }
};
</script>

<style>
.header {
  background-color: #ffffff;
  /* border-bottom: 1px solid #e8eaec; */
}
.layout-logo {
  width: 150px;
  height: 60px;
  /* background: #5b6270; */
  border-radius: 3px;
  float: left;
  position: relative;
  font-size: 20px;
  font-weight: bold;
  /* top: 15px;
    left: 20px; */
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
}
</style>
