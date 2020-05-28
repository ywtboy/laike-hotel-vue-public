<template>
  <Layout :style="{height: appHeight-65+'px'}">
    <Sider>
      <Menu
        theme="light"
        width="auto"
        :style="{height: '100%'}"
      >
        <MenuItem
          name="1"
          to="/setting/system"
        >
        系统设置
        </MenuItem>
        <MenuItem
          name="2"
          to="/setting/hotel"
        >
        门店设置
        </MenuItem>
        <MenuItem
          name="3"
          to="/setting/staff"
        >
        员工管理
        </MenuItem>

      </Menu>
    </Sider>
    <Content>
      <router-view />
    </Content>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SettingPage",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      appHeight: state => state.webSet.appHeight
    })
  }
};
</script>

<style>
</style>
