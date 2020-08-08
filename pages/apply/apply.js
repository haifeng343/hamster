// pages/apply/apply.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:app.globalData.isIphoneX || false,//是否为iphoneX
    name:'',//姓名
    mobile:'',//手机号
    email:'',//邮箱
    address:'',//详细地址
    job:'',//职业
    city:'',//城市
    orgName:'',//学校名称
    orgCode:'',//学校代码
    IsShow:false,//显示省市区
    isChecked:false,//是否勾选了用户协议
    userInfo:null,//用户信息
    agree:wx.getStorageSync('agree') || false,//同意

    IsSuccess:false,//提交成功 显示该弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow(){
    this.setData({
      name:wx.getStorageSync('userInfo').realname || '',
      userInfo:wx.getStorageSync('userInfo') || null
    })
    this.isAgree();
  },

  // 用户是否已申请
  isAgree(){
    let that = this;
    let url = '/api/xkspc/postpartnerapply';
    neil.post(url,{id:that.data.userInfo.userid},function(res){

    })
  },

  // 省市区选择
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value,
      IsShow:true,
      regionCode:e.detail.code
    })
  },

  // 取消
  bindNoChange(e){
    this.setData({
      region:this.data.region
    })
  },

  // 用户须知
  goWebview() {
    wx.navigateTo({
      url: '/pages/webwiew/webview',
    })
  },

  // 收货人
  hasName(e){
    this.setData({
      name:e.detail.value
    }) 
  },
  // 联系方式
  hasMobile(e){
    this.setData({
      mobile:e.detail.value
    }) 
  },
  // 职业
  hasJob(e){
    this.setData({
      job:e.detail.value
    }) 
  },
  // 学校名称
  hasOrgName(e){
    this.setData({
      orgName:e.detail.value
    }) 
  },
  // 学校代码
  hasOrgCode(e){
    this.setData({
      orgCode:e.detail.value
    }) 
  },
  // 邮箱地址
  hasEmail(e){
    this.setData({
      email:e.detail.value
    }) 
  },
  // 获取用户地址
  hasCity(e){
    this.setData({
      city:e.detail.value
    })
  },

  // 详细地址
  hasAddress(e){
    this.setData({
      address:e.detail.value
    }) 
  },

  // 用户是否否选了用户协议
  changeSelect(){
    this.setData({
      isChecked:!this.data.isChecked
    })
    wx.setStorageSync('agree', this.data.isChecked);
  },

  // 保存
  send:util.debounce(function(){
    let that = this;
    if(!that.data.name){
      wx.showToast({
        title: '请填写姓名',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.mobile){
      wx.showToast({
        title: '请填写手机号码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!app.globalData.mobileReg.test(that.data.mobile)){
      wx.showToast({
        title: '请填写正确的手机号码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.job){
      wx.showToast({
        title: '请填写职业',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.city){
      wx.showToast({
        title: '请填写所在城市',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.address){
      wx.showToast({
        title: '请填写所在地址',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.email){
      wx.showToast({
        title: '请填写邮箱地址',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!app.globalData.emailReg.test(that.data.email)){
      wx.showToast({
        title: '请填写正确的邮箱地址',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(that.data.isChecked == false){
      wx.showToast({
        title: '请同意用户服务协议',
        icon:'none',
        duration:2000
      })
      return false;
    }
    let url = '/api/xksxcx/applypartnerpeople';
    let params = {
      userid:that.data.userInfo.userid+'',
      citys:that.data.city+'',
      email:that.data.email,
      mobile:that.data.mobile,
      professional:that.data.job,
      hhaddress:that.data.address,
      orgCode:that.data.orgCode,
      orgName:that.data.orgName,
    };
    console.log(params)
    neil.post(url,params,function(res){
      that.setData({
        IsSuccess:true
      })
    })
  }),

  // 关闭弹窗
  closeDialog(){
    this.setData({
      IsSuccess:false
    })
    wx.navigateBack({
      delta:1
    });
  },

  onShareAppMessage: function () {

  }
})