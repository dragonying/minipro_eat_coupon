/*
 * @Descripttion: 
 * @version: 
 * @Author: zhouying
 * @Date: 2020-12-13 20:45:21
 * @LastEditors: zhouying
 * @LastEditTime: 2020-12-13 21:00:35
 */
import Vue from 'vue'
import App from './App'
import cuCustom from 'colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
