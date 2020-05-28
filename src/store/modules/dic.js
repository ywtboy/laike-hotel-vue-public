import { getDicByType }  from "@/api/dic.js";
import { Message } from 'iview';

const dic = {
    state: {
        dics: [],
        inout: [],
        pay_method: [],
        channel: [],
    },
    // getters 相当于计算属性
    getters: {
        codeToText: (state) => (val) =>{
            return val?state.pay_method.filter(i => val === i.dicCommonCode)[0].dicCommonName:'';
        },
        getDicType: (state) => (type) => {
            return state.dics.filter(i => type === i.dicType);
        },
    },
    // 更改状态 同步
    mutations: {
        inout(state, inout) {
            state.inout = inout;
        },
        pay_method(state, pay_method) {
            state.pay_method = pay_method;
        },
        channel(state, channel) {
            state.channel = channel;
        },
        dics(state, dics) {
            state.dics = dics;
        },
        
    },
    // 可以异步
    actions: {
        loadDic(context, type) {
            getDicByType(type).then(res => {
                if (res.data.code === 0) {
                    let inout = res.data.data;
                    context.commit(type, inout);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
        },
        loadAllDic(context) {
            getDicByType(null).then(res => {
                if (res.data.code === 0) {
                    let dics = res.data.data;
                    context.commit('dics', dics);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
        }
    },

}

export default dic

