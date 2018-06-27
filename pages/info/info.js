// pages/info/info.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {
        theme:'这是主题',
        date:'2018-06-27',
        image:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png',
        detail:'https://mp.weixin.qq.com/s/vzIVLBOebABfV4KAuyYKjw'
      },{
        theme:'这是主题',
        date:'2018-06-27',
        image:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png',
        detail:'https://mp.weixin.qq.com/s/vzIVLBOebABfV4KAuyYKjw'
      }
    ],
    selectedItem:0
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
   *  查看动态的详情
   */
  showDetail:function(res){
    let url = res.currentTarget.dataset.url;
    app.globalData.info_web_view = url;
    wx.navigateTo({
      url:'webPage'
    });
  },
  /**
   *  切换导航
   */
  turnNavi:function(res){
    let path = res.currentTarget.dataset.url;
    let that = this;
    let id = res.currentTarget.dataset.id;
    this.setData({
      selectedItem:id
    });
    wx.request({
      url:'http://localhost:8080/smallProject/info.do?path=' + path,
      success:function(response){
        let items_ = response.data.data;
        that.setData({
          items:items_
        });
      }
    })
  }
})