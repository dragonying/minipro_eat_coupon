<template>
	<view>
		<view class="main-wrapper" style="position:relative;top:-20vh;">
			<view class="container main-sentence justify-content-center text-center">
				<view id="sentence"  style="font-size:2rem;">{{sentence}}</view>
			</view>
		</view>
		<view class="foot-1" style="position:absolute;bottom:7vh;width:100%;">
			<view class="col">
				<button class="btn btn-primary btn-filled btn-xs" @click="randomSentence">再来一碗</button>
			</view>
		</view>
	</view>

</template>

<script>
	import jt from '../../data/jt.js'
	export default {
		data() {
			return {
				sentence: ''
			}
		},
		onLoad: function(n) {
			this.randomSentence(), wx.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"]
			});
		},
		onShareAppMessage: function(n) {
			var e = [{
				title: "毒鸡汤",
				path: "/pages/djt/djt"
			}];
			return e[Math.floor(Math.random() * e.length)];
		},
		onShareTimeline: function() {
			var n = [{
				title: "毒鸡汤"
			}];
			return n[Math.floor(Math.random() * n.length)];
		},
		methods: {
			randomSentence: function() {
				this.sentence = jt[Math.floor(Math.random() * jt.length)];
			}
		}

	}
</script>

<style lang="less">
	page {
		background-color: #f8f8f8;
		margin: 0;
		background: #FFFFFF url('https://shop.2dan88.com/minipro/day.jpg') no-repeat center/100% 100%;
		color: #212529;
		text-align: left;
		font-weight: 400;
		font-size: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
		line-height: 1.5;
	}
	
	.container {
		margin-right: auto;
		margin-left: auto;
		padding-right: 30rpx;
		padding-left: 30rpx;
		width: 100%;
		color:#FFFFFF
	}

	.col {
		text-align: center !important;
	}

	._img {
		border-style: none;
		vertical-align: middle;
	}

	::after,
	::before {
		box-sizing: border-box;
	}

	.main-wrapper {
		display: flex;
		height: 100vh;
		-webkit-box-align: center;
		align-items: center;
	}

	.text-center {
		text-align: center !important;
	}

	.btn:not(:disabled):not(.disabled) {
		cursor: pointer;
	}

	.btn-primary.btn-filled {
		background: #1aaf5d;
		color: #fff;
	}

	.btn-xs {
		padding: 16rpx 48rpx;
		font-size: 24rpx;
	}

	.btn {
		min-width: 100rpx;
		background: none;
		transition: all .3s ease;
	}

	.btn-primary {
		padding: 28rpx 56rpx 26rpx;
		border: 4rpx solid #1aaf5d;
		border-radius: 50rpx;
		color: #1aaf5d;
		text-transform: uppercase;
		letter-spacing: 2rpx;
		font-weight: 700;
		font-size: 22rpx;
		font-family: Raleway, Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
		line-height: 1;
		border-color: #007bff;
		background-color: #007bff;
		color: #fff;
	}

	.btn,
	.btn-primary {
		display: inline-block;
	}

	.btn {
		padding: .375rem .75rem;
		border: 2rpx solid transparent;
		border-radius: .25rem;
		vertical-align: middle;
		text-align: center;
		white-space: nowrap;
		font-weight: 400;
		font-size: 1rem;
		line-height: 1.5;
		transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
		user-select: none;
	}

	._select,
	button {
		text-transform: none;
	}

	button,
	input {
		overflow: visible;
	}

	._optgroup,
	._select,
	button,
	input,
	textarea {
		margin: 0;
		font-size: inherit;
		font-family: inherit;
		line-height: inherit;
	}

	button {
		border-radius: 0;
		appearance: button;
		-webkit-writing-mode: horizontal-tb !important;
		text-rendering: auto;
		color: -internal-light-dark(#000, #fff);
		letter-spacing: normal;
		word-spacing: normal;
		text-transform: none;
		text-indent: 0;
		text-shadow: none;
		display: inline-block;
		text-align: center;
		-webkit-box-align: start;
		align-items: flex-start;
		cursor: default;
		background-color: -internal-light-dark(#efefef, #3b3b3b);
		box-sizing: border-box;
		margin: 0;
		font: 400 27rpx Arial;
		padding: 2rpx 12rpx;
		border: 4rpx outset -internal-light-dark(#767676, #858585);
		border-image: initial;
	}
</style>
