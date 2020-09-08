// pages/userinfo/index.js
let app = getApp
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        username:'',
        tel:'',
        addr:'',
        usertype:''

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
  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        that.getopenid();
        that.getUser();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})