Page({
  data: {
  /** 导航*/
    /*导航图片*/
    naviPhotos:[
      'images/index.png',
      'images/tid.png',
      'images/join.png',
      'images/index_c.png',
      'images/tid_c.png',
      'images/join_c.png'
    ],
    navis:[
      'images/index_c.png',
      'images/tid.png',
      'images/join.png'
    ],
    /*下划线动画*/
    lineTranslation: {},
    /*记录当前被点击导航*/
    currentBlur:0,
  /** 菜单*/
    /*菜单的动画*/
    menuAnimation:{},
    /*菜单移动距离*/
    menuDistance:getApp().globalData.width*0.4,
  /** swiper*/
    /*swiper渐显渐隐动画*/
    swiperAnimation:{},
    //swiper透明度
    swiperOpacity:0.6,
    //swiper图片
    swiperPic:'index.jpg',
    swiperPicIndex:0,
    swiperPics:[
      'index.jpg',
      'privilege.jpg',
      'tid.jpg'
    ],
  /** 内容*/
    /*按下变色*/
    touchColor_a:'#fff',
    touchColor_b:'#fff',
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
      latitude:41.20,
      longitude:116.63,
      width: 50,
      height: 42
    }],
    /*box-shadow*/
    box_shadow:[0,0]
  },
  /** 地图*/
  /** 为主页导航添加的事件*/
  blurChange:function(res){
    //改变导航字体颜色（改变图片路径）
    if(isNaN(res))
      var id = Number(res.currentTarget.dataset.id);
    else
      var id = res;
    //按下 按钮后 更改 图片
    this.toggleSwiperPic(id);
    var names = this.data.naviPhotos;
    var nas = this.data.navis;
    for(var i=0;i<nas.length;i++){
      nas[i] = names[i];
    }
    nas[id] = names[id+3];
    this.setData({
      navis:nas,
      currentBlur:id
    });
    //移动下划线
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "ease-in-out",
      delay:0
    });
    var distance = getApp().globalData.width*0.16;
    animation.translate(id * distance).step();
    this.setData({
      lineTranslation:animation.export()
    });
  },
  /** 菜单的开关*/
  switchMenu:function(res){
    //当按下menu开关时 flag会被赋值，进而执行 menu开关操作
    var close = res.currentTarget.dataset.close;
    var distance = this.data.menuDistance;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in"
    });
    if(close) distance = 0;
    animation.translate(distance).step();
    if(distance >0){
      distance = 0;
    }else{
      distance = getApp().globalData.width*0.4
    }
    this.setData({
      menuAnimation:animation.export(),
      menuDistance:distance
    });
  },
  /** 滑动页面自动触发事件*/
  onPageScroll:function(){
    
  },
  /** 页面初次渲染完成后触发的事件*/
  onReady:function(){
    var that = this;
    //swiper图片变化
    setInterval(
      function(){
        var opa = that.data.swiperOpacity;
        if(opa - 0.4 > 0){
          //改变图片透明度
          var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: "ease-in"
          });
          animation.opacity(opa).step();
          opa -= 0.4;
          that.setData({
            swiperAnimation:animation.export(),
            swiperOpacity:opa
          });
        }else{
          //改变图片
          var index = that.data.swiperPicIndex;
          index = (index+1)%3;
          var animation = wx.createAnimation({
            duration: 0,
            timingFunction: "ease-in"
          });
          animation.opacity(1).step();
          that.blurChange(index);
          that.setData({
            swiperPicIndex:index,
            swiperPic:that.data.swiperPics[index],
            swiperOpacity:0.6,
            swiperAnimation:animation.export()
          });
        }
    },2000);
    //绑定map组件上下文
    that.data.mapContext = wx.createMapContext('map');
    that.data.mapContext.moveToLocation();
    that.loadMap();
  },
  /** 改变swiper图片*/
  toggleSwiperPic:function(method){
    this.setData({
      swiperPicIndex:method,
      swiperPic:this.data.swiperPics[method]
    });
  },
/** 内容*/
  /*改变按下颜色*/
  turnColor:function(res){
    var flag = res.currentTarget.dataset.flag;
    if(flag == 1){
      var color = this.data.touchColor_a;
      this.setData({
        touchColor_a:color=='#fff'?'#ececec':'#fff'
      });
    }
    else if(flag == 2){
      var color = this.data.touchColor_b;
      this.setData({
        touchColor_b:color=='#fff'?'#ececec':'#fff'
      });
    }
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
/** 跳转页面*/
jumpTo:function(res){
  var path = res.currentTarget.dataset.url;
  var navi = res.currentTarget.dataset.name;
  wx.navigateTo({
    url:path
  });
  wx.setNavigationBarTitle({
    title:navi
  });
},
  /** 跳转bar*/
  switchBar:function(){
    wx.switchTab({
      url:'../join/join'
    });
  },
  /** 改变view-box样式*/
  turnBox:function(res){
    var id = res.currentTarget.dataset.index;
    var themes = this.data.box_shadow;
    themes[id] = themes[id]==0?15:0;
    this.setData({
      box_shadow:themes
    })
  }
})