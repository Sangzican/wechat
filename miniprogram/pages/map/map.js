// miniprogram/pages/map/map.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    current: '../../pages/map/map',
    markers: [],
    marker: {},
    showModal: false,
  },
  handleChange({
    detail
  }) {
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
        that.myMapContext.moveToLocation({
          longitude: marker.longitude,
          latitude: marker.latitude
        });
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
        })
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
  getLocation: function () { //获取当前位置，并移动地图到当前位置
    this.myMapContext.moveToLocation();
  },
  // 点击控件调用方法
  mapControlTap: function () {
    console.log("点击");
    getLocation();
  },
  // 点击其他标记后地图中心转移到标记位置 --> PC上测试有问题，但是手机上暂时没有
  clickMarkTap: function (e) {
    console.log(e.markerId);
    // 获取点击的Marker信息并将其位置移至视觉中心
    this.getMarks(e.markerId);
    let marker = this.data.marker;
    console.log(marker);
    this.showCard();
  },
  // 显示/隐藏摊点信息卡片
  showCard: function () {
    this.setData({
      showModal: true
    });
  },
  hideCard: function () {
    this.setData({
      showModal: false
    });
  },
  preventTouchMove: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
            }
          })
        } else { //未授权，跳到授权页面
          this.setData({
            isHide: true
          })
        }
      }
    });
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
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      db.collection("users").add({
        data: {
          username:e.detail.userInfo.nickName,
          addr:e.detail.userInfo.province+e.detail.userInfo.city,
          tel: '',
          usertype:'普通用户',
          done: false
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res.detail.nickName)
        }
      })

      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  //搜索功能
  searchEvent(e) {
    console.log("用户搜索" + e.detail)
    setTimeout(() => {
      wx.hideLoading();
    }, 1000)
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