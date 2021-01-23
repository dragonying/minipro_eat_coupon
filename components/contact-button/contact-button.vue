<template>
	<view class="">
		<movable-area>
			<movable-view :x="x" :y="y2" direction="all">
				<button class="selfbutton cuIcon-service" style="font-size: 60rpx;" open-type="contact">
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
		methods: {}
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

