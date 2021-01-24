const cache = {
	set(data, toJson = true) {
		toJson && (data = JSON.stringify(data))
		return uni.setStorageSync(this.key, data)
	},
	get(forJson = true) {
		let res = uni.getStorageSync(this.key)
		return forJson ? (res ? JSON.parse(res) : null) : res
	},
	del() {
		return uni.removeStorageSync(this.key)
	}
}

//音乐缓存
export const musicCache = {
	key: 'GAN_FAN_MUSIC_KEY_CACHE',
	...cache
}
