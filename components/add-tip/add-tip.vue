<template>
	<view>
		<view class="uni-add-tips-box" v-if="showTip">
			<view class="uni-add-tips-content" @click="hideTip">
				<text>{{tip}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tip: {
				type: String,
				default: "点击「添加小程序」，下次访问更便捷",
				required: true
			},
			duration: {
				type: Number,
				default: 5,
				required: false
			}
		},
		data() {
			return {
				showTip: false,
				showKey: "SHOW_TIP"
			}
		},
		mounted() {
			this.showTip = !uni.getStorageInfoSync().keys.includes(this.showKey);
			setTimeout(() => {
				this.showTip = false
			}, this.duration * 1000)
		},
		methods: {
			hideTip() {
				uni.setStorageSync(this.showKey, true)
				this.showTip = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	.uni-add-tips-box {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 99999;
		opacity: .8;
		display: flex;
		-webkit-box-pack: end;
		justify-content: flex-end;
		-webkit-box-align: end;
		align-items: flex-end;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		width: 600rpx;
		animation: opacityC 1s linear infinite;
	}

	.uni-add-tips-content::before {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		top: -38rpx;
		right: 105rpx;
		display: block;
		border: 20rpx solid transparent;
		border-bottom-color: #34b5e2;
	}

	.uni-add-tips-content {
		border-width: 0rpx;
		margin-top: 20rpx;
		position: relative;
		background-color: #34b5e2;
		box-shadow: 0 10rpx 20rpx -10rpx #34b5e2;
		border-radius: 12rpx;
		display: flex;
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		padding: 18rpx 20rpx;
		margin-right: 40rpx;
	}

	.uni-add-tips-content>text {
		color: #fff;
		font-size: 28rpx;
		font-weight: 400;
	}


	@keyframes opacityC {
		0% {
			opacity: .8;
			transform: translateY(10rpx);
		}

		50% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
