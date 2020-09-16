// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  try{
    await db.collection('users').where({
      _openid: event.openid
    }).update({
      data: {
        marker_collections: _.pull(event._id)
      }
    })
  } catch (e) {
    console.error(e);
  }
}