// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
// 获取用户收藏列表中的摊点信息
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  let user = db.collection('users').where({
    _openid: event._openid
  }).get();
  console.log((await user).data[0].marker_collections)
  let marker_collections = (await user).data[0].marker_collections;
  try {
    return await db.collection('Markers').where({
    //下面为筛选条件 lt = <, gt = >
    _id: _.in(marker_collections)
    }).get();
  } catch (e) {
    console.error(e);
  }
}