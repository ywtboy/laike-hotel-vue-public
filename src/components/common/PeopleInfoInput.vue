<template>
  <div>
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
  </div>
</template>

<script>
import IDCard from "@/util/IDCard.js";
import { getOrderRooms } from "@/api/order.js";
export default {
  name: "PeopleInfoInput",
  props: {
    parentIsOpen: Boolean
  },
  data() {
    return {
      readCardload: false,
      guest: {
        guestName: null,
        guestTel: null,
        certificateType: "idcard",
        certificateNo: null,
        guestSex: null,
        guestNation: null,
        guestBirthday: null,
        guestAddress: null
      }
    };
  },
  watch: {
    parentIsOpen(parentIsOpen) {
      if (!parentIsOpen) {
        this.close();
      } else {
      }
    },
    guest: {
      handler(guest) {
        this.$emit("get-data", guest);
      },
      deep: true
    }
  },
  methods: {
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
    close() {
      // 恢复默认数据
      Object.assign(this.$data, this.$options.data());
      this.$Notice.close("guestLog");
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
  }
};
</script>

<style>
</style>
