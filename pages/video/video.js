var arr = [];
var app = getApp();

//提示信息
const NETWORK_ERROR = '网络繁忙，请稍后重试';

function getMB(b){
	return (b/1024.0/1024.0).toFixed(2);
}
function getName(url){
	return url.substring(url.indexOf('=')+1,url.indexOf('&'));
}
/* 建立taskId库*/
var TASKID = 0;
/* 建立task存储库*/
var tasks = new Array();
/* 创建数组存储downloadTask*/
var downloadTask = new Array();
/* 判断滑动事件类型*/
var scrollY = 0;

//链接
const URL = app.globalData.staticUrl;
/*	获取信息url*/
const loadUrl = URL + "meeting/load.do";
/*  ppt下载链接*/
const pptUrl = URL + "download/meeting.do?";
/**
 *	下载链接中的日期处理

 	 str1是要被替换掉的字符串

 	 str2是源字符串

 	 	'g'参数是指将整个字符串中的全部符合正则的字符串全部替换
 */
 function dateFormat_download(str1,str2){
 	let reg = new RegExp(str1,'g');
 	return str2.replace(reg,'');
 }
/* 下载文件&监听文件变化信息*/
function download(url0,index,that,fileName){
	var downloadTask = wx.downloadFile({
			url:url0,
			success:function(res){
				wx.saveFile({
					tempFilePath:res.tempFilePath,
					success:function(res){
						console.log(res.header);
						console.log("保存文件成功！" + res.savedFilePath);
						var downloaded = that.data.downloadedList;
						var downloading = that.data.downloadingList;
						downloaded[downloaded.length] = {
							name:fileName,
							savedFilePath:res.savedFilePath,
							size:downloading[index].size
						}
						that.setData({
							downloadedList:downloaded
						});
						if('' == that.data.savedFilePath){
							//显示文件存储位置提示
							that.setData({
								savedFilePath:downloaded[downloaded.length-1].savedFilePath.substring(0,downloaded[downloaded.length-1].savedFilePath.lastIndexOf('/')),
								savedFilePathShow:'block'
							});
						}
						downloading.splice(index,1);
						that.setData({
							downloadingList:downloading
						})
					},
					fail:function(){
						wx.showToast({
						  title: '文件已存在！',
						  icon: 'none',
						  duration: 2000
						});
						//从下载列表中清除保存失败的文件
						let downloading = that.data.downloadingList;
						downloading.splice(index,1);
						that.setData({
							downloadingList:downloading
						});
					}
				});
			}
		});
		
		downloadTask.onProgressUpdate((res) => {
			console.log(that.data.downloadingList);
			var downloadingObject = that.data.downloadingList;
			if(res.progress){
				downloadingObject[index].progress = res.progress;
			}
			if(res.totalBytesWritten){
				downloadingObject[index].currentSize = getMB(res.totalBytesWritten);
			}
			if(res.totalBytesExpectedToWrite){
				downloadingObject[index].size = getMB(res.totalBytesExpectedToWrite);
			}
			that.setData({
				downloadingList:downloadingObject
			})
		})
	return downloadTask;
}


/*pageObject*/
var pageObject = {};

Page({
	data:{
		index:0,
		data:{},
		arr:[{theme:"这是主题",loc:"地点",topic:[{subject:"演讲题目",lecture:[{lecturer:"演讲人名字",introduction:"演讲人介绍",ppt:"ppt文件名称",url:"ppt下载链接"},{lecturer:"演讲人名字",introduction:"演讲人介绍",ppt:"ppt文件名称",url:"ppt下载链接"}]},{subject:"演讲题目",lecture:[{lecturer:"演讲人名字",introduction:"演讲人介绍",ppt:"ppt文件名称",url:"ppt下载链接"}]}]}],
		animationData:{},
		downloadingList:[],
      	downloadedList:[],
      	//用于downloadPage切换的参数
      	downloadPageSwitch:app.data.width*0.85,
      	switchAnimation:{},
      	//开关的动画
      	switch:{},
      	switchIndex:1,
      	//下载页面的坐标
      	scrollTop:0,
      	//下载页面滑动 的开关
      	scrollSwitch:1,
      	//下载页面 开关的图片选择
      	switchPhoto:'download',
      	//下载页面 是否可滑动开关
      	isScroll:false,
      	//购票信息tip显示/隐藏动画
      	tipAnimation:{},
      		//移动距离
      	tipDistance:-app.globalData.width*0.15,
      	//ppt下载列表动画
      	pptListAnimation:{},
      	pptListZIndex:0,
      	//没有更多信息提示
      	meetingNumTip:'none',
      	//已下载文件所存储的目录
      	savedFilePath:'',
      	//已下在文件所在目录的提示显示设定
      	savedFilePathShow:'none',
      	//获取信息提示
      	serverInfo:'',
      	//用于储存大会日期的数组(每个日期在上部可滑导航处显示)
      	meetingTimes:['2018-04-31','2018-04-31','2018-04-31','2018-04-31'],
      	//用于表示被选中的导航选项
      	selectedItem:'',
      	//布局图标的坐标定义
      	titleRowMajor:(app.data.width*0.1)+30,
      	titleRowMinor:(app.data.width*0.1)+20,
	},
	onLoad:function() {
		console.log(this.data.arr);

		var that = this;	
		wx.request({
			url:loadUrl,
			method:'POST',
			success:function(res){
				console.log(res.data);
				that.setData({
					array:res.data.data.list,
					// array:res.data
					serverInfo:''
				});
				/* 请求参数（iqalience）*/
				pageObject = res.data.data.pageObject;
				pageObject.pageSize += 5;
			},
			fail:function(){
				wx.showToast({
				  title: '网络超时..',
				  icon: 'loading',
				  duration: 2000
				});
				that.setData({
					serverInfo:NETWORK_ERROR
				});
			}
		});
		/*更改navigator*/
		wx.setNavigationBarTitle({
			title:'大会资料'
		});
		/*加载已经下载的文件*/
		wx.getSavedFileList({
			success:function(res){
				let fileList_ = res.fileList;			
				if(fileList_.length > 1){
					let onePath = fileList_[0].filePath;
					let path = onePath.substring(0,onePath.lastIndexOf('/'));
					that.setData({
						savedFilePath:path,
						savedFilePathShow:'block'
					});
					that.showSwitch();
				}
			}
		});
	},
	// 关于下载页面的 滑动 相关的函数
	onPageScroll:function(e) {
		if(this.data.scrollSwitch){
			if(scrollY > e){
			    this.setData({
			      scrollTop: this.data.scrollTop - 10
			    });
			}else{
				this.setData({
			      scrollTop: this.data.scrollTop + 10
			    });
			}
		}
  	},
  	stopScroll:function(){
  		if(this.data.scrollSwitch){
  			this.data.scrollSwitch = 0;
  		}else{
  			this.data.scrollSwitch = 1;
  		}
  	},
	onReachBottom:function(){
		var that = this;
		//定义数组变量接受新的数据
		var tArray = that.data.array;
		wx.showLoading({
			title:"内容加载中",
		});
		console.log(pageObject);
		wx.request({
			url:loadUrl,
			method:'GET',
			data:pageObject,
			success:function(res){
				if(pageObject.pageSize == res.data.data.list.length)
					pageObject.pageSize += 5;
				else{
					that.setData({
						meetingNumTip:'block'
					});
				}
				that.setData({
					array:res.data.data.list, 
					// array:res.data
					serverInfo:''
				});
				wx.hideLoading();
			},
			fail:function(){
				wx.showToast({
				  title: '网络超时..',
				  icon: 'loading',
				  duration: 2000
				});
				that.setData({
					serverInfo:NETWORK_ERROR
				});
			}
		});
		that.setData({
			array:tArray
		});
		console.log(this.data.array);
	},
	downloadPPT:function(arg){
		var that = this;
		let date = 'date=' + arg.currentTarget.dataset.date + '&';

		var url0 = pptUrl + dateFormat_download('-',date) + arg.currentTarget.dataset.url;
		//先获取中文名称
		let fileName = url0.substring(url0.indexOf('name=')+5,url0.indexOf('id')-1);
		//处理中文链接
		url0 = encodeURI(url0);
		console.log(url0);
		var downloading = that.data.downloadingList;
		var currentLength = downloading.length;
		downloading[currentLength] = {
			//初始化任务对象
			name:fileName,
			progress:0,
			currentSize:0,
			size:0,
			status:'终断',
			taskId:TASKID++,
			url:url0
		}
		that.setData({
			downloadingList:downloading
		});
		if(this.data.switchIndex){
			this.showSwitch();
			this.data.switchIndex = 0;
		}
		//提示开始下载
		wx.showToast({
		  title: '加入下载列表',
		  icon: 'success',
		  duration: 2000
		});
		that.setData({
			downloadingList:downloading
		})
		tasks[TASKID-1] = download(url0,currentLength,that,fileName);
	},
  /**
   *  终断下载-继续下载
   */
  downloadMethod:function(arg){
  	var that = this;
  	var id = arg.currentTarget.dataset.item.taskId;
  	var status = arg.currentTarget.dataset.item.status;
  	var downloading = that.data.downloadingList;
    for(var i=0;i<downloading.length;i++){
    	console.log(downloading[i].taskId);
    	if(downloading[i].taskId == id){
    		console.log('matched');
    		console.log(status);
			if(status == '终断'){
				console.log('进入终止');
				tasks[id].abort();
				console.log('任务停止');
				downloading[i].status = '继续';
			}
			if(status == '继续'){
				downloading[i].progress = 0;
				downloading[i].currentSize = 0;
				downloading[i].status = '终断';
				tasks[i] = download(downloading[i].url,i,that);
			}
			that.setData({
				downloadingList:downloading
			});
		}
    }
    that.setData({
    	downloadingList:downloading
    })
  },
  abortDownload:function(arg){
    var that = this;
    var task = tasks[arg.currentTarget.dataset.task];
    task.abort();
    var id = arg.currentTarget.dataset.task;
    var downloading = that.data.downloadingList;
    for(var i=0;i<that.length;i++){
    	if(downloadingList[i].taskId == id){
			downloading[i].status = '继续';
		}
    }
    that.setData({
    	downloadingList:downloading
    })
  },
/**
 * 重启任务
 */
   resumeDownload:function(arg){
    var that = this;
    var id = arg.currentTarget.dataset.task;
    var downloading = that.data.downloadingList;
    for(var i=0;i<downloading.length;i++){
    	if(downloadingList[i].taskId == id){
			downloading[i].progress = 0;
			downloading[i].currentSize = 0;
			that.setData({
				downloadingList:downloading
			});
			tasks[i] = download(downloading[i].url,i,that);
		}
    }
 },
 /**
  *	打开文件
  */
  openFile:function(arg){
  	 var path = arg.currentTarget.dataset.savedfilepath;
  	 let name = arg.currentTarget.dataset.name;
  	 let type = name.substring(name.lastIndexOf('.')+1);
  	 console.log(type);

  	 wx.openDocument({
      filePath:path,
      fileType:type,
      success: function (res) {
        console.log('打开文档成功');
      },
      fail:function(res){
      	console.log(res)
      	wx.showToast({
      		title:'文件找不到或者文件类型不支持',
      		icon:'none',
      		duration:2000
      	});
      }
    })
  },
  /**
   * 删除任务
   */
   dropDownload:function(arg){
   	var that = this;
   	wx.showModal({
	  title: '确认',
	  content: '确定删除下载任务？',
	  success: function(res) {
	    if (res.confirm) {
	    	//用户点击确定下载任务
	    	//开始删除下载任务动作
	      	
		   	var path = arg.currentTarget.dataset.savedfilepath;
		   	var id = arg.currentTarget.dataset.taskid;
		   	console.log(id);
		   	console.log(path);
		   	//判断是下载完成的任务还是正在下载的任务
		   	if(id || id == 0){
		   		tasks[id].abort();
		   		var downloading = that.data.downloadingList;
		   		console.log(downloading);
		   		for(var i=0;i<downloading.length;i++){
		   			if(downloading[i].taskId == id){
		   				downloading.splice(i,1);
		   				that.setData({
		   					downloadingList:downloading
		   				});
		   			}
		   		}
		   	}
		   	else if(path){
			 	wx.removeSavedFile({
				filePath: path,
				success: function(res) {
					var downloaded = that.data.downloadedList;
					for(var i=0;i<downloaded.length;i++){
		   				downloaded.splice(i,1);
						that.setData({
							downloadedList:downloaded
						})
					}
				}
		      });
		   	}else{

		   	}
	    } else if (res.cancel) {
	      console.log('用户点击取消')
	    }
	  }
	});
   },
   switchDownloadPage:function(arg){
   	//切换 图片
   	var photoName = 'download';
   	//定义滑动动画
	var animation = wx.createAnimation({
	 	 duration: 400,
	 	 timingFunction: "ease",
	});
	var switchIndex = this.data.downloadPageSwitch;
   	animation.translateX(switchIndex).step();
   	if(switchIndex > 0){
   		this.data.downloadPageSwitch = 0;
   	}else{
   		this.data.downloadPageSwitch = app.data.width*0.85;
   	}
   	this.setData({
   		switchAnimation:animation.export()
   	});
   	if(switchIndex > 0){
  	 	animation.rotate(360).translateX(app.data.width*0.95).step();
  	 	photoName = 'download_r';
  	}else{
  		animation.rotate(0).translateX(app.data.width*0.15).step();
  		photoName = 'download';
  	}
   	this.setData({
   		switch:animation.export(),
   		switchPhoto:photoName,
   		isScroll:true
   	});
   },
   //开关本身的动画设定
   /* 显示switch*/
	showSwitch:function(){
		var animation = wx.createAnimation({
		 	 duration: 400,
		 	 timingFunction: "ease",
		});
		animation.translate(app.data.width*0.15).step();
		this.setData({
			switch:animation.export()
		});
	},
	/**购票咨询--makeACall*/
	makeCall:function(){
		wx.makePhoneCall({
			phoneNumber:'13681206054'
		});
	},
	/**购票咨询信息提示*/
	showTip:function(){
		var distance = this.data.tipDistance;
		var animation = wx.createAnimation({
			duration:200,
			timingFunction:'ease',
			delay:0
		}); 
		animation.translate(distance).step();
		distance = distance<0?0:(-app.globalData.width*0.15);
		this.setData({
			tipAnimation:animation.export(),
			tipDistance:distance
		});
	},
	/**加载ppt列表*/
	loadPPT:function(res){
		var that = this;
		var id = res.currentTarget.dataset.id;
		//请求ppt数据
		wx.request({
			url:res.currentTarget.dataset.url,
			data:pageObject,
			success:function(res){
				console.log(res.data);
				that.setData({
					array:res.data.data.list
				});
				//显示ppt列表
				var arr = that.data.array;
				var length = 0;
				var zindex = that.data.pptListZIndex;
				arr.forEach(function(value,index,array){
					if(value.id == id){
						console.log(value);
						length = value.ppts.length;
					}
				});
				var animation = wx.createAnimation({
				  duration: 1000,
				  timingFunction: "ease",
				  delay: 0
				});
				animation.translateY(zindex==0?30*length:0).step();
				that.setData({
					pptListAnimation:animation.export(),
					pptListZIndex:zindex==0?2500:0
				});
			}
		});
	},
	/**
   *  切换导航
   */
  turnNavi:function(res){

    let path = res.currentTarget.dataset.url;
    let that = this;
    let id = res.currentTarget.dataset.id;
    that.setData({
      selectedItem:id
    });
   }
})