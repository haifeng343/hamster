// pages/car/car.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: neil.baseImg,//图片头部链接
    isIphoneX: app.globalData.isIphoneX, //是否为iphoneX
    status: 2, // 1订单支付 2订单详情
    num: 0, //1选择支付方式 2选择配送方式 3收货地址选择
    payId: 1, //支付方式
    payTxt: '', //支付名称
    delId: 1, //配送方式
    delTxt: '常温配送', //配送
    delMoney: 0, //配送价格
    recevierInfo: null, //取货人信息
    recevierId: 0, //取货人Id
    // 支付列表
    payList: [],
    // 配送方式
    deliveryList: [],
    // x轴方向的偏移
    x: 0,
    // 当前x的值
    currentX: 0,
    allChecked: false, //全选选中
    payMoney: 0, //总价格
    totalMoney: 0, //合计价格
    save: 0, //节省
    total: 0, //总的商品数量

    checkList: [], //购物车勾选的商品id
    userInfo: null, //个人信息

    isCheck: false, //勾选则计算用户米粒
    showMili: false, //展示剩余米粒

    saveMili: 0, //剩余米粒
    kedikou: 0, //可抵扣米粒
    riceprice: 0, //用户可用的抵扣米粒

    shopbagid: 0, //购物包名
    isCan: false, //是否可以点击

    detail: null, //商品详情
    allCount: null, //商品总数量

    addressInfo: null, //地址信息
    remark: '', //备注
    deliveryList: [ //配送方式
      {
        id: 1,
        name: '常温配送',
        txt: 0,
        flag1: true,
        flag: false
      }, {
        id: 2,
        name: '干冰配送',
        txt: 400,
        flag1: true,
        flag: false
      }, {
        id: 3,
        name: '自行取货',
        txt: 0,
        flag1: false,
        flag: false
      }, {
        id: 4,
        name: '数据资料',
        txt: 0,
        flag1: false,
        flag: false
      },
    ],
    addCar: "1", //从详情页来的支付 吊起addshopcar成功之后再进行订单创建

    shopList:[],//购物车购物包列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.addCar) {
      that.setData({
        addCar: options.addCar
      })
    }

    if (!that.data.userInfo) {
      that.setData({
        userInfo: wx.getStorageSync('userInfo') || null
      })
    }

    if (that.data.userInfo) {
      that.getAddList();
      that.getApply();
      that.getCardList();
    }

    if (options) {
      that.setData({
        status: options.status || 2
      })
    }

    // 支付订单
    if (that.data.status == 1) {
      wx.setNavigationBarTitle({
        title: '支付订单',
      })
    }

    // 订单详情
    if (that.data.status == 2) {
      wx.setNavigationBarTitle({
        title: '订单详情',
      })
      if (options.address_id) { //获取到地址列表做比对取出地址id相等的那一栏
        if (options.address_id == 0) {
          that.setData({
            address_id: 0
          })
          return;
        }
        let url = '/api/xkspc/postconsigneeinfo';
        let params = {
          userid: that.data.userInfo.userid,
          pageIndex: 1,
          pageSize: 100
        };
        neil.post(url, params, function (res) {
          let temp1 = res.data.result.pageData;
          temp1.filter(item => {
            if (item.id == options.address_id) {
              that.setData({
                recevierInfo: item
              })
            } else {
              that.setData({
                recevierInfo: that.data.recevierInfo
              })
            }
          })
        }, null, false)
      }
      that.hasDetail(options.id);

    }
    if (options.checkList) {
      that.setData({
        checkList: JSON.parse(options.checkList), //这是转化的勾选的商品planid数组
        shopbagid: options.shopbagid
      })
    }

    if (options.delid) { //运输方式
      if (options.delid == 3) {
        that.setData({
          recevierInfo: null
        })
      }
      let temp2 = that.data.deliveryList;
      temp2.filter(item => {
        if (item.id == options.delid) {
          that.setData({
            delId: options.delid,
            delTxt: item.name
          })
        }
      })
    }

    that.computedMount();
  },
  onShow() {
    let that = this;
    that.setData({
      isCan: true,
    });
  },

  // 取消订单
  payCancel: util.debounce(function (e) {
    let item = e.currentTarget.dataset.item;
    let url = '/api/xksxcx/cancelorder';
    let params = {
      xdruserid: item.userid,
      orderid: item.orderid,
      shopbagid: item.shopbagid,
    }
    neil.post(url, params, function (res) {
      wx.navigateBack({
        delta: 1,
      })
      let pages = getCurrentPages();
      let befoPage = pages[pages.length - 2];
      befoPage.init();
      wx.showToast({
        title: '订单取消成功',
        icon: 'none',
        duration: 1000
      })
    })
  }),

  // 获取到备注信息
  hasRemark(e) {
    e.detail.value=e.detail.value.replace(/[\W]/g,'');
    this.setData({
      remark: e.detail.value
    })
  },

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
      wx.navigateBack({
        delta: 1,
      })
      let pages = getCurrentPages();
      let befoPage = pages[pages.length - 2];
      befoPage.init();
      wx.showToast({
        title: '已提交退款申请',
        icon: 'none',
        duration: 1000
      })
    })
  },

  // 删除当前数据
  deleted: util.debounce(function (e) {
    let Item = e.currentTarget.dataset.item;
    wx.showModal({
      content: '是否要删除该订单？',
      confirmColor: "#000000",
      success(res) {
        if (res.confirm) {
          let url = '/api/xksxcx/delorderinfo';
          neil.post(url, {
            id: parseInt(Item.orderid)
          }, function (res2) {
            if (res2.data.success) {
              wx.navigateBack({
                delta: 1,
              })
              let pages = getCurrentPages();
              let befoPage = pages[pages.length - 2];
              befoPage.init();
              wx.showToast({
                title: '删除成功!',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  }),

  // 获取到用户最新的米粒
  getApply() {
    let that = this;
    let url = '/api/xkspc/postpartnerapply';
    neil.post(url, {
      id: that.data.userInfo.userid
    }, function (res) {
      that.setData({
        riceprice: res.data.result.riceprice
      })
    }, null, false)
  },

  // 获取到默认地址
  getAddList() {
    let that = this;
    let url = '/api/xkspc/postconsigneeinfo';
    let params = {
      userid: that.data.userInfo.userid,
      pageIndex: 1,
      pageSize: 100
    };
    neil.post(url, params, function (res) {
      let tempArr = res.data.result.pageData;
      tempArr.filter(item => {
        if (item.ischeck == 1) {
          that.setData({
            recevierId: item.id,
            recevierInfo: item
          })
        }
      })
    }, null, false)
  },

  init() {
    let that = this;
    that.setData({
      recevierInfo: that.data.recevierInfo
    })
  },
  //点击跳转页面 1选择支付方式 2选择配送方式 3收货地址选择
  capTo(e) {
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
  },

  // 获取商品详情
  hasDetail(Id) {
    let that = this;
    let count = 0;
    let url = '/api/xksxcx/postorderdetail';
    neil.post(url, {
      id: parseFloat(Id)
    }, function (res) {
      if (res.data.success) {
        let temp = res.data.result;
        if (temp.list) {
          temp.list.forEach(item => {
            count += item.num
          })
          that.getAdressList();
        }
        let temp1 = res.data.result;
        temp.prod_money = temp.prod_money;
        temp.payMoney = temp.payMoney;
        that.setData({
          detail: temp1,
          allCount: count,
        })
      }
    }, null, false)
  },

  // 获取地址列表
  getAdressList() {
    let that = this;
    let url = '/api/xkspc/postconsigneeinfo';
    let params = {
      userid: that.data.userInfo.userid,
      pageIndex: 1,
      pageSize: 100
    };
    neil.post(url, params, function (res) {
      let tempArr = res.data.result.pageData;
      tempArr.forEach(item => {
        if (item.id == that.data.detail.address_id) {
          that.setData({
            addressInfo: item
          })
        }
      })
    }, null, false)
  },

  // 回到首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
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
      that.setData({
        shopList: res.data.result
      });
    }, null, false)
  },

  // 计算勾选的商品总价 节省 运费
  computedMount() {
    let that = this;
    let [tempArr2, money, old_money, totalMoney, total] = [that.data.checkList, 0, 0, 0, 0];

    tempArr2.forEach(item1 => {
      money += parseFloat(util.floatMul(item1.price, item1.plancount));
      old_money += parseFloat(util.floatMul((item1.original_price - item1.price), item1.plancount));
      total += parseFloat(item1.plancount)
    })

    //米粒抵扣 可使用的米粒>用户拥有米粒 则抵扣用户的当前米粒 且显示剩余米粒
    //        可使用的米粒<用户拥有米粒 则使用当前价格的20%
    // 
    let kedikou = money * 0.2; //可抵扣米粒
    let riceprice = that.data.userInfo.riceprice; //用户的总米粒
    if (kedikou > riceprice) {
      that.setData({
        kedikou: riceprice.toFixed(2),
        saveMili: 0, //剩余米粒
      })
    } else {
      that.setData({
        kedikou: kedikou.toFixed(2),
        saveMili: (riceprice - kedikou).toFixed(2), //剩余米粒
      })
    }
    that.setData({
      payMoney: money.toFixed(2),
      save: old_money.toFixed(2),
      total: total,
      riceprice: riceprice.toFixed(2), //用户拥有米粒
      totalMoney: (money + that.data.delMoney - (that.data.isCheck == true ? that.data.kedikou : 0)).toFixed(2), //商品总价+运费-抵扣 = 合计
    })
  },
  // 是否使用米粒
  changeCheck() {
    this.setData({
      isCheck: !this.data.isCheck
    })
    this.computedMount();
  },

  //从其他页面来的创建订单页面
  creatOrder() {
    let that = this;
    if (that.data.isCan) {
      if (!that.data.delTxt) {
        wx.showToast({
          title: '请选择配送方式',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.delId == 3) {

      } else {
        // if (!that.data.recevierInfo) {
        //   wx.showToast({
        //     title: '请选择收货人信息',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return false;
        // }
        // let recevierInfo = {};
        // recevierInfo.id = 0;
        // that.setData({
        //   recevierInfo: recevierInfo
        // })
      }
      let tempArr1 = that.data.shopList;
      let tempArr = that.data.checkList;
      let arr1 = [];
      tempArr1.forEach(item=>{
        if(item.shopbagid == wx.getStorageSync('shopbagid')){
          if(item.list.length){
            tempArr.forEach(item2=>{
              item.list.forEach(item1=>{
                if(item1.planid == item2.planid){
                  arr1.push(item1);
                }
              })
            })
          }
        }
      })
      let arr = arr1.filter(item => {
        return item;
      }).map(item => {
        return {
          planid: item.planid,
          planname: item.planname,
          price: item.price,
          quantity: item.quantity,
          plancount: item.num,
          shopid:item.shopid
        }
      })
      let url = '/api/xksxcx/addplaceorder';
      let rice = that.data.isCheck == true ? parseFloat(that.data.kedikou) : 0;
      let paymoney = parseFloat(that.data.payMoney) - parseFloat(rice);
      let payAllMoney = parseFloat(paymoney) + parseFloat(that.data.delMoney)
      let params = {
        xdraddressid: parseInt(that.data.recevierId ? that.data.recevierId : 0), //当前选择地址的id
        xdruserid: parseInt(that.data.userInfo.userid), //下单人
        xdrinvite: that.data.userInfo.ybrInvite, //下单人邀请码
        xdrriceprice: parseFloat(that.data.userInfo.riceprice <= 0 ? 0 : that.data.userInfo.riceprice), //下单人的总米粒
        ischeckrice: that.data.isCheck == true ? 1 : 0, //0不勾 1钩
        prod_money: parseFloat(that.data.payMoney), //商品总价格（应收）  单价x数量  不含运费
        trans_money: parseFloat(that.data.delMoney), //运费
        total_money: parseFloat(that.data.payMoney) + parseFloat(that.data.delMoney), //商品总价格（应收） + 运费
        payAllMoney: payAllMoney, //实际支付金额(含运费)
        payMoney: paymoney, //实际支付金额 不含运费
        riceprice: parseFloat(rice <= 0 ? 0 : rice), //订单扣除的米粒  商品总价格-当前可扣除米粒
        remark:that.data.remark,
        role: parseInt(that.data.userInfo.roleid), //用户角色
        trantype: parseInt(that.data.delId), //运输方式
        shopbagid: parseInt(wx.getStorageSync('shopbagid')), //包id
        list: arr //商品列表
      };

      if (that.data.addCar == "1") {
        // let url1 = '/api/xksxcx/addshopcar';
        // let params1 = {
        //   planid: arr[0].planid,
        //   userid: that.data.userInfo.userid,
        //   num: parseFloat(arr[0].plancount)
        // };
        // neil.post(url1, params1, function (res1) {
        //   //商品添加购物车之后需才可以创建订单
        //   neil.post(url, params, function (res) {
        //     that.setData({
        //       isCan: true,
        //     })
        //     wx.reLaunch({
        //       url: '/pages/orderPay/orderPay?ordercode=' + res.data.result.orderno + '&paymoney=' + res.data.result.realpay,
        //     })
        //   })
        // }, null, false)
        //商品添加购物车之后需才可以创建订单
        neil.post(url, params, function (res) {
          that.setData({
            isCan: true,
          })
          wx.reLaunch({
            url: '/pages/orderPay/orderPay?ordercode=' + res.data.result.orderno + '&paymoney=' + res.data.result.realpay,
          })
        })
      } else {
        neil.post(url, params, function (res) {
          that.setData({
            isCan: true,
          })
          wx.reLaunch({
            url: '/pages/orderPay/orderPay?ordercode=' + res.data.result.orderno + '&paymoney=' + res.data.result.realpay,
          })
        })
      }
    }

  },
  pay1: util.debounce(function (e) {
    let that = this;
    if (!that.data.userInfo) {
      return;
    }
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/orderPay/orderPay?ordercode=' + item.ordercode + '&paymoney=' + item.payMoney,
    })
  }),
  // 去到支付页面
  pay(e) {
    let that = this;
    if (!that.data.userInfo) {
      return;
    }
    let item = e.currentTarget.dataset.item;
    let tempArr = item.list;
    let tempArr1 = that.data.shopList;
    let arr1 = [];
    tempArr1.forEach(item=>{
      if(item.shopbagid == wx.getStorageSync('shopbagid')){
        if(item.list.length){
          tempArr.forEach(item2=>{
            item.list.forEach(item1=>{
              if(item1.planid == item2.planid){
                arr1.push(item1);
              }
            })
          })
        }
      }
    })
    let arr = arr1.filter(item => {
      return item;
    }).map(item => {
      return {
        planid: item.planid,
        planname: item.planname,
        price: item.price,
        quantity: item.quantity,
        plancount: item.num,
      }
    })
    let url = '/api/xksxcx/addplaceorder';
    let params = {
      xdraddressid: parseInt(item.address_id ? item.address_id : 0), //当前选择地址的id
      xdruserid: parseInt(item.userid), //下单人
      xdrinvite: that.data.userInfo.ybrInvite, //下单人邀请码
      xdrriceprice: parseFloat(that.data.userInfo.riceprice <= 0 ? 0 : that.data.userInfo.riceprice), //下单人的总米粒
      prod_money: parseFloat(item.prod_money), //商品总价格（应收）  单价x数量  不含运费
      trans_money: parseFloat(item.trans_money), //运费
      total_money: parseFloat(item.prod_money) + parseFloat(item.trans_money), //商品总价格（应收） + 运费
      payAllMoney: parseFloat(item.payAllMoney), //实际支付金额(不含运费)
      payMoney: parseFloat(item.prod_money - item.riceprice + item.trans_money), //实际支付金额 不含运费
      role: parseInt(that.data.userInfo.roleid), //用户角色
      ischeckrice: item.riceprice > 0 ? 1 : 0, //0不勾 1钩
      remark:item.remark?item.remark:'',
      riceprice: parseFloat(item.riceprice ? item.riceprice : 0), //订单扣除的米粒  商品总价格-当前可扣除米粒
      trantype: parseInt(item.express_type), //运输方式
      shopbagid: parseInt(wx.getStorageSync('shopbagid')), //包id
      list: arr //商品列表
    };
    neil.post(url, params, function (res) {
      that.setData({
        isCan: true,
      })
      wx.redirectTo({
        url: '/pages/orderPay/orderPay?ordercode=' + res.data.result.orderno + '&paymoney=' + res.data.result.realpay,
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})