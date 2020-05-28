import { login, getCurrUser, logout } from "@/api/login.js";
import { Message } from 'iview';
const user = {
    state: {
        currUser: {},
        isLogin: true,
        isFirst: 0,
        currHotel: {},
    },
    // getters 相当于计算属性
    getters: {},
    // 更改状态 同步
    mutations: {
        login(state, currUser) {
            state.isLogin = true;
            state.isFirst += 1; 
            state.currUser = currUser;
            state.currHotel = currUser.currHotel;
            console.log('state.isFirst:',state.isFirst);
            
        },
        logout(state) {
            state.isLogin = false;
            state.isFirst = 0;
            state.currUser = {};
            state.currHotel = {};
        },
        setIsLogin(state) {
            state.isLogin = false;
        },
    },
    // 可以异步
    actions: {
        login(context, loginInfo) {
            login(loginInfo).then(res => {
                if (res.data.code === 0) {
                    let currUser = res.data.data;
                    Message.success("登录成功");
                    context.commit('login', currUser);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
  
        },
        logout(context) {
            logout().then(res => {
                if (res.data.code === 0) {
                    context.commit('logout');
                    Message.success("退出系统成功");
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });    
        },
        currUser(context) {
            getCurrUser().then(res => {
                if (res.data.code === 0) {
                    let currUser = res.data.data;
                    context.commit('login', currUser);
                } else {
                    Message.error(res.data.code + "：" + res.data.msg);
                }
            });
        }
    },

}

export default user