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
			home: 'https://b0dd3fd3-6730-46ef-ab16-a0f3afe83bc1.bspapp.com/http/api/home'
		},
	}

};
</script>

<style lang="scss">
@import "colorui/main.css";
@import "colorui/icon.css";
page{
  height: 100%;
  -webkit-overflow-scrolling : touch;
}

</style>
