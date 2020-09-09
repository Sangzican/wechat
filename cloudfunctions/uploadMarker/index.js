// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const countResult = await db.collection('Markers').count()
  const total = countResult.total
  db.collection('Markers').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      id: total+1,
      user_openid: event.openid,
      user_name: event.username,
      title: event.marker_title,
      marker_phone: event.marker_phone,
      marker_msg: event.marker_msg,
      longitude: event.marker_longitude,
      latitude: event.marker_latitude,
      imgUrl: event.imgUrl,
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}