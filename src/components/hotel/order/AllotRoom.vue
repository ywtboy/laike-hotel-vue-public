<template>
  <div>
    <Modal
      width="800"
      v-model="isOpen"
      :title="title"
      :mask-closable="false"
      @on-visible-change="openOrClose"
    >
      <Form>
        <div
          class="allotRoom"
          v-if="'allot'===isAllot"
        >
          <Row>
            <Col :span="3">
            {{orderReserve?orderReserve.roomTypeName:''}}
            </Col>
            <Col :span="6">
            预订房价： {{orderReserve?orderReserve.roomTypePrice:''}} 元/间/晚
            </Col>
            <Col :span="4">
            预订数量： {{orderReserve?orderReserve.reserveNum:''}} 间
            </Col>
            <Col :span="4">
            已分配： {{orderReserve?orderReserve.allottedNum:''}} 间
            </Col>
          </Row>
        </div>
        <Divider style="margin-top: 24; margin-bottom: 24px;" />
        <div>
          <Row
            v-for="(item, index) in orderRooms"
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
                placeholder="请选择房号"
                :disabled="'allot'!==isAllot"
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
            <!-- <FormItem>
            <RadioGroup
              v-model="item.orderTypeCode"
              @on-change="setHourRoom(index,$event)"
            >
              <Radio label="daily">日租</Radio>
              <Radio label="hour_room">钟点</Radio>
            </RadioGroup>
          </FormItem> -->
            </Col>
            <Col :span="4">
            <FormItem>
              <Input
                v-model="item.roomPrice"
                prefix="logo-yen"
                placeholder="请输入房价"
                number
                style="width: 120px"
                clearable
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
                :readonly="onlyRead"
              ></DatePicker>--
              <DatePicker
                v-model="item.estimateOutTime"
                type="date"
                placement="bottom-end"
                placeholder="时间"
                :format="endFormat"
                style="width: 75px"
                :readonly="onlyRead"
              ></DatePicker>
            </FormItem>
            </Col>
            <Col :span="3">
            <FormItem>
              <InputNumber
                v-if="item.orderTypeCode === 'daily'"
                :max="100"
                :min="1"
                v-model="item.day"
                :formatter="value => `${value} 晚`"
                :parser="value => value.replace(' 晚', '')"
                :readonly="onlyRead"
              ></InputNumber>
              <!-- <InputNumber
              v-if="item.orderTypeCode === 'hour_room'"
              :max="3"
              :min="3"
              v-model="defaultHour"
              readonly
              :formatter="value => `${value} 小时`"
              :parser="value => value.replace(' 小时', '')"
              @on-change="setOutTime(index,$event)"
            ></InputNumber> -->
            </FormItem>
            </Col>
            <Col :span="2">
            <FormItem v-if="0 === index">
              <Button
                v-show="orderRooms.length < roomNum"
                type="error"
                icon="md-add"
                size="small"
                @click="handleRoomAdd"
              ></Button>&nbsp;
              <Button
                v-show="orderRooms.length > 1"
                type="error"
                icon="md-remove"
                size="small"
                @click="handleRoomRemove"
              ></Button>
            </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          @click="isOpen = false;"
        >取消</Button>
        <Button
          v-if="'allot'===isAllot"
          type="primary"
          size="large"
          :loading="allotRoomLoad"
          @click="submit"
        >确定</Button>
        <Button
          v-if="'checkIn'===isAllot"
          type="primary"
          size="large"
          :loading="allotRoomLoad"
          @click="submitCheckIn"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { allotRoom,checkIn } from "@/api/order.js";
export default {
  name: "AllotRoom",
  props: {
    openIs: Boolean,
    orderReserve: Object,
    order: Object,
    isAllot: String,
    checkInOrderRooms: Array
  },
  data() {
    return {
      isOpen: false,
      title: "分配房间",
      allotRoomLoad: false,
      orderRooms: [],
      startFormat: "MM-dd",
      endFormat: "MM-dd HH:mm",
      isRooms: null,
      onlyRead: false,
      isOk: false
    };
  },
  computed: {
    roomNum() {
      if ("allot" === this.isAllot) {
        return this.orderReserve.reserveNum - this.orderReserve.allottedNum;
      }
      return 0;
    },
    ...mapState({
      roomStates: state => state.room.roomStates
    }),
    ...mapGetters(["getRoomsByType"])
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    }
  },
  mounted() {
    if (null === this.roomStates) {
      this.loadRoomStates();
    }
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        this.$emit("allot-room-close", this.isOk);
        Object.assign(this.$data, this.$options.data());
      } else {
        this.isRooms = this.getRoomsByType(
          this.orderReserve ? this.orderReserve.roomTypeId : null
        );
        if ("allot" === this.isAllot) {
          this.title = "分配房间";
          this.onlyRead = true;
          for (let index = 0; index < this.roomNum; index++) {
            this.handleRoomAdd();
          }
        }
        if ("checkIn" === this.isAllot) {
          this.title = "办理入住";
          this.onlyRead = true;
          console.log(this.checkInOrderRooms);

          this.checkInOrderRooms.forEach(or => {
            let inTime = new Date(or.estimateInTime);
            let outTime = new Date(or.estimateOutTime);
            let day = outTime.getDate() - inTime.getDate();
            or.estimateInTime = inTime;
            or.estimateOutTime = outTime;
            or.day = day;
          });
          let rs = [];
          Object.assign(rs, this.checkInOrderRooms);
          this.orderRooms = rs;
        }
      }
    },
    submit() {
      this.allotRoomLoad = true;
      let tag = true;
      this.orderRooms.forEach(or => {
        if (or.roomNo === null || or.roomNo === "") {
          tag = false;
          this.$Message.error("请选择房号");
          return false;
        }
      });
      console.log(this.orderRooms);
      if (tag) {
        allotRoom({ orderRooms: this.orderRooms }).then(res => {
          if (res.data.code === 0) {
            this.isOk = true;
            this.isOpen = false;
            this.$Message.success("分配房间成功");
          } else {
            this.$Message.error(res.data.code + "：" + res.data.msg);
            this.allotRoomLoad = false;
          }
        });
      }
    },
    submitCheckIn() {
      this.allotRoomLoad = true;
      let json = {
        'order': this.order,
        'orderRooms': this.orderRooms,
        'reserved': true
      }
      checkIn(json).then(res => {
        if (res.data.code === 0) {
          this.isOk = true;
          this.isOpen = false;
          this.$emit("load-room-state");
         this.$Message.success('办理入住成功');
         

        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
          this.allotRoomLoad = false;
        }
      });
    },
    isDisabled(roomNo) {
      let tag = false;
      this.orderRooms.forEach(or => {
        if (roomNo === or.roomNo) {
          tag = true;
        }
      });
      return tag;
    },
    setRoomInfo(i) {
      let room = this.isRooms.filter(
        room => room.roomNo === this.orderRooms[i].roomNo
      );
      if (room && room.length > 0) {
        this.orderRooms[i].roomName = room[0].roomName;
        this.orderRooms[i].roomTypeName = room[0].roomTypeName;
        //  this.orderRooms[i].roomPrice = room[0].roomTypePrice;
      }
    },
    handleRoomAdd() {
      let inTime = new Date(this.orderReserve.estimateInTime);
      let outTime = new Date(this.orderReserve.estimateOutTime);
      let day = outTime.getDate() - inTime.getDate();
      this.orderRooms.push({
        roomName: "",
        roomNo: "",
        roomTypeName: "",
        roomPrice: this.orderReserve.roomTypePrice,
        guestName: this.order.guestName,
        guestTel: this.order.guestTel || null,
        guestCertificateNo: this.order.guestCertificateNo || null,
        otherGuestCertificateNos: null,
        // 日租/钟点
        orderTypeCode: "daily",
        // 预计入住时间
        estimateInTime: inTime,
        // 预计推翻时间
        estimateOutTime: outTime,
        reserveId: this.orderReserve.reserveId,
        orderNo: this.orderReserve.orderNo,
        day: day
      });
    },
    handleRoomRemove() {
      if (this.orderRooms.length > 1) {
        this.orderRooms.pop();
      }
    },
    ...mapActions(["loadRoomStates"])
  }
};
</script>

<style>
.allotRoom {
  font: 1.1em sans-serif;
  font-weight: bold;
}
</style>
