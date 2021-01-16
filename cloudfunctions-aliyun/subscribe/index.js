/*
 * @Descripttion: 
 * @version: 
 * @Author: zhouying
 * @Date: 2020-12-18 14:18:41
 * @LastEditors: zhouying
 * @LastEditTime: 2020-12-18 16:27:47
 */
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,  
	  page: 'pages/getCoupon/getCoupon',
	  lang: 'zh_CN',  
	  data: {
	      thing1: {
	        value: event.title
	      },
	      thing2: {
	        value: event.content
	      }
	  },
      
      templateId: "8e8GC_agCXbThLDSzQ74UdEdznAy94e7vfY23bdAY5g"
	 
  
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
} 