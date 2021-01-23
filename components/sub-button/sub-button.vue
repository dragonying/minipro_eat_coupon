<template>
	<view class="">
		<movable-area>
			<movable-view :x="x" :y="y2" direction="all">
				<button class="selfbutton cuIcon-service" style="font-size: 60rpx;" @click="onSubscribe">
				</button>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	const {
		windowWidth,
		windowHeight
	} = uni.getSystemInfoSync();
	export default {
		data() {
			return {
				x: windowWidth,
				y1: windowHeight,
				y2: windowHeight - 120,
			}
		},
		methods: {
			//订阅
			onSubscribe: function() {
				let templateId = "2Z3JCSj0nOVqCm2kL8MQvHSwz7mCVQj4kKl2k5Nha7Y";
				let openid = getApp().globalData.openid;
				uni.requestSubscribeMessage({
					tmplIds: [templateId],
					success: function(o) {
						if ("reject" != o[templateId]) {
							if ("ban" != o[templateId]) {
								uni.showLoading({
									title: "订阅中..."
								}), setTimeout(function() {
									uni.hideLoading();
								}, 1000);

								uni.request({
									url: getApp().globalData.subscribe,
									data: {
										data: "外卖领券提醒, 快来领优惠券啦！",
										templateId: templateId,
										openid: openid
									},
									success: function(t) {
										console.log(t);
										wx.showToast({
											title: "订阅完成",
											icon: "sucess",
											duration: 1000
										});
									},
									fail: function(t) {
										console.log(t);
										uni.showToast({
											title: "订阅失败",
											image: "../../static/error.png",
											duration: 1000
										});
									}
								});
							} else {
								uni.showToast({
									icon: "none",
									title: "请移步到设置打开订阅功能",
									duration: 1000
								});
							}
						} else {
							uni.showToast({
								icon: "none",
								title: "您拒绝了我明天就没提醒了哦",
								duration: 1000
							});
						}
					},
					fail: function(t) {
						console.log(t);
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	movable-area {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0rpx;
		top: 0rpx;
		z-index: 99;
		pointer-events: none;
	}

	.selfbutton {
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		line-height: 80rpx;
		font-size: 60rpx;

	}

	.cuIcon-share {
		color: #ff5b02;
	}

	movable-view {
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border: 1rpx solid rgba(153, 153, 153, 1);
		pointer-events: auto;
	}
</style>
