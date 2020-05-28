<template>
  <div>
      <Drawer v-model="isOpen"  width="300"
        @on-visible-change="openOrClose">
        <div style="">
            <center>
                <Avatar size="large" :style="{background: '#f56a00'}">{{ headText }}</Avatar>
                <h1>{{ currUser.realName }}</h1>
                <h3>系统到期时间： 
                    {{ currHotel && currHotel.activationEndTime ?  
                     new Date(currHotel.activationEndTime).Format("yyyy-MM-dd hh:mm") :'' }}
                </h3>
            </center>
            
            <Row>
                <Col :span="10">
                    <Button @click="pwdIsOpen=true">修改密码</Button>
                </Col>
                <Col :span="10" style="float: right;">
                    <Button @click="logout">退出系统</Button>
                </Col>
            </Row>
            
            
        </div>
        <div>
            <Divider orientation="left">当班信息</Divider>
            <Alert type="success" >当  班 人 ：{{ onDutyInfo.onComingRealName ? onDutyInfo.onComingRealName : '无' }}</Alert>
            <Alert type="success" >接班时间：{{ onDutyInfo.onComingTime ? onDutyInfo.onComingTime : '第一次' }}</Alert>
            
            <Alert type="success" >接班现金 ：
                <span class="redFont">
                {{ onDutyInfo.lastHandoverCash ? onDutyInfo.lastHandoverCash : '第一次' }} 
                </span> 元
            </Alert>
            
            <Button type="error" @click="handoverIsOpen = true" long>交 班</Button>
            
            
            <Divider orientation="left">收银台</Divider>
            <!-- <Alert type="success" >当前现金 ：
                <span class="redFont">
                {{ onDutyInfo.currentCash ? onDutyInfo.currentCash : '0' }}
                </span>
                 元
            </Alert> -->
            <Alert type="success">
                当前现金 ：
                <span class="redFont">
                {{ onDutyInfo.currentCash ? onDutyInfo.currentCash : '0' }}
                </span>
                 元
                <template slot="desc">
                    <div slot="content">
                        接班现金： 
                        <span class="redFont">
                        +{{ onDutyInfo.lastHandoverCash ? onDutyInfo.lastHandoverCash : '第一次' }}
                        </span>
                          元 <br />
                        
                        <p v-for="(item, index) in cashFlowInfo" :key="index" v-if="item.money != 0">
                            {{ item.item  }}： 
                            <span class="redFont">
                            {{ item.money > 0 ? '+'+item.money : item.money }}
                            </span>
                              元
                        </p>
                        结余： {{ onDutyInfo.currentCash ? onDutyInfo.currentCash : '0' }} 元
                    </div>
                </template>
            </Alert>

            <Alert type="success">
                订单结余：
                <span class="redFont">
                    {{ onDutyInfo.currentOrderBalance ? onDutyInfo.currentOrderBalance : 0 }} 
                </span>
                    元
                <template slot="desc">
                    <div slot="content">
                        <p v-for="(item, index) in onDutyInfo.orderInOut" :key="index">
                            {{ codeToText(item.payMethodCode)  }}：收入:{{ item.income }} 
                            <!-- {{ item.payMethodCode | codeToText(pay_method)  }}：收入;{{ item.income }} -->
                            支出:{{ item.outgoings}} 
                            &nbsp;结余:{{item.balance}} 
                        </p>
                    </div>
                </template>
            </Alert>
            <Button type="error" @click="cashTitle = '财务收账'; collectIsOpen = true;  " long>财务收账</Button>
            <p>&nbsp;</p>
            <Button type="error" @click="cashTitle = '添加备用金'; collectIsOpen = true; " long>添加备用金</Button>
            
            <!-- <p>收支结余</p>
            <p>现金</p> -->
        </div>
        
    </Drawer>
    <modal width="400" v-model="pwdIsOpen"  :mask-closable="false" @on-visible-change="pwdOpenOrClose" footer-hide >
            <!-- <Card dis-hover class="login"> -->
                <p slot="header" style="text-align:center">修改密码</p>
                <Form ref="pwdsForm" :model="pwds" :rules="pwdsRule" >
                    <FormItem  prop="oldPwd">
                        <Input  type="password" style="height: 40px" size="large" prefix="md-lock" 
                        placeholder="请输入旧密码" 
                            v-model="pwds.oldPwd"></Input>
                    </FormItem>
                    <FormItem  prop="newPwd">
                        <Input size="large" type="password" prefix="md-lock" placeholder="请输入新密码" 
                        v-model="pwds.newPwd"></Input>
                    </FormItem>
                    <FormItem  prop="newPwd2">
                        <Input size="large" type="password" prefix="md-lock" placeholder="请再次输入新密码" 
                        v-model="pwds.newPwd2"></Input>
                    </FormItem>
                    <FormItem>
                        <Button size="large" type="primary" long @click="pwdsSubmit">确认修改</Button>
                    </FormItem>
                    
                </Form>

            <!-- </Card> -->
      </modal>

      <modal width="400" v-model="handoverIsOpen"  :mask-closable="false" @on-visible-change="handoverOpenOrClose" footer-hide >
                <p slot="header" style="text-align:center">交接班</p>
                <Form ref="handoverForm" :model="handover" :rules="handoverRule" >
                    <FormItem  prop="offGoingPwd">
                        <Input  type="password" style="height: 40px" size="large" prefix="md-lock" 
                        placeholder="请输入交班人密码" 
                            v-model="handover.offGoingPwd"></Input>
                    </FormItem>
                    <FormItem  prop="onComingMobile">
                        <Input size="large" prefix="md-phone-portrait" placeholder="请接班人输入手机号" 
                        v-model="handover.onComingMobile"></Input>
                    </FormItem>
                    <FormItem  prop="onComingPwd">
                        <Input size="large" type="password" prefix="md-lock" placeholder="请接班人输入密码" 
                        v-model="handover.onComingPwd"></Input>
                    </FormItem>
                    <FormItem>
                        <Button size="large" type="primary" :loading="handoverLoad" long @click="handoverSubmit">确认交班</Button>
                    </FormItem>
                    
                </Form>
      </modal>
      <Modal width="400" v-model="collectIsOpen" @on-visible-change="collectOpenOrClose" :mask-closable="false" 
        footer-hide>
        <Alert type="success">
                当前现金：
                <span class="redFont">
                    {{ onDutyInfo.currentCash ? onDutyInfo.currentCash : '0' }}
                </span>
                    元
            </Alert>
            <p slot="header" style="text-align:center">{{cashTitle}}</p>
            <Form ref="collectForm" :model="collect" :rules="collectRule" >
                <FormItem  prop="flowMoney">
                    <Input size="large" prefix="md-phone-portrait" :placeholder="'请输入'+cashTitle +'金额'" 
                    v-model="collect.flowMoney"></Input>
                </FormItem>
                <FormItem  prop="userPwd">
                    <Input size="large" type="password" prefix="md-lock" placeholder="请输入密码" 
                    v-model="collect.userPwd"></Input>
                </FormItem>
                <FormItem>
                    <Button size="large" type="primary" :loading="collectLoad" 
                    long @click="cashSubmit">确认{{cashTitle}}</Button> 
                </FormItem>
                
            </Form>
      </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import {changePwd} from "@/api/login.js";
import { getOnDuty, handover } from "@/api/handover.js";
import { collectCash, addCash } from '@/api/finance.js'
// import { inout2Text } from '@/util/code2Text.js'
export default {
  name: 'MyInfo',
  props: {
    openIs: Boolean,
    printInfo: Object
  },
  filters: {
//     codeToText(val, list) {
//         return list.filter(i => val === i.dicCommonCode)[0].dicCommonName;
//     }
  },
  data() {
    return {
      isOpen: false,
      printLoad: false,
      pwdIsOpen: false,
      handoverIsOpen: false,
      collectIsOpen: false,
      collectLoad: false,
      handoverLoad: false,
      cashTitle: '财务收账',
      pwds: {
          oldPwd: '',
          newPwd: '',
          newPwd2: '',
      },
      handover: {
          offGoingPwd: '',
          onComingMobile: '',
          onComingPwd: '',
      },
      collect: {
          flowMoney: '',
          userPwd: ''
      },
      pwdsRule: {
          oldPwd: [
                { required: true, message: '请输入旧密码',}
            ],
        newPwd: [
            { required: true, message: '请输入新密码', },
        ],
        newPwd2: [
            { required: true, message: '请再次输入新密码', },
        ],
      },
      handoverRule: {
        offGoingPwd: [
                { required: true, message: '请交班人输入密码',}
            ],
        onComingMobile: [
            { required: true, message: '请接班人输入手机号', },
        ],
        onComingPwd: [
            { required: true, message: '请接班人输入密码', },
        ],
      },
      collectRule: {
        cashMoney: [
            { required: true, message: '请输入收款金额',}
        ],
        userPwd: [
            { required: true, message: '请输入密码', },
        ],
      },
      onDutyInfo: {},
    };
  },
  computed: {
      headText() {
          return this.currUser && this.currUser.realName ? this.currUser.realName.charAt(0)  : '囧';
      },

      cashFlowInfo() {
          let collectCash = 0;
          let otherCashIncome = 0;
          let otherCashOutgoings =0;
          let orderBalance = 0;
        //   let orderCash
          if (this.onDutyInfo.otherFrontCashFlows) {
              this.onDutyInfo.otherFrontCashFlows.forEach(flow => {
                    if (flow.itemCode === 'collect_cash') {
                        collectCash += flow.flowMoney;
                    } else {
                        if (flow.flowType === 'income') {
                            otherCashIncome += flow.flowMoney;
                        } else {
                            otherCashOutgoings += flow.flowMoney;
                        }
                    }
            });
        }
        if (this.onDutyInfo.orderInOut) {
            let inout = this.onDutyInfo.orderInOut.filter(inout => inout.payMethodCode === 'cash');
            inout[0] ? orderBalance = inout[0].balance : orderBalance = 0;
        }
        let info = [
            {"money" : orderBalance, "item":"订单结余"},
            {"money" : -collectCash, "item":"财务收账"},
            {"money" : otherCashIncome, "item":"其它收入"},
            {"money" : otherCashOutgoings, "item":"其它支出"}
            ];
          return info;
      },
      ...mapState({
            isLogin: state => state.user.isLogin,
            isFirst: state => state.user.isFirst,
            currUser: state => state.user.currUser,
            currHotel: state => state.user.currHotel,
            inout: state => state.dic.inout,
            pay_method: state => state.dic.pay_method,
        }),
    ...mapGetters([
      'codeToText',
    ])
  },
  mounted() {
    //   this.loadDic('inout');
    //   this.loadDic('pay_method');
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("my-info-close");
      } else {
        this.getOnDutyInfo();
      }
    },
    pwdOpenOrClose(val) {
        if (!val) {
            this.restForm('pwdsForm');
      } else {

      }
    },
    handoverOpenOrClose(val) {
        if (!val) {
            this.restForm('handoverForm');
      } else {

      }
    },
    collectOpenOrClose(val) {
        if (!val) {
            this.restForm('collectForm');
      } else {

      }
    },
    pwdsSubmit() {
        this.$refs.pwdsForm.validate(valid => {
            if (valid) {
                console.log(this.pwds.newPwd);
                console.log(this.pwds.newPwd2);
                if (this.pwds.newPwd === this.pwds.newPwd2 ) {
                    changePwd(this.pwds).then(res => {
                        if (res.data.code === 0) {
                            this.$Message.success("密码修改成功，请重新登录");
                            this.pwdIsOpen = false;
                            this.logout();
                        } else {
                            this.$Message.error(res.data.code + "：" + res.data.msg);
                        }
                    });
                } else {
                    this.$Message.error("两次新密码不一致");
                }
                
            }
        });
        
    },
    handoverSubmit() {
        this.$refs.handoverForm.validate(valid => {
            if (valid) {
                console.log(this.handover);
                this.handoverLoad = true;
                handover(this.handover).then(res => {
                    if (res.data.code === 0) {
                        this.$Message.success("交接班成功，请接班人重新登录");
                        this.handoverIsOpen = false;
                        this.handoverLoad = false;
                        this.logout();
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        this.handoverLoad = false;
                    }
                });
                
            }
        });
    },
    cashSubmit() {
        this.$refs.collectForm.validate(valid => {
            if (valid) {
                this.collectLoad = true;
                console.log(this.collect);
                if (this.cashTitle === '财务收账') {
                    collectCash(this.collect).then(res => {
                        if (res.data.code === 0) {
                            this.$Message.success("收账成功");
                            this.collectIsOpen = false;
                            this.collectLoad = false;
                            this.getOnDutyInfo();
                        } else {
                            this.$Message.error(res.data.code + "：" + res.data.msg);
                            this.collectLoad = false;
                        }
                    });
                }
                if (this.cashTitle === '添加备用金') {
                    addCash(this.collect).then(res => {
                        if (res.data.code === 0) {
                            this.$Message.success("添加备用金成功");
                            this.collectIsOpen = false;
                            this.collectLoad = false;
                            this.getOnDutyInfo();
                        } else {
                            this.$Message.error(res.data.code + "：" + res.data.msg);
                            this.collectLoad = false;
                        }
                    });
                }
                
                
            }
        });
    },
    getOnDutyInfo () {
        getOnDuty().then(res => {
            if (res.data.code === 0) {
                this.onDutyInfo = res.data.data;
            } else {
                this.$Message.error(res.data.code + "：" + res.data.msg);
            }
        });
    },
    restForm(name) { 
        console.log(name);
        console.log(this.$refs);
        this.$refs[name].resetFields(); 
    },
    ...mapActions({
         logout: 'logout' ,
         loadDic: 'loadDic',
      }),
  }
}
</script>

<style>
.redFont{
    font: 1.2em sans-serif;
    color: #ed4014;
}
select::-webkit-select-placeholder {
     color: rgb(189, 177, 177) !important;
     font-size: 16px !important;
    }

input::-webkit-input-placeholder {
     color: rgb(197, 181, 181) !important;
     font-size: 16px !important;
    }

input:-moz-placeholder {
    color: rgb(209, 196, 196) !important;
    font-size: 16px !important;
    }

input:-ms-input-placeholder {
    color: rgb(207, 190, 190) !important;
    font-size: 16px !important;
    }
</style>
