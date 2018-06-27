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
const MOVE_WIDTH = getApp().globalData.width*0.9 - 20;
const WIDTH = getApp().globalData.width;
const TELEPHONE_REGEX = /^(\\+\\d{2}-)?0\\d{2,3}-\\d{7,8}$/;
const PHONE_REGEX = /^(\+\d{0,4})*1[3|4|5|8][0-9]\d{8}$/;
const EMAIL_REGEX =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;;
Page({
	data:{
		colors:['e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5','e5e5e5'],
		colors_title:['666','666','666','666','666','666','666','666','666','666','666','666','666','666'],
		/*隐藏/显示删除文本按钮*/
		displays:['none','none','none','none','none','none','none','none','none','none','none','none','none'],
		/*input组件中的文本*/
		inputTexts:['您的姓名','您的公司','您的职位','您的手机','您的邮箱','公司简介',
		'您的姓名','您的公司','您的职位','您的部门','您的电话','您的手机','您的邮箱','公司简介'],
		/*input组件状态*/
		inputStatus:['delete','delete','delete','delete','delete','delete','delete','delete','delete','delete','delete','delete','delete'],
		/*文本框内字体颜色*/
		inputColors:['bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb','bbb'],
		/*切换页面的动画*/
		turnPageAnimation:{},
		/*动画物体移动的距离*/
		moveWidth:MOVE_WIDTH,
		/*页面的动画*/
		turnPageAnimation:{},
		/*聚焦调节*/
		// focus:'false'
	},
	onLoad:function(){
		wx.setNavigationBarTitle({
			title:'智联联盟会员申请'
		});
		this.turnPage();
	},
	changeBorderColor:function(res){
		//焦点聚集时触发事件
		var id = res.currentTarget.dataset.id;
		var color = this.data.colors;
		var color_t = this.data.colors_title;
		var inputColor = this.data.inputColors;
		var inputText = this.data.inputTexts;
		if(id){
			//删除提示文字
			if(inputColor[id] == 'bbb'){
				inputColor[id] = '051232';
				inputText[id] = '';
			}
			for(var i=0;i<color.length;i++){
				color[i] = GRAY;
				color_t[i] = DARK_GRAY;
			}
			color_t[id] = GREEN;
			color[id] = GREEN;
			this.setData({
				colors:color,
				colors_title:color_t,
				inputTexts:inputText,
				inputColors:inputColor
			});
		}
	},
	/** 在input组件中输入文本时触发时事件*/
	inputMethod:function(res){
		var id = res.currentTarget.dataset.id;
		var value = res.detail.value;
		//隐藏/显现删除文本按钮
		this.toggleDeleteIcon(id,value);
		//同步文本
		this.assignValue(id,value);
	},
	/** 在input组件失去焦点时触发的事件*/
	loseFocus:function(res){
		var value = res.detail.value;
		var id = res.currentTarget.dataset.id;
		var display = this.data.displays[id];
		if(display != 'none'){
			var status = this.data.inputStatus;
			if(value == '')
				status[id] = WARN;
			else if(!this.verifyForm(id,value))
				status[id] = ERROR;
			else
				status[id] = SUCCESS;
			this.setData({
				inputStatus:status
			});
		}
	},
	/** 删除文本按钮显现的操作*/
	toggleDeleteIcon:function(id,value){
		if(id){
			var dises = this.data.displays;
			var status = this.data.inputStatus;
			dises[id] = BLOCK;
			status[id] = DELETE;
			this.setData({
				displays:dises,
				inputStatus:status
			});
		}
	},
	/** 点击删除按钮，删除相应input组件中的文本*/
	deleteText:function(res){
		var id = res.currentTarget.dataset.id;
		if(id){
			var texts = this.data.inputTexts;
			texts[id] = '';
			this.setData({
				inputTexts:texts
			});
		}
		var status = this.data.inputStatus;
		status[id] = WARN;
		this.setData({
			inputStatus:status
		});
		//删除完文本后隐藏按钮
		// this.toggleDeleteIcon(id,'');
	},
	/** input组件内文本同步*/
	assignValue:function(id,value){
		var values = this.data.inputTexts;
		if(id){
			values[id] = value;
			this.setData({
				inputTexts:values
			});
		}
	},
	/** 表单信息验证*/
	verifyForm:function(id,value){
		if((id>=0&&id<=2)||(id>=5&&id<=9)||id == 10)
			return true;
		if(id == 3||id == 11){
			return PHONE_REGEX.test(value);
		}
		// else if(id == 10){
		// 	return TELEPHONE_REGEX.test(value);
		// }
		else if(id == 4||id == 12){
			return EMAIL_REGEX.test(value);
		}
		return true;
	},
	/** 重置表单内容*/
	resetForm:function(res){
		var flag = res.currentTarget.dataset.flag;
		var i = 0;
		var len = 6;
		if(!flag){
			i = 6;
			len = 14;
		}
		var texts = this.data.inputTexts;
		var status = this.data.inputStatus;
		var display = this.data.displays;
		for(i;i<len;i++){
			texts[i] = '';
			status[i] = 'delete';
			display[i] = 'none';
		}
		this.setData({
			inputTexts:texts,
			inputStatus:status,
			displays:display
		});
	},
	/** 提交表单*/
	submitForm:function(e){
		var that = this;
		var status = this.data.inputStatus;
		var flag = e.currentTarget.dataset.flag;
		var msg = '';
		var i = 0;
		var length = 5;
		if(!flag){
			i = 6;
			length = 13;
		}
		for(i;i<length;i++){
			if(status[i] != SUCCESS){
				console.log(i);
				switch(i){
					case 0: msg = '请输入姓名！';break;
					case 1: msg = '请输入公司名称！';break;
					case 2: msg = '请输入职位！';break;
					case 3: msg = '请输入正确的手机号码(国际电话请加"+"和区号)！';break;
					case 4: msg = '请输入正确的邮箱地址！';break;
					case 6: msg = '请输入姓名！';break;
					case 7: msg = '请输入公司名称！';break;
					case 8: msg = '请输入职位！';break;
					case 9: msg = '请输入部门！';break;
					case 10: msg = '请输入正确的电话号码(国际电话请加"+"和区号)！';break;
					case 11: msg = '请输入正确的手机号码(国际电话请加"+"和区号)！';break;
					case 12: msg = '请输入正确的邮箱地址！';break;
				}
				wx.showToast({
				  title: msg,
				  icon: 'none',
				  duration: 2000
				});
				return false;
			}
		}
		var texts = this.data.inputTexts;
		var values = e.detail.value;
		console.log(values);
		var params = {
			name:values.name,
			company:values.company,
			position:values.position,
			phoneNumber:values.phoneNumber,
			email:values.email,
			companyInfo:values.companyInfo
		};
		wx.request({
			url:'http://localhost:8080/zllm/gatherInfo',
			data:values,
			dataType:'json',
			method:'GET',
			header: {
			   'content-type': 'application/json'
			},
			success:function(){
				that.resetForm(e);
				that.turnToOk();
				// wx.showToast({
				//   title: '成功提交信息！',
				//   icon: 'success',
				//   duration: 2000
				// });
			},
			fail:function(){
				wx.showToast({
				  title: '服务繁忙,请稍后。',
				  icon: 'none',
				  duration: 2000
				});
			}
		});
	},
	/** 切换页面*/
	turnPage:function(){
		//切换页面的动画对象
		var turnPageAnimationCache = wx.createAnimation({
		  duration: 1000,
		  timingFunction: "ease",
		  delay: 0
		});
		var width = this.data.moveWidth;
		if(width>0){
			wx.setNavigationBarTitle({
				title:'智联标委会成员单位征集'
			});
		}else{
			wx.setNavigationBarTitle({
				title:'智联联盟会员申请'
			});
		}
		turnPageAnimationCache.translate(-width).rotate((width>0?180:0)).step();
		//页面的动画
		var pageAnimationCache = wx.createAnimation({
		  duration: 1000,
		  timingFunction: "ease",
		  delay: 0
		});
		pageAnimationCache.translate(-(width>0?WIDTH:0)).step();
		width = width>0?0:MOVE_WIDTH;
		this.setData({
			turnPageAnimation:turnPageAnimationCache.export(),
			pageAnimation:pageAnimationCache.export(),
			moveWidth:width
		});
	},
	/** 转换信息提交成功页面*/
	turnToOk:function(){
		wx.navigateTo({
			url:'ok'
		});
	}
});
