// pages/sponsor/sponsor.js
var app = getApp();
const URL = app.globalData.staticUrl;
const SPONSORS_URL = URL + 'sponsor/load.do';
const ANTISTOPS_URL = URL + 'sponsor/antistop.do';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    antistops:[],
    contents:[],
    antistopsStr:new Array(),
    searchPanelAnimation:{},
    searchPanelDisplay:'none',
    width:app.data.width
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取所有关键字
    wx.request({
      url:ANTISTOPS_URL,
      success:function(res){
        let list = res.data.data;

        that.setData({
          antistops:list
        });
      }
    })
    wx.request({
      url:SPONSORS_URL,
      success:function(res){
        let list = res.data.data;

        that.setData({
          contents:list
        });
      }
    })
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
    详细搜索
  */
  detailSearch:function(res){
    let that = this;
    let antistop = res.currentTarget.dataset.antistop;
    let index = res.currentTarget.dataset.index;
    let antistops_ = that.data.antistops;
    let antistopsStr_ = that.data.antistopsStr;

    if(antistops_[index].state == 1){
      antistops_[index].state = 0;
      for(let i=0;i<antistopsStr_.length;i++){
        if(antistop == antistopsStr_[i]){
          antistopsStr_.splice(i,1);
        }
      }
    }else{
      antistops_[index].state = 1;
      antistopsStr_.push(antistop);
    }

    
    

    wx.request({
      url:SPONSORS_URL,
      data:{
        'antistopsStr':antistopsStr_
      },
      success:function(res){
        let list = res.data.data;

        that.setData({
          contents:list,
          antistopsStr:antistopsStr_,
          antistops:antistops_
        });
      }
    })
  },
  /*
    显示关键字列表面板
  */
  showPanel:function(){
    //关闭了动画效果
    /*let animation = wx.createAnimation({
      duration:400,
      delay:0
    });
    animation.translateY(-app.data.width*0.4).step().translateY(0).step();*/
    this.setData({
     /* searchPanelAnimation:animation.export(),*/
      searchPanelDisplay:'block'
    });
  },
  /*
    隐藏关键字列表面板
  */
  hindPanel:function(){
    /*let animation = wx.createAnimation({
      duration:400,
      delay:0
    });
    animation.translateY(0).step();*/
    this.setData({
     /* searchPanelAnimation:animation.export(),*/
      searchPanelDisplay:'none'
    });
  }
})