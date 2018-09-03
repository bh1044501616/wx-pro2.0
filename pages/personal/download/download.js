// pages/personal/download/download.js
var app = getApp();

function getMB(b){
  return (b/1024.0/1024.0).toFixed(2);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadingList:[
      {
        name:'名字',
        progress:75,
        currentSize:5.1,
        totalSize:12.3
      },
      {
        name:'名字',
        progress:75,
        currentSize:5.1,
        totalSize:12.3
      }
    ],
    downloadedList:[
      {
        name:'名字',
        totalSize:12.3
      },
      {
        name:'名字',
        totalSize:12.3
      }
    ],
    emptyTip:['flex','flex']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    that.setData({
      downloadingList:app.globalData.downloadingList,
      downloadedList:app.globalData.downloadedList
    });

    //更新进度
    let _downloadingList = that.data.downloadingList;

    for(let i=0;i<_downloadingList.length;i++){
      _downloadingList[i].downloadTask.onProgressUpdate((res) => {
        //更新数据进度
        _downloadingList[i].progress = res.progress;
        _downloadingList[i].currentSize = getMB(res.totalBytesWritten);
        _downloadingList[i].totalSize = getMB(res.totalBytesExpectedToWrite);

        that.setData({
          downloadingList:_downloadingList
        });

        if(res.progress === 100){
          //下载完成，重新加载列表
          that.setData({
            downloadingList:app.globalData.downloadingList,
            downloadedList:app.globalData.downloadedList
          });
        }
        
      })
    }
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
    打开文件
  */
  openFile:function(res){
    let path = res.currentTarget.dataset.path;
    let name = res.currentTarget.dataset.name;

    console.log(name)

    wx.openDocument({
      filePath:path,
      fileType:name.substring(name.lastIndexOf('.')+1),
      success:function(){
        console.log('文件打开')
      },
      fail:function(res){
        console.log(res);
      }
    });
  },
  /*
    删除文件
  */
  dropFile:function(res){
    let that = this;
    let index = res.currentTarget.dataset.index;
    let name = res.currentTarget.dataset.name;
    let downloadedList1 = that.data.downloadedList;
    let downloadedList2 = app.globalData.downloadedList;
    
    //删除该页面下的
    if(downloadedList1[index].name === name){
      downloadedList1.splice(index,1);
    }
    
    //删除app页面下的
    if(downloadedList2[index].name === name){
      downloadedList2.splice(index,1);
    }
    that.setData({
      downloadedList:downloadedList1
    });
  },
  /*
    复制ppt的链接到剪贴板
  */
  copyPPTUrl:function(res){
    let _url = res.currentTarget.dataset.url;

    wx.setClipboardData({
      data:_url,
      success:function(){
        wx.showToast({
          title:'ppt链接已复制到剪贴板',
          icon:'none',
          duration:2000
        });
      }
    })
  }
})