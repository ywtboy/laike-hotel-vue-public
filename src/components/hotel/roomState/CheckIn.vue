<template>
  <div>
    <Modal
      width="800"
      v-model="isOpen"
      title="入住登记"
      :mask-closable="false"
      @on-visible-change="openOrClose"
    >
      <Form>
        <div>
          <Row>
            <Col :span="1">
            <Icon
              type="md-person"
              size="28"
            />

            </Col>
            <Col :span="4">
            <FormItem>
              <Input
                ref="nameInput"
                v-model="guest.guestName"
                placeholder="请输入姓名"
                icon="ios-card"
                style="width: 120px"
              />
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem>
              <Input
                v-model="guest.certificateNo"
                placeholder="请输入证件号"
                style="width: 240px"
                @on-change="openGuestLog(guest.certificateNo)"
              >
              <Select
                v-model="guest.certificateType"
                slot="prepend"
                style="width: 80px"
              >
                <Option value="idcard">身份证</Option>
                <Option value="other">其它</Option>
              </Select>
              </Input>
            </FormItem>
            </Col>
            <Col :span="5">
            <FormItem>
              <Input
                v-model="guest.guestTel"
                placeholder="手机号"
                style="width: 150px"
              />
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <DatePicker
                type="date"
                :start-date="new Date('1990-01-01')"
                placeholder="选择生日"
                v-model="guest.guestBirthday"
              ></DatePicker>
            </FormItem>
            </Col>

          </Row>
          <Row>
            <Col :span="1">&nbsp;</Col>
            <Col :span="4">
            <FormItem>
              <Select
                v-model="guest.guestSex"
                style="width: 120px"
                placeholder="请选择性别"
              >
                <Option value="male">男</Option>
                <Option value="female">女</Option>
              </Select>
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <Select
                v-model="guest.guestNation"
                style="width: 120px"
                placeholder="请选择民族"
              >
                <Option value="汉">汉</Option>
              </Select>
            </FormItem>
            </Col>
            <Col :span="10">
            <FormItem>
              <Input
                v-model="guest.guestAddress"
                placeholder="请输入地址"
                style="width: 300px"
              />
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <Button
                type="primary"
                size="small"
                shape="circle"
                icon="ios-card"
                :loading="readCardload"
                @click="readCard"
              >读卡</Button>
            </FormItem>
            </Col>
          </Row>

        </div>
        <Divider
          size="default"
          class="myHr"
        />
        <div>
          <Row
            v-for="(item, index) in checkIn.orderRooms"
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
                v-model="item.roomNo"
                filterable
                @on-change="setRoomInfo(index)"
                style="width: 120px"
              >
                <Option
                  v-for="v in isRooms"
                  :disabled="isDisabled(v.roomNo)"
                  :value="v.roomNo"
                  :key="v.roomName"
                >{{ v.roomName }}-{{ v.roomTypeName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <RadioGroup
                v-model="item.orderTypeCode"
                @on-change="setHourRoom(index,$event)"
              >
                <Radio label="daily">日租</Radio>
                <Radio label="hour_room">钟点</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col :span="4">
            <FormItem>
              <Input
                v-model="item.roomPrice"
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
              ></DatePicker>--
              <DatePicker
                v-model="item.estimateOutTime"
                type="date"
                placement="bottom-end"
                placeholder="时间"
                :format="endFormat"
                style="width: 75px"
              ></DatePicker>
            </FormItem>
            </Col>
            <Col :span="3">
            <FormItem>
              <InputNumber
                v-if="item.orderTypeCode === 'daily'"
                :max="100"
                :min="1"
                v-model="defaultDay"
                :formatter="value => `${value} 晚`"
                :parser="value => value.replace(' 晚', '')"
                @on-change="setOutTime(index,$event)"
              ></InputNumber>
              <InputNumber
                v-if="item.orderTypeCode === 'hour_room'"
                :max="3"
                :min="3"
                v-model="defaultHour"
                readonly
                :formatter="value => `${value} 小时`"
                :parser="value => value.replace(' 小时', '')"
                @on-change="setOutTime(index,$event)"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col :span="2">
            <FormItem v-if="0 === index">
              <Button
                type="error"
                icon="md-add"
                size="small"
                @click="handleRoomAdd"
              ></Button>&nbsp;
              <Button
                v-show="checkIn.orderRooms.length > 1"
                type="error"
                icon="md-remove"
                size="small"
                @click="handleRoomRemove"
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
                v-model="checkIn.order.channelCode"
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
                v-model="checkIn.order.payTypeCode"
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
            @get-money="getMoney"
            :parent-is-open="isOpen"
          ></PayDetail>

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
          :loading="checkInLoad"
          @click="submit"
        >确定</Button>
      </div>
    </Modal>
    <!-- <ViewOrder
      :open-is="viewOrder.openIs"
      :view-order-no="viewOrder.orderNo"
      @viewOrderClose="viewOrder.openIs = false;"
    /> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import PayDetail from "@/components/common/PayDetail.vue";
import IDCard from "@/util/IDCard.js";
import jsonp from "jsonp";
import { checkIn, getOrderRooms } from "@/api/order.js";
import ViewOrder from "../order/ViewOrder.vue";

export default {
  name: "CheckIn",
  props: {
    openIs: Boolean,
    room: Object,
    rooms: Array
  },
  components: {
    PayDetail,
    ViewOrder
  },
  data() {
    return {
      isOpen: false,
      viewOrder: {
        openIs: false,
        orderNo: ""
      },
      checkInLoad: false,
      checkOutHour: 12,
      businessDayEndHour: 6,
      checkIn: {
        reserved: false,
        order: {
          guestName: "",
          guestTel: "",
          guestCertificateNo: "",
          // 日租/钟点
          orderTypeCode: "daily",
          channelCode: "",
          checkInTime: new Date(),
          checkOutTime: new Date(),
          payTypeCode: "spot_pay",
          orderComment: null,
          clientTypeCode: "web"
        },
        orderRooms: [
          {
            roomName: "",
            roomNo: "",
            roomTypeName: "",
            roomPrice: null,
            guestName: "",
            guestTel: "",
            guestCertificateNo: "",
            otherGuestCertificateNos: null,
            // 日租/钟点
            orderTypeCode: "daily",
            // 预计入住时间
            estimateInTime: new Date(),
            // 预计退房时间
            estimateOutTime: null
          }
        ],
        orderIncome: {
          incomeMoney: 0,
          incomeTypeCode: "income",
          incomeComment: null,
          payDetails: []
        },
        guests: [
          {
            guestName: null,
            guestTel: null,
            certificateType: "idcard",
            certificateNo: null,
            guestSex: null,
            guestNation: null,
            guestBirthday: null,
            guestAddress: null
          }
        ]
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
      readCardload: false,
      startFormat: "MM-dd",
      endFormat: "MM-dd HH:mm",
      defaultDay: 1,
      defaultHour: 3
    };
  },
  computed: {
    isRooms() {
      return this.rooms.filter(room => room.roomState === "vacant");
    },
    ...mapState({
      inout: state => state.dic.inout,
      channel: state => state.dic.channel
    }),
    ...mapGetters(["codeToText"])
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  methods: {
    submit() {
      this.checkInLoad = true;
      this.checkIn.order.guestName = this.guest.guestName;
      this.checkIn.order.guestTel = this.guest.guestTel;
      this.checkIn.order.guestCertificateNo = this.guest.certificateNo;
      this.checkIn.order.checkInTime = this.checkIn.orderRooms[0].estimateInTime;
      this.checkIn.order.checkOutTime = this.checkIn.orderRooms[0].estimateOutTime;
      this.checkIn.order.orderTypeCode = this.checkIn.orderRooms[0].orderTypeCode;
      this.checkIn.guests[0] = this.guest;
      this.checkIn.orderRooms.forEach(or => {
        or.guestName = this.guest.guestName;
        or.guestTel = this.guest.guestTel;
        or.guestCertificateNo = this.guest.certificateNo;
      });
      console.log(this.guest);
      console.log(this.checkIn);
      if (
        this.checkIn.order.channelCode == null ||
        this.checkIn.order.channelCode === ""
      ) {
        this.$Message.error("请选择渠道");
        this.checkInLoad = false;
        return false;
      }
      checkIn(this.checkIn).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data.order);

          this.viewOrder.orderNo = res.data.data.order.orderNo;
          // this.viewOrder.openIs = true;
          this.isOpen = false;
          this.$emit("load-room-state");
          this.$Message.success("入住成功");
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
          this.checkInLoad = false;
        }
      });
    },
    openOrClose(val) {
      if (!val) {
        this.$emit("CheckInClose", this.viewOrder.orderNo);
        // 恢复默认数据
        // this.defaultDay=1;
        Object.assign(this.$data, this.$options.data());
        // this.readCardload = false;
        this.$Notice.close("guestLog");
      } else {
        this.checkIn.orderRooms[0].roomName = this.room.roomName;
        this.checkIn.orderRooms[0].roomNo = this.room.roomNo;
        this.checkIn.orderRooms[0].roomTypeName = this.room.roomTypeName;
        this.checkIn.orderRooms[0].estimateOutTime = this.getCheckOutTime(
          false,
          1
        );
        this.checkIn.orderRooms[0].roomPrice = this.room.roomTypePrice;
        this.$nextTick(() => {
          this.$refs.nameInput.focus();
        });
      }
    },
    setRoomInfo(i) {
      let room = this.rooms.filter(
        room => room.roomNo === this.checkIn.orderRooms[i].roomNo
      );
      if (room && room.length > 0) {
        this.checkIn.orderRooms[i].roomName = room[0].roomName;
        this.checkIn.orderRooms[i].roomTypeName = room[0].roomTypeName;
        this.checkIn.orderRooms[i].roomPrice = room[0].roomTypePrice;
      }
    },
    handleRoomAdd() {
      this.checkIn.orderRooms.push({
        roomName: "",
        roomNo: "",
        roomTypeName: "",
        roomPrice: null,
        guestName: "",
        guestTel: "",
        guestCertificateNo: "",
        otherGuestCertificateNos: null,
        // 日租/钟点
        orderTypeCode: "daily",
        // 预计入住时间
        estimateInTime: new Date(),
        // 预计推翻时间
        estimateOutTime: this.getCheckOutTime(false, 1)
      });
    },
    handleRoomRemove() {
      if (this.checkIn.orderRooms.length > 1) {
        this.checkIn.orderRooms.pop();
      }
    },
    getMoney(val) {
      // console.log('哈', val);
      this.checkIn.orderIncome = val;
    },
    readCard() {
      
      this.readCardload = true;
      IDCard.read(data => {
        console.log("retcode:", data.retcode);
        console.log("retmsg:", data.retmsg);
        console.log("errmsg:", data.errmsg);
        console.log("CardType:", data.CardType);
        // 查询顾客入住记录
        this.openGuestLog(data.cardno);

        this.guest.guestName = data.name;
        this.guest.certificateNo = data.cardno;
        this.guest.guestBirthday = data.born;

        if (data.sex == "男") {
          this.guest.guestSex = "male";
        }
        if (data.sex == "女") {
          this.guest.guestSex = "female";
        }

        this.guest.guestNation = data.nation;
        this.guest.guestAddress = data.address;

        this.readCardload = false;
      });
    },
    setOutTime(i, day) {
      console.log(this.checkIn.orderRooms[i].estimateInTime);
      this.checkIn.orderRooms[i].estimateOutTime = this.getCheckOutTime(
        false,
        day
      );
    },
    setHourRoom(i, val) {
      if (val === "hour_room") {
        this.startFormat = "HH:mm";
        this.endFormat = "HH:mm";
        this.checkIn.orderRooms[i].roomPrice = 60;
        this.checkIn.orderRooms[i].estimateOutTime = this.getCheckOutTime(
          true,
          3
        );
      } else {
        this.startFormat = "MM-dd";
        this.endFormat = "MM-dd HH:mm";
        this.setRoomInfo(i);
        this.checkIn.orderRooms[i].estimateOutTime = this.getCheckOutTime(
          false,
          1
        );
      }
      console.log(this.checkIn.orderRooms[i].estimateInTime);
      console.log(this.checkIn.orderRooms[i].estimateOutTime);
    },
    isDisabled(roomNo) {
      let tag = false;
      this.checkIn.orderRooms.forEach(or => {
        if (roomNo === or.roomNo) {
          tag = true;
        }
      });
      return tag;
    },
    channelChange(val) {
      if (val === "offline") {
        this.checkIn.order.payTypeCode = "spot_pay";
      } else {
        this.checkIn.order.payTypeCode = "advance_pay";
      }
    },
    openGuestLog(val) {
      console.log(val);
      let json = {
        guestCertificateNo: val,
        sortBy: "gmtCreate",
        orderBy: "desc",
        page: 1,
        limit: 3
      };
      if (val) {
        getOrderRooms(json).then(res => {
          if (res.data.code === 0) {
            let orderRooms = res.data.data;
            this.$Notice.close("guestLog");
            if (null === orderRooms || orderRooms.length <= 0) {
              this.$Notice.info({
                name: "guestLog",
                duration: 0,
                title: "此客人第一次入住！",
                desc: ""
              });
            }
            if (orderRooms && orderRooms.length > 0) {
              this.$Notice.open({
                name: "guestLog",
                title: "客人 " + orderRooms[0].guestName + " 最近入住记录",
                duration: 0,
                desc: val,
                render: h => {
                  return h(
                    "div",
                    orderRooms.map(or => {
                      return h(
                        "p",
                        {
                          style: {
                            paddingTop: "10px",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }
                        },
                        [
                          or.roomName,
                          "-" + or.roomTypeName + " ",
                          or.orderTypeCode === "daily" ? "日租" : "钟点",
                          " " + or.roomPrice + "元 ",
                          new Date(or.realInTime).toLocaleDateString()
                        ]
                      );
                    })
                  );
                }
              });
            }
          }
        });
      }
    },
    getCheckOutTime(isHour, length) {
      let current = new Date();
      if (isHour) {
        current.setHours(current.getHours() + length);
      } else {
        if (current.getHours() >= this.businessDayEndHour) {
          current.setDate(current.getDate() + length);
          console.log(length);
        }
        current.setHours(this.checkOutHour);
        current.setMinutes(0);
        current.setSeconds(0);
        current.setMilliseconds(0);
      }

      return current;
    }
  }
};
</script>

<style>
.myHr {
  margin-top: 0;
  margin-bottom: 24px;
}
</style>
