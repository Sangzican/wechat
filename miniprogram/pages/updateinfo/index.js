// pages/userinfo/index.js
let app = getApp
const db = wx.cloud.database()
let username = ''
let tel = ''
let addr = ''
Page({
  data: {
    id: '',
    openid: '',
    username: '',
    tel: '',
    addr: '',
    usertype: ''
  },
  //查询用户信息
  getUser() {
    var that = this;
    db.collection('users').where({
        _openid: this.data.openid
      })
      .get({
        success: function (res) {
          that.setData({
            id: res.data[0]._id,
            username: res.data[0].username,
            tel: res.data[0].tel,
            addr: res.data[0].addr,
            usertype: res.data[0].usertype
          })
        },
        fail: function (res) {
          console.log("查询失败")
        }
      })
  },
  //获取修改值
  upname(event) {
    username = event.detail.value
  },
  uptel(event) {
    tel = event.detail.value
  },
  upaddr(event) {
    addr = event.detail.value
  },
  //修改用户信息
  updateInfo() {
    db.collection('users').doc(this.data.id).update({
      data: {
        username: username,
        tel: tel,
        addr: addr
      },
      success(res){
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(res) {
        console.log("修改失败！")
      }
    })
  },
  //获取openid
  getopenid() {
    var that = this;
    wx.cloud.callFunction({
      name: "getopenid",
      success(res) {
        that.setData({
          openid: res.result.openid
        })
      },
      fail(res) {
        console.log("获取失败！", res)
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    that.getopenid();
    that.getUser();
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        var addr = 'userInfo.city';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
          [addr]: res.userInfo.city,
        })
      }
    })
  }

})