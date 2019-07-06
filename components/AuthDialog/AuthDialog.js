// components/AuthDialog.js
Component({

	options: {
		//在组件定义时的选项中启用多slot支持
		multipleSlots:true
	},

	/**
	 * 组件的属性列表
	 */

	//对外属性，当外部wxml文件传入数据时，会将数据设置成properties的属性
	properties: {
		AuthTitle:{
			type:String,
			value:'权限标题'
		},
		AuthContent:{
			type:String,
			value:'权限内容'
		},
		ConfirmButton:{
			type:String,
			value:'确定'
		},
		CancelButton:{
			type:String,
			value:'取消'
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		ShouldShow:false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		//隐藏弹框
		hideDialog(){
			this.setData({
				ShouldShow:false
			})
		},
		//显示弹框
		showDialog(){
			this.setData({
				ShouldShow:true
			})
		},
		//点击cancel按钮后
		cancelEvent(){
			this.triggerEvent("cancelEvent");
		},
		//点击确定按钮后
		confirmEvent(){
			this.triggerEvent("confirmEvent");
		}
	}
})
