const neil = require("../../utils/request.js"); //require引入
var setTime;
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    orderId: '',
    ordersn: '',
    payamount: '',
    type: "",
  },
  onShow: function() {
    this.timefc();
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      orderId: options.OrderId || '',
      ordersn: options.ordersn || '',
      payamount: options.money || '',
      type: options.type || "",
    })
  
  },
  init: function() {

  },
  timefc: function() {
    let that = this;
    if (setTime) {
      clearInterval(setTime);
    }
    setTime = setInterval(function() {
      that.payok(false, function(res) {
        if (res.IsPay) {
          clearInterval(setTime);
          wx.redirectTo({
            url: '/pages/payOk/payOk?OrderId=' + that.data.orderId + '&type=' + that.data.type,
          })
        }
      });
    }, 2000);
  },
  
  //支付成功
  payok: function(isShowLoading, onSuccess) {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    neil.post(url, params, function(res) {
        that.setData({
          orderContent: res.Data
        })
        onSuccess(res.Data);
      },
      function(val) {
        console.log(1111111)
        if (setTime) {
          clearInterval(setTime);
        }
      },
      isShowLoading,
      false);
  },
  groupTo:util.debounce(function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }),
  onUnload: function() {
    clearInterval(setTime);
  },
  bindPayok:util.debounce(function() {
    let that = this;
    that.payok(true, function(res) {
      if (res.IsPay) {
        clearInterval(setTime);
        wx.redirectTo({
          url: '/pages/payOk/payOk?OrderId=' + that.data.orderId + '&type=' + that.data.type,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '购买未完成，请稍后重试...',
        })
      }
    });
  }),
  onShareAppMessage: function(res) {
    return {
     
    }
  },
})