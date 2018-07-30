//app.js

App({
  data:{
    width:0,
    height:0
  },
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.width = wx.getSystemInfoSync().windowWidth
    this.globalData.height = wx.getSystemInfoSync().windowHeight
    this.data.width = wx.getSystemInfoSync().windowWidth
    this.data.height = wx.getSystemInfoSync().windowHeight

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onError: function(msg) {
    console.log(msg)
  },
  globalData: {
    width:0,
    height:0,
    title:"首页",
    info_web_view:'',
    staticUrl:/*'http://39.107.227.165/wx/'*/'http://localhost:8080/smallProject1.0/'
  }
})