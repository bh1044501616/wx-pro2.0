// pages/schedule/schedule.js
var app = getApp();
const LIST_URL = app.globalData.staticUrl + 'schedule/info/';
const DATE_URL = ['20180815','20180816','20180817','20180818'];
const DETAIL_URL = app.globalData.staticUrl + 'schedule/detail.do';

//获取全局唯一文件管理
var fileSystemManager = wx.getFileSystemManager();

function getMB(b){
  return (b/1024.0/1024.0).toFixed(2);
}

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
    detailDisplay:'none',
    //大会日期
    dates:['2018-08-15','2018-08-16','2018-08-17','2018-08-18'],
    //网络链接中断提示
    serverInfo:'',
    //用于返回主页面（手指动作坐标变量）
    startX:0,
    moveX:0,
    endX:0,
    //顶部导航的实际高度
    detailHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取大会行程首页数据
    wx.request({
      url:app.globalData.staticUrl + 'schedule/info/20180815.do',
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
    });

    //设置页面详情的高度
    var selector = wx.createSelectorQuery();
    selector.select('#scrollNavi0').boundingClientRect(function(res){
      that.setData({
        detailHeight:app.globalData.height/* - res.height*/
      });
    }).exec();
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
          detail:content,
          detailDisplay:'block'
        });
      }
    })

    let animation = wx.createAnimation({
      duration:400,
      delay:0,
      timingFunction:'ease-in-out'
    });
    animation.translateY(app.globalData.height).opacity(1).step();
    that.setData({
      detailAnimation:animation.export()
    });
  },
  //手指刚放到屏幕触发
  touchS:function(e){
    let that = this;

    //判断是否只有一个触摸点
    if(e.touches.length==1){
      this.setData({
        //记录触摸起始位置的X坐标
        startX:e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM:function(e){
    let that = this;

    let moveX = e.touches[0].clientX;

    if(e.touches.length == 1){
      let animation = wx.createAnimation({
        duration:400,
        delay:0,
        timingFunction:'ease-in-out'
      });
      animation.translate(-app.globalData.width + moveX).step();
      that.setData({
        detailAnimation:animation.export(),
        detailDisplay:'block'
      });
    }
  },
  touchE:function(e){
    let that = this;
    
    if(e.changedTouches.length==1){
      //手指移动结束后触摸点位置的X坐标
      let endX = e.changedTouches[0].clientX;
      
      if(that.data.startX > 0 && (endX - that.data.startX) > 50){
        that.backToList();
      }
    }
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
    animation.translateY(0).opacity(0).step();
    that.setData({
      detailAnimation:animation.export(),
      detailDisplay:'none'
    });
  },
  /*
    下载ppt
  */
  download:function(arg){
    let _url = arg.currentTarget.dataset.url;
    let _name = arg.currentTarget.dataset.name;
    var commonSize = 0;
    let downloadedObj = {
      url:_url,
      size:0
    }
    let downloadingObj = {
      name:_name
    }
    const _downloadTask = wx.downloadFile({
      url: _url, 
      success: function(res) {
        if (res.statusCode === 200) {
            //请求成功，保存文件到本地
            
            //将保存完的文件加入下载完成列表
            downloadedObj.name = downloadingObj.name;
            downloadedObj.size = downloadingObj.totalSize;
            console.log('转交数据时的downloadingsize' + commonSize)
            downloadedObj.path = res.tempFilePath;
        
            let _downloadedList = app.globalData.downloadedList;
            _downloadedList[_downloadedList.length] = downloadedObj;

            console.log(app.globalData.downloadingList)
            console.log(app.globalData.downloadedList)

            //将下载完成的任务从正在下载列表清除

            let _downloadingList = app.globalData.downloadingList;
            
            for(let i=0;i<_downloadingList.length;i++){
              if(_downloadingList[i] === downloadingObj){
                _downloadingList.splice(i,1);
              }
            }
        }
      },
      fail:function(res){
        console.log(res)
        //网络请求失败
        wx.showToast({
          title:'网络繁忙，稍后重试!',
          icon:'none',
          duration:2000
        });
      }
    });

    downloadingObj.downloadTask = _downloadTask;

    //添加任务到app.js
    let _downloadingList = app.globalData.downloadingList;
    _downloadingList[_downloadingList.length] = downloadingObj;
    app.globalData.downloadingList = _downloadingList;

    wx.showToast({
      title:'已加入下载列表',
      icon:'none',
      duration:2000
    });

    /*_downloadTask.onProgressUpdate((res) => {
      //更新数据进度
      downloadingObj.progress = res.progress;
      downloadingObj.currentSize = getMB(res.totalBytesWritten);
      downloadingObj.totalSize = getMB(res.totalBytesExpectedToWrite);

      commonSize = getMB(res.totalBytesExpectedToWrite);
    })*/
  },
  /*
    切换到pc页面下载ppt
  */
  /*turnToPCPage:function(){
    app.globalData.info_web_view = app.globalData.staticUrl + "schedule/load.do";

    wx.navigateTo({
      url:'../webPage'
    })
  }*/
})