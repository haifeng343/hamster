// pages/car/car.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({


  // 当前是 tab 页时，点击 tab 时触发
  onTabItemTap(e) {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null
    })
    if (e.index == 2) {
      wx.setStorageSync('isGetCarList', true);
    }
    // if (wx.getStorageSync('isGetCarList')) {
    if (that.data.userInfo) {
      this.init();
    }
    that.setData({
      checkList: [],
      payMoney: 0,
      save: 0,
    })
    // }
  },
  /**
   * 页面的初始数据
   */
  data: {
    pc: '',
    baseUrl: neil.baseImg,
    num: 0, //1选择支付方式 2选择配送方式 3收货地址选择
    payId: 1, //支付方式
    payTxt: '', //支付名称
    delId: 0, //配送方式
    delTxt: '', //配送
    delMoney: 0, //配送价格
    recevierInfo: null, //取货人信息
    recevierId: 0, //取货人Id
    // 支付列表
    payList: [],
    // 配送方式
    deliveryList: [],
    userInfo: null, //个人信息
    carList: [], //购物车包列表
    // x轴方向的偏移
    x: 0,
    // 当前x的值
    currentX: 0,
    allChecked: false, //全选选中
    payMoney: 0, //总价格
    save: 0, //节省
    allCount: 0, //商品总数量

    bagId: '', //所勾选的购物包id
    checkList: [], //当前购物包所勾选的商品id
    checkList1: [], //所有购物包里勾选的商品id对应的商品信息

    bagDialog: false, //添加购物包弹窗
    bagName: '', //购物包的名称
    bagTitle: '新增购物包', //弹窗title是添加还是编辑

    IsSelect: false, //是否默认选中当前购物包
    status: 1, //1显示默认选中 2隐藏默认选中

    showName: '', //编辑所打开的购物包名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    // if (wx.getStorageSync('isGetCarList')) {
    if (wx.getStorageSync('userInfo')) {
      that.init();
    }
    // }
  },

  onShow() {
    this.setData({
      pc: wx.getStorageSync('pc') || 1
    })
  },
  // 获取购物车包列表
  init() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    let url = '/api/xksxcx/postshopcar';
    let params = {
      id: that.data.userInfo.userid,
    }
    neil.post(url, params, function (res) {
      let tempArr = res.data.result;
      tempArr.forEach(item => {
        item.x = 0; //商品横向滚动删除
        item.toggle = false; //默认折叠
        if (item.isCheck) { //初始化将购物车默认选中id赋值
          that.setData({
            bagId: item.shopbagid
          })
          wx.setStorageSync('shopbagid', item.shopbagid)
          item.toggle = true;
        }
        if (item.list.length) {
          item.list.forEach(item1 => {
            if (item1.num >= item1.quantity) {
              item1.num = item1.quantity
            }
            item1.isCheck = false; //
            item.arr = []; //放勾选的商品列表
          })
        }
      });
      that.setData({
        carList: tempArr,
      });
    }, null, false)
  },

  // 展开/收起
  toggle(e) {
    let that = this;
    let tempArr = that.data.carList;
    tempArr.forEach(item => {
      if (item.shopbagid == e.currentTarget.dataset.id) {
        item.toggle = !item.toggle;
      }
    });
    that.setData({
      carList: tempArr
    })
  },

  // 去商品详情页面
  toDetail: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&number=' + e.currentTarget.dataset.number,
    })
  }),

  //点击跳转页面 1选择支付方式 2选择配送方式 3收货地址选择
  capTo: util.debounce(function (e) {
    let that = this;
    let num = parseFloat(e.currentTarget.dataset.num);
    that.setData({
      num: num
    })
    if (num == 1) {
      wx.navigateTo({
        url: '/pages/way/way?num=1' + '&id=' + that.data.payId,
      });
    }
    if (num == 2) {
      wx.navigateTo({
        url: '/pages/way/way?num=2' + '&id=' + that.data.delId,
      });
    }
    if (num == 3) {
      wx.navigateTo({
        url: '/pages/addressList/addressList?status=1&id=' + that.data.recevierId,
      })
    }
  }),

  //购物包下面的产品
  selectChange(e) {
    let that = this;
    let tempArr = that.data.carList;
    let idx = e.currentTarget.dataset.index;
    let arr = this.data.carList[idx].list;
    let bagid = e.currentTarget.dataset.bagid;
    that.setData({
      bagId: bagid
    });
    that.setBag();
    tempArr.forEach(item => {
      if (item.shopbagid == bagid) {
        that.setData({
          bagName: item.bagname
        })
        arr.forEach(item => {
          item.isCheck = false;
          e.detail.value.forEach(item1 => {
            if (item1 == item.planid) {
              item.isCheck = !item.isCheck
            }
          })
        })
      } else {
        if (item.list) {
          item.list.forEach(item1 => {
            item1.isCheck = false;
            item.arr = [];
          })
        }
      }
    })
    tempArr.forEach(item => {
      if (item.shopbagid == e.currentTarget.dataset.bagid) {
        item.arr = e.detail.value
      }
    })
    tempArr.forEach(item => {
      if (item.shopbagid == bagid) {
        item.isCheck = true;
      } else {
        item.isCheck = false;
      }
    })
    that.setData({
      bagId: bagid,
      carList: tempArr
    })
    wx.setStorageSync('shopbagid', bagid);
    that.computedMount();
  },

  // 计算勾选的商品总价 节省 运费
  computedMount() {
    let that = this;
    let [tempArr2, money, old_money, arr] = [that.data.carList, 0, 0, []];

    arr = tempArr2.filter(item => {
      return item.arr
    }).map(item => {
      return item.arr
    })
    let arr1 = arr.reduce((prev, cur, index, ary) => {
      return [...prev, ...cur];
    })
    tempArr2.forEach(item => {
      if (item.shopbagid == that.data.bagId) {
        if (item.list.length) {
          item.list.forEach(item1 => {
            if (arr1.length) {
              arr1.filter(item2 => {
                if (item1.planid == item2) {
                  money += util.floatMul(item1.price, item1.num);
                  old_money += util.floatMul((item1.original_price) - (item1.price), item1.num);
                }
              })
            }
          })
        }
      }
    })
    that.setData({
      payMoney: money,
      save: old_money,
      checkList: arr1,
    })
  },

  // 滑块发生改变的时候
  handleMovableChange: function (e) {
    this.data.currentX = e.detail.x;
  },

  // 滑块滑动结束
  handleTouchend: function (e) {
    this.isMove = true;
    if (this.data.currentX < -10) {
      this.data.x = -50;
      this.setData({
        x: this.data.x
      });
    } else {
      this.data.x = 0;
      this.setData({
        x: this.data.x
      });
    }
  },

  //删除当前行购物车数据
  deletedItem(e) {
    let that = this;
    let tempArr = that.data.carList;
    tempArr.filter(item => {
      if (item.shopbagid == wx.getStorageSync('shopbagid')) {
        if (item.list.length) {
          item.list.filter((item1, index) => {
            if (item1.planid == e.currentTarget.dataset.planid) {
              wx.showModal({
                content: '确定删除该商品吗？',
                success(res) {
                  if (res.confirm) {
                    item.list.splice(index, 1);
                    let url = '/api/xksxcx/delshopcarinfo';
                    let params = {
                      userid: parseInt(that.data.userInfo.userid),
                      shopbagid: parseInt(e.currentTarget.dataset.bagid),
                      planid: parseInt(e.currentTarget.dataset.planid),
                      shopid: parseInt(e.currentTarget.dataset.shopid)
                    };
                    neil.post(url, params, function (res) {
                      if (res.data.success) {
                        that.init();
                      }
                    }, null, false)
                  }
                }
              })
            }
          })
        }
      }
    })
    that.setData({
      carList: tempArr,
    })
    that.computedMount();
  },
  handleTouchestart: function (e) {},

  //获取当前行的数值
  hasNumber(e) {
    e.detail.value = e.detail.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
    let that = this;
    let bagid = e.currentTarget.dataset.bagid;
    let tempArr = that.data.carList;
    tempArr.forEach(item => {
      if (item.shopbagid == bagid) {
        if (item.list.length) {
          item.list.forEach(item1 => {
            if (item1.planid == e.currentTarget.dataset.id) {
              item1.num = e.detail.value;
              console.log(e.detail.value)
              if (e.detail.value >= item1.quantity) {
                wx.showToast({
                  title: '已经超出了商品的库存数量啦',
                  icon: 'none',
                  duration: 1000
                })
                item1.num = item1.quantity;
              }
              if (e.detail.value == 0) {
                item1.num = 1;
              }
            }
          })
        }
      }
    })
    that.setData({
      carList: tempArr
    })
    that.computedMount();
  },

  //购物车减少数量
  removed(e) {
    let that = this;
    let tempArr = that.data.carList;
    tempArr.forEach((item, index) => {
      if (item.shopbagid == wx.getStorageSync('shopbagid')) {
        if (item.list.length) {
          item.list.forEach((item1, index1) => {
            if (item1.planid == e.currentTarget.dataset.id) {
              item1.num--;
              if (item1.num >= 1) {
                that.deleteShop(e.currentTarget.dataset.shopid, item1.num);
              }
              if (item1.num == 0) {
                item1.num = 1;
                wx.showModal({
                  content: '确定删除当前商品吗？',
                  success(res) {
                    if (res.confirm) {
                      tempArr[index].list.splice(index1, 1);
                      let url = '/api/xksxcx/delshopcarinfo';
                      let params = {
                        userid: parseInt(that.data.userInfo.userid),
                        shopbagid: parseInt(e.currentTarget.dataset.shopbagid),
                        planid: parseInt(e.currentTarget.dataset.id),
                        shopid: parseInt(e.currentTarget.dataset.shopid)
                      };
                      neil.post(url, params, function (res) {
                        that.init();
                      }, null, false)
                    } else {
                      item1.num = 1;
                      that.init();
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    that.setData({
      carList: tempArr
    })
    that.computedMount();
  },

  // 商品添加
  add(e) {
    let that = this;
    let tempArr = that.data.carList;
    tempArr.forEach(item => {
      if (item.shopbagid == wx.getStorageSync('shopbagid')) {
        if (item.list) {
          item.list.forEach(item1 => {
            if (item1.planid == e.currentTarget.dataset.id) {
              if (item1.num >= item1.quantity) {
                wx.showToast({
                  title: '已经超过了库存数量，不能再购买啦',
                  icon: 'none',
                  duration: 1000
                })
                return;
              }
              item1.num++;
              that.deleteShop(e.currentTarget.dataset.shopid, item1.num);
            }
          })
        }
      }
    })
    that.setData({
      carList: tempArr
    })
    that.computedMount();
  },

  // 选择了哪一个购物包
  bagSelect(e) {
    let that = this;
    let tempArr = that.data.carList;
    that.setData({
      checkList: [],
      payMoney: 0,
      save: 0
    })
    tempArr.forEach(item => {
      item.isCheck = false;
      if (item.list.length) {
        item.list.forEach(item1 => {
          item1.isCheck = false;
        })
      }
      if (item.shopbagid == e.detail.value) {
        that.setData({
          bagName: item.bagname
        })
        item.isCheck = true;
        item.toggle = true;
      } else {
        item.isCheck = false;
        item.toggle = false;
      }
    })
    that.setData({
      carList: tempArr,
      bagId: e.detail.value
    });
    wx.setStorageSync('shopbagid', e.detail.value);
    that.setBag();
  },

  // 将当前购物包设为选中购物包
  setBag() {
    let that = this;
    let url = '/api/xksxcx/editshopbagstatus';
    let params = {
      userid: parseInt(that.data.userInfo.userid),
      shopbagid: parseInt(that.data.bagId)
    };
    neil.post(url, params, function (res) {}, null, false);
  },
  onHide() {
    //页面离开之后调用切换的默认购物包 减少接口请求
    wx.setStorageSync('isGetCarList', false)
  },

  // 当前商品数量变化时调用该方法
  deleteShop(id, num) {
    let that = this;
    let url = '/api/xksxcx/editshopcarnumber';
    let params = {
      shopid: parseFloat(id),
      num: parseFloat(num),
    }
    neil.post(url, params, function (res) {}, null, false)
  },

  // 去支付
  goPay: util.debounce(function () {
    let that = this;
    if (!that.data.checkList.length) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (that.data.userInfo.phone == '0' || !that.data.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    let tempArr = that.data.carList;
    let arr = [];
    tempArr.forEach(item => {
      if (item.list) {
        item.list.forEach(item1 => {
          if (item1.isCheck)[
            arr.push(item1)
          ]
        })
      }
    })
    let a = arr.filter(item => {
      return item;
    }).map(item => {
      return {
        planid: item.planid,
        planname: item.planname,
        price: item.price,
        quantity: item.quantity,
        plancount: item.num,
        original_price: item.original_price,
        pic: item.pic
      }
    })
    console.log(a)
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?status=1&checkList=' + JSON.stringify(a) + '&shopbagid=' + that.data.bagId,
    })
  }),

  // 点击更多
  setStatus: util.debounce(function (e) {
    let that = this;
    that.setData({
      status: 2,
      showName: e.currentTarget.dataset.bagname
    })
    let toust = false; //是否有商品
    let tempArr = that.data.carList;
    let names = ''; //包名
    let isCheck = false; //是否勾选
    tempArr.forEach(item => {
      if (item.shopbagid == e.currentTarget.dataset.bagid) {
        names = item.bagname;
        isCheck = item.isCheck;
        if (item.list.length > 0) {
          toust = true;
        }
      }
    });
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        // 编辑
        if (res.tapIndex == 0) {
          that.setData({
            bagDialog: true,
            bagName: names,
            bagTitle: '编辑购物包',
            IsSelect: isCheck,
            bagId: e.currentTarget.dataset.bagid
          });
        }
        //删除
        if (res.tapIndex == 1) {
          if (toust) {
            wx.showModal({
              content: '该购物包下还有商品未购买，是否确认删除？',
              confirm: '确定',
              confirmColor: '#000',
              success(res) {
                if (res.confirm) {
                  tempArr.forEach((item, index) => {
                    if (item.shopbagid == e.currentTarget.dataset.bagid) {
                      tempArr.splice(index, 1);
                    }
                  })
                  that.setData({
                    carList: tempArr
                  })
                  wx.showToast({
                    title: '删除成功!',
                    icon: 'none',
                    duration: 2000
                  })
                  let url = '/api/xksxcx/delshopbaginfo';
                  let params = {
                    shopbagid: parseFloat(e.currentTarget.dataset.bagid),
                    shopbagname: e.currentTarget.dataset.bagname
                  };
                  neil.post(url, params, function (res) {

                  })
                }
              }
            })
            return
          }
          wx.showModal({
            content: '是否删除该购物包？',
            confirm: '确定',
            confirmColor: '#000',
            success(res) {
              if (res.confirm) {
                tempArr.forEach((item, index) => {
                  if (item.shopbagid == e.currentTarget.dataset.bagid) {
                    tempArr.splice(index, 1);
                  }
                })
                that.setData({
                  carList: tempArr
                })
                wx.showToast({
                  title: '删除成功!',
                  icon: 'none',
                  duration: 2000
                })
                let url = '/api/xksxcx/delshopbaginfo';
                let params = {
                  shopbagid: parseFloat(e.currentTarget.dataset.bagid),
                  shopbagname: e.currentTarget.dataset.bagname
                };
                neil.post(url, params, function (res) {

                })
              }
            }
          })

        }
      }
    })
  }),

  // 显示添加购物包弹窗
  showBagDialog() {
    this.setData({
      status: 1
    })
    this.setData({
      bagDialog: true,
      bagTitle: '添加购物包',
      IsSelect: false,
      bagName: '',
    })
  },

  // 获取包名
  hasBagName(e) {
    this.setData({
      bagName: e.detail.value
    })
  },

  // 取消新增购物包
  cancelDialog() {
    this.setData({
      bagDialog: false,
      bagName: ''
    })
  },

  // 确定新增购物包
  confimDialog() {
    let that = this;
    if (!that.data.bagName) {
      wx.showToast({
        title: '请输入购物包名',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // if(that.data.bagName == that.data.showName){//如果和编辑打开的购物包名一致则不调用接口直接关闭弹窗
    //   that.setData({
    //     bagDialog: false,
    //   })
    //   return;
    // }
    let url = that.data.bagTitle == '编辑购物包' ? '/api/xksxcx/editshopbagname' : '/api/xksxcx/addshopbag';
    let params = {
      userid: that.data.userInfo.userid,
      bagname: that.data.bagName,
      bagtype: 3,
      isCheck: that.data.IsSelect,
      shopbagid: parseFloat(that.data.bagTitle == '编辑购物包' ? that.data.bagId : 0)
    };
    neil.post(url, params, function (res) {
      that.setData({
        bagDialog: false,
        bagName: ''
      })
      that.init();
    })
  },

  // 清除弹出框的内容
  cleard() {
    this.setData({
      bagName: '',
    })
  },

  // 是否默认选中
  changeSelect(e) {
    console.log(e.detail.value)
    this.setData({
      IsSelect: e.detail.value
    })
  },

  // 去登录
  toLogin: util.debounce(function () {
    wx.navigateTo({
      url: '/pages/warrant/warrant',
    })
  }),

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

  }
})