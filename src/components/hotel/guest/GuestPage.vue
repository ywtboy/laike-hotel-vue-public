<template>
  <Layout :style="{height: appHeight-65+'px'}">
    <Sider style="height: 100%">
      <Menu
        width="auto"
        style="height: 100%"
        :active-name="currentMenu"
      >
        <!-- <MenuGroup
          title="客房销售报表"
          style=""
        > -->
          <MenuItem name="/guest/guestList" to="/guest/guestList">宾 客</MenuItem>
          <MenuItem name="/guest/vip" to="/guest/vip">会 员</MenuItem>
        <!-- </MenuGroup> -->
      </Menu>
    </Sider>
    <Content class="laike-hotel-content">
      <router-view />
    </Content>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'GuestPage',
  data() {
    return {
      currentMenu: "/guest/guestList"
    }
  },
  computed: {
    ...mapState({
      appHeight: state => state.webSet.appHeight
    })
  },
  mounted() {
    if (this.$route.path === "/guest") {
      this.$router.push("/guest/guestList");
    }
    this.currentMenu = this.$route.path;
  },
}
</script>

<style>

</style>
