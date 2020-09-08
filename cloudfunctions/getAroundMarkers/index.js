// 云函数入口文件
const cloud = require('./node_modules/wx-server-sdk')
cloud.init();
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  //let marker1, marker2;
  try {
    //order
    return await db.collection('Markers').where({
    //下面为筛选条件 lt = <, gt = >
    latitude: _.lt(40),
    latitude: _.gte(35),
    }).get();
  } catch (e) {
    console.error(e);
  }
}