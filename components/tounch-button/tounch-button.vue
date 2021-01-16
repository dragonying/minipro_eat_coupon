<template>
	<view>
		<movable-area>
		
			<movable-view  :x="x" :y="y1" direction="all">
				<button  class="selfbutton cuIcon-share" style="font-size: 60rpx; color: #39B54A;" open-type="share">
						
				</button>
				
			</movable-view>
		
		
		</movable-area>
	<!-- 	<movable-area>
		  <movable-view :x="x" :y="y2" direction="all">
		   
			<button  class="selfbutton cuIcon-service" style="font-size: 60rpx;" open-type="contact">
		
			</button>
		  </movable-view>
		</movable-area> -->
	</view>
	
</template>

<script>
	const { windowWidth, windowHeight } = uni.getSystemInfoSync();
	export default {
		data() {
			return {
				 x:windowWidth,
				 y1:windowHeight,
				 y2:windowHeight-120,
				

			}
			},
			onShareAppMessage(res) {
				var messages = [{
					title: '美团饿了么大额红包，每日可领！',
					path: '/pages/getCoupon/getCoupon'
				},{
					title: '吃了这么多年外卖，你知道这个秘密吗？',
					path: '/pages/getCoupon/getCoupon'
				}];
				return messages[Math.floor(Math.random()*messages.length)];
			},
			methods:{
				 share(){
					
				  }
			}
			}
</script>

<style scoped>
	movable-area{
	  position: fixed;
	  width: 100%;
	  height: 100%;
	  left: 0rpx;
	  top: 0rpx;
	  z-index: 99;
	  pointer-events: none;
	}
	.selfbutton{
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		line-height: 80rpx;
		
		}
	movable-view{
	  width: 80rpx;
	  height: 80rpx;
	  border-radius: 80rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  background-color: #fff;
	  border: 1rpx solid rgba(153, 153, 153, 1);
	  pointer-events: auto;
	}
</style>

