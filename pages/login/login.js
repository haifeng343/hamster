// pages/login/login.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '', //手机号
    code: '', //验证码
    codeTxt: '获取验证码',
    IsDisAbled: true, //是否显示点击获取验证码
    IsClick: false, //是否可以点击
    isChecked: false,
    userInfo:null,//个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
  },

  // 获取手机号
  hasMobile(e) {
    let that = this;
    that.setData({
      mobile: e.detail.value
    })
    if (app.globalData.mobileReg.test(e.detail.value)) {
      that.setData({
        IsClick: true
      })
    } else {
      that.setData({
        IsClick: false
      })
    }
  },

  // 获取验证码
  hasCode(e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 发送验证码
  hasGetCode:util.debounce(function() {
    let that = this;
    let time = 60;
    if (!app.globalData.mobileReg.test(that.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号/账号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let url = '/api/xksxcx/sendlogincode';
    let params = {
      ID: that.data.mobile,
    }
    neil.post(url, params, function (res) {
      console.log(res);
      if (res.success == true) {
        wx.showToast({
          title: '验证码已发送,请注意查收',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          IsClick: true
        })
      }
    })
    let timer = setInterval(() => {
      time--;
      if (time > 0) {
        that.setData({
          codeTxt: time + 's',
          IsDisAbled: false
        })
      } else {
        that.setData({
          codeTxt: '获取验证码',
          IsDisAbled: true
        })
        clearInterval(timer);
      }
    }, 1000);

  }),

  // 同意
  changeSelect() {
    let that = this;
    that.setData({
      isChecked: !that.data.isChecked
    })
  },

  // 登录
  login:util.debounce(function() {
    let that = this;
    if (!that.data.mobile) {
      wx.showToast({
        title: '请输入手机号/账号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!app.globalData.mobileReg.test(that.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号/账号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!that.data.isChecked){
      wx.showToast({
        title: '请勾选用户服务协议',
        icon:'none',
        duration:2000
      })
      return false;
    }
    let url = '/api/xksxcx/login';
    let params = {
      mobile: that.data.mobile,
      checkCode: that.data.code,
      userid:that.data.userInfo.userid
    }
    neil.post(url, params, function (res) {
      //账号登录成功缓存个人信息供使用 授权之后会再次完善个人信息
      let user1 = wx.getStorageSync('userInfo');
      user1.phone = that.data.mobile;
      wx.setStorageSync('userInfo', user1);
      wx.setStorageSync('isGetCarList', true);
      wx.navigateBack({
        delta: 1
      })
    },null,false)

  }),

  // 用户须知
  goWebview:util.debounce(function() {
    wx.navigateTo({
      url: '/pages/webwiew/webview?type=1',
    })
  }),

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})