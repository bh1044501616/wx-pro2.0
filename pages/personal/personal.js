// pages/personal/personal.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myticket:{},
    userInfo:{},
    modelDisplay:'',
    qrCodeDisplay:'none',
    checkListDisplay:'none',
    checkList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    that.setData({
      myticket:app.globalData.myticket,
      userInfo:app.globalData.userInfo,
      //加载验证过的列表
      checkList:app.globalData.checkList
    });
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
    //返回该页面后重新渲染
    this.setData({
      myticket:app.globalData.myticket,
      userInfo:app.globalData.userInfo
    });
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
  
  },
  /*
    页面跳转
  */
  turnPage:function(res){
    let _url = res.currentTarget.dataset.url;
    if(_url != ''){
      wx.navigateTo({
        url:_url
      });
      return;
    }
    //获取app中存储的用户信息
    let _myticket = app.globalData.myticket;

    //根据ap中用户的信息进行判断 将要跳转的页面
    if(_myticket.name === undefined){
      //没有存储用户信息
      wx.navigateTo({
        url:"login/login"
      });
    }else{
      //有存储用户信息，直接跳转到信息页面
      wx.navigateTo({
        url:"myticket/myticket"
      });
    }
  },
  /**购票咨询--makeACall*/
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber:'13681206054'
    });
  },
  /*
    点击模态框按钮后的动作
  */
  buttonEvent:function(){

    //获取用户信息
    wx.getUserInfo({
      success:function(userInfo){
        let _userInfo = app.globalData.userInfo;

        if(_userInfo.nickName != userInfo.nickName && _userInfo.avatarUrl != userInfo.avatarUrl){
          //如果信息不一致说明用户更改，清空本地数据，保证数据安全
          wx.clearStorageSync();

          //保存userInfo到app
          app.globalData.userInfo = userInfo;

          //保存userInfo到本地
          wx.setStorageSync('userInfo',userInfo);
        }
      }
    });
    this.setData({
      modelDisplay:'none'
    });
  },
  /*
    查看二维码
  */
  checkQrCode:function(){
    let display = this.data.qrCodeDisplay;
    if(display == ''){
      this.setData({
        qrCodeDisplay:'none'
      });
    }else{
      this.setData({
        qrCodeDisplay:''
      });
    }
  },
  /*
    验证二维码
  */
  verifyQrCode:function(){
    var that = this;

    wx.scanCode({
      scanType:'qrCode',
      success:function(res){
        let result = res.result;

        wx.request({
          url:app.globalData.staticUrl + 'ticket/check.do?phone=' + result,
          header:{
            'content-type':'application/json'
          },
          method:'GET',
          success:function(res){
            let state = res.data.state;

            if(!state){
              wx.showToast({
                title:res.data.message,
                duration:2000,
                icon:'none'
              });
            }else{
              //验证成功
              wx.showToast({
                title:'验证通过',
                duration:1000,
                icon:'success'
              });

              //保存刚才验证的号码到列表
              var _checkList = that.data.checkList;
              if(_checkList.length == 0){
                //如果列表为空，则创建新的数据对象
                _checkList = new Array();
              }
              _checkList.push(result);

              that.setData({
                checkList:_checkList
              });
              //保存列表到本地
              wx.setStorageSync('checkList',_checkList);
            }
          },
          fail:function(){
            wx.showToast({
              title:'网络繁忙,请稍后重试',
              duration:2000,
              icon:'loading'
            });
          }
        })
      }
    });
  },
  /*
    显示验证过的二维码列表
  */
  showCheckList:function(){
    let that = this;

    let _checkListDisplay = that.data.checkListDisplay;
    if(_checkListDisplay == ''){
      that.setData({
        checkListDisplay:'none'
      });
    }else{
      that.setData({
        checkListDisplay:''
      });
    }
  }
})