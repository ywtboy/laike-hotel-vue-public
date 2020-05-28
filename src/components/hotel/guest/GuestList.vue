<template>
  <div>
    <div>
      <Row>
        <Form
          ref="queryGuestForm"
          :model="query"
          inline
        >
          <FormItem prop="guestName">
            <Input
              v-model="query.guestName"
              clearable
              placeholder="客人姓名"
            />
          </FormItem>
          <FormItem prop="guestTel">
            <Input
              v-model="query.guestTel"
              clearable
              placeholder="手机号码"
            />
          </FormItem>
          <FormItem prop="certificateNo">
            <Input
              v-model="query.certificateNo"
              clearable
              placeholder="证件号码"
            />
          </FormItem>
          <FormItem>
            <Button
              type="info"
              @click="page.page=1;loadGuests()"
            >查询</Button>
          </FormItem>
          <FormItem>
            <Button
              type="info"
              @click="handleReset('queryGuestForm')"
            >重置</Button>
          </FormItem>
        </Form>
      </Row>
    </div>
    <div>
      <Table
        stripe
        border
        size="small"
        class="laike-hotel-table"
        :columns="guestCol"
        :data="guests"
        @on-row-dblclick="handleColDbClick"
      >
        <template
          slot-scope="{row}"
          slot="guestSex"
        >
          <span v-if="row.guestSex ==='male'">男</span>
          <span v-else-if="row.guestSex ==='female'">女</span>
          <span v-else>未知</span>
        </template>
      </Table>
    </div>
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
        @on-change="loadGuests"
        show-sizer
        @on-page-size-change="setPageSize"
      />
      </Col>
    </Row>
  </div>
</template>

<script>
import { getGuestOfHotel } from "@/api/guest.js";
export default {
  name: "GuestList",
  data() {
    return {
      guests: [],
      query: {
        guestName: null,
        guestTel: null,
        certificateNo: null,
        page: 1,
        limit: 15,
        sortBy: "gmtCreate",
        orderBy: "desc"
      },
      page: {
        total: 0,
        page: 1,
        limit: 15,
        pageSizeOpts: [5, 10, 15, 20, 30, 40]
      },
      guestCol: [
        {
          title: "姓名",
          key: "guestName",
          width: 90
        },
        {
          title: "性别",
          slot: "guestSex",
          width: 90
        },
        {
          title: "证件号码",
          key: "certificateNo",
          width: 200
        },
        {
          title: "民族",
          key: "guestNation",
          width: 90
        },
        {
          title: "手机号",
          key: "guestTel",
          width: 150
        },
        {
          title: "生日",
          key: "guestBirthday",
          width: 150
        },
        {
          title: "地址",
          key: "guestAddress"
        }
      ]
    };
  },
  mounted() {
    this.loadGuests();
  },
  methods: {
    loadGuests() {
      this.query.page = this.page.page;
      this.query.limit = this.page.limit;
      getGuestOfHotel(this.query).then(res => {
        if (res.data.code === 0) {
          this.guests = res.data.data;
          this.page.total = res.data.count;
          this.$Message.success("查询成功");
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleColDbClick() {},
    setPageSize(val) {
      this.page.limit = val;
      this.loadGuests();
    }
  }
};
</script>

<style>
</style>
