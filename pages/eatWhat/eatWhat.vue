<template>
	<view class='content-box'>
		<view :class="runningStatus" id="bg"></view>
		<view id="tempContainer">
			<view v-for="(item,index) in tempFoods" :key="index">
				<view class="tempItem" :style="[{top:item.top},{left:item.left},{fontSize:item.fontSize},{color:item.color}]">{{item.food}}</view>
				<view :class="['tempItem','iconfont',item.cn]" :style="[{top:item.icotop},{left:item.icoleft},{fontSize:item.fontSize},{color:item.color}]"></view>
			</view>
		</view>
		<view id="outer">
			<view id="inner">
				<view :class="runningStatus" id="main">
					<text class="tip">点击可以切换饭点~</text>
					<view :class="{title:true,shack:hasClickTime}" @click="changeTime">
						<view>今天<text class="time">{{eatTime}}</text>吃</view>
						<view class='eat'>
							<text class="what">{{food}}</text><text class="punctuation">{{punctuation}}</text>
						</view>
					</view>
					<view id="startBtn" @click="play">
						<view class="inner">{{btnText}}</view>
					</view>
					<view class="share">
						<button class="shareApp" openType="share">
							<view class="inner">分享吃什么</view>
						</button>
						<button class="luckyMoney" @click="getLuckyMoney">
							<view class="inner">去领红包</view>
						</button>
					</view>
					<view id="showRestaurant" @click="showRestaurant" v-if="showRoom">
						<image src="../../static/cousor.png"></image>
						<text>点击查看餐厅详情</text>
					</view>
				</view>
				<view id="footer" :class="{hide:isRunning}">
					<view id="toggle">
						<text class="option" :class="{selected:isHuman}" @click="changeType('human')" id="human">正常人类</text>
						<text class="option" :class="{selected:!isHuman}" @click="changeType('monster')" id="monster">非正常人</text>
						<view class="hb" :class="{monster:!isHuman}"></view>
					</view>
					<view class="fab" id="getRestaurants" title="定位餐厅" @click="showLocationMenu"></view>
					<!-- <view bindtap="__e" class="fab" data-event-opts="{{[ [ 'tap',[ [ 'editMenu',['$event'] ] ] ] ]}}" id="editMenu" title="菜单"></view> -->
				</view>
			</view>
			<view class="safeAreaInsetBottom"></view>
		</view>
		<!-- 	<view id="menuModal">
			<form bindsubmit="__e" data-event-opts="{{[ [ 'submit',[ [ 'handleFormSubmit',['$event'] ] ] ] ]}}" style="{{'margin-top:'+navbarHeight}}">
				<text class="title">~ 想吃什么 ~</text>
				<textarea maxlength="1000" name="textarea" placeholder="在这里输入菜单,项目间以空格分隔,保存后会缓存到本地,再次打开会恢复初始值…" value="{{menuValue}}"></textarea>
				<button formType="submit">保存，再次打开恢复默认</button>
			</form>
		</view> -->
	</view>
</template>
<script>
	import tounchButton from '../../components/tounch-button/tounch-button.vue'
	import QQMapWX from '../../vendor/qqmap-wx-jssdk.min.js'
	import {
		breakfast_food,
		lunch_food,
		dinner_food,
		supper_food,
		icon_food,
		monster_food,
		msg_tip
	} from '../../data/data.js'
	const defaultEat = '神马'
	const qqmapsdk = new QQMapWX({
		key: "HIVBZ-VKAR4-A32UU-XT3DI-E7ZVK-D4BDU"
	})
	export default {
		components: {
			tounchButton
		},
		data() {
			return {
				musicIsPlay: false,
				timer: null, //定时器
				isRunning: false, //运行吃什么的状态
				type: "human", //吃的类型
				hasClickTime: false,
				food: defaultEat,
				eatType: 'lunch',
				eatTypeArr: {
					breakfast: {
						title: '早饭',
						value: breakfast_food
					},
					lunch: {
						title: '午饭',
						value: lunch_food
					},
					dinner: {
						title: '晚饭',
						value: dinner_food
					},
					supper: {
						title: '夜宵',
						value: supper_food
					}
				},
				items: [{
						value: '0',
						name: '正常人类',
						checked: 'true'
					},
					{
						value: '1',
						name: '非正常人类'
					}
				],
				menuValue: "",
				showMenu: false,
				foods: [], //食物列表
				tempFoods: [], //临时食物
				restaurants: [], //餐厅列表
				btnText: "开始", //按钮文案
				titleAnimationData: {},
				timerArr: [] //定时器组
			}

		},
		onShareAppMessage(res) {

		},
		computed: {
			//吃饭时间
			eatTime() {
				return this.eatTypeArr[this.eatType].title
			},
			//运行状态
			runningStatus() {
				let s = this.isRunning ? 'running' : 'done'
				this.restaurants.length && (s += ' restaurants')
				return s
			},
			//符号
			punctuation() {
				return this.isRunning || this.food == defaultEat ? "？" : "！"
			},
			//是否人类
			isHuman() {
				return this.type == 'human'
			},
			//显示定位餐厅
			showRoom() {
				return this.restaurants.length && this.food != defaultEat
			}

		},
		onShareTimeline(res) {},
		onLoad() {
			// 吃饭类型
			this.eatType = this.getTimeState();
			this.foods = this.eatTypeArr[this.eatType].value;
		},
		//页面隐藏时
		onHide() {
			uni.pauseBackgroundAudio();
			this.musicIsPlay = false;
			this.clearTimerArr();
		},
		methods: {
			clearTimerArr() {
				clearTimeout(this.timer)
				this.timerArr.map(v => clearTimeout(v))
			},
			//随机函数
			random: function(t, n) {
				return t = t || 100, n = n || 0, Math.floor(Math.random() * (t - n + 1)) + n;
			},
			// 开始
			play() {
				if (this.isRunning) {
					this.clearTimerArr()
					this.isRunning = false
					this.btnText = "换一个"
						//非人类题醒
						!this.isHuman && uni.showToast({
							title: msg_tip[this.random(msg_tip.length - 1)],
							icon: "none",
							position: 'top'
						});
				} else {
					this.isRunning = true
					this.tempFoods = []
					const _this = this
					let n = 0

					function t() {
						//随机一个食物
						let i = _this.foods[_this.random(_this.foods.length - 1)];
						//随机类名
						let iconame = icon_food[_this.random(icon_food.length - 1)];
						_this.food = i;
						_this.btnText = '停'
						_this.tempFoods.push({
							food: i,
							cn: iconame,
							top: _this.random(100, 0) + "%",
							left: _this.random(100, 0) + "%",
							icotop: _this.random(100, 0) + "%",
							icoleft: _this.random(100, 0) + "%",
							fontSize: _this.random(38, 14) + "px",
							color: "rgba(" + _this.random(100, 255) + "," + _this.random(100, 255) + "," + _this.random(100, 255) + "," +
								_this.random(
									7, 2) / 10 + ")"
						});
						n++
						_this.timer = setTimeout(() => {
							t()
							_this.tempFoods.length > 70 && _this.tempFoods.splice(0, 70)
							let tm = setTimeout(() => {
								_this.tempFoods.shift()
							}, 200 * n)
							_this.timerArr.push(tm)
						}, 100);
					}
					t();
				}
			},
			getTimeState() {
				let hours = (new Date()).getHours();
				let type = ``;
				// 判断当前时间段
				if (hours >= 0 && hours <= 10) {
					type = 'breakfast';
				} else if (hours > 10 && hours <= 14) {
					type = 'lunch';
				} else if (hours > 14 && hours <= 20) {
					type = 'dinner';
				} else if (hours > 20 && hours <= 24) {
					type = 'supper';
				}
				return type
			},
			getLuckyMoney: function() {
				uni.switchTab({
					url: "/pages/getCoupon/getCoupon"
				});
			},
			//切换类型
			changeType(v) {
				if (v !== this.type) {
					this.type = v
					this.food = defaultEat
					this.btnText = "开始"
					this.restaurants = []
					this.foods = this.isHuman ? this.eatTypeArr[this.eatType].value : monster_food
					uni.showToast({
						title: this.isHuman ? "还是人类好吃Ψ(￣∀￣)Ψ" : "注意！前方高能！",
						icon: "none"
					})
					uni.reportAnalytics("toggle_type", {
						type: v
					});
				}
			},
			//切换时间
			changeTime() {
				this.hasClickTime = true;
				this.food = defaultEat;
				let allType = Object.keys(this.eatTypeArr);
				let currentIndex = allType.indexOf(this.eatType);
				this.eatType = allType[currentIndex + 1] ? allType[currentIndex + 1] : allType[0];
				this.foods = this.eatTypeArr[this.eatType].value;
				this.btnText = '开始'
			},
			// 显示餐厅
			showLocationMenu() {
				uni.showActionSheet({
					itemList: ["获取附近餐厅", "手动定位地址"],
					success: (e) => {
						switch (e.tapIndex) {
							case 0:
								this.getRestaurants();
								break;
							case 1:
								uni.chooseLocation({
									success: this.getRestaurants
								});
								break;
						}
						uni.reportAnalytics("get_restaurants", {
							type: 0 === e.tapIndex ? "nearby" : "locate"
						});
					}
				});
			},
			// 获取附近餐厅
			getRestaurants(n) {
				console.log('获取附近餐厅')
				uni.showLoading({
					title: n ? "搜索美食中…" : "获取附近美食…",
					mask: true
				})
				//并发5个请求
				Promise.all(Array.from({
					length: 5
				}, (t, a) => {
					return this.searchRestaurants(n, a + 1);
				})).then((n) => {
					let all = n.reduce(function(t, n) {
						return t.concat(n.data);
					}, []);
					this.type = "human";
					this.food = defaultEat;
					this.btnText = "开始";
					this.restaurants = all;
					this.foods = all.map(function(t) {
						return t.title;
					});
					setTimeout(function() {
						uni.showToast({
							title: "菜单已更新"
						});
					}, 10);
				}, function(n) {
					setTimeout(function() {
						uni.showToast({
							title: JSON.stringify(n),
							icon: "none"
						});
					}, 10);
				}).then(function() {
					return uni.hideLoading();
				});
			},
			//搜索餐厅
			searchRestaurants(location, page) {
				return new Promise(function(resolve, reject) {
					qqmapsdk.search({
						location: location,
						keyword: "美食",
						page_size: 20,
						page_index: page,
						success: resolve,
						fail: reject
					});
				});
			},
			//显示餐厅位置
			showRestaurant: function() {
				const e = this.restaurants.find((t) => {
					return t.title === this.food;
				});
				uni.openLocation({
					latitude: e.location.lat,
					longitude: e.location.lng,
					name: e.title,
					address: e.address
				});
			},
		},
		onShow: function() {
			if (!this.musicIsPlay) {
				uni.playBackgroundAudio({
					dataUrl: 'https://shop.2dan88.com/minipro/eatsong.mp3',
					title: '干饭人之歌',
					coverImgUrl: 'https://shop.2dan88.com/minipro/mp3.jpg'
				})
				this.musicIsPlay = true
			}
		},
		onShareAppMessage: function(n) {
			let t = this.eatTime
			return uni.reportAnalytics("share", {
				type: this.type,
				food: this.food,
				time: t
			}), {
				title: defaultEat === this.food ? "今天吃神马？这是一个能解决你的人生一大困扰的小程序！" : "今天" + t + "吃" + this.food +
					"！这个小程序解决了我人生的一大困扰啊！",
				path: "pages/eatwhat/eatwhat"
			};
		},
		onShareTimeline: function() {
			return {
				title: "神马" === this.food ? "今天吃神马？这是一个能解决你的人生一大困扰的小程序！" : "今天" + this.eatTime + "吃" + this.food +
					"！这个小程序解决了我人生的一大困扰啊！",
				imageUrl: "../../static/share_pic.png",
				path: "/pages/eatwhat/eatwhat"
			};
		},
	}
</script>

<style lang="less">
	.content-box {
		background-color: #e9e9e9;
	}

	// 背景
	#bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background: #e9e9e9 url("data:image/png;base64,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");

		transform: translateZ(0);
		animation: flow 5s linear infinite;
	}

	#bg.running {
		animation-play-state: paused;
	}

	@keyframes move {
		0% {
			transform: translateX(0);
		}

		to {
			transform: translateX(-30rpx);
		}
	}

	@keyframes flow {
		0% {
			background-position: 50% 0;
		}

		to {
			background-position: 50% -600rpx;
		}
	}

	#outer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;

		#inner {
			position: relative;
			-webkit-box-flex: 1;
			flex: 1;
		}

		.safeAreaInsetBottom {
			height: env(safe-area-inset-bottom);
		}
	}

	// 抖动
	@keyframes shack {
		0% {
			transform: translateX(0rpx);
		}

		25% {
			transform: translateX(20rpx);
		}

		50% {
			transform: translateX(0rpx);
		}

		75% {
			transform: translateX(-20rpx);
		}

		100% {
			transform: translateX(0rpx);
		}

	}



	// .adContainer {
	// 	width: 100%;
	// 	max-width: 414px;
	// 	align-self: center;
	// }



	//主要内容
	#main {
		position: relative;
		margin-top: 30%;
		text-align: center;

		.tip {
			position: absolute;
			top: -100rpx;
			left: 50%;
			padding: 14rpx 24rpx;
			background: rgba(0, 0, 0, .6);
			color: #fff;
			white-space: nowrap;
			border-radius: 30px;
			background-size: contain;
			transform: translate3d(-50%, 0, 0);
			animation: tip 3s linear 1s both;
		}

		@keyframes tip {

			0%,
			to {

				opacity: 0;
				transform: perspective(1200rpx) translate3d(-50%, 14rpx, 0) scale(.7) rotateY(180deg);
			}

			20%,
			80% {
				opacity: 1;
				transform: perspective(1200px) translate3d(-50%, 0, 0) rotateY(0deg);
			}
		}

		.eat {
			text-align: center;
		}

		.tip:after {
			content: "";
			position: absolute;
			top: 100%;
			left: 50%;
			margin-left: -8rpx;
			border: 16rpx solid transparent;
			border-top-color: rgba(0, 0, 0, .6);
		}

		// 吃什么
		.title {
			margin: 0 0 60rpx;
			padding: 0;
			font-weight: 400;
			font-size: 56rpx;
			cursor: pointer;
			color: #cf5459;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			&.shack {
				animation: shack .1s linear 5;
			}



			.what {
				font-weight: 700;
				font-size: 64rpx;
				color: #cf5459;
				text-align: center;
				margin-right: 10rpx;
			}
		}

		&.restaurants {
			margin-top: 30%;

			// .what {
			// 	display: block;
			// }

			&.done .what {
				white-space: normal;
			}

			&.done #showRestaurant {
				display: inline-block;
			}
		}

		#showRestaurant {
			display: none;
			margin-top: 80rpx;
			font-size: 24rpx;
			font-weight: 700;
			color: rgb(94, 43, 107);
			text-align: center;

			image {
				width: 56rpx;
				height: 56rpx;
				vertical-align: middle;
				animation: move .5s linear infinite;
			}

			text {
				border-bottom: 2rpx dotted;
			}
		}

		// 开始按钮
		#startBtn {
			width: 400rpx;
			height: 160rpx;
			margin: 0 auto;
			padding: 10rpx;
			border-radius: 80rpx;
			background: rgba(0, 0, 0, .1);
			box-shadow: inset 0 4rpx 6rpx rgba(0, 0, 0, .07), 0 2rpx hsla(0, 0%, 100%, .5);

			.inner {
				width: 100%;
				height: 100%;
				line-height: 140rpx;
				color: #fff;
				font-size: 56rpx;
				text-align: center;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .3);
				border-radius: 70rpx;
				border: 2rpx solid #b4969b;
				background: linear-gradient(180deg, #ff927c, #f3685e);
				box-shadow: inset 0 2rpx #ffd17c, 0 4rpx 6rpx rgba(0, 0, 0, .2);
			}

			&:hover .inner {
				background: linear-gradient(180deg, #ff927c, #ec6253);
				box-shadow: inset 0 2rpx #ffd17c, 0 4rpx 6rpx rgba(0, 0, 0, .2);
			}

			&:active .inner {
				background: linear-gradient(180deg, #f3685e, #ff927c);
				box-shadow: inset 0 2rpx #fa726d, 0 4rpx 6rpx rgba(0, 0, 0, .2);
			}
		}

		// 分享按钮和领红包按钮
		.share {
			display: flex;
			-webkit-box-orient: horizontal;
			-webkit-box-direction: normal;
			flex-direction: row;
			-webkit-box-pack: center;
			justify-content: center;
			margin-top: 20rpx;

			.shareApp {
				width: 160rpx;
				height: 60rpx;
				margin: 20rpx;
				padding: 10rpx;
				border-radius: 80rpx;
				background: rgba(0, 0, 0, .1);
				box-shadow: inset 0 4rpx 6rpx rgba(0, 0, 0, .07), 0 2rpx hsla(0, 0%, 100%, .5);

				.inner {
					width: 100%;
					height: 100%;
					line-height: 40rpx;
					color: #fff;
					font-size: 24rpx;
					text-align: center;
					text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .3);
					border-radius: 70rpx;
					border: 2rpx solid #97d110;
					background: linear-gradient(180deg, #19ac18, #19ac18);
				}

				&:hover .inner {
					box-shadow: inset 0 2rpx #97d110, 0 4rpx 6rpx rgba(0, 0, 0, .2);
					background: linear-gradient(180deg, #137e11, #137e11);

				}

				&:active .inner {
					background: linear-gradient(180deg, #19ac18, #19ac18);
					box-shadow: inset 0 2rpx #97d110, 0 4rpx 6rpx rgba(0, 0, 0, .2);
				}
			}

			.luckyMoney {
				width: 160rpx;
				height: 60rpx;
				margin: 20rpx;
				padding: 10rpx;
				border-radius: 80rpx;
				background: rgba(0, 0, 0, .1);
				box-shadow: inset 0 4rpx 6rpx rgba(0, 0, 0, .07), 0 2rpx hsla(0, 0%, 100%, .5);

				.inner {
					width: 100%;
					height: 100%;
					line-height: 40rpx;
					color: #fff;
					font-size: 24rpx;
					text-align: center;
					text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .3);
					border-radius: 70rpx;
					border: 2rpx solid #e88e1d;
					background: linear-gradient(180deg, #f0713f, #f0713f);
					box-shadow: inset 0 2rpx #ffd17c, 0 4rpx 6rpx rgba(0, 0, 0, .2);
				}

				&:hover .inner {
					background: linear-gradient(180deg, #c78f41, #c78f41);
					box-shadow: inset 0 2rpx #ffe696, 0 4rpx 6rpx rgba(0, 0, 0, .2);
				}

				&:active .inner {
					background: linear-gradient(180deg, #f0713f, #f0713f);
					box-shadow: inset 0 2rpx #ffb050, 0 4rpx 6rpx rgba(0, 0, 0, .2);
				}
			}
		}

	}


	#tempContainer {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		min-height: 100%;
		overflow: hidden;
		z-index: -1;

		.tempItem {
			position: absolute;
			white-space: nowrap;
			color: #777;
			animation: flash 5s ease-out both;
		}
	}




	@keyframes flash {
		0% {
			opacity: 0;
			transform: translate3d(-50%, -50%, 0) scale(2);
			color: transparent;
			text-shadow: 0 0 10rpx rgba(0, 0, 0, .5);
		}


		25% {
			opacity: .5;
		}

		50% {
			opacity: 1;
		}

		75% {
			opacity: .5;
		}

		to {
			opacity: 0;
			transform: translate3d(-50%, -50%, 0) scale(.5);
		}
	}

	// 底部
	#footer {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		width: 100%;
		transition: .3s;

		&.hide {
			position: fixed;
			bottom: -88rpx;
			opacity: 0;
		}
	}

	#toggle {
		position: absolute;
		bottom: 18rpx;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 40rpx;
		background: rgba(0, 0, 0, .1);
		padding: 4rpx;
		font-size: 24rpx;
		box-shadow: inset 0 4rpx 6rpx rgba(0, 0, 0, .07), 0 2rpx hsla(0, 0%, 100%, .5);


		.option {
			display: inline-block;
			color: #ddd;
			line-height: 1;
			padding: 10rpx 20rpx;
			transition: .3s;

			&.selected {
				color: #fff;
			}
		}

		.hb {
			box-sizing: initial;
			content: "";
			position: absolute;
			top: 4rpx;
			left: 4rpx;
			width: 4em;
			height: 1em;
			border-radius: 40rpx;
			padding: 10rpx 20rpx;
			transition: .3s;
			z-index: -1;
			text-align: center;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .3);
			border-radius: 40rpx;
			border: 2rpx solid #00bdd6;
			background: linear-gradient(180deg, #a2c0c4, #2bd0e6);

			&.monster {
				left: 140rpx;
				width: 4em;
				border: 2rpx solid #e80773;
				background: linear-gradient(180deg, #e6a7c5, #e80773);
			}
		}
	}


	#getRestaurants {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath d='M256 0C156.748 0 76 80.748 76 180c0 33.534 9.289 66.26 26.869 94.652l142.885 230.257A15 15 0 00258.499 512h.119a14.997 14.997 0 0012.75-7.292L410.611 272.22C427.221 244.428 436 212.539 436 180 436 80.748 355.252 0 256 0zm128.866 256.818L258.272 468.186l-129.905-209.34C113.734 235.214 105.8 207.95 105.8 180c0-82.71 67.49-150.2 150.2-150.2S406.1 97.29 406.1 180c0 27.121-7.411 53.688-21.234 76.818z' fill='%23FFF'/%3E%3Cpath d='M256 90c-49.626 0-90 40.374-90 90 0 49.309 39.717 90 90 90 50.903 0 90-41.233 90-90 0-49.626-40.374-90-90-90zm0 150.2c-33.257 0-60.2-27.033-60.2-60.2 0-33.084 27.116-60.2 60.2-60.2s60.1 27.116 60.1 60.2c0 32.683-26.316 60.2-60.1 60.2z' fill='%23FFF'/%3E%3C/svg%3E");
	}

	.fab {
		position: absolute;
		bottom: 0;
		right: 20rpx;
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.3) no-repeat center;
		background-size: 48rpx;
	}


	#editMenu {
		bottom: 108rpx;
		background-size: 40rpx auto;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 317.825 317.825' width='512' height='512'%3E%3Cpath d='M301.934 143.021H15.891C7.119 143.021 0 150.14 0 158.912s7.119 15.891 15.891 15.891h286.042c8.74 0 15.891-7.119 15.891-15.891.001-8.772-7.15-15.891-15.89-15.891zM15.891 79.456h286.042c8.74 0 15.891-7.119 15.891-15.891s-7.151-15.891-15.891-15.891H15.891C7.119 47.674 0 54.793 0 63.565s7.119 15.891 15.891 15.891zm286.043 158.913H15.891C7.119 238.369 0 245.52 0 254.26s7.119 15.891 15.891 15.891h286.042c8.74 0 15.891-7.151 15.891-15.891.001-8.74-7.15-15.891-15.89-15.891z' fill='%23FFF'/%3E%3C/svg%3E");
	}

	#menuModal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .3);
	}

	#menuModal form {
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		right: 20rpx;
		padding: 0 20rpx;
		background-image: linear-gradient(180deg, #5d4e48, #372d27);
		border: 2rpx solid #22201f;
		border-radius: 14rpx;
		box-shadow: inset 0 2rpx 0 hsla(0, 0%, 100%, .3), 0 4rpx 20rpx rgba(0, 0, 0, .3);
	}

	#menuModal .title {
		display: block;
		text-align: center;
		font-size: 64rpx;
		color: #fff;
		margin: 40rpx 0;
		text-shadow: 0 -4rpx rgba(0, 0, 0, .7);
	}

	#menuModal textarea {
		width: 100%;
		height: 13em;
		background: #fff;
		border: 2rpx solid #22201f;
		border-radius: 14rpx;
		padding: 14rpx 20rpx;
		margin-bottom: 20rpx;
		line-height: 1.5;
	}

	#menuModal button {
		width: 100%;
		font-size: 32rpx;
		color: #fff;
		text-shadow: 0 2rpx rgba(0, 0, 0, .3);
		background: #f6b43d;
		border-radius: 14rpx;
		margin-bottom: 20rpx;
	}
</style>
