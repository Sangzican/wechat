// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  try {
      return await db.collection('Markers').where({
      //下面为筛选条件
      title: {
        $regex: '.*' + event.title + '.*',  // 正则表达式
        $options: 'i' // //$options:'1' 代表这个条件不区分大小写
      }
    }).get({
      success: function (res) {
        console.log(res)
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}