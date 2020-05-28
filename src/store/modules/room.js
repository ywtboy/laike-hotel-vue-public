import { getRoomState, getRoomType } from "@/api/room.js";
import { Message } from 'iview';
const room = {
    state: {
        roomStates: null,
        roomTypes: null
    },
    // getters 相当于计算属性
    getters: {
        getRoomsByType: (state) => (typeId) =>{
            if (null == typeId) {
                return state.roomStates;
            }
            return state.roomStates.filter(i => typeId === i.roomTypeId && i.roomState === "vacant");
        },
    },
    // 更改状态 同步
    mutations: {
        setRoomStates(state, roomStates) {
            state.roomStates = roomStates;
        },
        setRoomTypes(state, roomTypes) {
            state.roomTypes = roomTypes;
        },
    },
    // 可以异步
    actions: {
        loadRoomStates(context) {
            getRoomState().then(res => {
                if (res.data.code === 0) {
                    let roomStates = res.data.data;
                    context.commit('setRoomStates', roomStates);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
  
        },
        loadRoomTypes(context) {
            getRoomType().then(res => {
                if (res.data.code === 0) {
                    let roomTypes = res.data.data;
                    context.commit('setRoomTypes', roomTypes);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
        }
    },

}

export default room