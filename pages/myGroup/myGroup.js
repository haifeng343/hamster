// pages/my/my.js
const app = getApp();
const neil = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mark:wx.getStorageSync('userInfo').roleid,//3普通用户 456合伙人
    userDetail:null,//个人的销量佣金新客户等信息
    tableNav:['当月排行','当季排行','全年排行'],//初级合伙人榜单nav
    showNav:0,//默认选中榜单
    userInfo:null,//用户个人信息
    // 榜单数据
    tableList:[],
    // 轮播内容
    swiper:[
      '恭喜用户我是山大王成功邀请好友注册',
      '恭喜用户?成功邀请好友注册',
      '恭喜用户与世无争成功邀请好友注册',
      '恭喜用户一脸清高成功邀请好友注册',
      '恭喜用户秦祥林成功邀请好友注册',
      '恭喜用户荷花成功邀请好友注册',
      '恭喜用户黄鱼鹏成功邀请好友注册',
      '恭喜用户弱神经功邀请好友注册',
      '恭喜用户x功邀请好友注册',
      '恭喜用户扑街仔功邀请好友注册',
    ],
    current:0,//轮播index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.init();
  },

  // 获取个人信息
  onShow(){
    
  },
   
  // 轮播的change事件
  swiperChange(e){
    let that = this;
    if(e.detail.source=="touch"){
      that.setData({
        current:e.detail.current
      })
    }
  },

  // 禁止手动切换
  stopTouchMove(){
    return 
  },

  init(){
    let that = this;
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
      // 刷新我的圈子
    let url = '/xks/xksxcx/getquanzicomm';
    neil.post(url, {
      id: parseFloat(that.data.userInfo.userid)
    }, function (res) {
      that.setData({
        userDetail:res.data.result
      })
    }, null, false);
    that.getCoreList(that.data.showNav);
  },

  // 未登录请先登录
  IsLogin(){
    let that = this;
    if(!that.data.userInfo){
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
  },

  // 切换榜单的nav
  setTableNav(e){
    this.IsLogin();
    this.setData({
      showNav:e.currentTarget.dataset.index
    })
    this.getCoreList(e.currentTarget.dataset.index);
  },

  // 排行列表 月 季 年
  getCoreList(tab){
    let that = this;
    let url = '';
    if(tab ==0){
       url = '/xks/xksxcx/getscoremonth';
    }else if(tab == 1){
      url = '/xks/xksxcx/getscoreseason';
    }else if(tab == 2){
      url = '/xks/xksxcx/getscoreyear';
    }
    neil.post(url, {
      id: parseFloat(that.data.userInfo.userid)
    }, function (res) {
      that.setData({
        tableList:res.data.result
      })
    }, null, false)
  },

  // 消费记录
  goPayList(e){
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/payList/payList?name='+e.currentTarget.dataset.name,
    })
  },

  // 邀请好友注册
  goShare(){
    this.IsLogin();
    wx.navigateTo({
      url: '/pages/share/share',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})