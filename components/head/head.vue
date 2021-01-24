<template>
	<view>
		<view class="head" :style="{ height: height + 'px', background:background}">
			<view 
			class="back"
			@click="back"
			v-if="backShow"
			:style="{ 
				top: top + 'px',
				color:color
			}">〈</view>
			<view
			class="title"
			v-if="titleShow"
			:style="{
				top: top + 'px',
				color:color,
				'font-size': size + 'rpx'
			}">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '自定义标题'
			},
			size:{
				type: String,
				default: '32'
			},
			color:{
				type: String,
				default: '#000'
			},
			titleShow: {
				type: Boolean,
				default: true
			},
			backShow: {
				type: Boolean,
				default: true
			},
			background:{
				type: String,
				default: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)"
			}
		},
		data() {
			return {
				height :0,
				top:0,
			}
		},
		created() {
			//设备信息
			let app = uni.getSystemInfoSync();
			//胶囊信息
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			this.height  = app.statusBarHeight + menuButtonInfo.height + (menuButtonInfo.top - app.statusBarHeight)*2
			this.top = menuButtonInfo.top;
		},
		methods: {
			back(){
				console.log('点击头部返回')
				uni.navigateBack();
			}
		}
	}
</script>

<style>
.head{
	position: fixed;
	width: 750rpx;
	z-index: 999;
}
.title{
	position: fixed;
	width: 750rpx;
	text-align: center;
	line-height: 32px;
	height: 32px;
}
.back{
	position: fixed;
	width: 81rpx;
	text-align: center;
	line-height: 32px;
	height: 32px;
	font-size: 32rpx;
	font-weight: 900;
	z-index: 9;
}
</style>
