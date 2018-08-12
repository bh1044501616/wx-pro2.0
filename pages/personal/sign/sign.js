// pages/personal/sign/sign.js
var app = getApp();

const GREEN = '35cc62';
const DARK_GRAY = '666';
const GRAY = 'e5e5e5';
const YELLOW = 'ffb54c';
const RED = 'fa6557';
const WARN = 'warn';
const SUCCESS = 'success';
const ERROR = 'error';
const DELETE = 'delete';
const BLOCK = 'block';

const TELEPHONE_REGEX = /^(\\+\\d{2}-)?0\\d{2,3}-\\d{7,8}$/;
const PHONE_REGEX = /^(\+\d{0,4})*1[3|4|5|8][0-9]\d{8}$/;
const EMAIL_REGEX =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {
        tip:'论坛',
        name:'forum',
        placeholder:'',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },
      {
        tip:'姓名',
        name:'name',
        placeholder:'请输入姓名',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'公司',
        name:'company',
        placeholder:'请输入公司',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'职位',
        name:'position',
        placeholder:'请输入职位',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'手机',
        name:'phone',
        placeholder:'请输入手机',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'邮箱',
        name:'email',
        placeholder:'请输入邮箱',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'密码',
        name:'password',
        placeholder:'请输入密码',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      },{
        tip:'确认密码',
        name:'password',
        placeholder:'请确认密码',
        placeholder_style:'',
        line_color:'e5e5e5',
        icon:'',
        text:''
      }
    ],
    placeholder_style:'e5e5e5',
    first_password:''
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
    表单获取到焦点（点击输入框）
  */
  gainFocus:function(res){
    let that = this;
    let id = res.currentTarget.dataset.id;
    let _items = that.data.items;

    //改变输入框下部颜色
    _items[id].line_color = GREEN;

    that.setData({
      items:_items
    });
  },
  /*
    表单失去焦点
  */
  loseFocus:function(res){
    let that = this;
    let _items = that.data.items;
    let id = res.currentTarget.dataset.id;

    //改变输入框下部颜色
    _items[id].line_color = GRAY;

    //验证表单内容
    let value = res.detail.value;
    if(value != ''){
      //输入内容才验证
      let flag = that.verifyForm(id,value,that);
      if(flag){
        _items[id].icon = SUCCESS;
      }else{
        _items[id].icon = ERROR;
      }
    }

    //记录第一次输入的密码
    let pwd = '';
    if(id == 6){
      pwd = value;

      if(_items[7].text != '' && value == _items[7].text){
        _items[7].icon = SUCCESS;
      }
    }

    that.setData({
      items:_items,
      first_password:pwd
    });
  },
  /*
    输入时触发的动作
  */
  inputMethod:function(res){
    let that = this;

    let id = res.currentTarget.dataset.id;
    let value = res.detail.value;

    //改变表单欧右侧图标显示
    let _items = that.data.items;
    if(value === ''){
      _items[id].icon = '';
    }else{
      _items[id].icon = DELETE;
    }

    //同步text内容
    _items[id].text = value;

    that.setData({
      items:_items
    });
  },
  /*
    表单信息验证
  */
  verifyForm:function(id,value,that){
    if((id>=0&&id<=3)||(id == 6))
      return true;
    if(id == 4){
      return PHONE_REGEX.test(value);
    }
    else if(id == 5){
      return EMAIL_REGEX.test(value);
    }else if(id == 7){
      return (that.data.items[6].text == value);
    }else{
      return ture;
    }
  },
  /*
    点击删除按钮，删除相应input组件中的文本
  */
  deleteText:function(res){
    let that = this;
    var id = res.currentTarget.dataset.id;
    var _items = that.data.items;

    //清空文本框
    _items[id].text = '';

    //隐藏文本框右侧图标
    _items[id].icon = '';

    that.setData({
      items:_items
    });
  },
  /*
    重置表单
  */
  resetForm:function(){
    console.log(1);
    let that = this;
    let _items = that.data.items;

    for(let i=0;i<_items.length;i++){
      //清空表单数据
      _items[i].text = '';

      //隐藏所有icon
      _items[i].icon = '';
    }

    that.setData({
      items:_items
    });
  },
  /*
    提交表单
  */
  submitForm:function(res){
    //验证所有表单输入正确
    let that = this;
    let _items = that.data.items;
    for(let i=0;i<_items.length;i++){
      if(_items[i].icon != SUCCESS){
        wx.showToast({
          title: '请确认信息是否填写完整！',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    //验证通过，提交表单
    let value = res.detail.value;

    wx.request({
        url:app.globalData.staticUrl + 'ticket/signin.do',
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
  }
})