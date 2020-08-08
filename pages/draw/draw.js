const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',//提现金额
    userInfo:wx.getStorageSync('userInfo') || null
  },

  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 获取提现金额
  hasMoney(e){
    this.setData({
      money:e.detail.value
    })
  },
  
  // 提现
  draw: util.debounce(function () {
    let that = this;
    if(!that.data.userInfo){
      return
    }
    if(that.data.money<0.3){
      wx.showToast({
        title: '请输入最小为0.3元的提现金额',
        icon:'none',
        duration:1000
      })
      return false
    }
    neil.post('/am/cps/commpanywithdrawals', {
      userId: parseFloat(that.data.userInfo.userid),
      roleId:parseFloat(that.data.userInfo.roleid),
      realName:that.data.userInfo.realname,
      idCard:that.data.userInfo.idcardno,
      pay:that.data.money+'',
      openId:that.data.userInfo.openId
    }, function (res) {
      if(res.data.success){
        wx.navigateTo({
          url: '/pages/drawSuc/drawSuc',
        })
        that.getMyInfo();
      }
    }, null, false)
  }),

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

  // 清空
  clearInput(){
    this.setData({
      money:''
    })
  }
})