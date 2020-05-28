<template>
  <div>
    <Modal
      width="350"
      v-model="isOpen"
      :title="title"
      @on-visible-change="openOrClose"
      :mask-closable="false"
    >
        <Form ref="consumeForm" :model="consumeInfo" :rules="ruleConsumeInfo" :label-width="80">
            <FormItem label="消费项目" prop="consumeItemCode">
                <Select v-model="consumeInfo.consumeItemCode" placeholder="选择消费项目" @on-change="getTips">
                    <Option value="rent_manual">手动房租</Option>
                    <Option value="commodity">商品</Option>
                    <Option value="cleaning_charge">清洗费</Option>
                    <Option value="damage">赔偿</Option>
                    <Option value="other_consume">其它</Option>
                </Select>
            </FormItem>
            <FormItem label="消费详情" prop="consumeItemDetail">
                <Input v-model="consumeInfo.consumeItemDetail" :placeholder="tips"></Input>
            </FormItem>
            <FormItem label="房 号" prop="roomNo">
                <Select v-model="consumeInfo.roomNo" placeholder="选择消费房号" @on-change="setRoomName">
                    <Option v-for="(item, index) in orderRooms" :key="index" :value="item.roomNo">{{ item.roomName }}</Option>
                </Select>
            </FormItem>
            
            <FormItem label="金 额" prop="consumeMoney">
                <Input v-model="consumeInfo.consumeMoney" placeholder="输入金额" number></Input>
            </FormItem>
            <FormItem label="备 注" >
                <Input v-model="consumeInfo.consumeComment" placeholder="输入备注" type="textarea"></Input>
            </FormItem>
        </Form>
         <div slot="footer">
          <Button
            size="large"
            @click="isOpen = false;"
          >取消</Button>
          <Button
            type="primary"
            size="large"
            :loading="loading"
            @click="submit"
          >确定</Button>
       </div>
    </Modal>

    <Modal
      width="350"
      v-model="isOffsetOpen"
      title="消费冲账"
      @on-visible-change="openOrClose"
      :mask-closable="false"
    >
      <Form ref="offsetForm" :model="consumeInfo" :rules="ruleOffsetInfo" :label-width="80">
            <FormItem :label-width="0">
                <h3>消费金额：{{ offsetOrderConsume&&offsetOrderConsume.consumeMoney?offsetOrderConsume.consumeMoney:'' }} 元 &nbsp 冲账金额不能大于消费金额</h3>
            </FormItem>
            <FormItem label="冲账金额" prop="consumeMoney">
                <Input v-model="consumeInfo.consumeMoney" placeholder="输入冲账金额" number></Input>
            </FormItem>
            <FormItem label="冲账原因"  prop="consumeComment">
                <Input v-model="consumeInfo.consumeComment" placeholder="输入冲账原因" type="textarea"></Input>
            </FormItem>
        </Form>

        <div slot="footer">
          <Button
            size="large"
            @click="isOffsetOpen = false;"
          >取消</Button>
          <Button
            type="primary"
            size="large"
            :loading="loading"
            @click="offsetSubmit"
          >确定</Button>
       </div>
    </Modal>
  </div>
</template>

<script>
import {saveOrderConsume} from '@/api/order.js'
export default {
  name: "ConsumeEntry",
  props: {
    openIs: Boolean,
    orderRooms: Array,
    openIsOffset: Boolean,
    offsetOrderConsume: Object
  },
  data() {
    return {
      isOpen: false,
      isOffsetOpen: false,
      title: '消费入账',
      loading: false,
      tips: '请输入消费详情',
      saveIs: false,
      consumeInfo: {
          orderNo: '',
          consumeTypeCode: 'income',
          consumeItemCode: '',
          consumeItemDetail: '',
          consumeMoney: null,
          roomName: null,
          roomNo: null,
          consumeComment: null,
          offsetId: null,
      },
      ruleConsumeInfo: {
          consumeItemCode: [
              { required: true, message: '请选择消费项目',}
          ],
          consumeItemDetail: [
              { required: true, message: '请输入消费详情',}
          ],
          roomNo: [
              { required: true, message: '请选择房号',}
          ],
          consumeMoney: [
              { required: true, message: '请输入金额', },
              { type: "number", min: 1, message: "必须是大于0的数字",},
          ],
      },
      ruleOffsetInfo: {
        consumeMoney: [
              { required: true, message: '请输入冲账金额', },
              { type: "number", min: 1, message: "必须是大于0的数字",},
          ],
        consumeComment: [
            { required: true, message: '请输入冲账原因', },
        ],
      }
    };
  },
  watch: {
    openIs(openIs) {
      this.isOpen = openIs;
    },
    openIsOffset(openIsOffset) {
      this.isOffsetOpen = openIsOffset;
    },
  },
  methods: {
      openOrClose(val) {
      if (!val) {
        
        
        this.$emit("consume-entry-close", this.saveIs);
        // 恢复默认数据
        console.log(this.$options.data());
        
        Object.assign(this.$data, this.$options.data());
        
      } else {
        console.log('offsetOrderConsume:',this.offsetOrderConsume);
        
        this.$refs.consumeForm.resetFields();
        this.title += '--' + this.orderRooms[0].orderNo; 
        this.consumeInfo.orderNo = this.orderRooms[0].orderNo;
        if (1 === this.orderRooms.length) {
            this.consumeInfo.roomNo = this.orderRooms[0].roomNo;
            this.consumeInfo.roomName = this.orderRooms[0].roomName;
        }
      }
    },
    submit() {
        this.loading = true;
        this.$refs.consumeForm.validate(valid => {
            if (valid) {
                console.log(this.consumeInfo);
                saveOrderConsume(this.consumeInfo).then(res => {
                    if (res.data.code === 0) {
                        this.$Message.success(res.data.msg);
                        this.saveIs = true;
                        this.isOpen = false;
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        this.loading = false;
                    }
                });
            } else {
                this.$Message.error('请输入');
                this.loading = false;
            }
        })  
    },
    offsetSubmit() {
        this.loading = true;
        this.$refs.offsetForm.validate(valid => {
            if (valid) {
              this.consumeInfo.orderNo = this.offsetOrderConsume.orderNo;
              this.consumeInfo.consumeTypeCode="outgoings";
              this.consumeInfo.consumeItemCode="offset";
              this.consumeInfo.offsetId=this.offsetOrderConsume.consumeId;
              this.consumeInfo.roomName=this.offsetOrderConsume.roomName;
              this.consumeInfo.roomNo=this.offsetOrderConsume.roomNo;
                console.log(this.consumeInfo);
                saveOrderConsume(this.consumeInfo).then(res => {
                    if (res.data.code === 0) {
                        this.$Message.success(res.data.msg);
                        this.saveIs = true;
                        this.isOffsetOpen = false;
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        this.loading = false;
                    }
                });
            } else {
                this.$Message.error('请输入');
                this.loading = false;
            }
        })  
    },
    setRoomName(val) {
        let room = this.orderRooms.filter(room => room.roomNo === val)
        console.log(room);
        
        if (room.length !== 0) this.consumeInfo.roomName = room[0].roomName;
    },
    getTips(val) {
        switch (val) {
            case 'rent':
                this.tips = '如超时房费...等'
                break;
            case 'commodity':
                this.tips = '如红牛1罐...等'
                break;
            case 'cleaning_charge':
                this.tips = '如床单/被套...等'
                break;
            case 'damage':
                this.tips = '如电视/水壶...等'
                break;    
            default:
                this.tips = '请输入具体情况'
                break;
        }
    }
  },
};
</script>

<style>
</style>
