// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 调用数据库API，必须在inti之后
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.usertype === "摊主") {
    db.collection('users').where({
      _openid: event.openid
    }).update({ 
      data: {
        usertype: "摊主",
        done: true
      },
      success(res) {
        console.log(res)
        console.log('修改成功')
      },
      fail(res) {
        console.log("修改失败！")
      }
    })
  }else {
    db.collection('users').where({
      _openid: event.openid
    }).update({ 
      data: {
        usertype: "普通用户",
        done: false
      },
      success(res) {
        console.log(res)
        console.log('修改成功')
      },
      fail(res) {
        console.log("修改失败！")
      }
    })
  }
}