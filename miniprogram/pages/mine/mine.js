let app = getApp
const db = wx.cloud.database()
const {
  $Message
} = require('../../dist/base/index');
Page({
  data: {
    showModal: false,
    isHide: true,
    openid: '',
    id: '',
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ],
    //用户个人信息
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    usertype: '普通用户'
  },
  handleSuccess() {
    $Message({
      content: '刷新成功',
      type: 'success'
    });
  },
  deluser: function () {
    this.setData({
      showModal: true
    })
  },
  hideCard: function () {
    this.setData({
      showModal: false
    });
  },
  getMarkerByUser: function () {
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMarkerByUser',
      // 传给云函数的参数
      data: {
        openid: that.data.openid
      },
      success: function (res) {
        console.log(res.result)
        if(res.result?.data[0]?._id != undefined)
        that.setData({
          id: res.result.data[0]._id
        })
        if(res.result.data.length < 1){
          that.setData({
            usertype: "普通用户",
            isHide: true
          })
          that.changeUserType("普通用户")
        }else {
          that.setData({
            usertype: "摊主",
            isHide: false
          })
          that.changeUserType("摊主")
        }
        console.log(that.data.usertype)
      },
      fail: function (res) {
        // console.error
        that.setData({
          usertype : "普通用户",
          isHide: true
        })
        that.changeUserType("普通用户")
      }
    })
  },
  // 修改用户类型
  changeUserType: function(usertype) {
    console.log("开始调用changeUserType函数")
    let that = this
    wx.cloud.callFunction({
      name: 'changeUserType',
      data: {
        openid: that.data.openid,
        usertype: usertype
      },
      success: res => {
        console.log('[云函数] [changeUserType] 调用成功 ')
      },
      fail: err => {
        console.error('[云函数] [changeUserType] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  // 注销
  removeuser:function(){
    let that=this;
    console.log(that.data.id)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'removeUser',
      // 传给云函数的参数
      data: {
        _openid: that.data.openid,
        _id: that.data.id
      },
      success: function (res) {
        console.log(res.result)
        console.log('注销成功')
        that.setData({
          showModal: false
        })
        wx.showToast({
          title: '注销成功',
          icon: 'success',
          duration: 2000
         })
         // 更新用户身份
         that.setData({
           usertype: "普通用户",
           isHide: true
         })
         that.changeUserType("普通用户")
      },
      fail: console.error
    })
  },

  //获取openid
  getopenid() {
    var that = this;
    wx.cloud.callFunction({
      name: "getopenid",
      success(res) {
        console.log('success')
        that.setData({
          openid: res.result.openid
        })
        that.getMarkerByUser();
      },
      fail(res) {
        console.log("获取失败！", res)
      }
    })
  },
  /**
   *点击添加地址事件
   */
  add_address_fun: function () {
    wx.navigateTo({
      url: 'add_address/add_address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    let that = this;
    this.getopenid();
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
    //查询用户表，判断是否为摊主  
    // 因为更新数据库的代码有问题，所以用户是否为摊主由查询用户拥有摊点数量来判断
    // db.collection('users').where({
    //     _openid: this.data.openid
    //   })
    //   .get({
    //     success: function (res) {
    //       if (res.data[0].usertype === '摊主') {
    //         that.setData({
    //           isHide: false,
    //           usertype: '摊主'
    //         })
    //       }
    //     },
    //     fail: function (res) {
    //       console.log("查询失败！")
    //     }
    //   })
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    var that=this
    this.onLoad()
    setTimeout(function () {
      //要延时执行的代码     
      that.handleSuccess()
    }, 1000)
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