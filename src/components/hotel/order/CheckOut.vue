<template>
  <div>
      <Modal
      width="500"
      v-model="isOpen"
      :title="title"
      @on-visible-change="openOrClose"
      :mask-closable="false"
    >
        <Form>
            本次退房：
         <Row v-for="(item, index) in orderRooms" :key="index">
             <Col :span="24" v-if="item.orderRoomStateCode === 'live'">
                
                {{ item.roomName }} （{{ item.roomTypeName }}）
                
             </Col>
         </Row>
         <Row>
             <Col>
            <FormItem v-if="payMoney < 0">
                已欠费:<span style="color: rgb(255, 1, 1);">{{ payMoney }}</span> 元
            </FormItem>
            <FormItem v-else>
                应退金额：{{ payMoney }} 元
            </FormItem>
             </Col>
         </Row>
        
            <Row>
            <PayDetail
                ref="payDetail"
                @get-money="getMoney"
                :parent-is-open="isOpen"
                :is-check-out="true"
            ></PayDetail>
            </Row>
        </Form>
        <div slot="footer">
        <Button
          size="large"
          @click="isOpen = false;"
        >取消</Button>
        <Button
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
import { checkOut } from "@/api/order.js";
export default {
  name: 'CheckOut',
  components:{
      PayDetail
  },
  props: {
    openIs: Boolean,
    orderNo: String,
    orderRooms: Array,
    payMoney: Number
  },
  data() {
    return {
      isOpen: false,
      title: '结账退房',
      loading: false,
      saveIs: false,
      checkOut: {
        orderNo: '',
        checked: true,
        orderIncome: {}
      },
      orderIncome: {
        orderNo: null,
        incomeMoney: 0,
        incomeComment: null,
        payDetails: []
      },

    }
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("check-out-close");
        // 恢复默认数据
        Object.assign(this.$data, this.$options.data());
      } else {
        
      }
    },
    submit() {
        if (this.payMoney < 0) {
            this.$Modal.warning({
                            title: '欠费',
                            content: '此订单已欠费，无法结账退房！'
                        });
            return false;
        }
        this.orderIncome.orderNo = this.orderNo;
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
        this.checkOut.orderNo = this.orderNo;
        this.checkOut.orderIncome = this.orderIncome;
        if (tag) {
            if (this.payMoney !== this.checkOut.orderIncome.incomeMoney) {
            this.$Modal.warning({
                            title: '警告',
                            content: '金额与应退金额不同，如有消费未入账，请先入账！'
                        });
            return false;
        }
          checkOut(this.checkOut).then(res => {
            if (res.data.code === 0) {
                this.$emit("load-room-state");
                this.$Message.success(res.data.msg);
                this.isOpen = false;
            } else {
                this.$Message.error(res.data.code + "：" + res.data.msg);
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
