// pages/list/list.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: neil.baseImg,
    toView: '', //冒点
    scrollLeft: 0, //距离左边距离
    showId: wx.getStorageSync('active') || 1, //默认选择菜单栏
    showName: '质粒病毒', //默认选择空值
    scrollViewWidth: 0, //可视宽度
    // 导航菜单
    navList: [{
        id: 1,
        name: '质粒病毒'
      },
      {
        id: 2,
        name: '细胞提供'
      },
      {
        id: 3,
        name: '测序组学'
      },
      {
        id: 4,
        name: '病理实验'
      },
      {
        id: 5,
        name: '动物实验'
      },
      {
        id: 6,
        name: '细胞实验'
      },
      {
        id: 7,
        name: '分子检测'
      },
      {
        id: 8,
        name: '试剂抗体'
      },
    ],

    list: [], // 商品列表
    pageIndex: 1, //页码数
    pageSize: 10, //每页条数
    totalPageCount: '', //总页数
    // 购物车勾选列表
    carList: [],
    showDialog: false, //是否显示隐藏层
    allMoney: 0, //总价
    allPrice: 0, //节省
    allCount: 0, //总数

    userInfo: null, //个人信息
    checkList: [], //勾选的planid
    isClick: false, //禁止操作
    showCarList: false, //是否为当前操作的tab

    shopList: [], //购物车商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },

  // 初始化冒点
  onShow() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null
    })
    that.setData({
      showId: wx.getStorageSync('active') || 1,
    })
    that.init();
  },

  // 数据初始化
  init() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    let url = '/api/xksxcx/postplaninfo';
    // let tempArr1 = that.data.carList || []
    let params = {
      planname: '',
      typeid: that.data.showId + '',
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
    }
    neil.post(url, params, function (res) {
      let tempArr = res.data.result.pageData;
      let temp = that.data.list;
      tempArr.filter(item => {
        item.flag = true;
        item.number = 0;
        if (item.number >= item.quantity) {
          item.number = item.quantity
        }
        if (item.pic) {
          item.pic = item.pic
        } else if (item.picone) {
          item.pic = item.picone
        } else if (item.pictwo) {
          item.pic = item.pictwo
        } else if (item.picthree) {
          item.pic = item.picthree
        }
      });

      that.setData({
        list: that.data.pageIndex == 1 ? tempArr : temp.concat(tempArr),
        pageIndex: res.data.result.pageIndex,
        pageSize: res.data.result.pageSize,
        totalPageCount: res.data.result.totalPageCount
      })
      if (that.data.userInfo) {
        that.getCardList();
      }
    }, null, true)
  },

  // 去商品详情页面
  toDetail: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&number=' + e.currentTarget.dataset.number,
    })
  }),

  // 头部nav切换菜单
  setItem(e) {
    let that = this;
    that.setData({
      pageIndex: 1,
      list: []
    })
    that.setData({
      showId: e.currentTarget.dataset.id,
      showName: e.currentTarget.dataset.name,
    });

    that.init();
    wx.setStorageSync('active', parseFloat(e.currentTarget.dataset.id));
  },

  // 将当前商品添加进购物车
  addCardCount(e) {
    let that = this;
    let tempArr = that.data.list;
    let tempArr1 = that.data.carList || [];
    let Id = e.currentTarget.dataset.id;
    tempArr.forEach(item => {
      if (item.planid == Id) {
        item.number = 1;
        item.flag = false;
        item.allMoney = util.floatMul(item.number, item.price);
        tempArr1.push(item);
      }
    })
    that.setData({
      carList: tempArr1,
      list: tempArr
    });
    that.computedFc();
  },

  // 获取当前输入框的值
  hasInput(e) {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false
    }
    e.detail.value = e.detail.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
    let tempArr = that.data.carList;
    let tempArr1 = that.data.list;
    tempArr.forEach(item => {
      if (item.planid == e.currentTarget.dataset.id) {
        item.number = parseInt(e.detail.value ? e.detail.value : 1);
        if (e.detail.value >= item.quantity) {
          item.number = parseInt(item.quantity);
          e.detail.value = parseInt(item.quantity);
          wx.showToast({
            title: '已超出商品库存数量啦',
            icon: 'none',
            duration: 1000
          })
          return
        }
      }
    })
    tempArr1.forEach(item => {
      if (item.planid == e.currentTarget.dataset.id) {
        item.number = parseInt(e.detail.value ? e.detail.value : 1);
        if (e.detail.value >= item.quantity) {
          item.number = parseInt(item.quantity);
          e.detail.value = parseInt(item.quantity);
          wx.showToast({
            title: '已超出商品库存数量啦',
            icon: 'none',
            duration: 1000
          })
          return
        }
      }
    })
    //调用购物车商品数量变化接口
    let arr = that.data.shopList;
    tempArr1.forEach(item => {
      arr.filter(item1 => {
        if (item1.list.length) {
          item1.list.filter(item2 => {
            if (item.number > 0 && item2.planid == item.planid) { //如果商品的数量还大于0，则只是商品数量的改变
              that.deleteShhop(item2.shopid, item.number);
              return
            }
          })
        }
      });
    })

    that.setData({
      carList: tempArr,
      list: tempArr1
    })
    that.computedFc();
  },

  // 计算总价节省
  computedFc() {
    let [that, tempArr, allMoney, allPrice, allCount] = [this, this.data.carList || [], 0, 0, 0];
    tempArr.forEach(item => {
      allMoney += util.floatMul(item.price, item.number);
      allPrice += util.floatMul((item.original_price - item.price), item.number);
      allCount += item.number;
    })
    that.setData({
      allMoney: allMoney.toFixed(2),
      allPrice: allPrice,
      allCount: allCount
    })
  },

  // 显示/隐藏dialog
  dialogToggle() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },

  //获取到购物车的列表
  getCardList() {
    let that = this;
    let url = '/api/xksxcx/postshopcar';
    let params = {
      id: that.data.userInfo.userid,
    }
    neil.post(url, params, function (res) {
      let tempArr = res.data.result;
      let tempArr1 = that.data.list || [];
      let tempArr2 = [];
      that.setData({
        shopList: res.data.result
      });
      //初始化购物车列表和商品列表联动
      tempArr.forEach(item => {
        if (item.shopbagid == wx.getStorageSync('shopbagid')) {
          if (!item.list.length) {
            tempArr1.forEach(item1 => {
              item1.number = 0;
            })
          }
          if (item.list) {
            item.list.forEach(item1 => {
              tempArr1.forEach(item2 => {
                if (item1.planid == item2.planid) {
                  item2.number = item1.num;
                  if (item2.number >= item2.quantity) {
                    item2.number = item2.quantity
                  }
                }
              })
            })
          }
        }
      })
      //初始化商品列表和底部购物车列表联动
      tempArr1.filter(item => {
        return item.number > 0
      }).map(item => {
        tempArr2.push(item);
      })
      that.setData({
        list: tempArr1,
        carList: tempArr2,
        showCarList: tempArr2.length > 0 ? true : false,
      })
      that.computedFc();
    }, null, false)
  },

  // 添加/减少
  computedTo(e) {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false
    }
    let tempArr = that.data.list;
    let tempArr1 = [];
    let num = e.currentTarget.dataset.num;
    let arr = that.data.shopList;
    tempArr.filter(item => {
      if (item.planid == e.currentTarget.dataset.id) {
        if (num == 1) { //减法
          item.number--;
          arr.filter(item1 => {
            if (item1.shopbagid == wx.getStorageSync('shopbagid')) {
              if (item1.list.length) {
                item1.list.filter(item2 => {
                  if (item.number > 0) { //如果商品的数量还大于0，则只是商品数量的改变
                    if (item2.planid == item.planid) {
                      that.deleteShhop(item2.shopid, item.number);
                    }
                  }
                  if (item.number == 0) { //如果商品的数量为0，则在购物车删除相同的planid数据
                    if (item.planid == item2.planid) {
                      let url1 = '/api/xksxcx/delshopcarinfo';
                      let params1 = {
                        userid: parseInt(that.data.userInfo.userid),
                        shopbagid: parseInt(wx.getStorageSync('shopbagid')),
                        planid: parseInt(item.planid),
                        shopid: parseInt(item2.shopid)
                      };
                      neil.post(url1, params1, function (res1) {

                        that.getCardList();
                      }, null, false);
                    }
                  }
                })
              }
            }
          })

        }

        if (num == 2) { //加法
          if (item.number >= item.quantity) {
            wx.showToast({
              title: '已经超过了库存数量，不能再购买啦',
              icon: 'none',
              duration: 1000
            })
            return;
          }
          let url = '/api/xksxcx/addshopcar';
          let params = {
            planid: item.planid,
            userid: that.data.userInfo.userid,
            num: parseInt(item.number)+1,
            shoptype: 1, //1不累加 2累加
          };
          neil.post(url, params, function (res) {
            item.number++;
            that.getCardList();
          }, null, false);
        }
      }
    })

    tempArr.filter(item => {
      return item.number > 0;
    }).map(item => {
      tempArr1.push(item);
    })

    if (tempArr1.length == 0) {
      that.setData({
        showDialog: false,
        carList: tempArr1
      })
    }

    that.setData({
      list: tempArr,
      carList: tempArr1,
      showCarList: tempArr1.length > 0 ? true : false,
    })
    that.computedFc();
  },
  // 当前商品数量变化时调用该方法
  deleteShhop(id, num) {
    let that = this;
    let url = '/api/xksxcx/editshopcarnumber';
    let params = {
      shopid: parseFloat(id),
      num: parseInt(num),
    }
    neil.post(url, params, function (res) {

      that.getCardList();
    }, null, false)
  },

  // 订单支付
  goCar: util.debounce(function () {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      });
      return false;
    }
    if (that.data.userInfo.phone == '0' || !that.data.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let tempArr = that.data.carList;
    let a = tempArr.filter(item => {
      return item;
    }).map(item => {
      return {
        planid: item.planid,
        planname: item.planname,
        price: item.price,
        quantity: item.quantity,
        plancount: item.number,
        original_price: item.original_price,
        pic: item.pic
      }
    })
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?status=1&checkList=' + JSON.stringify(a) + '&addCar=1',
    })
  }),

  // 去搜索页面
  toSearch: util.debounce(function () {
    wx.navigateTo({
      url: '/pages/search/search',
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
    if (this.data.totalPageCount < this.data.pageIndex) {
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
  onShareTimeline(){
    return {
      title: '小科鼠|科研优选互动平台',
      path: '/pages/index/index?scene=' + wx.getStorageSync('userInfo').invite,
      imageUrl: '../../image/sharePng.png'
    }
  },
  onShareAppMessage: function () {
    return {
      title: '小科鼠|科研优选互动平台',
      path: '/pages/index/index?scene=' + wx.getStorageSync('userInfo').invite,
      imageUrl: '../../image/sharePng.png'
    }
  }
})