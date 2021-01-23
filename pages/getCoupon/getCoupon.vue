<template>
	<view class="container">
		<tounchButton></tounchButton>
		<!-- <subButton></subButton> -->
		<addTip :tip="tip" :duration="duration"></addTip>
		<v-tabs v-model="current" :tabs="tabs" @change="changeTab" class="tab shadow-box"></v-tabs>
		<view class="coupon" ref="coupon">
			<view class="item shadow-warp" v-for="(v, i) in couponList" @click="toCoupon(i)" :key="i">
				<view class='card'>
					<view class="top">
						<view class="left">
							<view class="content">
								<image :src="v.icon" class="icon" mode="widthFix" />
								<view class="name">{{ v.name }}</view>
							</view>
							<view class="text">{{v.type}}</view>
						</view>
						<view class="right">免费领取</view>
					</view>
					<view class="bottom">
						<image :src="v.bannerPic" mode="widthFix" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tounchButton from '../../components/tounch-button/tounch-button.vue'
	import addTip from '../../components/add-tip/add-tip.vue'
	// import subButton from '../../components/sub-button/sub-button.vue'

	export default {
		components: {
			tounchButton,
			addTip
			// subButton
		},
		data() {
			return {
				shareType: [1, 2], // 分享类型
				current: 0,
				tabs: [],
				couponList: [],
				coupons: [],
				tip: "点击「添加小程序」，下次访问更便捷",
				duration: 5
			};
		},
		onLoad(e) {
			uni.showLoading({
				title: '获取优惠中',
				duration: 5000
			});
			this.getHome()
			//#ifdef H5
			let tabId = this.$route.query.tabId ? parseInt(this.$route.query.tabId) : 0
			//#endif
			//#ifdef MP-WEIXIN
			let tabId = e.tabId ? parseInt(e.tabId) : 0
			//#endif
			for (let i in this.tabs) {
				if (tabId == this.tabs[i].tabId) {
					this.current = parseInt(i)
				}
			}
			this.changeTab(this.current)
		},
		onShareAppMessage(res) {
			var messages = [{
				title: '美团饿了么大额红包，每日可领！',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '吃了这么多年外卖，你知道这个秘密吗？',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '这样点外卖，一年省下一个亿',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '点外卖前先领券，吃霸王餐',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '美团饿了么内部优惠券，手慢无',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '点外卖不用优惠券，你就out了',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '外卖不为人知的秘密，点这解密',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '震惊！小伙点外卖竟然花了1分钱',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '从这点外卖，你也可以吃霸王餐',
				path: '/pages/getCoupon/getCoupon'
			}];
			return messages[Math.floor(Math.random() * messages.length)];
		},

		onShareTimeline(res) {
			var messages = [{
				title: '美团饿了么大额红包，每日可领！',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '吃了这么多年外卖，你知道这个秘密吗？',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '这样点外卖，一年省下一个亿',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '点外卖前先领券，吃霸王餐',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '美团饿了么内部优惠券，手慢无',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '点外卖不用优惠券，你就out了',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '外卖不为人知的秘密，点这解密',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '震惊！小伙点外卖竟然花了1分钱',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '从这点外卖，你也可以吃霸王餐',
				path: '/pages/getCoupon/getCoupon'
			}];
			return messages[Math.floor(Math.random() * messages.length)];

		},
		methods: {
			changeTab(index) {
				this.couponList = []

				if (index == 0) {
					this.couponList = this.coupons
					setTimeout(() => {
						uni.hideLoading()
					}, 200)
				} else {
					for (let i in this.coupons) {
						if (this.coupons[i].tabId == this.tabs[index].tabId) {
							this.couponList.push(this.coupons[i])
						}
					}
				}
				//#ifdef H5
				this.$nextTick(() => {
					this.$refs.coupon.scrollTop = 0;
				})
				//#endif
				// setTimeout(() => {
				// 	uni.hideLoading()
				// }, 200)

			},
			toCoupon(i) {
				console.log(this.couponList[i])
				//h5
				//#ifdef H5
				window.location.href = this.couponList[i].url
				//#endif
				//微信小程序
				//#ifdef MP-WEIXIN
				if (this.couponList[i].minapp) {
					wx.navigateToMiniProgram({
						appId: this.couponList[i].minapp.appid,
						path: this.couponList[i].minapp.path,
						success(res) {
							// 打开成功
						}
					})
				}
				//#endif
			},
			getHome() {
				uni.request({
					url: getApp().globalData.api.home,
					success: (res) => {
						this.tabs = res.data.data.tabs
						this.coupons = res.data.data.coupons
						this.changeTab(0)
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.container {
		font-size: 14px;
		line-height: 24px;
		position: relative;

		.tab {
			position: fixed;
			top: var(--window-top);
			left: 0;
			z-index: 9999;
		}

		.coupon {
			padding-top: 200rpx;
			padding-bottom: 10rpx;

			.item {
				background-color: #ffffff;
				margin: 30rpx;
				border-radius: 20rpx;
				padding: 0 30rpx 30rpx 30rpx;

				// .card {
				// 	padding: 20rpx;
				// 	background-color: #FFFFFF;
				// 	border-radius: 10rpx;
				// }

				.top {
					height: 116rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						height: 116rpx;
						width: 400rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.content {
							width: 100%;
						}

						.icon {
							display: inline-block;
							vertical-align: bottom;
							width: 52rpx;
							height: auto;
						}

						.name {
							text-align: left;
							display: inline-block;
							vertical-align: bottom;
							font-size: 34rpx;
							color: #000;
							line-height: 50rpx;
							font-weight: bold;
							margin-left: 15rpx;
						}

						.text {
							width: 200rpx;
							height: 38rpx;
							line-height: 38rpx;
							text-align: center;
							font-size: 24rpx;
							color: #61300e;
							background: linear-gradient(90deg, #f9db8d, #f8d98a);
							border-radius: 6rpx;
						}
					}

					.right {
						width: 170rpx;
						height: 60rpx;
						border-radius: 30rpx;
						background: linear-gradient(90deg, #ec6f43, #ea4a36);
						color: #fff;
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
					}
				}

				.bottom {
					height: 300rpx;
					width: 100%;
					overflow: hidden;
					border-radius: 20rpx;

					image {
						display: block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
