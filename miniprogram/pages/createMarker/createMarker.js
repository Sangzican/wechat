// miniprogram/pages/createMarker/createMarker.js
let marker_title
let marker_phone
let marker_msg
const db = wx.cloud.database()
const { $Message } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/biaoji.bmp',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrl: '',
    openid: '',
    id: '',
    username: '',
    marker_title: '',
    marker_phone: '',
    marker_msg: '',
    marker_longitude: '',
    marker_latitude: '',
  },
  handleSuccess () {
    $Message({
        content: '刷新成功',
        type: 'success'
    });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //23333
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                username: res.userInfo.nickName
              })
            }
          })
        }
      }
    })

    this.onGetOpenid();

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          marker_longitude: res.longitude,
          marker_latitude: res.latitude,
        })
      }
    })
    // that.myMapContext.moveToLocation();
    wx.stopPullDownRefresh()
  },
  //页面刷新
  onPullDownRefresh: function () {
    var that=this
    this.onLoad()
    setTimeout(function () {
      //要延时执行的代码     
      that.handleSuccess()
    }, 1000)
  },
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.setData({
          openid: res.result.openid
        })
        // app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
        // console.log(this.data.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    let that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'markers_img/' + that.data.openid + 'marker_image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            // 显示上传成功后的摊位图片
            that.setData({
              imgUrl: res.fileID
            })

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            // 更新用户数据
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 获取输入内容并放入data
  getmarker_msg: function (e) {
    marker_msg = e.detail.detail.value
  },
  getmarker_title: function (e) {
    marker_title = e.detail.detail.value
  },
  getmarker_phone: function (e) {
    marker_phone = e.detail.detail.value
  },
  // 上传摊点信息
  uploadMarker: function () {
    let that = this;
    db.collection('users').where({
        _openid: this.data.openid
      })
      .get({
        success: function (res) {
          that.setData({
            id: res.data[0]._id,
          })
        },
        fail: function (res) {
          console.log("查询失败")
        }
      })

    // 更新用户身份
    wx.cloud.callFunction({
      name: 'changeUserType',
      data: {
        openid: that.data.openid,
        usertype: "摊主"
      },
      success: res => {
      },
      fail: err => {
        console.error('[云函数] [changeUserType] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

    this.setData({
      marker_title: marker_title,
      marker_phone: marker_phone,
      marker_msg: marker_msg
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'uploadMarker',
      data: {
        imgUrl: that.data.imgUrl,
        openid: that.data.openid,
        username: that.data.username,
        marker_title: that.data.marker_title,
        marker_phone: that.data.marker_phone,
        marker_msg: that.data.marker_msg,
        marker_longitude: that.data.marker_longitude,
        marker_latitude: that.data.marker_latitude,
      },
      success: res => {
        console.log('[云函数] [uploadMarker] user openid: ', res.result.openid)
        // 提示用户上传成功
        wx.showToast({
          title: '创建成功',
        })
        // 创建成功后跳转页面
        // 但是它不跳啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
        wx.switchTab({
          url: '../mine/mine',
        })
      },
      fail: err => {
        console.error('[云函数] [uploadMarker] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

})