<template>
	<view>
		<music-top :content="userSongs[now].name"></music-top>
		<scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">
			<view>
				<carousel :img-list="userSongs" url-key="pic" @selected="selectedBanner" />
				<imt-audio autoplay continue :src="userSongs[now].music" :duration="userSongs[now].duration" @prev="prev" @next="next">
					<rich-text :nodes="userSongs[now].geci" style="text-align: center;" slot="content"></rich-text>
				</imt-audio>
				<view class="text-center rowline">
					<view class='bg-gradual-purple lg block shadow radius btn' @tap="showModal" data-target="viewModal">
						歌曲库
					</view>
					<view class="bg-gradual-purple lg block shadow radius btn" @tap="showModal" data-target="RadioModal">
						点歌
					</view>
				</view>
				<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
					<view class="cu-dialog" @tap.stop="">
						<view class="search-bar cu-bar search bg-night">
							<view class="search-form round">
								<text class="cuIcon-search"><text class="text-mauve">{{platname}}</text></text>
								<input :adjust-position="false" type="text" @confirm="searchMusic" placeholder="搜索歌名" confirm-type="search"></input>
							</view>
							<button size="mini" class="setting" @click="selectPlatForm">
								切换频道
							</button>
						</view>
						<scroll-view scroll-y="true" class="content1 bg-night">
							<view>
								<view class="list" v-for="(item,key) in songList" :key="item.songid" @click="diange(key)">
									<image :src="item.pic" mode="scaleToFill"></image>
									<text>{{item.name}} - {{item.author}}</text>
									<view class="btn" @click="addMusic(item)">+</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
				<view class="content">
					<view class="list" :class="{active:key===now}" v-for="(item,key) in userSongs" :key="key" @click="choiceSong(key)">
						<image :src="item.pic" mode="scaleToFill"></image>
						<text>{{item.name}} - {{item.author}}</text>
						<view class="btn cute" @click.stop="cutMusic(key)">-</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		ColorList
	} from './theme.js'
	import imtAudio from '@/components/imt-audio/imt-audio'
	import carousel from '@/components/vear-carousel/vear-carousel'
	import musicTop from '@/components/music-top/music-top'
	import {
		musicCache
	} from '@/vendor/storage'
	const SONGURL = 'http://www.depmusic.com/song.php'
	export default {
		components: {
			imtAudio,
			carousel,
			musicTop
		},
		data() {
			return {
				radio: '',
				themeList: [],
				modalName: null,
				songList: [],
				platKey: '163', //平台key
				platForm: [{
						title: '网易云音乐',
						key: '163'
					},
					{
						title: 'QQ音乐',
						key: 'qq'
					},
					{
						title: '酷狗音乐',
						key: 'kugou'
					},
					{
						title: '5Sing',
						key: '5sing'
					},
					{
						title: '酷我音乐',
						key: 'kuwo'
					},
					{
						title: 'soundcloud',
						key: 'soundcloud'
					}
					// {
					// 	title: '虾米音乐',
					// 	key: 'xiami'
					// },
					// {
					// 	title: '百度音乐',
					// 	key: 'baidu'
					// },
					// {
					// 	title: '一听音乐',
					// 	key: '1ting'
					// }
				],
				userSongs: [{
					songid: 1,
					name: 'Catch the Moment刀剑神域',
					author: '序列之争',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a16492d0-134b-11eb-899d-733ae62bed2f.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/6e2c6a90-11cb-11eb-8ff1-d5dcf8779628.jpg'
				}, {
					songid: 2,
					name: '樱花樱花想见你',
					author: '昼夜',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a63ad300-134b-11eb-9dfb-6da8e309e0d8.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/6ee5cf80-11cb-11eb-8bd0-2998ac5bbf7e.jpg'
				}, {
					songid: 3,
					name: 'Otokaze',
					author: '夏恋',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a2cb75d0-134b-11eb-b997-9918a5dda011.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/6f8a4ce0-11cb-11eb-8bd0-2998ac5bbf7e.jpg'
				}, {
					songid: 4,
					name: 'City of Twilight',
					author: 'Raujika',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a3584c80-134b-11eb-9dfb-6da8e309e0d8.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/70405670-11cb-11eb-8ff1-d5dcf8779628.jpg'
				}, {
					songid: 5,
					name: '鸟之诗',
					author: '八音盒版',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a3f92060-134b-11eb-899d-733ae62bed2f.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/5116ee70-11cc-11eb-9dfb-6da8e309e0d8.jpg'
				}, {
					songid: 6,
					name: '夏野与暗恋',
					author: '闫东炜',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a53b6460-134b-11eb-899d-733ae62bed2f.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/7166ae00-11cb-11eb-8bd0-2998ac5bbf7e.jpg'
				}, {
					songid: 7,
					name: 'キミを思うメロディー',
					author: 'アッチョリケ',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/a4a1e380-134b-11eb-b997-9918a5dda011.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/720278d0-11cb-11eb-8a36-ebb87efcf8c0.jpg'
				}, {
					songid: 8,
					name: 'Cymophane',
					author: 'Tassel',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/d0f7ae60-134b-11eb-8ff1-d5dcf8779628.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/6d8b4890-11cb-11eb-8ff1-d5dcf8779628.jpg'
				}, {
					songid: 9,
					name: 'Refrain',
					author: 'Anan Ryoko',
					geci: '纯音乐，无歌词',
					music: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-hjinhmzy11qaa4ebe2/d02717f0-134b-11eb-899d-733ae62bed2f.mp3',
					pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dengluyun/506acff0-11cc-11eb-b680-7980c8a877b8.jpg'
				}],
				now: 0,
			}
		},
		onShow() {
			uni.hideTabBar();
		},
		onLoad() {
			uni.showLoading({
				title: '初始化...',
				mask: true,
				duration: 1500
			})
			let musics = musicCache.get()
			if (musics) {
				this.userSongs = musics
			}
		},
		computed: {
			platname() {
				return this.platForm[this.platForm.findIndex(v => v.key === this.platKey)].title;
			}
		},
		methods: {
			//选择平台
			selectPlatForm() {
				uni.showActionSheet({
					itemList: this.platForm.map(v => v.title),
					success: (res) => {
						this.platKey = this.platForm[res.tapIndex].key
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			//选中音乐
			choiceSong(key) {
				this.now = key
			},
			//上一曲
			prev() {
				let pre = this.now - 1
				this.now = this.userSongs[pre] ? pre : this.userSongs.length - 1;
			},
			//下一曲
			next() {
				let nxt = this.now + 1
				this.now = this.userSongs[nxt] ? nxt : 0;
			},
			// 添加音乐
			addMusic(obj) {
				this.userSongs.unshift(obj)
				musicCache.set(this.userSongs)
				this.now = 0
				uni.showToast({
					title: '已添加到歌单',
					mask: true
				})
			},
			//删减音乐
			cutMusic(index) {
				uni.showModal({
					title: '确定删除吗?',
					content: this.userSongs[index].name,
					success: (res) => {
						if (res.confirm) {
							this.userSongs.splice(index, 1)
							musicCache.set(this.userSongs)
							uni.showToast({
								title: '已移除歌曲',
								mask: true
							})
							if (index === this.now) {
								this.next()
							}
						}
					}
				});

			},
			//音乐查询
			searchMusic(e) {
				let sname = e.detail.value.trim();
				if (!sname.length) {
					uni.showToast({
						title: '请输入歌名',
						icon: 'none'
					});
					return false;
				}
				uni.showLoading({
					title: '搜索中...',
					mask: true
				})
				uni.request({
					url: SONGURL,
					header: {
						'X-Requested-Wit': 'XMLHttpRequest',
						'content-type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
					data: {
						music_input: sname,
						music_filter: 'name',
						music_type: this.platKey
					},
					success: (res) => {
						res.data.code === 200 ? this.songList = res.data.data : uni.showToast({
							title: res.data.error+"切换其他频道试试吧(〃'▽'〃)",
							icon: 'none',
							duration:3000
						});
					},
					fail: (error) => {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			//歌名搜索
			searchIcon(e) {
				let key = e.detail.value.toLowerCase();
				let list = this.name;
				for (let i = 0; i < list.length; i++) {
					let a = key;
					let b = list[i].title.toLowerCase();
					if (b.search(a) != -1) {
						list[i].isShow = true
					} else {
						list[i].isShow = false
					}
				}
				this.name = list
			},
			diange(e) {
				this.now = e.songid
				this.modalName = null
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},

			changeLang() {
				// this.$store.commit('changeLang')
			},

			changeTheme(e) {
				this.themeList = []
				for (let i = 0; i < ColorList.length; i++) {
					let random = Math.floor(Math.random() * ColorList.length)
					let item = ColorList[random]
					this.themeList.indexOf(item) === -1 && this.themeList.push(item)
					if (this.themeList.length > 5) break
				}
				this.modalName = e.currentTarget.dataset.target
			},
			RadioChange(e) {
				let name = e.detail.value
				let obj = this.themeList.filter(item => {
					return item.name === name
				})
				// this.$store.commit('setThemeColor', obj[0])
				this.modalName = ''
			},

		},
	}
</script>

<style lang="less">
	page {
		background-color: #000000;
	}

	.setting {
		margin-right: 30rpx;
		color: #fff;
		background-color: #4d4858;
	}

	.content {
		padding: 20rpx;
	}

	.search-bar {
		border-radius: 20rpx 20rpx 0 0;
	}

	.content1 {
		height: 100%;
		padding: 20rpx;
		border-radius: 0 0 20rpx 20rpx;
		overflow: auto;
	}

	.rowline {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.list {
		font-size: 28rpx;
		line-height: 88rpx;
		padding: 0 20rpx;
		background: #1c1d27;
		border-radius: 10rpx;
		margin-top: 10rpx;
		color: #fff;
		text-align: left;
		display: flex;
		align-items: center;

		image {
			height: 60rpx;
			width: 60rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		text {
			flex: 1;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.btn {
			height: 60rpx;
			width: 60rpx;
			border-radius: 50%;
			text-align: center;
			line-height: 60rpx;
			font-weight: bold;
			font-size: 60rpx;
			color: #FFFFFF;
			background-image: linear-gradient(45deg, #ec008c, #6739b6);
			opacity: .8;

			&.cute {
				font-size: 70rpx;
				background-image: linear-gradient(45deg, #ff9700, #ed1c24);
			}
		}

	}

	.active {
		background: #169af3;
		color: #fff;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60rpx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		/* background-color:#f1f1f1 ; */
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100rpx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50rpx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64rpx;
		height: 64rpx;
		line-height: 64rpx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10rpx;
		height: 10rpx;
		background-color: currentColor;
		position: absolute;
		bottom: 10rpx;
		border-radius: 10rpx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}

	.margin-xl {
		margin-bottom: 100rpx;
	}

	.btn {
		position: relative;
		/* margin-top: 20rpx; */
		width: 48%;
		border: 0rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		font-size: 30rpx;
		height: 64rpx;
		line-height: 1;
		text-align: center;
		text-decoration: none;
		overflow: visible;
		transform: translate(0rpx, 0rpx);
	}
</style>
