<template>
  <div>
      <Modal
      width="500"
      v-model="isOpen"
      :title="title"
      @on-visible-change="openOrClose"
      :mask-closable="false"
    >
          <Form ref="offsetForm" :model="orderIncome" :rules="payRule" v-if="incomeClass === 'offset'">
            <FormItem  >
                <h3 v-for="(item, index) in offsetIncome.payDetails" :key="index">
                  {{codeToText(item.payMethodCode)}}：{{ item.payMoney }} 元 
                  可冲减：{{ !item.offsetMoney?item.payMoney:item.payMoney-item.offsetMoney }} 元  
                </h3>
          </FormItem>
          <FormItem  v-for="(item, index) in orderIncome.payDetails" :key="'payDetail'+index"
            :label="codeToText(item.payMethodCode)+'冲账金额'"
            prop="payMoney"
           
            >
                <Input
                  v-model="item.payMoney"
                  number
                  :placeholder="'金额，'+ codeToText(item.payMethodCode)+ '不冲账则不填'"
                  style="width: 200px"
                />
                <span style="color: red;">{{item.errMsg}}</span>
          </FormItem>
          合计：{{total}}
          <FormItem label="冲账原因" prop="incomeComment">
                <Input v-model="orderIncome.incomeComment" placeholder="输入冲账原因" type="textarea"></Input>
            </FormItem>
        </Form>
        
        <Form v-else>
            <Row>
            <PayDetail
                ref="payDetail"
                @get-money="getMoney"
                :parent-is-open="isOpen"
            ></PayDetail>
            <FormItem label="备 注" >
                <Input v-model="orderIncome.incomeComment" placeholder="输入备注" type="textarea"></Input>
            </FormItem>
            </Row>
            
        </Form>
        <div slot="footer">
          <Button
            size="large"
            @click="isOpen = false;"
          >取消</Button>
          <Button v-if="incomeClass === 'offset'"
            type="primary"
            size="large"
            :loading="loading"
            @click="offSetSubmit"
            :disabled="!isOffsetButton"
          >确定冲账</Button>
          <Button v-else
            type="primary"
            size="large"
            :loading="loading"
            @click="submit"
          >确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import PayDetail from '../../common/PayDetail.vue'
import { saveOrderIncome } from "@/api/order.js";
import { mapGetters } from 'vuex'
export default {
  name: 'IncomeEntry',
  components:{
      PayDetail
  },
  props: {
    openIs: Boolean,
    orderNo: String,
    offsetIncome: Object,
    incomeClass: String,
  },
  data() {
    return {
      isOpen: false,
      title: '收款',
      loading: false,
      saveIs: false,
      orderIncome: {
        orderNo: null,
        incomeMoney: 0,
        incomeComment: null,
        payDetails: []
      },
      payRule: {
        // payDetails: [
        //   { type: "number", min: 0, message: "必须是大于0的数字"},
        // ],
        incomeComment: [
          { required: true, message: '请输入冲账原因',}
        ],
      },
      
    }
  },
  computed: {
    isOffsetButton() {
      let tag = false;
      this.orderIncome.payDetails.forEach(p => {
        
        if (p && p.payMoney && typeof p.payMoney == 'number' && p.payMoney>0) {
          tag =true;
          p.errMsg = '';
        } else {
          p.errMsg = '冲账金额必须大于0的数字';
        }
        if (!p.payMoney) {
          p.errMsg = '';
        }
      })
      console.log('tag==', tag);
      
      return tag;
    },
    total() {
      let sum = 0;
      this.orderIncome.payDetails.forEach(element => {
        sum += element.payMoney;
      });
      return sum;
    },
    ...mapGetters([
      'codeToText',
    ])
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.title = '收款';
        // ,this.saveIs
        this.orderIncome.saveIs=this.saveIs;
        this.$emit("income-entry-close", this.orderIncome);
        // 恢复默认数据
        Object.assign(this.$data, this.$options.data());
      } else {
        if (this.incomeClass === 'offset') {
          console.log(this.incomeClass === 'offset');
          this.offsetIncome.payDetails.forEach(pay => {
            this.orderIncome.payDetails.push({
                  payMethodCode: pay.payMethodCode,
                  offsetId: pay.payDetailId,
                  payMoney: null,
                  errMsg: '',
              })
          })
          this.title = '收款冲账';
        }
      }
    },
    offSetSubmit() {

     this.orderIncome.payDetails =  this.orderIncome.payDetails.filter(p => p.payMoney);
        this.orderIncome.orderNo = this.orderNo;

        this.orderIncome.incomeTypeCode = 'outgoings';
        this.orderIncome.incomeClassCode = 'offset';
        this.orderIncome.incomeMoney = this.total;
        this.orderIncome.offsetId = this.offsetIncome.incomeId;
        console.log(' this.orderIncome', this.orderIncome);

        
        this.$refs.offsetForm.validate(valid => {
              if (valid) {
                  console.log('通过');
                  // this.orderIncome.incomeComment = '冲账原因:' + this.orderIncome.incomeComment;
                  saveOrderIncome(this.orderIncome).then(res => {
                    if (res.data.code === 0) {
                        this.$Message.success(res.data.msg);
                        this.orderIncome = res.data.data;
                        this.saveIs = true;
                        this.isOpen = false;
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        console.log('错误消息',res.data.msg);
                        this.loading = false;
                    }
                });
                  
              } else {
                console.log('未通过');
              }
          })    
    },
    submit() {
        this.orderIncome.orderNo = this.orderNo;
        console.log(this.orderIncome);
        console.log(this.orderIncome.payDetails);
        console.log(this.$refs.payDetail.$refs.payForm);
        
        let tag = false;
        this.$refs.payDetail.$refs.payForm.forEach(pay  => {
          pay.validate(valid => {
              if (valid) {
                  console.log('通过');
                  tag = true;
                  
              } else {
                console.log('未通过');
                tag = false;
              }
          })
        })
        if (tag) {
          saveOrderIncome(this.orderIncome).then(res => {
            if (res.data.code === 0) {
                this.$Message.success(res.data.msg);
                this.orderIncome = res.data.data;
                this.saveIs = true;
                this.isOpen = false;
            } else {
                this.$Message.error(res.data.code + "：" + res.data.msg);
                console.log('错误消息',res.data.msg);
                
                this.loading = false;
            }
        });
        }   
    },
    getMoney(val) {
      // console.log('哈', val);
      this.orderIncome = val;
    },
  },
}
</script>

<style>

</style>
