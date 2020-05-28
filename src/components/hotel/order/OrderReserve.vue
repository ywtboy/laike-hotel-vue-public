<template>
  <div>
    <Modal
      width="800"
      v-model="isOpen"
      title="订单预订"
      :mask-closable="false"
      @on-visible-change="openOrClose"
    >
      <Form>
        <PeopleInfoInput
          :parent-is-open="isOpen"
          @get-data="getPeopleData"
        />
        <Divider
          size="default"
          class="myHr"
        />
        <div>
          <Row
            v-for="(item, index) in orderReserves"
            :key="index"
          >
            <Col :span="1">
            <Icon
              type="md-home"
              size="28"
            />
            </Col>
            <Col :span="4">
            <FormItem>
              <Select
                v-model="item.roomTypeId"
                filterable
                style="width: 120px"
                placeholder="选择房型"
                @on-change="setRoomTypeInfo(index)"
              >
                <Option
                  v-for="v in roomTypes"
                  :value="v.roomTypeId"
                  :key="v.roomTypeId"
                >{{ v.roomTypeName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <InputNumber
                :max="100"
                :min="1"
                placeholder="预订间数"
                v-model="item.reserveNum"
                :formatter="value => `${value} 间`"
                :parser="value => value.replace(' 间', '')"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <Input
                v-model="item.roomTypePrice"
                prefix="logo-yen"
                placeholder="请输入房价"
                number
                style="width: 120px"
              />
            </FormItem>
            </Col>
            <Col :span="6">
            <FormItem>
              <DatePicker
                v-model="item.estimateInTime"
                type="date"
                placement="bottom-end"
                placeholder="时间"
                :format="startFormat"
                style="width: 75px"
                :options="inOptions"
                @on-change="setOutTime(index,item.estimateInTime, item.day)"
              ></DatePicker>--
              <DatePicker
                v-model="item.estimateOutTime"
                type="date"
                placement="bottom-end"
                placeholder="时间"
                :format="endFormat"
                style="width: 75px"
                :options="outOptions(item.estimateInTime)"
                @on-change="setDay(index,item.estimateOutTime)"
              ></DatePicker>
            </FormItem>
            </Col>
            <Col :span="3">
            <FormItem>
              <InputNumber
                :max="100"
                :min="1"
                v-model="item.day"
                :formatter="value => `${value} 晚`"
                :parser="value => value.replace(' 晚', '')"
                @on-change="setOutTime(index,item.estimateInTime, $event)"
              ></InputNumber>

            </FormItem>
            </Col>
            <Col :span="2">
            <FormItem v-if="0 === index">
              <Button
                type="error"
                icon="md-add"
                size="small"
                @click="handleAdd"
              ></Button>&nbsp;
              <Button
                v-show="orderReserves.length > 1"
                type="error"
                icon="md-remove"
                size="small"
                @click="handleRemove"
              ></Button>
            </FormItem>
            </Col>
          </Row>
        </div>
        <Divider
          size="default"
          class="myHr"
        />
        <div>
          <Row>
            <Col :span="1">
            <Icon
              type="md-arrow-forward"
              size="28"
            />
            </Col>
            <Col :span="4">
            <FormItem>
              <Select
                v-model="order.channelCode"
                style="width: 120px"
                @on-change="channelChange"
                placeholder="请选择渠道"
              >
                <Option
                  v-for="(item, index) in channel"
                  :key="index"
                  :value="item.dicCommonCode"
                >
                  {{ item.dicCommonName }}</Option>
              </Select>
            </FormItem>
            </Col>

            <Col :span="8">
            <FormItem>
              <Select
                v-model="order.payTypeCode"
                style="width: 120px"
              >
                <Option value="spot_pay">现付</Option>
                <Option value="advance_pay">预付</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>

        </div>
        <Divider
          size="default"
          class="myHr"
        />
        <div>
          <PayDetail
            :parent-is-open="isOpen"
            @get-money="getMoney"
          ></PayDetail>
          <FormItem>
            <Input
              v-model="order.orderComment"
              placeholder="输入备注"
              type="textarea"
            ></Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          @click="isOpen = false;"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="reserveLoad"
          @click="submit"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { reserve } from "@/api/order.js";
export default {
  name: "OrderReserve",
  props: {
    openIs: Boolean
  },
  components: {
    PeopleInfoInput: () =>
      import(/* webpackChunkName: "peopleInfoInput" */ "@/components/common/PeopleInfoInput.vue"),
    PayDetail: () =>
      import(/* webpackChunkName: "payDetail" */ "@/components/common/PayDetail.vue")
  },
  data() {
    return {
      isOpen: false,
      orderIncome: {
        incomeMoney: 0,
        incomeTypeCode: "income",
        incomeComment: null,
        payDetails: []
      },
      guest: {
        guestName: null,
        guestTel: null,
        certificateType: "idcard",
        certificateNo: null,
        guestSex: null,
        guestNation: null,
        guestBirthday: null,
        guestAddress: null
      },
      orderReserves: [
        {
          roomTypeId: null,
          roomTypeName: null,
          roomTypePrice: null,
          reserveNum: 1,
          estimateInTime: new Date(),
          estimateOutTime: null,
          day: 1
        }
      ],
      order: {
        guestName: "",
        guestTel: "",
        guestCertificateNo: "",
        // 日租/钟点
        orderTypeCode: "daily",
        channelCode: "",
        payTypeCode: "spot_pay",
        orderComment: null,
        clientTypeCode: "web"
      },
      reserveLoad: false,
      startFormat: "MM-dd",
      endFormat: "MM-dd HH:mm",
      defaultDay: 1,
      checkOutHour: 12,
      businessDayEndHour: 6,
      inOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      outDisabledDateTemp: Date.now() - 86400000,
    };
  },
  computed: {
    ...mapState({
      roomTypes: state => state.room.roomTypes,
      channel: state => state.dic.channel
    })
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("order-reserve-close");
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadRoomTypes();
        this.orderReserves[0].estimateOutTime = this.getCheckOutTime(
          false,
          new Date(),
          1
        );
      }
    },
    outOptions(inTime){
        const disabledDate = date => {
          return date && date.valueOf() < inTime.valueOf();
        };
        return { disabledDate };
      },
    getPeopleData(event) {
      this.guest = event;
    },
    getMoney(event) {
      this.orderIncome = event;
    },
    setDay(i, outTime) {
      this.orderReserves[i].day = outTime.getDate() - this.orderReserves[i].estimateInTime.getDate();
    },
    setOutTime(i, inTime, day) {
      let curr = new Date();
      if (curr.toDateString() === inTime.toDateString()) {
        inTime = curr;
      } else {
        inTime.setHours(this.businessDayEndHour);
      }
      this.orderReserves[i].estimateOutTime = this.getCheckOutTime(
        false,
        inTime,
        day
      );
    },
    handleAdd() {
      this.orderReserves.push({
        roomTypeId: null,
        roomTypeName: null,
        roomTypePrice: null,
        reserveNum: 1,

        // 预计入住时间
        estimateInTime: new Date(),
        // 预计推翻时间
        estimateOutTime: this.getCheckOutTime(false, new Date(), 1),
        day: 1
      });
    },
    handleRemove() {
      if (this.orderReserves.length > 1) {
        this.orderReserves.pop();
      }
    },
    setRoomTypeInfo(i) {
      let roomType = this.roomTypes.filter(
        roomType => roomType.roomTypeId === this.orderReserves[i].roomTypeId
      );
      if (roomType && roomType.length > 0) {
        this.orderReserves[i].roomTypeName = roomType[0].roomTypeName;
        this.orderReserves[i].roomTypePrice = roomType[0].roomTypePrice;
      }
    },
    submit() {
      this.reserveLoad = true;
      this.order.guestName = this.guest.guestName;
      let guests = [this.guest];
      let json = {
        order: this.order,
        orderReserves: this.orderReserves,
        orderIncome: this.orderIncome,
        guests: guests
      };
      reserve(json).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data);

          this.isOpen = false;
          this.$Message.success("预订成功");
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
          this.reserveLoad = false;
        }
      });
    },
    getCheckOutTime(isHour, inTime, length) {
      let current = new Date(inTime);
      console.log("ssd--", current);

      if (isHour) {
        current.setHours(current.getHours() + length);
      } else {
        // if (current.getHours() >= this.businessDayEndHour) {
        current.setDate(current.getDate() + length);
        // }
        current.setHours(this.checkOutHour);
        current.setMinutes(0);
        current.setSeconds(0);
        current.setMilliseconds(0);
      }

      return current;
    },
    channelChange(val) {
      if (val === "offline") {
        this.order.payTypeCode = "spot_pay";
      } else {
        this.order.payTypeCode = "advance_pay";
      }
    },
    ...mapActions(["loadRoomTypes"])
  }
};
</script>

<style>
</style>
