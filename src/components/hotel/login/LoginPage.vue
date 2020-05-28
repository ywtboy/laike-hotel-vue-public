<template>
  <div class="myLogin" >
        <!-- <router-link :to="url">{{ url }}</router-link> -->
<Alert banner v-if="isLogin" style="top: 0px">
    <router-link :to="url">若登录成功没有跳转，请点击这里</router-link>
    </Alert>
        <center >
            <Card v-if="loging" dis-hover class="login">
                <p slot="title">手机号登录</p>
                <Form ref="loginForm" :model="loginInfo" :rules="loginRule" >
                    <FormItem  prop="mobileNum">
                        <Input  style="height: 40px" size="large" ref="mobileInput"
                        prefix="md-phone-portrait" @keyup.enter.native="focus('pwdInput')"
                        placeholder="请输入手机号" v-model="loginInfo.mobileNum"></Input>
                    </FormItem>
                    <FormItem  prop="userPwd">
                        <Input size="large" type="password" prefix="md-lock" @keyup.enter.native="submit"
                        placeholder="请输入密码"  ref="pwdInput"
                        v-model="loginInfo.userPwd"></Input>
                    </FormItem>
                    <FormItem>
                        <Button size="large" type="primary" long  @click="submit">登录</Button>
                    </FormItem>
                </Form>
                <div >
                    <Tooltip content="员工账号请在系统设置中添加" placement="top">
                        <a @click="loging = false">酒店拥有者注册</a>
                    </Tooltip>
                </div>
            </Card>
            <Card v-else dis-hover class="login">
                <p slot="title">注册</p>
                <Form ref="registerForm" :model="registerInfo" :rules="registerRule" >
                    <div v-show="isUserInfo">
                        <FormItem  prop="realName">
                            <Input width="40" style="height: 40px" size="large" prefix="ios-contact" placeholder="请输入您的真实姓名" 
                                v-model="registerInfo.realName"></Input>
                        </FormItem>
                        <FormItem  prop="mobileNum">
                            <Input width="40" style="height: 40px" size="large" prefix="md-phone-portrait" placeholder="请输入手机号" 
                                v-model="registerInfo.mobileNum"></Input>
                        </FormItem>
                        <FormItem  prop="userPwd">
                            <Input size="large" type="password" prefix="md-lock" placeholder="请输入密码" v-model="registerInfo.userPwd"></Input>
                        </FormItem>
                        <FormItem  prop="pwd">
                            <Input size="large" type="password" prefix="md-lock" placeholder="请再次输入密码" v-model="registerInfo.pwd"></Input>
                        </FormItem>

                        <FormItem>
                            <Button size="large" type="primary" long @click="regNext">下一步</Button>
                        </FormItem>
                    </div>

                    <div v-show="!isUserInfo">
                        <FormItem  prop="hotelName">
                            <Input width="40" style="height: 40px" size="large" prefix="md-home" placeholder="请输入酒店/宾馆名称" 
                                v-model="registerInfo.hotelName"></Input>
                        </FormItem>
                        <FormItem  prop="currRegion">
                            <Cascader :data="regionInfo" v-model="currRegion" placeholder="请选择省/市/县（区）"></Cascader>
                        </FormItem>
                        <FormItem  prop="address">
                            <Input width="40" style="height: 40px" size="large" prefix="ios-navigate" placeholder="请输入具体地址" 
                                v-model="registerInfo.address"></Input>
                        </FormItem>
                        <FormItem  prop="hotline">
                            <Input width="40" style="height: 40px" size="large" prefix="md-call" placeholder="请输入热线" 
                                v-model="registerInfo.hotline"></Input>
                        </FormItem>

                        <FormItem>
                            
                            <Button size="large" type="primary" long  @click="registerSubmit" >完成</Button>
                        </FormItem>
                    </div>
                    
                </Form>
                <div >
                    <Row>
                        <Col :span="10" style="float: left;"><a v-show="!isUserInfo" @click="isUserInfo = true">返回上一步</a></Col>
                        <Col :span="2">&nbsp;</Col>
                        <Col :span="10" style="float: right;"><a @click="loging = true">已有账号，去登录</a></Col>
                    </Row>
                    
                    
                </div>
            </Card>
             
            
        </center>

      
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { register } from "@/api/login.js";
export default {
  name: 'LoginPage',
  props: {
    url: String
  },
  data() {
      const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.loginInfo.pwd !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.registerForm.validateField('pwd');
                    }
                    callback();
                }
            };
      const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.loginInfo.userPwd) {
                    callback(new Error('两次密码不一致'));
                } else {
                    callback();
                }
            };
    return {
        loging: true,
        isUserInfo: true,
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
        registerInfo: {
            realName: '',
            mobileNum: '',
            userPwd: '',
            // 确认密码
            pwd: '',

            hotelName: '',
            countryCode: 'cn',
            provinceCode: '',
            cityCode: '',
            districtCode: '',
            address: '',
            hotline: '',

        },
        registerRule: {
            realName: [
                { required: true, message: '请输入您的姓名',}
            ],
            mobileNum: [
                { required: true, message: '请输入手机号', },
            ],
            userPwd: [
               { required: true, message: '请输入密码', },
            ],
            pwd: [
                { required: true, message: '请再次输入密码', },
            ],
            hotelName: [
                { required: true, message: '请输入酒店/宾馆名称',}
            ],
            address: [
                { required: true, message: '请输入具体地址', },
            ],
            hotline: [
                { required: true, message: '请输入热线电话', },
            ],
        },
        currRegion: [],
        regionInfo: [
            {
                value: '62',
                label: '甘肃',
                children: [
                    {
                        value: '08',
                        label: '平凉',
                        children: [
                            {
                                value: '22',
                                label: '灵台'
                            }
                        ]
                    }
                ]
            }
        ],
    }
  },
  computed: {
      ...mapState({
            isLogin: state => state.user.isLogin,
        })
  },
  watch: {
    isLogin(isLogin) {
        if (isLogin) {
            console.log('aaa');
            this.$router.push(this.url);
            this.$Message.success('登录成功！');
        }
    }
  },
  mounted() {
      console.log(this.isLogin);
      this.focus('mobileInput');
  },
  methods: {
      submit() {
        
          this.$refs.loginForm.validate(valid => {
              if (valid) {
                  this.login(this.loginInfo);
              }
          });
          
      },
      regNext() {
          this.isUserInfo = false; 
      },
      registerSubmit() {
          console.log(' 123',this.registerInfo);
          this.$refs.registerForm.validate(valid => {
              console.log(valid);
              if (valid) {
                  console.log(valid);
                this.registerInfo.provinceCode = this.currRegion[0];
                 console.log('1');
                this.registerInfo.cityCode = this.currRegion[1];
                console.log('1');
                this.registerInfo.districtCode = this.currRegion[2];
                console.log('1');
                console.log(this.registerInfo);
                if (this.registerInfo.userPwd !== this.registerInfo.pwd) {
                    this.$Message.error('两次密码不一致');
                    return;
                }else{
                    register(this.registerInfo).then(res => {
                        if (res.data.code === 0) {
                            this.$Message.success('注册成功，请登录');
                            this.loging = true;
                        } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        }
                    });
                }
              }
          });
          
      },
      ...mapActions({
         login: 'login' 
      }),
      focus(name) {
          this.$nextTick(() => this.$refs[name].focus());
      }
  },
}
</script>

<style>
.myLogin{
    height: 100vh;
    background-image: url('https://s2.ax1x.com/2019/03/22/A8YNuD.jpg');
    background-repeat:no-repeat; 
    background-size:100% 100%;
    -moz-background-size:100% 100%;
}
.login{
    top: 180px;
    /* left: 500px; */
    width: 400px;
}
</style>
