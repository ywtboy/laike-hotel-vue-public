<template>
  <Layout :style="{height: appHeight - 65 + 'px' }">
    <Layout>
      <Sider>
        <!-- :value="false"
        :collapsed-width="10"
        :style="{background: '#f8f8f9', minHeight: '100%'}" -->
        <Menu
          theme="light"
          width="auto"
          style="height: 100%;"
        >
          <div>
            总房数：{{ roomStates.length }}<br />
            已租：{{ roomNum.rented }}<br />
            空房：{{ roomNum.vacant }}<br />
            脏房：{{ roomNum.dirty }}<br />
            维修：{{ roomNum.repair }}<br />

            入住率：{{ occupancy }}<br />
          </div>
          <div>
            <Button
              type="primary"
              shape="circle"
              size="small"
              @click="orderReserve.openIs = true"
            >预 订</Button>
          </div>
        </Menu>
      </Sider>
      <Content>
        <div class="rooms">
          <div v-for=" room in roomStates">
            <!-- <Poptip
              placement="bottom"
              trigger="hover"
              content="content"
              style="float: left;"
            > style="background: #fff;"-->
            <Card
              class="room "
              :class="room.roomState"
            >
              <div
                style="height: 100%; width: 100%"
                @click.prevent.right="openMenu(room, $event)"
                @dblclick="dblclickHandle(room)"
              >
                <p
                  align="left"
                  class="roomNo"
                >{{ room.roomName }}
                  <Icon
                    style="float: right;"
                    size="24"
                    v-if="room.roomState === 'rented_hour' "
                    type="md-time"
                  />
                </p>
                <p
                  align="left"
                  class="roomType"
                >{{ room.roomTypeName }}</p>
                <p
                  align="left"
                  class="state"
                >{{ room.roomStateName }}</p>
              </div>
            </Card>
            <!-- <Button
                slot="title"
                @click="alert(233)"
              >修改房态</Button> -->
            <!-- </Poptip> -->
          </div>
        </div>
      </Content>
    </Layout>
    <!-- <Footer>2011-2016 &copy; TalkingData</Footer> -->
    <ViewOrder
      :open-is="viewOrder.openIs"
      :view-order-no="currentRoom.orderNo"
      :is-print="viewOrder.isPrint"
      @viewOrderClose="orderClose"
      @load-room-state="getRoomStateList"
    />

    <CheckIn
      :open-is="checkIn.openIs"
      :room="currentRoom"
      :rooms="roomStates"
      @CheckInClose="checkInClose($event)"
      @load-room-state="getRoomStateList"
    ></CheckIn>

    <OrderReserve
      :open-is="orderReserve.openIs"
      @order-reserve-close="orderReserve.openIs = false"
    >
    </OrderReserve>

    <Modal
      v-model="stateModal"
      :title="editRoomStateTitle"
      :loading="stateLoad"
      @on-ok="submitRoomState"
    >
      <RadioGroup v-model="currentState">
        <Radio
          v-for="state in states"
          v-if="state.dicCommonCode !== 'rented'"
          :key="state.dicCommonId"
          :label="state.dicCommonCode"
        >{{ state.dicCommonName }}</Radio>
      </RadioGroup>
    </Modal>

    <Dropdown
      trigger="custom"
      :visible="false"
      :transfer="true"
      transfer-class-name="mymenu"
      @on-click="handleMenu"
    >
      <DropdownMenu slot="list">
        <DropdownItem
          name="checkIn"
          :disabled=" 'vacant' !== currentRoom.roomState"
        >入住</DropdownItem>
        <!-- <DropdownItem
          name="reserve"
          :disabled="true"
        >预定</DropdownItem> -->
        <DropdownItem
          name="view"
          :disabled=" 'rented' !== currentRoom.roomState"
        >查看订单</DropdownItem>
        <!-- <DropdownItem
          name="continue"
          :disabled=" 'rented' !== currentRoom.roomState"
        >续费</DropdownItem>
        <DropdownItem
          name="checkOut"
          :disabled=" 'rented' !== currentRoom.roomState"
        >结账</DropdownItem> -->
        <DropdownItem
          name="lock"
          :disabled=" 'vacant' !== currentRoom.roomState"
        >锁房</DropdownItem>
        <Dropdown placement="right-start">
          <DropdownItem
            divided
            name="state"
            :disabled=" 'rented' === currentRoom.roomState"
          >修改房态
            <Icon type="ios-arrow-forward"></Icon>
          </DropdownItem>
          <!-- <DropdownMenu slot="list" :disabled=" 'rented' === currentRoom.roomState">
            <DropdownItem
              v-for="state in states"
              v-if="state.dicCommonCode !== 'rented'"
              :key="state.dicCommonId"
              :disabled="state.dicCommonCode === currentRoom.roomState"
              :name="state.dicCommonCode"
            >{{ state.dicCommonName }}</DropdownItem>
          </DropdownMenu> -->
        </Dropdown>
        <DropdownItem
          divided
          name="close"
        >取消</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Layout>
</template>

<script>
import ViewOrder from "../order/ViewOrder.vue";
import CheckIn from "../roomState/CheckIn.vue";
import { getRoomState, updateRoomState } from "@/api/room.js";
import { getDicByType } from "@/api/dic.js";
import { mapMutations, mapState } from "vuex";

import appHeight from "@/util/autoHeight.js";

export default {
  name: "RoomState",
  components: {
    ViewOrder,
    CheckIn,
    OrderReserve: () =>
      import(/* webpackChunkName: "orderReserve" */ "../order/OrderReserve.vue")
  },
  data() {
    return {
      hotelNo: "622723001",
      currentRoom: {},
      viewOrder: {
        openIs: false,
        isPrint: false
      },
      roomStates: [],
      stateModal: false,
      stateLoad: true,
      states: [],
      editRoomStateTitle: "修改房态",
      currentState: "",
      checkIn: {
        openIs: false
      },
      autoHeight: appHeight,
      orderReserve: {
        openIs: false
      }
    };
  },
  computed: {
    roomNum() {
      let roomNum = {};
      roomNum.vacant = 0;
      roomNum.rented = 0;
      roomNum.dirty = 0;
      roomNum.repair = 0;
      this.roomStates.forEach(room => {
        if ("vacant" === room.roomState) {
          roomNum.vacant++;
        }
        if ("rented" === room.roomState || "rented_hour" === room.roomState) {
          roomNum.rented++;
        }
        if ("dirty" === room.roomState) {
          roomNum.dirty++;
        }
        if ("repair" === room.roomState) {
          roomNum.repair++;
        }
      });
      return roomNum;
    },
    occupancy() {
      return (
        Math.round((this.roomNum.rented / this.roomStates.length) * 10000) /
          100.0 +
        "%"
      );
    },
    ...mapState({
      appHeight: state => state.webSet.appHeight,
      channel: state => state.dic.channel
    })
  },
  mounted() {
    this.getStateList("roomState");
    this.getRoomStateList();
  },
  methods: {
    openMenu(room, event) {
      //   this.$emit('myOpenOrder');
      // this.viewOrder.openIs = true;
      this.currentRoom = room;

      let clientHeight = document.documentElement.clientHeight;
      let clientWidth = document.documentElement.clientWidth;

      let menu = document.getElementsByClassName("mymenu")[0];
      menu.style.display = "";
      let menuHeight = menu.offsetHeight;
      let menuWidth = menu.offsetWidth;
      console.log(menuHeight);

      if (clientHeight - event.clientY < 200) {
        menu.style.top = event.clientY - menuHeight + "px";
      } else {
        menu.style.top = event.clientY + "px";
      }

      if (clientWidth - event.clientX < 103) {
        menu.style.left = clientWidth - menuWidth + "px";
      } else {
        menu.style.left = event.clientX + "px";
      }
    },
    handleMenu(name) {
      console.log(name);
      if (name === "checkIn") {
        this.checkIn.openIs = true;
        this.closeMenu();
      }

      if (name === "reserve") {
        this.checkIn.openIs = true;
        this.closeMenu();
      }

      if (name === "view") {
        this.viewOrder.openIs = true;
        this.closeMenu();
      }

      if (name === "close") {
        this.closeMenu();
      }
      if (name === "state") {
        this.editRoomStateTitle = "修改房态--" + this.currentRoom.roomName;
        this.currentState = this.currentRoom.roomState;
        this.stateModal = true;
        this.closeMenu();
      }
    },
    dblclickHandle(room) {
      this.currentRoom = room;
      if ("rented" === room.roomState || "rented_hour" === room.roomState) {
        this.viewOrder.openIs = true;
      }
      if ("vacant" === room.roomState) {
        this.checkIn.openIs = true;
      }
      if ("dirty" === room.roomState || "repair" === room.roomState) {
        this.editRoomStateTitle = "修改房态--" + this.currentRoom.roomName;
        this.currentState = this.currentRoom.roomState;
        this.stateModal = true;
      }
    },
    closeMenu() {
      let menu = document.getElementsByClassName("mymenu")[0];
      menu.style.display = "none";
    },
    orderClose() {
      this.viewOrder.openIs = false;
      this.viewOrder.isPrint = false;
    },
    checkInClose(event) {
      this.checkIn.openIs = false;
      if (event) {
        this.currentRoom.orderNo = event;
        this.viewOrder.isPrint = true;
        this.viewOrder.openIs = true;
      }
    },
    getRoomStateList() {
      getRoomState().then(res => {
        if (res.data.code === 0) {
          this.roomStates = res.data.data;
          this.setRoomStates(res.data.data);
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    getStateList(dicTypeCode) {
      getDicByType(dicTypeCode).then(res => {
        if (res.data.code === 0) {
          this.states = res.data.data;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    submitRoomState() {
      updateRoomState(this.currentRoom.roomNo, this.currentState).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(
            this.currentRoom.roomName + "：" + res.data.msg
          );
          this.stateModal = false;
          this.getRoomStateList();
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    viewRoomState(stateCode) {
      let state = this.states.filter(v => v.dicCommonCode === stateCode);
      return state.dicCommon;
    },
    ...mapMutations({
      setRoomStates: "setRoomStates"
    })
  }
};
</script>

<style>
.rooms {
  /* padding: 20px; */
}
.room {
  width: 135px;
  float: left;
  margin-left: 7px;
  margin-top: 8px;
  margin-bottom: 7px;
  background-color: rgb(225, 226, 225);
}
.vacant {
  background-color: rgb(208, 243, 208);
}
.dirty {
  background-color: rgb(247, 245, 201);
}
.rented,
.rented_hour {
  background-color: rgb(165, 216, 250);
}
.repair {
  background-color: #e8eaec;
}
.roomNo,
.roomType {
  font: 1.3em sans-serif;
  font-weight: bold;
}
.state {
  font: 1.1em sans-serif;
  font-weight: bold;
}
.mymenu {
  /* top: 60px !important;
  left: 200px !important; */
  max-height: none;
  overflow: visible;
}
</style>
