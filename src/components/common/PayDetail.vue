<template>
  <div>
    <Row
      v-for="(item, index) in payDetails"
      :key="index"
    >
      <Col :span="24">

      <Form ref="payForm" :model="item" :rules="payRule" inline>
        <Icon
          type="logo-yen"
          size="24"
        />
        <FormItem prop="payMethodCode">
          <Select
            v-model="item.payMethodCode"
            style="width: 120px"
            placeholder="请选择支付方式"
            @on-change="item.disabled = (item.payMethodCode === '' ) ? true:false"
          >
            <Option v-for="(item, index) in pay_method" :key="index" :value="item.dicCommonCode">
              {{ item.dicCommonName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="payMoney">
          <Input
            v-model="item.payMoney"
            number
            placeholder="金额"
            style="width: 120px"
            :disabled="item.disabled"
            @on-change="loadMoney"
          />
        </FormItem>
        <FormItem v-if="0 === index">
          <Button
            type="error"
            icon="md-add"
            size="small"
            @click="handleAdd"
          ></Button>&nbsp;
          <Button
            v-show="payDetails.length > 1"
            type="error"
            icon="md-remove"
            size="small"
            @click="handleRemove"
          ></Button>
        </FormItem>

        <FormItem v-if="index === (payDetails.length - 1)">
          合计：{{ total }}
        </FormItem>
      </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
export default {
  name: "PayDetail",
  props: {
    parentIsOpen: Boolean,
    isCheckOut: Boolean
  },
  data() {
    return {
      orderIncome: {
        orderNo: null,
        incomeTypeCode: 'income',
        incomeClassCode: 'receipts', // 默认收款
        offsetId: null,
        incomeMoney: 0,
        incomeComment: null,
        payDetails: []
      },
      payDetails: [
        {
          payMethodCode: "",
          payMoney: null,
          disabled: true,
        }
      ],
      payRule: {
        payMethodCode: [
          { required: true, message: '请选择支付方式',}
        ],
        payMoney: [
          { required: true, message: '请输入金额',},
          { type: "number", min: 1, message: "必须是大于0的数字"},
        ],
      },
    };
  },
  computed: {
    total() {
      let sum = 0;
      this.payDetails.forEach(element => {
        sum += element.payMoney;
      });
      return sum;
    },
    ...mapState({
            inout: state => state.dic.inout,
            pay_method: state => state.dic.pay_method,
        })
  },
  watch: {
    parentIsOpen(parentIsOpen) {
      if (!parentIsOpen) {
        this.close();
      }else{
        this.$refs.payForm.forEach(pay  => {
          pay.resetFields();
          if (this.isCheckOut) {
            this.payRule.payMoney = [
              { required: true, message: '请输入金额',},
              { type: "number", min: 0, message: "必须是不小于0的数字"},
            ];
          }
        })
      }
    }
  },
  methods: {
    handleAdd() {
      this.payDetails.push({
        payMethodCode: "",
        payMoney: null,
        disabled: true,
      });
    },
    handleRemove() {
      if (this.payDetails.length > 1) {
        this.payDetails.pop();
      }
    },
    loadMoney() {
      this.orderIncome.incomeMoney = this.total;
      this.orderIncome.payDetails = this.payDetails;
      
      this.$emit("get-money", this.orderIncome);
    },
    close() {
      // 恢复默认数据
      Object.assign(this.$data, this.$options.data());
      
    }
  }
};
</script>

<style>
</style>
