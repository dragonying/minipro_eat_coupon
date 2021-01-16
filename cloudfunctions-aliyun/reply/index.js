// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
   //设置输入状态
     await cloud.openapi.customerServiceMessage.setTyping({
        touser: OPENID,
        command: 'Typing'
      })
   if (event.Content == 1) {
	   const qunimg = await cloud.downloadFile({
	         fileID: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-ajnunstyegeqcf2b9c/0c0f5c90-4129-11eb-bc56-c9cea619f663.png",
	     })
	   
      //上传图片素材到媒体库，并获取到图片id
        const qunmedia = await cloud.openapi.customerServiceMessage.uploadTempMedia({
          type: 'image',
          media: {
            contentType: 'image/png',
            value: qunimg.fileContent
          }
        })
        //向用户发送群二维码
        await cloud.openapi.customerServiceMessage.send({
          touser: OPENID,
          msgtype: 'image',
          image: {
            mediaId: qunmedia.mediaId,
          }
        })
    
    
      
    } else {
    await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'text',
      text: {
        content: '已收到！需要人工服务请回复1'
      }
    });
  }
  
  //取消状态设置
  cloud.openapi.customerServiceMessage.setTyping({
    touser: OPENID,
    command: 'CancelTyping'
  })
  return 'success';
};