import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dic from './modules/dic'
import room from './modules/room'
import webSet from './modules/webSet'
Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
	modules: {
		user,
		dic,
		room,
		webSet
	},
	strict: debug
})



export default store