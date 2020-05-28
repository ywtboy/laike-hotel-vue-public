<template>
  <div>
    <Modal
      width="900"
      v-model="isOpen"
      title="查看订单"
      @on-visible-change="openOrClose"
      :mask-closable="false"
    >

      <p
        slot="header"
        style=""
      >
        <Row>
          <Col :span="16">
          查看订单
          </Col>
          <Col :span="8">
          订单号：{{ orderInfo.order.orderNo }}
          </Col>
        </Row>
      </p>
      <!-- {{orderInfo}} -->
      <div>
        <Row>
          <Col :span="2">{{ orderInfo.order.guestName }}</Col>
          <Col :span="7">
          证件号：{{ orderInfo.order.guestCertificateNo }}
          </Col>
          <Col :span="5">
          电话：{{ orderInfo.order.guestTel }}
          </Col>
          <Col :span="5">
          渠道：{{ orderInfo.order.channelCode | codeToText }}
          <Tag color="green">
            {{ orderInfo.order.payTypeCode | codeToText }}
          </Tag>
          </Col>
          <Col :span="5">
          订单号：{{ orderInfo.order.orderNo }}
          </Col>

        </Row>

      </div>
      <!-- {{orderReserve}} -->

      <div v-if="showReserve">
        <Divider
          size="default"
          style="margin-top: 0; margin-bottom: 24px;"
        />
        <Table
          :columns="orderReserveCol"
          :data="orderInfo.orderReserves"
          size="small"
          class="orderInfo"
        >

          <template
            slot-scope="{row}"
            slot="inOutTime"
          >
            {{ new Date(row.estimateInTime).Format("MM-dd") }} 至
            {{ row.estimateOutTime | inOutTimeFilter }}
          </template>

          <template
            slot-scope="{row}"
            slot="action"
          >

            <!-- &nbsp; -->
            <a
              v-if="row.allottedNum <  row.reserveNum "
              @click="allotRoom.isAllot='allot';allotRoom.orderReserve=row;allotRoom.openIs=true"
            >分配房间</a>
          </template> -->
        </Table>

      </div>
      <Divider
        size="default"
        style="margin-top: 0; margin-bottom: 24px;"
      />
      <div>
        <Table
          v-if="orderInfo.orderRooms && orderInfo.orderRooms.length > 0"
          :columns="orderRoomCol"
          :data="orderInfo.orderRooms"
          size="small"
          class="orderInfo"
        >

          <template
            slot-scope="{row}"
            slot="roomName"
          >
            {{ row.roomName }} ( {{ row.roomTypeName }} )
          </template>
          <template
            slot-scope="{row}"
            slot="orderTypeCode"
          >
            {{ row.orderTypeCode | codeToText }}
          </template>
          <template
            slot-scope="{row}"
            slot="inOutTime"
          >
            {{ (row.realInTime || row.estimateInTime) | inOutTimeFilter }} 至
            {{ row.estimateOutTime | inOutTimeFilter }}
          </template>
          <template
            slot-scope="{row}"
            slot="state"
          >
            {{ row.orderRoomStateCode | codeToText }}
          </template>
          <template
            slot-scope="{row}"
            slot="action"
          >
            <Poptip
              confirm
              :title="'确认 ' + row.roomName + '  退房?'"
              :transfer="true"
              @on-ok="roomOut(row.roomNo)"
            >
              <a v-if="row.orderRoomStateCode === 'live'">退房</a>
            </Poptip>
            &nbsp;
            <a
              v-if="row.orderRoomStateCode === 'live'"
              @click="openChangeRoom(row)"
            >换房</a> &nbsp;
            <a
              v-if="row.orderRoomStateCode === 'no_live'"
              @click="allotRoom.isAllot='checkIn';allotRoom.checkInOrderRooms[0]=row;allotRoom.openIs=true"
            >办理入住</a>
          </template>
        </Table>
      </div>
      <Divider style="margin-top: 24; margin-bottom: 24px;" />

      <div class="orderInfo">
        <Row style="margin-bottom: 10px;">
          <Col :span="18">
          消费金额：￥{{ orderInfo.order.orderMoney }}元
          <a
            size="small"
            type="text"
            @click="consumeListIs = !consumeListIs; getConsume()"
          > 查看详情
            <Icon
              type="ios-arrow-down"
              v-if="consumeListIs"
            />
            <Icon
              type="ios-arrow-forward"
              v-else
            /></a>
          </Col>
          <Col :span="3">
          </Col>
        </Row>
        <Table
          :columns="consumeCol"
          :data="orderConsume"
          size="small"
          v-if="consumeListIs"
          style="margin-bottom: 10px;"
          :height="consumeTableHeight"
          :row-class-name="rowClassName"
        >
          <template
            slot-scope="{row}"
            slot="consumeMoney"
          >
            <span v-if="row.consumeTypeCode === 'outgoings'">-</span>{{row.consumeMoney}}
          </template>
          <template
            slot-scope="{row}"
            slot="action"
          >
            <Tooltip
              content="当消费有错误时，进行冲账抵消错误金额"
              placement="top"
            >
              <a
                v-if="row.consumeTypeCode === 'income' && row.consumeItemCode !=='offset' 
                  && (row.offsetMoney?row.offsetMoney<row.consumeMoney:true)"
                @click="consumeEntry.offsetOrderConsume = row;consumeEntry.openIsOffset = true;"
              >
                冲账
              </a>
            </Tooltip>
          </template>
          <template
            slot-scope="{row}"
            slot="consumeItemCode"
          >
            {{ row.consumeItemCode | codeToText }}
          </template>
        </Table>
        <Row style="margin-bottom: 10px;">
          <Col :span="19">
          已交金额：￥{{ orderInfo.order.payMoney }}元
          <a
            size="small"
            type="text"
            @click="incomeListIs = !incomeListIs; getIncome()"
          > 查看详情
            <Icon
              type="ios-arrow-down"
              v-if="incomeListIs"
            />
            <Icon
              type="ios-arrow-forward"
              v-else
            /></a>
          </Col>

          <Col :span="5">
          <span v-if="balance >= 0">余&nbsp;&nbsp; 额：
            ￥ <span>{{ balance }}</span> 元
          </span>
          <span v-else>欠&nbsp;&nbsp; 费：
            ￥ <span style="color: rgb(255, 1, 1);">{{ balance }}</span> 元
          </span>

          </Col>
        </Row>
        <Table
          :columns="incomeCol"
          :data="orderIncome"
          size="small"
          v-if="incomeListIs"
          :height="incomeTableHeight"
          :row-class-name="rowClassName"
        >
          <template
            slot-scope="{row}"
            slot="incomeTypeCode"
          >
            {{ row.incomeTypeCode | codeToText }}
          </template>

          <template
            slot-scope="{row}"
            slot="incomeClassCode"
          >
            {{ row.incomeClassCode | codeToText }}
          </template>
          <template
            slot-scope="{row}"
            slot="incomeMoney"
          >
            <span v-if="row.incomeTypeCode === 'outgoings'">-</span>{{ row.incomeMoney }}
          </template>

          <template
            slot-scope="{row}"
            slot="payDetails"
          >
            <span
              v-for="(item, index) in row.payDetails"
              :key="index"
            >
              {{ codeToText(item.payMethodCode) }}：<span v-if="row.incomeTypeCode === 'outgoings'">-</span>{{ item.payMoney | codeToText }}
            </span>

          </template>
          <template
            slot-scope="{row}"
            slot="action"
          >
            <a
              v-if="row.incomeClassCode!=='offset' && isOffset(row.payDetails)"
              @click="incomeEntry.incomeClass = 'offset'; incomeEntry.offsetIncome = row;incomeEntry.openIs = true;"
            >冲账</a>
          </template>
        </Table>
      </div>

      <div slot="footer">
        <Row>
          <Col :span="10">
          <Button
            :disabled="orderInfo.order.orderStateCode==='completed'"
            style="float: left;"
          >取消订单</Button>
          </Col>

          <Col :span="14">
          <Button @click="isOpen = false;">取消</Button>
          <Button @click="orderPrint.openIs = true; getIncome()">打印</Button>
          <Button
            type="info"
            :disabled="orderInfo.order.orderStateCode==='completed'"
            @click="consumeEntry.openIs = true"
          >消费入账</Button>
          <Button
            type="info"
            :disabled="orderInfo.order.orderStateCode==='completed'"
            @click="incomeEntry.openIs = true"
          >收款</Button>
          <Button
            type="info"
            :disabled="orderInfo.order.orderStateCode==='completed'"
            @click="checkOut.openIs = true"
          >结账退房</Button>
          </Col>
        </Row>

      </div>
    </Modal>
    <OrderPrint
      :open-is="orderPrint.openIs"
      :print-info="orderInfo"
      :orderMoney="orderInfo.order.orderMoney"
      :payMoney="orderInfo.order.payMoney"
      :incomes="orderIncome"
      :balance="balance"
      :currIncome="printIncome"
      @order-print-close="orderPrint.openIs = false; "
    />
    <ConsumeEntry
      :open-is="consumeEntry.openIs"
      :open-is-offset="consumeEntry.openIsOffset"
      :order-rooms="orderInfo.orderRooms"
      :offset-order-consume="consumeEntry.offsetOrderConsume"
      @consume-entry-close="consumeEntryClose($event)"
    />

    <IncomeEntry
      :open-is="incomeEntry.openIs"
      :order-no="orderInfo.order.orderNo"
      :income-class="incomeEntry.incomeClass"
      :offset-income="incomeEntry.offsetIncome"
      @income-entry-close="incomeEntryClose($event)"
    />

    <CheckOut
      :open-is="checkOut.openIs"
      :order-no="orderInfo.order.orderNo"
      :order-rooms="orderInfo.orderRooms"
      :pay-money="balance"
      @check-out-close="checkOut.openIs = false"
      @load-room-state="loadRoomState"
    />

    <ChangeRoom
      :open-is="changeRoom.openIs"
      :orderRoom="changeRoom.orderRoom"
      @change-room-close="changeRoomClose($event)"
    />

    <AllotRoom
      :open-is="allotRoom.openIs"
      :order-reserve="allotRoom.orderReserve"
      :order="orderInfo.order"
      :is-allot="allotRoom.isAllot"
      :check-in-order-rooms="allotRoom.checkInOrderRooms"
      @allot-room-close="allotRoomClose($event)"
    />

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getOrderInfo,
  getOrderConsume,
  getOrderIncome,
  checkOut
} from "@/api/order.js";
import OrderPrint from "./OrderPrint.vue";
import ConsumeEntry from "./ConsumeEntry.vue";
import viewOrderData from "./data/viewOrderData.js";
import { orderCodeToText } from "@/util/code2Text.js";
import IncomeEntry from "./IncomeEntry.vue";
import CheckOut from "./CheckOut.vue";
import ChangeRoom from "./ChangeRoom.vue";

export default {
  name: "ViewOrder",
  components: {
    OrderPrint,
    ConsumeEntry,
    IncomeEntry,
    CheckOut,
    ChangeRoom,
    AllotRoom: () =>
      import(/* webpackChunkName: "allotRoom" */ "./AllotRoom.vue")
  },
  filters: {
    inOutTimeFilter(val) {
      if (!val) return "";
      return new Date(val).Format("MM-dd hh:mm");
    },
    codeToText(val) {
      return orderCodeToText(val);
    }
  },
  props: {
    openIs: Boolean,
    viewOrderNo: String,
    isPrint: Boolean
  },
  data() {
    return {
      isOpen: false,
      orderInfo: {
        order: {
          channelCode: "",
          orderNo: "",
          payTypeCode: ""
        }
      },
      orderPrint: {
        openIs: false
      },
      consumeEntry: {
        openIs: false,
        openIsOffset: false,
        offsetOrderConsume: null
      },
      incomeEntry: {
        openIs: false,
        incomeClass: "receipts",
        offsetIncome: null
      },
      checkOut: {
        openIs: false
      },
      changeRoom: {
        openIs: false,
        orderRoom: null
      },
      orderRoomCol: viewOrderData.orderRoomCol,
      consumeListIs: false,
      incomeListIs: false,
      consumeCol: viewOrderData.consumeCol,
      incomeCol: viewOrderData.incomeCol,
      orderConsume: [],
      orderIncome: [],
      roomOutInfo: {
        roomNo: "",
        orderNo: "",
        checked: false
      },
      printIncome: null,
      orderReserveCol: viewOrderData.orderReserveCol,
      allotRoom: {
        openIs: false,
        orderReserve: null,
        isAllot: "allot",
        checkInOrderRooms: []
      }
    };
  },
  computed: {
    consumeTableHeight() {
      if (4 < this.orderConsume.length) {
        return 5 * 40 + 15;
      } else {
        return this.orderConsume.length * 40 + 32;
      }
    },
    incomeTableHeight() {
      return this.getTableHeight(this.orderIncome.length);
    },
    balance() {
      return this.orderInfo.order.payMoney - this.orderInfo.order.orderMoney;
    },
    showReserve() {
      let show = false;
      if (
        this.orderInfo.orderReserves &&
        this.orderInfo.orderReserves.length > 0
      ) {
        this.orderInfo.orderReserves.forEach(element => {
          if (element.allottedNum < element.reserveNum) {
            show = true;
          }
        });
      }
      return show;
    },
    ...mapGetters(["codeToText"])
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  mounted() {},
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("viewOrderClose");
        // 恢复默认数据
        Object.assign(this.$data, this.$options.data());
      } else {
        this.getData();
        if (this.isPrint) {
          this.getIncome();
          this.orderPrint.openIs = true;
        }
      }
    },
    openChangeRoom(orderRoom) {
      this.changeRoom.orderRoom = orderRoom;
      this.changeRoom.openIs = true;
    },
    getData() {
      getOrderInfo(this.viewOrderNo).then(res => {
        if (res.data.code === 0) {
          this.orderInfo = res.data.data;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    getConsume() {
      getOrderConsume(this.viewOrderNo).then(res => {
        if (res.data.code === 0) {
          this.orderConsume = res.data.data;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    getIncome() {
      getOrderIncome(this.viewOrderNo).then(res => {
        if (res.data.code === 0) {
          this.orderIncome = res.data.data;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    consumeEntryClose(event) {
      this.consumeEntry.openIs = false;
      this.consumeEntry.openIsOffset = false;
      console.log("event==", event);

      if (event) {
        this.getData();
        if (this.consumeListIs) {
          this.getConsume();
        }
      }
    },
    incomeEntryClose(event, inSave) {
      this.incomeEntry.openIs = false;

      console.log("event::", event);
      console.log("inSave::", event.saveIs);
      this.printIncome = event;
      if (event.incomeClassCode) {
        this.getData();
        if (
          event.saveIs === true &&
          this.incomeEntry.incomeClass === "receipts"
        ) {
          this.orderPrint.openIs = true;
        }
        if (this.incomeListIs) {
          this.getIncome();
        }
      }
      this.incomeEntry.incomeClass = "receipts";
    },
    changeRoomClose(isSuccess) {
      this.changeRoom.openIs = false;
      if (isSuccess) {
        this.getData();
        this.$emit("load-room-state");
      }
    },
    allotRoomClose(isOk) {
      this.getData();
      this.getConsume();
      this.allotRoom.openIs = false;
      this.$emit("load-room-state");
    },
    roomOut(roomNo) {
      this.roomOutInfo.roomNo = roomNo;
      this.roomOutInfo.orderNo = this.orderInfo.order.orderNo;
      checkOut(this.roomOutInfo).then(res => {
        if (res.data.code === 0) {
          this.getData();
          this.$emit("load-room-state");
          this.$Message.success("退房成功");
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    loadRoomState() {
      this.getData();
      this.$emit("load-room-state");
    },
    getTableHeight(val) {
      if (4 < val) {
        return 4 * 40 + 22;
      } else {
        return val * 40 + 32;
      }
    },
    rowClassName(row, index) {
      if (
        row.consumeItemCode === "offset" ||
        row.incomeClassCode === "offset"
      ) {
        return "offset-row";
      }
      return "";
    },
    isOffset(pays) {
      console.log("pays= ", pays);
      let tag = false;
      if (pays) {
        pays.forEach(pay => {
          if (
            pay.offsetMoney === null ||
            (pay.offsetMoney && pay.offsetMoney < pay.payMoney)
          ) {
            tag = true;
          }
        });
      }
      return tag;
    }
  }
};
</script>

<style>
.orderInfo {
  padding-bottom: 10 px;
  font: 1.1em sans-serif;
  font-weight: bold;
}
.offset-row {
  color: rgb(248, 8, 8);
}
</style>
