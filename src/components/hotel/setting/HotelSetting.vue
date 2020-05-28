<template>
  <div style="padding: 10px">
    <div>
      <Row>
        <Col :span="18">&nbsp;</Col>
        <!-- <Col :span=""></Col> -->
        <Col
          :span="6"
          align="right"
        >
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
        >
          门店信息
        </Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="roomTypeModal = true;roomTypeTitle = '添加房型';"
        >
          添加房型
        </Button>
        </Col>
      </Row>
    </div>
    <div>
      <Table
        :columns="roomTypeCol"
        :data="roomTypes"
        stripe
        :loading="false"
      >
        <template
          slot-scope="{row}"
          slot="roomNo"
        >
          <a
            style="margin-right: 6px;"
            v-for="(room, index) in row.rooms"
            :key="room.roomId"
          >{{ room.roomName }}</a>
        </template>
        <template
          slot-scope="{row}"
          slot="count"
        >
          {{ row.rooms.length }}
        </template>
        <template
          slot-scope="{row}"
          slot="action"
        >
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="openRoomTypeEditModal(row)"
          >修改</Button>
          <Button
            type="error"
            size="small"
          >删除</Button>
        </template>
      </Table>
    </div>

    <Modal
      v-model="roomTypeModal"
      :title="roomTypeTitle"
      @on-visible-change="resetForm('roomTypeForm',$event)"
    >
      <Form
        ref="roomTypeForm"
        :model="roomType"
        :label-width="80"
        :rules="ruleroomType"
      >
        <FormItem
          label="房型名称"
          prop="roomTypeName"
        >
          <Input
            v-model="roomType.roomTypeName"
            placeholder="请输入房型名称"
            style="width: 250px;"
          ></Input>
        </FormItem>
        <FormItem
          label="房号"
          prop="roomName"
        >
          <Input
            v-for="(room, i) in roomType.rooms"
            v-model="room.roomName"
            placeholder="输入房号"
            style="width: 100px; padding-right: 4px; padding-bottom: 3px"
            icon="md-close"
            @on-click="handleRemove(i)"
          >
          </Input>
          <Button
            size="small"
            shape="circle"
            icon="md-add"
            @click="handleAdd"
          ></Button>

        </FormItem>
        <FormItem
          label="默认房价"
          prop="roomTypePrice"
        >
          <Input
            v-model="roomType.roomTypePrice"
            number
            prefix="logo-yen"
            placeholder="请输入默认房价"
            style="width: 250px;"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <p
          align="left"
          style="float: left;"
        >
          <Icon
            type="ios-information-circle-outline"
            :size="16"
          />
          说明：点击
          <Icon
            type="md-add"
            size="16"
          />
          可以添加多个房号，点击
          <Icon
            type="md-close"
            size="16"
          />
          可删除房号
        </p>

        <Button
          size="large"
          @click="roomTypeModal = false;"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="loadroomType"
          @click="submitRoomType"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import hotel from "./data/hotelData.js";
import { getRoomType, addOrUpdateRoomType } from "@/api/room";
export default {
  name: "HotelSetting",
  data() {
    return {
      roomTypeCol: hotel.roomTypeCol,
      roomTypes: [],
      hotelNo: "622723001",
      roomTypeModal: false,
      roomTypeTitle: "添加房型",
      roomType: {
        roomTypeId: null,
        roomTypeName: "",
        roomTypePrice: null,
        hotelNo: "",
        sortNo: 99,
        rooms: [{ roomName: "", roomNo: "" }]
      },
      ruleroomType: {
        roomTypeName: [{ required: true, message: "请输入房型名称" }],
        // 'room.roomName': [
        //   { required: true, message: "请输入房号"}
        // ],
        roomTypePrice: [
          { required: true, message: "请输入默认房价" },
          { type: "number", message: "必须是数字" }
        ]
      },
      loadroomType: false
    };
  },
  mounted() {
    this.getRoomTypeList();
  },
  methods: {
    getRoomTypeList() {
      getRoomType().then(res => {
        this.roomTypes = res.data.data;
      });
    },
    submitRoomType() {
      console.log(this.roomType);
      this.$refs["roomTypeForm"].validate(valid => {
        if (valid) {
          this.loadroomType = true;
          console.log("通过");
          let method = "post";
          if (this.roomType.roomTypeId !== null) {
            method = "patch";
          }
          addOrUpdateRoomType(this.roomType, method).then(res => {
            if (res.data.code == 0) {
              this.$Message.success(res.data.msg);
              this.roomTypeModal = false;
              this.getRoomTypeList();
            } else {
              this.$Message.error(res.data.code + ": " + res.data.msg);
              this.loadroomType = false;
            }
          });
        } else {
          this.$Message.error("请输入");
          this.loadroomType = false;
        }
      });
    },
    openRoomTypeEditModal(row) {
        this.roomTypeTitle = "修改房型";
        this.roomTypeModal = true;
        this.roomType.roomTypeId = row.roomTypeId;
        this.roomType.roomTypeName = row.roomTypeName;
        this.roomType.roomTypePrice = row.roomTypePrice;

        this.roomType.rooms = [{ roomName: "", roomNo: "" }];
        row.rooms.forEach(element => {
            this.roomType.rooms.push(element);
        });
        console.log('房间：', this.roomType.rooms)

    },
    resetForm(form, event) {
      if (!event) {
        this.$refs[form].resetFields();
        // 恢复默认数据
        Object.assign(this.$data.roomType, this.$options.data().roomType)
        this.loadroomType = false;
        // this.roomType.rooms = [{ roomName: "", roomNo: "" }];
      }
    },
    handleAdd() {
      this.roomType.rooms.push({
        roomName: "",
        roomNo: ""
      });
    },
    handleRemove(i) {
      console.log("shan除" + i);
      if (i == 0 && this.roomType.rooms.length === 1) {
        this.$Message.error("这是最后一个啦！");
      } else {
        this.roomType.rooms.splice(i, 1);
      }
    }
  }
};
</script>

<style>
</style>
