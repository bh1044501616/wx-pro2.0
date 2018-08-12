// pages/personal/myticket/myticket.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myticket:{},
    payMentDisplay:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将app.js的用户信息保存
    this.setData({
      myticket:app.globalData.myticket
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;

    //保存用户数据到本地
    wx.setStorageSync('myticket',that.data.myticket);
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
  
  },
  /*
    支付
  */
  pay:function(){
    let _payMentDisplay = this.data.payMentDisplay;
    if(_payMentDisplay == 'none'){
      this.setData({
        payMentDisplay:''
      })
    }else{
      this.setData({
        payMentDisplay:'none'
      })
    }
  }
})