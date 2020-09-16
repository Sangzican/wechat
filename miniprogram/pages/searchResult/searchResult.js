// miniprogram/pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchTitle: '',
    markers: [],
    isNull: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchTitle: options.searchTitle
    },this.getSearch(options.searchTitle) // setData引起的界面更新渲染完毕后的回调函数
    )
    
  },
  // 通过tittle来搜索并返回markers数组
  getSearch(title) {
    console.log(title)
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMarkersByTitle',
      // 传给云函数的参数
      data: {
        title: title
      },
      success: function(res) {
        console.log(res.result.data)
        if(res.result.data.length > 0){
          that.setData({
            isNull: false,
            markers: res.result.data
          })
        }else {
          // 如果搜索为空设置isNull为true
          that.setData({
            isNull: true
          })
        }
      },
      fail: console.error
    })
  }
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
  // onPullDownRefresh: function () {

  // },

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