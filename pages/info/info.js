// pages/info/info.js
var app = getApp();


/*Long转换为Date格式的字符串*/
function dateFormat(longTypeDate){  
 var dateTypeDate = "";  
 var date = new Date();  
 date.setTime(longTypeDate);  
 dateTypeDate += date.getFullYear(); //年  
 dateTypeDate += "-" + getMonth(date); //月  
 dateTypeDate += "-" + getDay(date); //日  
 return dateTypeDate; 
}


const LOADURL = 'http://localhost:8080/smallProject/news/load.do';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    selectedItem:0,
    pageObject:'',
    //没有更多提示
    newsNumTip:'none',
    //赞的动画
    praiseAnimation:{},
    praiseAnimationIndex:0,
    praiseIcon:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;

    wx.request({
      url:'http://localhost:8080/smallProject/news/load.do',
      success:function(response){
        let items_ = response.data.data.list;
        let pageObject_ = response.data.data.pageObject;
        pageObject_.pageSize += 5;
        that.setData({
          items:items_,
          pageObject:pageObject_
        });
      },
      complete:function(){
        //同步动画和列表
        that.syncListAndAnimation(that);
      }
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.refreshPage();
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
  //页面触底
  onReachBottom:function(){
    var that = this;
    //定义数组变量接受新的数据
    var tArray = that.data.items;
    let pageObject_ = that.data.pageObject;
    wx.showLoading({
      title:"内容加载中",
    });
    wx.request({
      url:LOADURL,
      method:'GET',
      data:pageObject_,
      success:function(res){
        if(pageObject_.pageSize == res.data.data.list.length)
          that.data.pageObject.pageSize += 5;
        else{
          that.setData({
            newsNumTip:'block'
          });
        }
        that.setData({
          items:res.data.data.list, 
        });
        wx.hideLoading();
      },
      fail:function(){
        wx.showToast({
          title: '网络超时..',
          icon: 'loading',
          duration: 2000
        });
      }
    });
    that.setData({
      items:tArray
    });
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
      url:'http://localhost:8080/smallProject/news/load.do?id=' + id,
      success:function(response){
        let items_ = response.data.data.list;
        let pageObject_ = response.data.data.pageObject;
        pageObject_.pageSize += 5;
        that.setData({
          items:items_,
          pageObject:pageObject_
        });
      },
      complete:function(){
        //同步动画和列表
        that.syncListAndAnimation(that);
      }
    });

    
  },
  /*
      点下‘赞！’
  */
  doPraise:function(arg){
    let that = this;
    let id = arg.currentTarget.dataset.id;
    let index = arg.currentTarget.dataset.index;

    //赞的动画
    let animations = that.data.praiseAnimation;

    //为动画赋值
      //有效动画
    let praiseAnimation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    });
    praiseAnimation.scale(2,2).step();
    praiseAnimation.scale(1,1).step();
      //无效动画
    let noneAnimation = wx.createAnimation({
      duration: 0
    });

    animations[index] = praiseAnimation.export();

    //设置赞的图片
    let icons = that.data.praiseIcon;
    icons[index] = 'praise1';

    that.setData({
      praiseAnimation:animations,
      praiseIcon:icons
    });

    //反应该条信息是否已经被赞过
    let praiseFlag = that.data.praiseIcon[index];

    animations[index] = noneAnimation.export();
    that.setData({
      praiseAnimation:animations
    });

    if(praiseFlag == 'praise'){
      //当该条消息未被赞时才发送请求
      wx.request({
        url:app.globalData.staticUrl + 'news/addPraise.do?id=' + id,
        success:function(){
          //更新赞后的数字
          that.refreshPage();
        }
      });
    }
  },
  /*
      更新列表的同时同步动画
  */
  syncListAndAnimation:function(that){
    let items_ = that.data.items;
    let animations = new Array(items_.length);

    let icons = animations;
    for(let i=0;i<icons.length;i++){
      icons[i] = 'praise';
    }

    that.setData({
      praiseAnimation:animations,
      praiseIcon:icons
    });
  },
  /*
    添加查看次数
  */
  doWatch:function(arg){
    let id = arg.currentTarget.dataset.id;

    wx.request({
      url:app.globalData.staticUrl + 'news/addWatch.do?id=' + id,
    });
  },
  /*
    刷新页面信息
  */
  refreshPage:function(){
    let that = this;
    let id = that.data.selectedItem;

     wx.request({
      url:'http://localhost:8080/smallProject/news/load.do?id=' + id,
      success:function(response){
        let items_ = response.data.data.list;
        let pageObject_ = response.data.data.pageObject;
        pageObject_.pageSize += 5;
        that.setData({
          items:items_,
          pageObject:pageObject_
        });
      }
    });
  }
})