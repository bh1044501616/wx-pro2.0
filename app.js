//app.js

App({
  data:{
    width:0,
    height:0
  },
  globalData: {
    width:0,
    height:0,
    title:"首页",
    info_web_view:'',
    staticUrl:'https://www.psnhub.club/wx/'/*'http://localhost:8080/smallProject1.0/'*/,
    userInfo:{},
    tempUserInfo:{},
    myticket:{},
    //验证过的二维码列表
    checkList:[],
    /*schedule页面的下载相关变量*/
    downloadingList:[],
    downloadedList:[]
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
   /* wx.login({
      success:function(res){
        console.log(res.code);
        wx.request({
          url:that.globalData.staticUrl + 'ticket/login.do',
          method:'POST',
          header:{
            'content-type':'application/x-www-form-urlencoded' 
          },
          data:{
            'code':res.code
          },
          success:function(){

          }
        });
      }
    })*/
    // 获取用户信息
    /*wx.authorize({
        scope: 'scope.record',
        success() {
            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            wx.startRecord()
            wx.getUserInfo({
              success:function(res){
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                console.log(res.userInfo)

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
        }
    })*/

    //加载缓存（同步加载）
    let _myticket = wx.getStorageSync('myticket');
    this.globalData.myticket = _myticket;
    let _userInfo = wx.getStorageSync('userInfo');
    this.globalData.userInfo = _myticket;
    //加载本地存储的  二维码 检测过的列表
    let _checkList = wx.getStorageSync('checkList');
    this.globalData.checkList =  _checkList;
  },
  onError: function(msg) {
    console.log(msg)
  }
})