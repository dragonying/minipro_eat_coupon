<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @click="BackHome">
					<image style="width: 50upx;height: 50upx;" src="../../static/icon/hourse.png" mode=""></image>
				</view>
				<view class="content music-title" :style="[{top:StatusBar + 'px'}]">
					<slot name="content">{{content}}</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'cu-custom',
		props: {
			content: {
				type: String,
				default: "",
				required: false
			}
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		methods: {
			BackHome() {
				uni.showTabBar();
				uni.switchTab({
					url: "/pages/getCoupon/getCoupon"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.music-title{
		height: 80rpx;
	}
</style>
