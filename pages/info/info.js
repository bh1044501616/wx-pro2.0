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
    newsNumTip:'none'
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
        console.log(items_);
        that.setData({
          items:items_,
          pageObject:pageObject_
        });
        console.log(that.data.pageObject);
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
    console.log(that.data.pageObject);
    wx.request({
      url:LOADURL,
      method:'GET',
      data:pageObject_,
      success:function(res){
        if(pageObject_.pageSize == res.data.data.list.length)
          that.data.pageObject.pageSize += 5;
        else{
          console.log("没有更多了~");
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
    console.log(this.data.array);
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
      url:'http://localhost:8080/smallProject/news/load.do',
      success:function(response){
        let items_ = response.data.data.list;
        let pageObject_ = response.data.data.pageObject;
        pageObject_.pageSize += 5;
        console.log(items_);
        that.setData({
          items:items_,
          pageObject:pageObject_
        });
        console.log(that.data.pageObject);
      }
    })
  }
})