// pages/order/order.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否为iphoneX
    baseUrl: neil.baseImg,
    list: [], //列表数据
    //顶部菜单
    nav: [{
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '待付款'
      },{
        id: 4,
        name: '已发货'
      },
      {
        id: 5,
        name: '待收货'
      },
      {
        id: 6,
        name: '待评价'
      }
    ],
    active: 0, //选中第一个
    pageIndex: 1, //页码
    pageSize: 10, //页码条数
    totalPageCount: '', //总页码数
    userInfo: null, //个人信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        active:parseFloat(options.status)
      })
    }
    this.init();
  },
  init() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    let url = '/api/xksxcx/postorderinfo';
    let params = {
      userid: that.data.userInfo.userid,
      status: that.data.active,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
    };
    neil.post(url, params, function (res) {
      if (res.data.success) {
        let tempArr = res.data.result.pageData;
        tempArr.forEach(item => {
          // item.express_time = util.formatTime(item.express_time);
          // item.payAllMoney = (item.total_money + item.trans_money) - item.riceprice
        })
        let temp = that.data.list;
        that.setData({
          list: that.data.pageIndex == 1 ? tempArr : temp.concat(tempArr),
          pageIndex: res.data.result.pageIndex,
          pageSize: res.data.result.pageSize,
          totalPageCount: res.data.result.totalPageCount,
        })
        that.computedFn();
      }
    })
  },

  computedFn() {
    let that = this;
    let tempArr = that.data.list;
    tempArr.forEach(item => {
      item.count = 0;
      // item.toPayMoney = 0;
      if (item.list.length) {
        item.list.forEach(item1 => {
          item.count += item1.num;
          // item.toPayMoney = (item.payMoney + item.trans_money - item.riceprice).toFixed(2)
        })
      }
    })
    that.setData({
      list: tempArr
    })
  },
  // 切换状态
  setIndex(e) {
    this.setData({
      active: e.currentTarget.dataset.id,
      pageIndex: 1
    });
    this.init();
  },

  // 去到支付页面
  pay: util.debounce(function (e) {
    let that = this;
    if (!that.data.userInfo) {
      return;
    }
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/orderPay/orderPay?ordercode=' + item.ordercode + '&paymoney=' + item.payMoney,
    })
  }),

  // 取消订单
  payCancel: util.debounce(function (e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let url = '/api/xksxcx/cancelorder';
    let params = {
      xdruserid: item.userid,
      orderid: item.orderid,
      shopbagid: item.shopbagid,
    }
    neil.post(url, params, function (res) {
      let tempArr = that.data.list;
      tempArr.forEach((item1, index) => {
        if (item1.orderid == item.orderid) {
          item1.status = 8;
        }
      })
      that.setData({
        list: tempArr
      })
      wx.showToast({
        title: '订单取消成功',
        icon: 'none',
        duration: 1000
      })
    })
  }),

  // 退款
  refund(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let url = '/api/xkspc/refundapply';
    let params = {
      ordercode: item.ordercode,
      orderid: item.orderid,
      wxordercode: item.wxordercode ? item.wxordercode : '', //商户号为null
      updateuserid: that.data.userInfo.userid, //
    }
    neil.post(url, params, function (res) {
      let tempArr = that.data.list;
      tempArr.forEach((item1, index) => {
        if (item1.orderid == item.orderid) {
          item1.status = 9;
        }
      })
      that.setData({
        list: tempArr
      })
      wx.showToast({
        title: '已提交退款申请',
        icon: 'none',
        duration: 1000
      })
    })
  },

  // 删除当前数据
  deleted: util.debounce(function (e) {
    let that = this;
    let Item = e.currentTarget.dataset.item;
    let tempArr = that.data.list;
    wx.showModal({
      content:'是否要删除该订单？',
      confirmColor:"#000000",
      success(res) {
        if (res.confirm) {
          let url = '/api/xksxcx/delorderinfo';
          neil.post(url, {
            id:parseInt(Item.orderid)
          }, function (res2) {
            if (res2.data.success) {
              tempArr.forEach((item, index) => {
                if (item.orderid == Item.orderid) {
                  tempArr.splice(index, 1);
                }
              })
              wx.showToast({
                title: '删除成功!',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                list: tempArr
              })
            }
          })
        }
      }
    })
  }),

  // 去详情页
  // toDetail(e) {
  // wx.navigateTo({
  //   url: '/pages/orderDetail/orderDetail?status=2&id=' + e.currentTarget.dataset.id,
  // })
  // },
  toDetail: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?status=2&id=' + e.currentTarget.dataset.id,
    })
  }),
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1
    })
    this.init();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.totalPageCount <= this.data.pageIndex) {
      return
    }
    let temp = this.data.pageIndex;
    temp++;
    this.setData({
      pageIndex: temp
    })
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})