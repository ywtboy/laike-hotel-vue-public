<template>
  <Layout :style="{height: conHeight+'px'}">
    <Sider>
      <Menu
        theme="light"
        active-name="all"
        width="auto"
        :style="{height: '100%'}"
      >
        <MenuGroup title="订单查询">
          <MenuItem
            name="all"
            @click.native="queryClassified('all')"
          >
          全部订单
          </MenuItem>
          <MenuItem
            name="live"
            @click.native="queryClassified('live')"
          >
          当前正住
          </MenuItem>
          <MenuItem
            name="out"
            @click.native="queryClassified('out')"
          >
          今日预退
          </MenuItem>
          <MenuItem
            name="today_come"
            @click.native="queryClassified('today_come')"
          >
          今日预到
          </MenuItem>
          <MenuItem
            name="wait_allot"
            @click.native="queryClassified('wait_allot')"
          >
          等待分房
          </MenuItem>
          <MenuItem
            name="no_come"
            @click.native="queryClassified('no_come')"
          >
          预订未到
          </MenuItem>
        </MenuGroup>
      </Menu>
    </Sider>
    <Content class="laike-hotel-content">
      <Row>
        <Col :span="24">
        <Form
          ref="queryForm"
          :model="query"
          inline
        >
          <FormItem
            v-if="isShowDate"
            label="营业日"
            :label-width="80"
            prop="startTime"
          >
            <DatePicker
              v-model="query.startTime"
              type="date"
              clearable
              placement="bottom-end"
              placeholder="开始时间"
              style="width: 120px"
              :options="options1"
              @on-change="setEndTime"
            ></DatePicker>--
            <DatePicker
              v-model="query.endTime"
              type="date"
              placement="bottom-end"
              placeholder="结束时间"
              style="width: 120px"
              :options="options1"
            ></DatePicker>
          </FormItem>
          <FormItem prop="endTime"> </FormItem>
          <FormItem prop="orderNo">
            <Input
              v-model="query.orderNo"
              clearable
              placeholder="输入订单号"
            />
          </FormItem>
          <FormItem prop="guestName">
            <Input
              v-model="query.guestName"
              clearable
              placeholder="输入客人姓名"
            />
          </FormItem>
          <FormItem>
            <Button
              type="info"
              @click="page.page=1;getOrderList()"
            >查询</Button>
          </FormItem>
          <FormItem>
            <Button
              type="info"
              @click="handleReset('queryForm')"
            >重置</Button>
          </FormItem>
        </Form>
        </Col>
      </Row>
      <Row>
        <Col :span="24">
        <Table
          stripe
          border
          size="small"
          class="orderTable"
          :columns="orderCol"
          :data="orders"
          @on-row-dblclick="handleColDbClick"
        >
          <template
            slot-scope="{row}"
            slot="orderStateCode"
          >
            {{ row.orderStateCode | codeToText }}
          </template>
          <template
            slot-scope="{row}"
            slot="orderRooms"
          >
            <Row
              v-for="(item, index) in row.orderRooms"
              :key="'room'+index"
            >
              <Col
                :span="24"
                style="padding:5px;"
              >
              <!-- <Table stripe :show-header="false" size="small" :columns="orderRoomCol" :data="row.orderRooms"></Table> -->
              <div
                class="roomInfo"
                style=" width:50px;padding-right:0px;"
              >{{ item.guestName }}</div>
              <div
                class="roomInfo"
                style="width:105px;padding-right:0px;"
              >{{ item.roomName }}（{{ item.roomTypeName }}）</div>
              <div
                class="roomInfo"
                style="padding-right:10px;"
              >{{ item.orderTypeCode | codeToText }}</div>
              <div
                class="roomInfo"
                style="width:50px;padding-right:10px;"
              >{{ item.roomPrice }}元</div>
              <div
                class="roomInfo"
                v-if="item.orderRoomStateCode === 'live'"
                style="padding-right:10px;"
              >
                时间：{{ item.realInTime | inOutTimeFilter }}至{{ item.estimateOutTime | inOutTimeFilter }}</div>
              <div
                class="roomInfo"
                v-if="item.orderRoomStateCode === 'left'"
                style="padding-right:10px;"
              >
                时间：{{ item.realInTime | inOutTimeFilter }}至{{ item.realOutTime | inOutTimeFilter }}</div>
              <div
                class="roomInfo"
                v-if="item.orderRoomStateCode === 'no_live'"
                style="padding-right:10px;"
              >
                时间：{{ item.estimateInTime | inOutTimeFilter }}至{{ item.estimateOutTime | inOutTimeFilter }}</div>
              <div
                class="roomInfo"
                style="padding-right:10px;"
              >{{ item.orderRoomStateCode | codeToText }}</div>
              </Col>
            </Row>

            <Row 
              v-for="(item, index) in row.orderReserves"
              :key="index"
              v-if="item.allottedNum < item.reserveNum"
            >
              <Col
                :span="24"
                style="padding:5px;"
              >
              <!-- <Table stripe :show-header="false" size="small" :columns="orderRoomCol" :data="row.orderRooms"></Table> -->
              <div
                class="roomInfo"
                style="width:70px;padding-right:0px;"
              >{{ item.roomTypeName }}</div>
              <div
                class="roomInfo"
                style="width:50px;padding-right:10px;"
              >{{ item.roomTypePrice }}元</div>
              <div
                class="roomInfo"
                style="padding-right:10px;"
              >{{ item.reserveNum }} 间</div>
              <div
                class="roomInfo"
                style="width:90px;padding-right:10px;"
              >已分配: {{ item.allottedNum }} 间</div>

              <div
                class="roomInfo"
                style="padding-right:10px;"
              >
                时间：{{ item.estimateInTime | inOutTimeFilter }} 至 {{ item.estimateOutTime | inOutTimeFilter }}</div>
              <div
                class="roomInfo"
                style="padding-right:10px;"
              >
                 等待分房</div>

              </Col>
            </Row>
          </template>
          <template
            slot-scope="{row}"
            slot="action"
          >
            <a @click="viewOrder.orderNo = row.orderNo; viewOrder.openIs = true;">查看详情</a>
            <!-- <Button size="small" type="info" ghost>查看详情</Button> -->
          </template>
        </Table>
        </Col>
      </Row>
      <Row>
        <Col :span="24">
        <Page
          :total="page.total"
          show-total
          prev-text="上一页"
          next-text="下一页"
          :current.sync="page.page"
          :page-size="page.limit"
          :page-size-opts="page.pageSizeOpts"
          @on-change="getOrderList"
          show-sizer
          @on-page-size-change="setPageSize"
        />
        </Col>
      </Row>
    </Content>
    <ViewOrder
      :open-is="viewOrder.openIs"
      :view-order-no="viewOrder.orderNo"
      @viewOrderClose="viewOrder.openIs = false"
    />
  </Layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import orderData from "./data/orderData.js";
import { getOrders } from "@/api/order.js";
import ViewOrder from "./ViewOrder.vue";
import { orderCodeToText } from "@/util/code2Text.js";
import queryUtils from "@/util/queryUtils.js";
export default {
  name: "OrderPage",
  components: {
    ViewOrder
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
  data() {
    return {
      orderCol: orderData.orderCol,
      orderRoomCol: orderData.orderRoomCol,
      businessDayEndHour: 6,
      orders: [],
      query: {
        orderNo: null,
        startTime: "",
        endTime: "",
        ss: null,
        guestName: null,
        "orderRoomQuery.orderRoomStateCode": null,
        "orderRoomQuery.estimateOutTimeStart": null,
        "orderRoomQuery.estimateOutTimeEnd": null,
        "orderRoomQuery.estimateInTimeStart": null,
        "orderRoomQuery.estimateInTimeEnd": null,
        queryType: null,
        page: 1,
        limit: 15,
        sortBy: "gmtCreate",
        orderBy: "desc"
      },
      viewOrder: {
        openIs: false,
        orderNo: ""
      },
      page: {
        total: 0,
        page: 1,
        limit: 15,
        pageSizeOpts: [5, 10, 15, 20, 30, 40]
      },
      options1: {
        shortcuts: [
          {
            text: "今天",
            value() {
              return new Date().toLocaleString();
            }
            // onClick: picker => {
            //   this.$Message.info("Click today");
            // }
          },
          {
            text: "昨天",
            value() {
              let date = new Date();
              date.setDate(date.getDate() - 1);
              return date.toLocaleString();
            }
          },
          {
            text: "前天",
            value() {
              let date = new Date();
              date.setDate(date.getDate() - 2);
              return date.toLocaleString();
            }
          }
        ]
      },
      isShowDate: true
    };
  },
  computed: {
    conHeight() {
      return this.appHeight - 65;
    },
    ...mapState({
      appHeight: state => state.webSet.appHeight,
      channel: state => state.dic.channel
    })
  },
  mounted() {
    // let date = new Date();
    // if (date.getHours() < this.businessDayEndHour) {
    //   date.setDate(date.getDate() - 1);
    // }
    // this.query.startTime = queryUtils.getBusinessDate(
    //   date,
    //   this.businessDayEndHour
    // );
    this.$nextTick(() => {
      this.getOrderList();
    });
  },
  methods: {
    queryClassified(val) {
      Object.assign(this.$data.query, this.$options.data().query);
      Object.assign(this.$data.page, this.$options.data().page);
      if ("all" === val) {
        this.isShowDate = true;
      }
      if ("live" === val) {
        this.isShowDate = false;
        this.query["orderRoomQuery.orderRoomStateCode"] = "live";
        this.query.queryType = "live";
      }
      if ("out" === val) {
        this.isShowDate = false;
        this.query["orderRoomQuery.orderRoomStateCode"] = "live";
        this.query[
          "orderRoomQuery.estimateOutTimeStart"
        ] = queryUtils.getBusinessDate(new Date(), this.businessDayEndHour);
        this.query[
          "orderRoomQuery.estimateOutTimeEnd"
        ] = queryUtils.getBusinessDate(
          new Date().setDate(new Date().getDate() + 1),
          this.businessDayEndHour
        );
        this.query.queryType = "live";
      }

      if ("wait_allot" === val) {
        this.isShowDate = false;
        this.query.queryType = "reserve";
      }

      if ("no_come" === val) {
        this.isShowDate = false;
        this.query["orderRoomQuery.orderRoomStateCode"] = "no_live";
        this.query.queryType = "reserve";
      }

      if ("today_come" === val) {
        this.isShowDate = false;
        this.query["orderRoomQuery.orderRoomStateCode"] = "no_live";
        this.query[
          "orderRoomQuery.estimateInTimeStart"
        ] = queryUtils.getBusinessDate(new Date(), this.businessDayEndHour);
        this.query[
          "orderRoomQuery.estimateInTimeEnd"
        ] = queryUtils.getBusinessDate(
          new Date().setDate(new Date().getDate() + 1),
          this.businessDayEndHour
        );
        this.query.queryType = "reserve";
      }

      this.getOrderList();
    },
    getOrderList() {
      this.query.page = this.page.page;
      this.query.limit = this.page.limit;

      this.query.startTime = queryUtils.getBusinessDate(
        this.query.startTime,
        this.businessDayEndHour
      );
      this.query.endTime = queryUtils.getBusinessDate(
        this.query.endTime,
        this.businessDayEndHour
      );
      getOrders(this.query).then(res => {
        if (res.data.code === 0) {
          this.orders = res.data.data;
          this.page.total = res.data.count;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    setEndTime(val) {
      let date = new Date(val);
      date.setDate(date.getDate() + 1);
      this.query.endTime = date.toLocaleString();
    },
    setPageSize(val) {
      this.page.limit = val;
      this.getOrderList();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleColDbClick(row, index) {
      this.viewOrder.orderNo = row.orderNo;
      this.viewOrder.openIs = true;
    }
  }
};
</script>

<style>
.orderTable {
  font: 1.1em sans-serif;
  font-weight: bold;
}
.roomInfo {
  float: left;
}
</style>
