
const webSet = {
    state: {
        appHeight: window.innerHeight,

    },
    // getters 相当于计算属性
    getters: {
        
    },
    // 更改状态 同步
    mutations: {
        setAppHeight(state, appHeight) {
            state.appHeight = appHeight;
        },
    },
    // 可以异步
    actions: {

    },

}

export default webSet