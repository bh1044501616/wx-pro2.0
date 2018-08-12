// pages/personal/login/login.js
var app = getApp();

const GRAY = 'e5e5e5';
const BLUE = '00a4db';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formInputBorderColor:[GRAY,GRAY]
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
  /*
    改变表单边框颜色
  */
  changeInputBorder:function(res){
    let id = res.currentTarget.dataset.id;

    let _formInputBorderColor = this.data.formInputBorderColor;

    _formInputBorderColor[id] = _formInputBorderColor[id] == GRAY ? BLUE : GRAY;
    this.setData({
      formInputBorderColor:_formInputBorderColor
    });
  },
  /*
    转到注册页面
  */
  toSignin:function(){
    wx.navigateTo({
      url:'../sign/sign'
    })
  },
  /*
    登陆
  */
  login:function(res){
    let value = res.detail.value;

    wx.request({
        url:app.globalData.staticUrl + 'ticket/loginin.do',
        method:'POST',
        header:{
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data:value,
        success:function(res){
          let state = res.data.state;

          if(!state){
            wx.showToast({
              title:res.data.message,
              duration:2000,
              icon:'none'
            });
          }else{
            app.globalData.myticket = res.data.data

            wx.navigateTo({
              url:'../myticket/myticket'
            });
          }
        },
        fail:function(){
          wx.showToast({
            title:'网络繁忙',
            duration:2000,
            icon:'none'
          });
        }
      });  
  },
  /*
    微信登陆
  */
  wxLogin:function(){
    wx.getUserInfo({
      success:function(res){
        console.log(res);
      }
    });
  }
})