const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
const timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否为iphonex
    orderno: '', //订单号
    realpay: '', //支付金额
    total_fee: '', //标价金额 (支付金额x100)
    isClick: false, //是否可以点击
    time: '15:00', //时间
    userInfo: null, //个人信息
    paySuccess: false, //是否支付成功
    nonceStr: '',
    package: '',
    paySign: '',
    timeStamp: '',
  },

  onLoad: function (options) {
    let that = this;
    if (options) {
      that.setData({
        orderno: options.ordercode + '',
        realpay: parseFloat(options.paymoney),
        total_fee: parseInt(options.paymoney * 100)
      })
    }
    // let count = 900;
    // clearInterval(timer);
    // let timer = setInterval(function () {
    //   if (count == 0) {
    //     clearInterval(timer)
    //   } else {
    //     count--;
    //     let minutes = (Math.floor(count / 60));
    //     let seconds = (Math.floor(count % 60));
    //     // console.log(minutes+':'+seconds);
    //     if (seconds < 10) {
    //       seconds = '0' + seconds
    //     }
    //     that.setData({
    //       time: minutes + ':' + seconds
    //     })
    //     if (count == 0) { //倒计时到了   取消订单
    //       let url = '/api/xksxcx/cancelorder';
    //       let params = {
    //         xdruserid: that.data.userInfo.userid,
    //         orderid: options.ordercode + '',
    //         shopbagid: wx.getStorageSync('shopbagid'),
    //       }
    //       neil.post(url, params, function (res) {

    //       }, null, false);
    //       clearInterval(timer)
    //     }
    //   }
    // }, 1000)

  },
  onShow() {
    this.setData({
      isClick: true,
      userInfo: wx.getStorageSync('userInfo') || null,
    })
  },

  // 吊起微信支付
  pay: util.debounce(function (e) {
    let that = this;
    if (that.data.isClick) {
      let url = '/api/xksxcx/pay';
      let params = {
        ordercode: that.data.orderno,
        paymoney: parseFloat(that.data.realpay),
        totalfee: parseInt(that.data.total_fee),
        openid: wx.getStorageSync('userInfo').openId
      }
      neil.post(url, params, function (res) {
        if (res.data.success) { //成功之后吊起微信支付 并监听回调
          that.setData({
            isClick: false,
            nonceStr: res.data.result.nonceStr,
            package: res.data.result.package,
            paySign: res.data.result.paySign,
            timeStamp: res.data.result.timeStamp,
          })
          wx.requestPayment({
            nonceStr: that.data.nonceStr,
            package: that.data.package,
            paySign: that.data.paySign,
            signType: 'MD5',
            timeStamp: that.data.timeStamp,
            success(res1) {
              console.log(res1);
              if (res1.errMsg == "requestPayment:ok") {
               wx.redirectTo({
                url:'/pages/payok/payok?orderno='+that.data.orderno+'&realpay='+that.data.realpay
               })
              }
              that.setData({
                isClick: true
              })
            },
            fail(res1) {
              wx.redirectTo({
                url: '/pages/payeor/payeor',
              })
              that.setData({
                isClick: true
              })
            },
            complete(res1) {
              // let pages = getCurrentPages();
              // let befoPage = pages[pages.length - 2];
              // if (!befoPage) return;
              // console.log(befoPage.data.list, 111111);
              // return
            }
          })
        }
      })
    }
  }),

  // 用户取消支付
  cancelPay() {
    let that = this;
    let url = '/api/xksxcx/cancelorder';
    let params = {
      xdruserid: that.data.userInfo.userid,
      orderid: that.data.orderno + '',
      shopbagid: wx.getStorageSync('shopbagid'),
    }
    neil.post(url, params, function (res) {
      wx.showToast({
        title: '用户取消支付',
        image: '../../image/cancel.png'
      })
    }, null, false)
  },

  onShareAppMessage: function () {

  }
})