<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "app",
  data() {
    return {
      appHeight: window.innerHeight
    };
  },
  components: {},
  beforeCreate() {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      window.location = "/m/";
    }
  },
  mounted() {
    // 动态改变页面高度
    var vm = this;
    window.onresize = function setHeight() {
      vm.appHeight = window.innerHeight;
      vm.setAppHeight(window.innerHeight);
    };
  },
  methods: {
    ...mapMutations({
      setAppHeight: "setAppHeight"
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* font: 1.1em sans-serif; */
  /* font-weight:bold; */
}
</style>
