// pages/detail/detail.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: neil.baseImg,
    Id: 0, //当前商品id
    isIphoneX: app.globalData.isIphoneX, //是否为iphonex
    // 商品列表
    list: [],
    carList: [], //购物车列表
    number: 1, //购买数量
    detail: null, //购物车详情
    showId: null, //默认选中了哪一个
    banner: [], //轮播图

    shopCarList: [], //购物车内购物包商品列表

    userInfo: null, //获取个人信息
    current: 0, //滑块的index
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options) {
      that.setData({
        Id: parseFloat(options.id),
        userInfo: wx.getStorageSync('userInfo'),
        number: parseFloat(options.number) || 1,
      })
      wx.setNavigationBarTitle({
        title: options.name,
      })
    }
    that.init();
  },
  // 页面卸载的时候调用上一页面的初始化
  onUnload(){
    let pages = getCurrentPages();
    let befoPage = pages[pages.length -2];
    befoPage.init();
  },

  // 初始化
  init() {
    // 获取商品详情
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    let url = "/api/xksxcx/postplandetail";
    let params = {
      id: parseFloat(that.data.Id)
    }
    neil.post(url, params, function (res) {
      let temp = res.data.result;
      let tempArr = [];
      temp.list = temp.list.filter(item=>{
        return item.planname;
      })
      tempArr.push(temp.pic, temp.picone, temp.pictwo, temp.picthree);
      let arr = tempArr.filter(item => {
        return item;
      }).map(item => {
        return that.data.baseUrl+item
      })
      if (temp.list) {
        temp.list.forEach(item => {
          if (that.data.Id == item.planid) {
            that.setData({
              showId: item.planid
            })
          }
        })
      }
      that.setData({
        detail: temp,
        banner: arr
      })
    }, null, false)

    // 推荐列表
    neil.post('/api/xksxcx/postrecommendinfo', {
      id: parseFloat(that.data.Id)
    }, function (res1) {
      let temp = res1.data.result;
      temp.forEach(item => {
        if (item.pic) {
          item.pic = item.pic;
        } else if (item.picone) {
          item.pic = item.picone;
        } else if (item.pictwo) {
          item.pic = item.pictwo;
        } else if (item.picthree) {
          item.pic = item.picthree;
        }
      })
      that.setData({
        list: temp
      });
    }, null, false)
  },

  // 预览图片
  priview(e){
    let that = this;
    wx.previewImage({
      urls: that.data.banner,
      current:e.currentTarget.dataset.current
    })
  },

  // 滑块
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 获取当前数量
  hasNumber(e) {
    let that = this;
    e.detail.value = e.detail.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
    that.setData({
      number: e.detail.value
    })
    if (e.detail.value >= that.data.detail.quantity) {
      e.detail.value = that.data.detail.quantity;
      that.setData({
        number: that.data.detail.quantity
      })
      wx.showToast({
        title: '已超出商品库存数量啦',
        icon: 'none',
        duration: 1000
      })
    }
    if (e.detail.value == 0) {
      that.setData({
        number: 1
      })
    }

  },

  // 切换产品型号
  setItem: util.debounce(function (e) {
    let that = this;
    this.setData({
      Id: parseFloat(e.currentTarget.dataset.id),
      showId: parseFloat(e.currentTarget.dataset.id),
      number: 1
    });
    that.init();
  }),

  // 去商品详情页面
  toDetail: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  }),

  // 将当前商品添加进购物车
  addCardCount: util.debounce(function (e) {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
    let Id = e.currentTarget.dataset.id;
    let url = '/api/xksxcx/addshopcar';
    let params = {
      planid: Id,
      userid: that.data.userInfo.userid,
      num: 1,
      shoptype:2,//1不累加 2累加
    };
    neil.post(url, params, function (res) {
      if(res.data.success){
        wx.showToast({
          title: '已成功添加进购物车',
          icon: 'none',
          duration: 2000
        })
      }
    }, null, false);
  }),

  // 将勾选的商品 数量和标签 加入购物车
  addCar: util.debounce(function () {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
    wx.setStorageSync('isGetCarList', true);

    let url = '/api/xksxcx/addshopcar';
    let params = {
      planid: that.data.Id,
      userid: that.data.userInfo.userid,
      num: parseInt(that.data.number),
      shoptype:2,//1不累加 2累加
    };
    neil.post(url, params, function (res) {
      if(res.data.success){
        wx.showToast({
          title: '已成功添加进购物车',
          icon: 'none',
          duration: 2000
        })
      }
    }, null, false);
  }),

  // 加/减
  computedCount(e) {
    let [that, num, number] = [this, e.currentTarget.dataset.num, this.data.number];
    if (num == 1) { //减法
      number--;
      if (number == 0) {
        return
      }
    } else if (num == 2) { //加法
      number++;
      if (number > that.data.detail.quantity) {
        number = that.data.detail.quantity;
        wx.showToast({
          title: '已经超过了库存数量，不能再购买啦',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    } else {

    }
    that.setData({
      number: number
    })
  },

  // 去购物车
  goCar: util.debounce(function () {
    if (!this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
    wx.setStorageSync('isGetCarList', true);
    wx.switchTab({
      url: '/pages/car/car',
    })
  }),

  
  //获取到购物车的列表
  getCardList() {
    let that = this;
    let url = '/api/xksxcx/postshopcar';
    let params = {
      id: that.data.userInfo.userid,
    }
    neil.post(url, params, function (res) { 
      that.setData({
        shopCarList: res.data.result
      });
    }, null, false)
  },

  // 去支付
  goPay: util.debounce(function () {
    let that = this;
    let addCard = false;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
    if (that.data.userInfo.phone == '0' || !that.data.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let checkList = [];
    checkList.push({
      planid: that.data.detail.planid,
      planname: that.data.detail.planname,
      price: that.data.detail.price,
      original_price: that.data.detail.original_price,
      quantity: that.data.detail.quantity,
      plancount: that.data.number,
      pic: that.data.banner[0]
    })
    //把这里的商品和购物车里的商品列表做对比 若有则不再创建订单 addcar传false  否则addcar传true    
    let tempArr = that.data.shopCarList;
    tempArr.forEach(item=>{
      if(item.showbagid== wx.getStorageSync('showbagid')){
        if(item.list.length){
          item.list.forEach(item1=>{
            if(item1.planid == that.data.detail.planid){
              addCard = false
            }else{
              addCard = true
            }
          })
        }
      }
    })
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?status=1&checkList=' + JSON.stringify(checkList) + '&addCar='+addCard,
    })
  }),


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})