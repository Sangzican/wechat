// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入request-promise用于做网络请求
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let url = "https://v1.alapi.cn/api/lajifenlei?name="+encodeURIComponent(event.laji);
  return await rp(url)
    .then(function (res) {
      // res's type is string
      var jsonObj = JSON.parse(res);
      console.log(typeof jsonObj.data);
      var type = "";
      switch(jsonObj.data[0].type){
        case 1:
          type = "可回收";
          break;
        case 2:
          type = "有害";
          break;
        case 3:
          type = "厨余";
          break;
        case 4:
          type = "其他";
          break;
        default:
          console.log("出错");
          type = "";
      }
      return {
        "name": jsonObj.data[0].name,
        "type": type,
        "explain": jsonObj.data[0].explain
      };
      // type: res.data.type,
      // explain: res.data.explain,
      //return res.data.name;
    })
    .catch(function (err) {
        // Crawling failed...
        return {res: err}
    });
  
}

