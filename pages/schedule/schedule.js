// pages/schedule/schedule.js
var app = getApp();
const LIST_URL = app.globalData.staticUrl + 'schedule/info/';
const DATE_URL = ['20180815','20180816','20180817','20180818'];
const DETAIL_URL = app.globalData.staticUrl + 'schedule/detail.do';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //导航被选中的
    selectedItem:0,
    //日程
    contents:[],
    //被选中项的详细信息
    detail:{},
    detailAnimation:{},
    //大会日期
    dates:['2018-08-15','2018-08-16','2018-08-17','2018-08-18'],
    //网络链接中断提示
    serverInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取大会行程首页数据
    wx.request({
      url:app.globalData.staticUrl + 'schedule/info/20180809.do',
      success:function(res){
        let list = res.data.data;
        that.setData({
          contents:list,
          serverInfo:''
        })
      },
       fail:function(){
        that.setData({
          serverInfo:'网络繁忙,请稍侯'
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
  turnNavi:function(res){
    let that = this;

    let index = res.currentTarget.dataset.index;
    that.setData({
      selectedItem:index
    });

    //更新数据
    wx.request({
      url:LIST_URL + DATE_URL[index] + ".do",
      success:function(res){
        that.setData({
          contents:res.data.data,
          serverInfo:''
        });
      },
      fail:function(){
        that.setData({
          serverInfo:'网络繁忙,请稍侯'
        });
      }
    }) 
  },
  /*
    查看大会详细信息
  */
  checkDetail:function(res){
    let that = this;

    let index = res.currentTarget.dataset.index;

    //获取请求信息中的ids
    let content = that.data.contents[index];
    let topics = content.topics;
    let ids = new Array();
    for(let i=0;i<topics.length;i++){
      //遍历topics获取所有id
      ids.push(topics[i].id);
    }

    wx.request({
      url:DETAIL_URL,
      data:{
        'ids':ids
      },
      header:{
        'enctype':'application/x-www-form-urlencoded'
      },
      success:function(res){
        let list = res.data.data;

        for(let i=0;i<topics.length;i++){
          //遍历topics为每个topic添加演讲信息
          for(let j=0;j<ids.length;j++){
            if(content.topics[i].id == ids[j]){
              content.topics[i].lectures = list[ids[j]];
            }
          }
        }

        that.setData({
          detail:content
        });
      }
    })

    let animation = wx.createAnimation({
      duration:400,
      delay:0,
      timingFunction:'ease-in-out'
    });
    animation.translate(-app.data.width).step();
    that.setData({
      detailAnimation:animation.export()
    });
  },
  /*
    返回列表
  */
  backToList:function(){
    let that = this;
    
    let animation = wx.createAnimation({
      duration:400,
      delay:0,
      timingFunction:'ease-in-out'
    });
    animation.translate(0).step();
    that.setData({
      detailAnimation:animation.export()
    });
  }
})