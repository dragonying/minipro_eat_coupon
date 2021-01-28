<template>
	<view class="art">
		<music-top :content="title"></music-top>
		<!-- 轮播图 -->
		<swiper class='swiper' autoplay="true">
			<block v-for="(item,index) in foodPic" :key="index">
				<swiper-item>
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</block>
		</swiper>
		<view class="article" v-if="sentence">
			<view class="title">
				<text>《{{sentence.title}}》</text>
				<text>{{sentence.author}}</text>
			</view>
			<view class="content">
				<text v-for="(item,index) in sentence.content.split(',')" :key="index">{{item}}</text>
			</view>
			<view class="desc">
				{{sentence.des}}
			</view>
		</view>
		<view class="foot-1" style="position:absolute;bottom:3vh;width:100%;">
			<view class="col">
				<button class="btn btn-primary btn-filled btn-xs" @click="randomArt">下一首</button>
			</view>
		</view>
	</view>
</template>


<script>
	import {
		foodPic,
		foodArticle
	} from '@/data/article'
	import musicTop from '@/components/music-top/music-top'

	export default {
		components: {
			musicTop
		},
		data() {
			return {
				foodPic: foodPic.sort(function(a, b) {
					return Math.random() > .5 ? -1 : 1
				}),
				foodArticle,
				title: '美食诗词',
				sentence: null,
			}
		},
		methods: {
			randomArt() {
				this.sentence = this.foodArticle[Math.floor(Math.random() * this.foodArticle.length)];
			}

		},
		created() {
			this.randomArt()
		}
	}
</script>

<style lang="less">
	.swiper {
		height: 350rpx;

		image {
			height: 100%;
			width: 100%;
		}
	}

	.col {
		text-align: center;

		.btn {
			opacity: .8;
		}
	}

	.article {
		color: #FFFFFF;
		padding: 40rpx 30rpx 0;


		.title {
			display: flex;
			justify-content: center;
			font-size: 40rpx;

			text {
				margin: 10rpx;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			text-align: center;
			letter-spacing: 5rpx;
			font-size: 30rpx;

			text {
				margin-top: 10rpx;
			}
		}

		.desc {
			margin-top: 30rpx;
			font-size: 25rpx;
		}
	}
</style>
