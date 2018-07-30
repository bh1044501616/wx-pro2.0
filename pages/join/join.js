// pages/join/join.js.
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animations:new Array(4),
    moved:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this

    let animation = wx.createAnimation({
      delay: 0,
      duration:0
    });
    animation.translate(0).step();

    let animations_ = that.data.animations;
    animations_[that.data.moved] = animation.export();
    this.setData({
      animations:animations_
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
  /**
   * 页面跳转
   */
  turnPage:function(arg){
    let that = this;
    let url = arg.currentTarget.dataset.url;
    let index = arg.currentTarget.dataset.index;
    that.data.moved = index;
    let animations_ = that.data.animations;

    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: "ease",
      delay: 0
    });
    animation.translate(500).step();

    animations_[index] = animation.export();
    that.setData({
      animations:animations_
    });
    app.globalData.info_web_view = url;
    wx.navigateTo({
      url:'../webPage'
    });
  },
  /*
    跳转页面
  */
  naviTo:function(arg){
    let url = arg.currentTarget.dataset.url;

    wx.navigateTo({
      url:url
    });
  }
})