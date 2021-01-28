<template>
	<view class="whole">
		<scroll-view v-show="gecitext" scroll-y="true" class="geciposition">
			<view>
				<slot name="content"></slot>
			</view>
		</scroll-view>
		<view class="imt-audio">
			<!-- #ifdef H5||MP-WEIXIN -->
			<view class="audio-wrapper">
				<view class="audio-number">{{format(current)}}</view>
				<slider class="audio-slider" :activeColor="color" block-size="16" :value="current" :max="duration" @changing="sliderChanging"
				 @change="sliderChange"></slider>
				<view class="audio-number">{{format(duration)}}</view>
			</view>
			<!-- #endif -->
			<view class="audio-control-wrapper" :style="{color}">
				<view v-show="dqxh" class="audio-control-switch1" @click="xunhuan">
					<image src="../../static/xunhuan.png" class="audio-icon"></image>
				</view>
				<view v-show="qxdqxh" class="audio-control-switch1" @click="qxxunhuan">
					<image src="../../static/qxxunhuan.png" class="audio-icon"></image>
				</view>
				<view class="audio-control audio-control-prev" v-if="control" :style="{borderColor:color}" @click="prev">&#xe601;</view>
				<view class="audio-control audio-control-switch" :class="{audioLoading:loading}" :style="{borderColor:color}"
				 @click="clickBtn">{{loading?'&#xe600;':(paused?'&#xe865;':'&#xe612;')}}</view>
				<view class="audio-control audio-control-next" v-if="control" :style="{borderColor:color}" @click="next">&#xe601;</view>

				<view v-show="showgeci" class="audio-control-switch2" @click="geci">
					<image src="../../static/geci.png" class="audio-icon"></image>
				</view>
				<view v-show="shutdowngeci" class="audio-control-switch2" @click="qxgeci">
					<image src="../../static/qxgeci.png" class="audio-icon"></image>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				audio: uni.createInnerAudioContext(),
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				paused: true, //是否处于暂停状态
				loading: false, //是否处于读取状态
				seek: false, //是否处于拖动状态
				dqxh: true, //单曲循环未点击
				qxdqxh: false, //单曲循环点击
				showgeci: true, //歌词未点击
				shutdowngeci: false, //歌词点击
				gecitext: false, //不显示歌词
			}
		},
		props: {
			src: String, //音频链接
			autoplay: Boolean, //是否自动播放
			looping: Boolean, //是否循环播放
			continue: Boolean, //播放完成后是否继续播放下一首，需定义@next事件
			control: {
				type: Boolean,
				default: true
			}, //是否需要上一曲/下一曲按钮
			color: {
				type: String,
				default: '#169af3'
			} //主色调
		},
		methods: {
			//滚动条变化后
			sliderChange(e) {
				this.audio.seek(e.detail.value);
				this.paused && this.play();
			},
			//滚动条变化中
			sliderChanging(e) {
				this.seek = true;
				this.current = e.detail.value
			},
			//清除播放时长
			initMusicData(initDuration = true) {
				this.audio.stop();
				this.paused = true;
				this.current = 0;
				initDuration && (this.duration = 0);
			},
			//点击按钮
			clickBtn() {
				this.paused ? this.play() : this.pause()
			},
			//返回prev事件
			prev() {
				this.initMusicData()
				this.$emit('prev')
				uni.showToast({
					title: "上一曲",
					icon: "none",
					mask: true
				});
			},
			//返回next事件
			next() {
				this.initMusicData()
				this.$emit('next')
				uni.showToast({
					title: "下一曲",
					icon: "none",
					mask: true
				})
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//点击播放按钮
			play() {
				this.loading = true
				this.audio.play()
			},
			//点击暂停按钮
			pause() {
				this.audio.pause()
				this.paused = true
			},
			//点击循环播放
			xunhuan() {
				this.audio.loop = true
				this.dqxh = false
				this.qxdqxh = true
				uni.showToast({
					title: "单曲循环",
					icon: "none"
				});
			},
			//取消循环播放
			qxxunhuan() {
				this.audio.loop = false
				this.dqxh = true
				this.qxdqxh = false
			},
			//显示歌词
			geci() {
				this.showgeci = false
				this.shutdowngeci = true
				this.gecitext = true
			},
			//取消歌词
			qxgeci() {
				this.showgeci = true
				this.shutdowngeci = false
				this.gecitext = false
			},
		},
		created() {
			if (this.src) {
				this.audio.src = this.src
				this.autoplay && this.play()
			}

			this.audio.obeyMuteSwitch = false

			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = this.audio.currentTime
				}
				if (!this.duration) {
					this.duration = this.audio.duration
				}
			})
			//音频播放事件
			this.audio.onPlay(() => {
				this.paused = false
				this.loading = false
			})
			//音频暂停事件
			this.audio.onPause(() => {
				this.paused = true
			})
			//音频进入可以播放状态
			this.audio.onCanplay(() => {
				console.log('oncanplay', this.audio.currentTime)
			})
			//音频结束事件
			this.audio.onEnded(() => {
				if (this.continue) {
					this.next()
				} else {
					this.initMusicData()
				}

			})
			//音频完成更改进度事件
			this.audio.onSeeked(() => {
				this.seek = false
			})
		},
		beforeDestroy() {
			this.audio.destroy()
		},
		watch: {
			src(src) {
				this.audio.src = src
				this.initMusicData()
				if (src) {
					this.play();
				}else{
					this.audio.stop();
				}
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: 'icon';
		src: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/1c90d860-2a35-11eb-899d-733ae62bed2f.eot');
		src: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/1c90d860-2a35-11eb-899d-733ae62bed2f.eot?#iefix') format('embedded-opentype'),
			url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/1bbebb50-2a35-11eb-8a36-ebb87efcf8c0.woff2') format('woff2'),
			url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/892b6d50-2a35-11eb-97b7-0dc4655d6e68.woff') format('woff'),
			url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/ab0559e0-2a35-11eb-b680-7980c8a877b8.ttf') format('truetype'),
			url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/e2502ab0-2a35-11eb-b997-9918a5dda011.svg#iconfont') format('svg');
	}

	.imt-audio {
		width: 100%;
		padding: 30upx 0;
		background: #fff;
		border-radius: 20upx;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
	}

	.audio-number {
		width: 120upx;
		font-size: 24upx;
		line-height: 1;
		color: #333;
		text-align: center;
	}

	.audio-slider {
		flex: 1;
		margin: 0;
	}

	.audio-control-wrapper {
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "icon" !important;
	}

	.audio-control {
		font-size: 32upx;
		line-height: 1;
		border: 4upx solid;
		border-radius: 50%;
		padding: 16upx;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.audio-control-switch {
		font-size: 40upx;
		margin: 0 80upx;
	}

	.audio-control-switch1 {
		font-size: 40upx;
		margin-right: 80upx;
		/* margin: 0 50upx; */
	}

	.audio-control-switch2 {
		font-size: 40upx;
		margin-left: 80upx;
		/* margin: 0 50upx; */
	}

	.audio-icon {
		width: 50upx;
		height: 50upx;
	}

	.audio-icon1 {
		width: 85upx;
		height: 85upx;
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}

	.geciposition {
		/* #ifdef APP-PLUS */
		margin-top: 78upx;
		/* #endif */
		width: 85%;
		height: 1000upx;
		position: fixed;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 35upx;
		color: #fff;
		top: 100upx;
	}

	.whole {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
