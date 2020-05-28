<template>
  <div>
    <Modal
      v-model="isOpen"
      title="订单打印"
      @on-visible-change="openOrClose"
      width="280"
      :style="{maxHeight:'500px',}"
    >
        <div class="print" id="printDiv" style="width: 59 mm;" >
            <h3>{{currHotel && currHotel.hotelName ? currHotel.hotelName :''}}</h3>
            <!-- <Divider style="color: #000;" dashed /> -->
             订单号:
            {{printInfo.order.orderNo}} <br/>
            <div v-if="showReserve"  >
              ------------------------------<br/>
              客人姓名：{{printInfo.order.guestName}} <br/>
              预 订 <br/>
              <span v-for="(item, index) in printInfo.orderReserves" :key="'reserve'+index" 
                v-if="item.allottedNum <  item.reserveNum"
              >
                ------------------------------<br/>
                房型：{{ item.roomTypeName }} <br/>
                房价：{{ item.roomTypePrice }} 元/间/晚 <br/>
                数量：{{ item.reserveNum }} 间 <br/>
                入离时间：<br/>
                {{new Date(item.estimateInTime).Format('yyyy-MM-dd')}} 至 <br />
                {{ new Date(item.estimateOutTime).Format('yyyy-MM-dd hh:mm')}} <br/>
              </span>
            </div>
            ------------------------------<br/>
            <span v-for="(item, index) in printInfo.orderRooms" :key="index">
              客人姓名：{{item.guestName}} <br/>
              房间：{{item.roomName}}（{{ item.roomTypeName}}） <br/>
              {{item.orderTypeCode === 'daily' ? '日租房':'钟点房' }} {{item.roomPrice}} 元 <br/>
              入离时间：<br/>
              {{new Date(item.realInTime||item.estimateInTime).Format('yyyy-MM-dd hh:mm')}} 至 <br />
              {{ new Date(item.estimateOutTime).Format('yyyy-MM-dd hh:mm')}} <br/>
              ------------------------------<br/>
            </span>
            已消费： {{ orderMoney }} 元  <br />
            已收款： {{ payMoney }} 元  <br />
            <span v-if="balance >= 0">余&nbsp;&nbsp; 额：</span> 
            <span v-else>欠&nbsp;&nbsp; 费：</span> 
            {{ balance }} 元   <br />
            ------------------------------<br/>
            <div v-if="!currIncome">
               收款详情： <br/>
              <span v-for="(item, index) in incomes" :key="'in'+index">
                <span v-if="item.incomeClassCode == 'offset' ">冲减 </span>
                <span v-if="item.incomeClassCode == 'refund' ">退款 </span>
                <span v-for="(pay, index) in item.payDetails" :key="'pay'+index">
                {{ pay ? codeToText(pay.payMethodCode) : '' }} 
                <span v-if="pay.payType == 'outgoings' ">-</span>
                {{ pay ? pay.payMoney : ''  }} 
                  <!-- <br/> -->
                </span> 
              <br/>
            </span> 
            </div>
            <span v-if="currIncome">
              本次收款： <br/>
              <span v-for="(pay, index) in currIncome.payDetails" :key="index">
                {{ pay ? codeToText(pay.payMethodCode) : '' }} {{ pay ? pay.payMoney : ''  }}   <br/>
              </span>
            </span>
            
            <!-- <br/> -->
            ------------------------------<br/>
            打印时间：<br/>
            {{new Date().Format('yyyy-MM-dd hh:mm:ss')}} <br/>
            <span v-if="currUser.realName !== printInfo.order.operatorName">打印人：{{currUser.realName}} <br/></span>
            ------------------------------<br/>
            操作人：{{currIncome ? currIncome.operatorName : printInfo.order.operatorName}} <br/>
            
            <p style="font: 1.3em sans-serif;">客人签名：_________________</p>
            <!-- <h5>订单号：{{ printInfo.order.orderNo || 获取中}}</h5>
            <h5>客人：{{ printInfo.order.guestName || 获取中}}</h5> -->
        </div>
      
      <div slot="footer">
        <Button
          size="large"
          @click="isOpen = false;"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="printLoad"
          @click="print"
        >打印</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import printJs from 'print-js'

export default {
  name: "OrderPrint",
  props: {
    openIs: Boolean,
    printInfo: Object,
    orderMoney: Number,
    payMoney: Number,
    incomes: Array,
    balance: Number,
    currIncome: Object
  },
  data() {
    return {
      isOpen: false,
      printLoad: false
    };
  },
  computed: {
    showReserve() {
      let show = false;
      if (this.printInfo.orderReserves && this.printInfo.orderReserves.length > 0) {
        this.printInfo.orderReserves.forEach(element => {
          if (element.allottedNum <  element.reserveNum) {
            show = true;
          }
        });
      }
      return show;
    },
    ...mapState({
            currUser: state => state.user.currUser,
            currHotel: state => state.user.currHotel,
        }),
    ...mapGetters([
      'codeToText',
    ])
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
      console.log(this.printInfo);
      console.log(this.incomes);
      
      
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("order-print-close");
      } else {
        console.log('currIncome:', this.currIncome);
        
      }
    },
    print() {
        
        console.log(this.printInfo);
        printJs('printDiv', 'html');
        // printJs({
        //   printable: 'printDiv',
        //   type: 'html',
        //   header: '灵台县星辰宾馆-入住',
        //   // headerStyle: 'font-size: 13pt;',
        //   // style: 'margin:0 auto;',
        //   // font: '黑体',
        //   font_size: '11pt'
        // });
        
        // let con = document.getElementsByClassName('print')[0].innerHTML;
        // console.log(con);
        
        // let w = window.open();
        // w.document.write(con);
        // w.document.close();
    }
  }
};
</script>

<style>
.print{
    width: 60 mm;
    /* margin: 0; */
    margin:0 auto;
    padding: 0;
    font: 1.2em sans-serif;
    font-weight: bold;
    max-height: 500px;
    overflow:auto;
    
    
}
</style>
