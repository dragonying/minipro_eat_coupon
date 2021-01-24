<!-- 轮播图插件 -->
<template>
	<swiper class="image-container" previous-margin="45rpx" next-margin="55rpx" circular autoplay @change="swiperChange">
		<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in imgList" :key="item[urlKey]">
			<image @click="clickImg(item)" :class="currentIndex == index ? 'item-img' : 'item-img-side'" :src="item[urlKey]" lazy-load :style="dontFirstAnimation ? 'animation: none;' : ''" mode="aspectFill"></image>
		</swiper-item>
	</swiper>
</template>
<script>
	export default {
		props: {
			imgList: {
				type: Array,
				default() {
					return []
				}
			},
			urlKey: {
				type: String,
				default() {
					return ''
				}
			},
		},
		data() {
			return {
				currentIndex: 0,
				dontFirstAnimation: true
			}
		},
		methods: {
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			}
		}
	}
</script>
<style scoped>
	.image-container {
		background-color: #000000;
		width: 750rpx;
		height: 950rpx;
	}

	.item-img {
		width: 630rpx;
		height: 900rpx;
		border-radius: 14rpx;
		animation: to-big .4s;
	}

	.swiper-item {
		width: 630rpx;
		height: 900rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-side {
		width: 630rpx;
		height: 660rpx;
		border-radius: 14rpx;
		animation: to-mini .4s;
	}

	.swiper-item-side {
		width: 630rpx;
		height: 600rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	@keyframes to-mini
	{
		from {
			height: 900rpx;
		}
		to {
			height: 660rpx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 660rpx;
		}
		to {
			height: 900rpx;
		}
	}
</style>
