// 云函数入口文件
const cloud = require('./node_modules/wx-server-sdk')
cloud.init();
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    //order
      return await db.collection('Markers').where({
      //下面为筛选条件
      id: event.id,
    }).get({
      success: function (res) {
        console.log(res);
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}