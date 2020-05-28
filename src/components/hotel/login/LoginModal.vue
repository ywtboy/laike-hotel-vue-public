<template>
  <div>
      <modal width="400" v-model="openIs" :closable="false" :mask-closable="false" footer-hide >
            <!-- <Card dis-hover class="login"> -->
                <p slot="header" style="text-align:center">登录超时，请重新登录</p>
                <Form ref="loginForm" :model="loginInfo" :rules="loginRule" >
                    <FormItem  prop="mobileNum">
                        <Input width="40" style="height: 40px" size="large" prefix="md-phone-portrait" placeholder="请输入手机号" 
                            v-model="loginInfo.mobileNum"></Input>
                    </FormItem>
                    <FormItem  prop="userPwd">
                        <Input ref="pwdInput" size="large" type="password" prefix="md-lock" 
                            placeholder="请输入密码" v-model="loginInfo.userPwd"
                            @keyup.enter.native="submit"
                            ></Input>
                    </FormItem>
                    <FormItem>
                        <Button size="large" type="primary" long @click="submit">登录</Button>
                    </FormItem>
                    
                </Form>

            <!-- </Card> -->
      </modal>
      
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
export default {
  name: 'LoginModal',
  props: {
    url: String
  },
  data() {
    return {
        openIs: false,
        loginInfo: {
            mobileNum: null,
            userPwd: null,
        },
        loginRule: {
            mobileNum: [
                { required: true, message: '请输入手机号',}
            ],
            userPwd: [
                { required: true, message: '请输入密码', },
            ],
        },
    }
  },
  computed: {
      ...mapState({
            isLogin: state => state.user.isLogin,
            isFirst: state => state.user.isFirst,
            currUser: state => state.user.currUser,
        })
  },
  watch: {
    isLogin(isLogin) {
          if (!isLogin) {
              if (this.isFirst !== 0) {
                  this.openIs = true;
                  this.loginInfo.mobileNum = this.currUser.mobileNum;
                  this.$nextTick(() => this.$refs['pwdInput'].focus());
              } 
          } else {
            this.openIs = false;
            this.$Message.success('登录成功！');
            this.$refs.loginForm.resetFields();
          }
      }
  },
  methods: {
      submit() {
          this.$refs.loginForm.validate(valid => {
              if (valid) {
                  this.login(this.loginInfo);
              }
          });
      },
      ...mapActions({
         login: 'login' 
      }),
  },
}
</script>

<style>
.myLogin{
    height: 100%;
    background-image: url('http://img.netbian.com/file/2017/1126/f6b5361574f1257f0e70da58a503e7c9.jpg');
}
.login{
    /* top: 180px; */
    /* left: 500px; */
    /* width: 400px; */
}
</style>
