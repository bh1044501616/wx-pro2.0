// pages/index/position/position.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 地图*/
    /*地图上下文*/
    mapContext:{},
    position:{
      latitude:39.90,
      longitude:116.38
    },
    markers: [{
      iconPath: "images/marker.png",
      id: 0,
      latitude:40.044666,
      longitude:116.299267,
      width: 50,
      height: 42,
      alpha:0.95,
      width:18,
      height:28
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.setNavigationBarTitle({
      title:'会议地点'
    });
    //绑定map组件上下文
    that.data.mapContext = wx.createMapContext('map');
    that.data.mapContext.moveToLocation();
    that.loadMap();
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
  /** 地图*/
  /*加载地图初始化信息*/
  loadMap:function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        that.setData({
          position:{
            latitude:res.latitude,
            longitude:res.longitude
          }
        })
      }
    });
  },
})