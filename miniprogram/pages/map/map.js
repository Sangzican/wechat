// miniprogram/pages/map/map.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '../../pages/map/map',
    markers: [],
    marker: {},
    showModal: false,
  },
  handleChange ({ detail }) {
    this.setData({
        current: detail.key
    });
},
  // 获取单个marks标记
  getMarks(markerId) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getMarkById',
      data: {
        id: markerId,
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log(res.result.data[0].title);
        let marker = res.result.data[0];
        that.myMapContext.moveToLocation({longitude: marker.longitude, latitude: marker.latitude});
        that.setData({
          marker: marker,
        });
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [getMatkById] 调用失败：', err)
      }
    })
  },
  // 获取周围的摊点标记组
  getAroundMarkers() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getAroundMarkers',
      data: {
        
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res.result.data);
        that.setData({
          markers: res.result.data,
        }
        )
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [getMatkById] 调用失败：', err)
      }
    })
  },
  getLocation: function() {      //获取当前位置，并移动地图到当前位置
    this.myMapContext.moveToLocation();
  },
  // 点击控件调用方法
  mapControlTap: function() {
    console.log("点击");
    getLocation();
  },
  // 点击其他标记后地图中心转移到标记位置 --> PC上测试有问题，但是手机上暂时没有
  clickMarkTap: function(e) {
    console.log(e.markerId);
    // 获取点击的Marker信息并将其位置移至视觉中心
    this.getMarks(e.markerId);
    let marker = this.data.marker;
    console.log(marker);
    this.showCard();
  },
  // 显示/隐藏摊点信息卡片
  showCard: function() {
    this.setData({showModal: true});
  },
  hideCard: function() {
    this.setData({showModal: false});
  },
  preventTouchMove: function() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myMapContext = wx.createMapContext('newmap', this);
    // 中心点偏移 会出错，好像是版本问题，暂时不要调用
    // this.myMapContext.setCenterOffset([0.6, 0.5]);
    // this.getLocation();
    let that = this;
    this.getAroundMarkers();
    
    wx.getLocation({
      type: 'gcj02',
      //altitude: 'altitude',
      success: function (res) {
        console.log("经度：" + res.longitude);
        console.log("纬度：" + res.latitude);
        that.setData({
          setting: {
            longitude: res.longitude,
            latitude: res.latitude,
          },
          // markers: markers,
        })
      }
    })
    this.myMapContext.moveToLocation();
  },
  //搜索功能
  searchEvent(e){
  	console.log("用户搜索"+e.detail)
    setTimeout(()=>{
      wx.hideLoading();
    },1000)
  },
  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  //  onShow: function () {
  //  },
  //  onShow: function () {
  //  },

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

  // },
  
})
