<template>
  <Layout :style="{height: appHeight-65+'px'}">
    <Sider style="height: 100%">
      <Menu
        width="auto"
        style="height: 100%"
      >

        <MenuGroup
          title="客房销售报表"
          style=""
        >
          <MenuItem name="1-1">日报表</MenuItem>
          <MenuItem name="1-2">月报表</MenuItem>
        </MenuGroup>
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
  name: "ReportPage",
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
