<template>
  <div>
      <Select
        v-model="checkedRoomNo"
        filterable
        @on-change="setRoomInfo"
        :style="{width: width?width+'px':'auto',}"
        placeholder="请选择房号"
        :size="size"
        >
        <Option
            v-for="v in isRooms"
            :disabled="isDisabled(v.roomNo)"
            :value="v.roomNo"
            :key="v.roomName"
        >{{ v.roomName }}-{{ v.roomTypeName }}
        </Option>
        </Select>
  </div>
</template>

<script>
export default {
  name: 'SelectRoomNo',
  props: {
      rooms: Array, // 所有房间
      defaultRoomNo: String,  // 默认选中的房号
      notRoomNos: Array, // 不能选的房号
      isOpen: Boolean,  // 父组件是否打开
      width: Number,
      size: String
  },
  data() {
    return {
        checkedRoomNo: null,
    }
  },
  computed: {
    isRooms() {
        if (this.rooms) {
            return this.rooms.filter(room => room.roomState === 'vacant');
        }
        return null;
    },
  },
  watch: {
      isOpen(isOpen) {
          if (isOpen) { // 打开
              console.log('打开', this.rooms);
              this.checkedRoomNo =null;
          } else { // 关闭
            console.log('关闭');       
          }
      }
  },
  methods: {
      setRoomInfo() {
        let room = null;
        if (this.rooms) {
            room = this.rooms.filter(room => room.roomNo === this.checkedRoomNo)[0];
        }
        
        this.$emit("room-no-change", room);
    },
    isDisabled(roomNo) {
      let tag = false;
      if (!this.notRoomNos) {
          return false;
      }
      this.notRoomNos.forEach(or => {
        if (roomNo === or) {
          tag = true;
        }
      });
      return tag;
    },
  },
}
</script>

<style>

</style>
