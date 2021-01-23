<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhouying
 * @Date: 2020-12-13 20:45:21
 * @LastEditors: zhouying
 * @LastEditTime: 2020-12-13 21:01:17
-->
<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		api: {
			home: 'https://eb63f7cf-573f-4070-a944-d5ac57d4acfa.bspapp.com/http/api/home'
		},
	}

};
</script>

<style lang="scss">
@import "colorui/main.css";
@import "colorui/icon.css";
@import "iconfont/iconfont.css";
page{
  height: 100%;
  -webkit-overflow-scrolling : touch;
}

</style>
