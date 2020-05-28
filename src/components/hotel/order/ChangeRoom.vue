<template>
  <div>
      <Modal width="400" v-model="isOpen" title="换房" @on-visible-change="openOrClose"
      :mask-closable="false" footer-hide>
        <Form ref="changeForm" :model="changeInfo" :rules="changeRule" >
            <FormItem >
                <h2>旧房号：{{ orderRoom && orderRoom.roomName?orderRoom.roomName:'' }} </h2>
                <h2>旧房价：{{ orderRoom && orderRoom.roomPrice?orderRoom.roomPrice:'' }} 元</h2>
            </FormItem>
            <FormItem  >
                <h3>选择新房号：</h3>
                <SelectRoomNo :width="350" :size="'large'" :rooms="roomStates" 
                :notRoomNos="notRoomNos" :isOpen="isOpen" 
                 @room-no-change="getCheckedRoom($event)" />
            </FormItem>
            <FormItem  prop="newRoomPrice">
                <h3>输入新房价：</h3>
                <Input size="large" prefix="md-phone-portrait" placeholder="请输入新房价" number
                v-model="changeInfo.newRoomPrice"></Input>
            </FormItem>
            <FormItem  prop="reason">
                <h3>输入换房原因：</h3>
                <Input size="large" type="textarea" prefix="md-lock" placeholder="请输入换房原因" 
                v-model="changeInfo.reason"></Input>
            </FormItem>
            <FormItem>
                <Button size="large" type="primary" :loading="changeLoad" long @click="submit">确认换房</Button>
            </FormItem>
            
        </Form>
      </Modal>
  </div>
</template>

<script>
import SelectRoomNo from '../common/SelectRoomNo.vue'
import { mapState } from 'vuex'
import { exeChangeRoom } from "@/api/order.js";
export default {
  name: 'ChangeRoom',
  components: {
      SelectRoomNo,
  },
  props: {
    openIs: Boolean,
    orderNo: String,
    orderRoom: Object,
  },
  data() {
    return {
        isOpen: false,
        changeLoad: false,
        notRoomNos: null,
        changeInfo: {
            orderRoomId: null,
            newRoomNo: null,
            newRoomPrice: null,
            newRoomTypeName: null,
            reason: null,
        },
        changeRule: {
            newRoomPrice: [
              { required: true, message: '请输入新房房价', },
              { type: "number", min: 0, message: "不能小于0",},
          ],
          reason: [
              { required: true, message: '请输入换房原因', },
          ]
        },
        isSuccess: false,
    }
  },
  computed: {
      ...mapState({
            roomStates: state => state.room.roomStates,
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
        this.$emit("change-room-close",this.isSuccess);
        // 恢复默认数据
        Object.assign(this.$data, this.$options.data());
      } else {
        this.notRoomNos = [this.orderRoom.roomNo];
        console.log(this.roomStates);
        
      }
    },
    submit() {
        this.changeInfo.orderRoomId = this.orderRoom.orderRoomId;
        console.log(this.changeInfo);
        this.$refs.changeForm.validate(valid => {
            if (valid) {
                this.changeLoad = true;
                console.log(this.changeInfo);
                exeChangeRoom(this.changeInfo).then(res => {
                    if (res.data.code === 0) {
                        this.$Message.success(res.data.msg);
                        this.isSuccess = true;
                        this.isOpen = false;
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        this.loading = false;
                    }
                });
                this.changeLoad = false;
            } else {
                this.$Message.error('请输入');
                this.changeLoad = false;
            }
        })
        
    },
    getCheckedRoom(room) {
        console.log('room',room);
        
        this.changeInfo.newRoomNo = room.roomNo;
        this.changeInfo.newRoomTypeName = room.roomTypeName;
    }
  },
}
</script>

<style>

</style>
