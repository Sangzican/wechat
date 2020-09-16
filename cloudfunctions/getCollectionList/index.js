// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
// 获取在首页点击摊点后获取是否在用户收藏列表里
exports.main = async (event, context) => {
  return await db.collection('users').where({
    _openid: event._openid,
    marker_collections: event._id
  }).get();
}