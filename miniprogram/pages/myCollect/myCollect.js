// miniprogram/pages/myCollect/myCollect.js
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color:"#FFB800",
    openid: '',
    markers: [],
    isNull: true
  },
  handleSuccess () {
    $Message({
        content: '刷新成功',
        type: 'success'
    });
},
  getOpenid: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        console.log(that.data.openid)
        that.getCollections()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  //根据用户openid获取用户的收藏摊点
  //用户收藏摊点的_id并放入自己的marker_collections数组中
  getCollections: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getCollection',
      data: {
        _openid: that.data.openid
      },
      success: res => {
        console.log(res.result)
        that.setData({
          markers: res.result.data
        })
        if(that.data.markers.length > 0)
          that.setData({
            isNull: false
          })
        console.log(that.data.markers)
        console.log(that.data.markers.length)
      },
      fail: err => {
        console.error('[云函数] [getCollection] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //view
          className_height: res.windowHeight / that.data.markers.length,
        })
      }
    }) 
    wx.stopPullDownRefresh()
  },
  handleClick(){
    this.setData({
      color:"#80848f"
    })
    //************************************************************************************** */
  },
  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {
    
  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  onPullDownRefresh: function () {
    var that=this
    this.onLoad()
    setTimeout(function () {
      //要延时执行的代码     
      that.handleSuccess()
    }, 1000)
  },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})