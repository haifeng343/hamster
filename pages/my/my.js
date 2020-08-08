// pages/my/my.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mark: 3, //3普通用户 4 5 6合伙人

    tableNav: ['当月排行', '当季排行', '全年排行'], //初级合伙人榜单nav
    showNav: 0, //默认选中榜单
    userInfo: null, //用户个人信息
    // 轮播内容
    swiper: [
      '恭喜用户我是山大王成功邀请好友注册',
      '恭喜用户?成功邀请好友注册',
      '恭喜用户与世无争成功邀请好友注册',
      '恭喜用户一脸清高成功邀请好友注册',
      '恭喜用户秦祥林成功邀请好友注册',
      '恭喜用户荷花成功邀请好友注册',
      '恭喜用户黄鱼鹏成功邀请好友注册',
      '恭喜用户弱神经成功邀请好友注册',
      '恭喜用户x成功邀请好友注册',
      '恭喜用户扑街仔成功邀请好友注册',
    ],
    interval:5000,//轮播切换时间
    current: 0, //轮播index
    user: null, //个人的资料信息
    protocol: null, //申请人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.init();
  },

  // 获取个人信息
  onShow() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null,
      mark: wx.getStorageSync('userInfo').roleid || 3
    })
    if (that.data.userInfo) {
      that.getMyInfo();
      that.goProtocol1();
    }
  },

  // 刷新且设置个人信息
  getMyInfo() {
    let that = this;
    let url = '/api/xksxcx/getuserrefresh';
    neil.post(url, {
      id: parseFloat(that.data.userInfo.userid)
    }, function (res) {
      let userInfo1 = wx.getStorageSync('userInfo');
      userInfo1.riceprice = res.data.result.riceprice;
      userInfo1.roleid = res.data.result.roleid;
      userInfo1.balance = res.data.result.balance;
      userInfo1.enables = res.data.result.enables;
      userInfo1.integral = res.data.result.integral;
      that.setData({
        roleid:userInfo1.roleid,
        userInfo:res.data.result
      })
      wx.setStorageSync('userInfo', userInfo1);
    }, null, false)
  },

  // 轮播的change事件
  swiperChange(e) {
    let that = this;
    if (e.detail.source == "touch") {
      that.data.current = e.detail.current;
    }
  },

  // 禁止手动切换
  stopTouchMove() {
    return
  },

  init() {
    let that = this;
    if(!wx.getStorageSync('userInfo')){
      return
    }
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null,
    })
    if (that.data.userInfo.roleid == 3) {
      wx.setNavigationBarColor({
        backgroundColor: '#D2E3EF',
        frontColor: '#000000'
      })
    }
    if (that.data.userInfo.roleid !== 3) {
      wx.setNavigationBarColor({
        backgroundColor: '#EEE9E0',
        frontColor: '#000000'
      })
    }
  },
  // 未登录请先登录
  IsLogin() {
    let that = this;
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
  },

  // 提现
  goWrap: util.debounce(function () {
    let that = this;
    that.IsLogin();
    neil.post('/am/cps/getissigning', {
      id: that.data.userInfo.userid
    }, function (res) {
      if(res.data.result == 'null'){//跳转用户协议
        neil.post('/am/cps/wdsigning', {
          userId: parseFloat(that.data.userInfo.userid),
          userName:that.data.userInfo.realname,
          cid:that.data.userInfo.idcardno,
          cidType:0,
          openId:that.data.userInfo.openId
        }, function (res) {
          wx.navigateTo({
            url: '/pages/webview1/webview1?http='+res.data.result,
          })
        }, null, false)
      }else{//跳转到提现
        wx.navigateTo({
          url: '/pages/draw/draw',
        })
      }
    }, null, false)
  }, 500),

  // 我的订单
  goMyOrder: util.debounce(function () {
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/order/order',
    })
  }, 500),

  // 我的地址
  goAddress: util.debounce(function () {
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  }, 500),

  // 查看合伙人协议
  toWebview: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/webwiew/webview?type='+e.currentTarget.dataset.roleid,
    })
  },500),

  // 校验是否申请
  goProtocol1: util.debounce(function () {
    let that = this;
    let url = '/api/xkspc/postpartnerapply';
    neil.post(url, {
      id: that.data.userInfo.userid
    }, function (res) {
      that.setData({
        protocol: res.data.result
      })
    }, null, false)
  }, 500),

  // 合伙人申请
  goProtocol: util.debounce(function () {
    let that = this;
    that.IsLogin();
    if (!that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/user/user',
      })
      return;
    }
    if (!that.data.protocol) { //去协议阅读界面
      wx.navigateTo({
        url: '/pages/protocol/protocol',
      })
    } else if (that.data.protocol.ischeck == 1) { //去合伙人填写界面
      wx.navigateTo({
        url: '/pages/apply/apply',
      })
    } else if (that.data.protocol.ischeck == 2 && that.data.protocol.audittype == 1) { //申请中
      wx.navigateTo({
        url: '/pages/orderStatus/orderStatus?IsStatus=3&status=3',
      })
    } else if (that.data.protocol.audittype == 2) { //申请成功  未完成需要用户申请成功协议特权展示等
      wx.navigateTo({
        url: '/pages/webview/webview',
      })
    } else if (that.data.protocol.audittype == 3) { //申请失败
      wx.navigateTo({
        url: '/pages/orderStatus/orderStatus?IsStatus=3&status=4&txt=' + that.data.protocol.shrremark,
      })
    }
  }, 500),

  // 邀请好友注册
  goShare: util.debounce(function () {
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/share/share',
    })
  }, 500),

  // 我的资料
  goUser: util.debounce(function () {
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/user/user',
    })
  }, 500),

  // 我的圈子
  goMyGroup: util.debounce(function () {
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/myGroup/myGroup?mark=' + this.data.mark,
    })
  }, 500),
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})