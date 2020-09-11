// miniprogram/pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = new Array();
    var location1 = { name: "1" };
    var location2 = { name: "2" };
    var location3 = { name: "3" };
    var location4 = { name: "4" };
    var location5 = { name: "5" };
    var location6 = { name: "6" };
    arr.push(location1);
    arr.push(location2);
    arr.push(location3);
    arr.push(location4);
    arr.push(location5);
    arr.push(location6); 
    console.log("OK");
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //view
          className_height: res.windowHeight / arr.length,
          //btn
          array: arr,
        })
      }
    }) 
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