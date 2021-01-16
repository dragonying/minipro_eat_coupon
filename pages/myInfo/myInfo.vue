<template>
	<scroll-view scroll-y class="scrollPage">

		<view class="UCenter-bg bg-gradual-orange padding radius text-center shadow-blur">
			<image :src="pic" class="png" mode="widthFix" style="border-radius: 50%;"></image>

			<view class="margin-top-sm">
				<text style="font-size: 40rpx;">{{name}}</text>
			</view>

		</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-orange">干饭</view>
				<view class="margin-top-sm">
					<text class="cuIcon-emoji"></text> 爱好</view>
			</view>
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-blue">{{sex}}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-friendfavor"></text>性别</view>
			</view>
			<view class="flex flex-sub flex-direction">
				<view class="text-xxl text-green">{{area}}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-location"></text>国家</view>
			</view>
		</view>
		<view v-if="!hasLogin" class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<button class="cu-item arrow" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">
				<view class="content" style="text-align: left;">
					<text class="cuIcon-magic text-red"></text>
					<text class="text-grey">自报大名</text>
				</view>
			</button>
		</view>
		<!-- 	  <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
	   <view class="cu-item arrow" @tap="onSubscribe" >
	     <view class="content" >
	       <text class="cuIcon-notice text-red"></text>
	       <text class="text-grey">领券提醒</text>
	     </view>
	   </view>
	  </view> -->
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow" @tap="showQrcode">
				<view class="content">
					<text class="cuIcon-appreciate text-red"></text>
					<text class="text-grey">赞赏支持</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow" @tap="showMy">
				<view class="content" bindtap="">
					<text class="cuIcon-comment text-red"></text>
					<text class="text-grey">联系作者</text>
				</view>
			</view>

		</view>




	</scroll-view>
</template>

<script>
	export default {

		data() {
			return {
				hasLogin: false,

				pic: require('../../static/touxiang.png'),
				name: '我要干饭了',
				sex: '你猜',
				area: '吃货星球'
			}
		},
		onLoad() {
			const that = this;
			uni.getStorage({
				key: "userInfo",
				success(e) {
					that.hasLogin = true;
					that.pic = e.data.avatarUrl;
					that.name = e.data.nickName;
					that.area = e.data.country;
					that.sex = (e.data.gender == 1 ? '男' : '女');
				}
			})


		},
		onShareAppMessage(res) {
			var messages = [{
				title: '美团饿了么大额红包，每日可领！',
				path: '/pages/getCoupon/getCoupon'
			}, {
				title: '吃了这么多年外卖，你知道这个秘密吗？',
				path: '/pages/getCoupon/getCoupon'
			}];
			return messages[Math.floor(Math.random() * messages.length)];
		},
		onShareTimeline(res) {
			var messages = [{
				title: '干饭选择困难症必备神器！',
				path: '/pages/eatWhat/eatWhat'
			}, {
				title: '干饭人干饭魂！',
				path: '/pages/eatWhat/eatWhat'
			}];
			return messages[Math.floor(Math.random() * messages.length)];
		},

		methods: {

			wxGetUserInfo() {
				uni.getUserInfo({
					lang: "zh_CN",
					success: (res) => {
						console.log(res.userInfo)
						this.pic = res.userInfo.avatarUrl;
						this.name = res.userInfo.nickName;
						this.area = res.userInfo.country;
						this.sex = res.userInfo.gender == 1 ? '男' : '女';

						uni.setStorage({ //将用户信息保存在本地  
							key: 'userInfo',
							data: res.userInfo
						})
						this.hasLogin = true;
					},
					fail: () => {
						console.log("未授权");
					}
				})
			},
			showQrcode() {
				uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
					current: 0,
					urls: [
						'https://shop.2dan88.com/minipro/p.png'
						// 'https://7863-xcx-2gojl4usae2f3353-1304501291.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201212154700.jpg?sign=e1453efe65d921dde96d544eba638331&t=1607760437'
					],
					longPressActions: { //长按保存图片到相册
						itemList: ['保存图片'],
						success: (data) => {
							console.log(data);
							uni.saveImageToPhotosAlbum({ //保存图片到相册
								filePath: payUrl,
								success: function() {
									uni.showToast({
										icon: 'success',
										title: '保存成功'
									})
								},
								fail: (err) => {
									uni.showToast({
										icon: 'none',
										title: '保存失败，请重新尝试'
									})
								}
							});
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				});
			},
			showMy() {
				uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
					current: 0,
					urls: [
						// 'https://7863-xcx-2gojl4usae2f3353-1304501291.tcb.qcloud.la/1.jpg?sign=6374a6448726b8ae0d7c825373875a28&t=1607760826'
						'https://shop.2dan88.com/minipro/me.png'
					]
				})

			},
			async onSubscribe() {
				const that = this;
				console.log(getApp().globalData)
				uni.request({
					url: getApp().globalData.getOpenId,
					success: (res) => {
						console.log(res)

					}
				});
				// await wx.cloud.init()
				// wx.cloud.callFunction({
				//   name:'getOpenId',
				//   success(res){
				// 	  const openid = res.result.openid;
				//       wx.requestSubscribeMessage({
				//          tmplIds: ['8e8GC_agCXbThLDSzQ74UdEdznAy94e7vfY23bdAY5g'],
				//          success(res){
				//            wx.cloud.callFunction({
				//              name:'subscribe',
				//              data:{
				//                openid:openid,
				//                title:'干饭时刻即将来临，快来领取超级优惠券啦！',
				//                time:'红包天天领，每天准时提醒，省心省时省钱！s'
				//              },
				//              success(res){
				//                uni.showToast({
				//                    title: '订阅成功！',
				//                    duration: 2000
				//                });
				//              },
				//              fail(res){
				//                uni.showToast({
				//                    title: '订阅失败！',
				//                    duration: 2000,
				//                    icon:'none'
				//                });
				//              }
				//            })
				//          },
				// 		 fail(res){
				// 			uni.showToast({
				// 			    title: '授权失败！',
				// 			    duration: 2000,
				// 			    icon:'none'
				// 			}); 
				// 		 }


				//        })


				//   },
				//   fail(res){
				// 	  console.log('获取openid失败！')
				//   }
				// })




			}

		}



	}
</script>

<style>
	.UCenter-bg {

		height: 550rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}
</style>
