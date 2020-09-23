// pages/warrant/warrant.js
const app = getApp();
const neil = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取授权
  getUserInfo(e) {
    let that = this;
    console.log(wx.getStorageSync('scene'))
    wx.login({
      success: res => {
        // console.log(res.code);return;
        wx.getSetting({
          success: function (v) {
            if (v.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (e) {
                  var url = '/api/xksxcx/getwxopenid';
                  var params = {
                    userid:'',
                    nickname:e.userInfo.nickName,
                    gender:e.userInfo.gender==1?'男':'女',
                    roleid:3,
                    phone:'',
                    avatar:e.userInfo.avatarUrl,
                    pwd:'',
                    openId:'',
                    invite:'',
                    orgCode:'',
                    orgName:'',
                    ybrInvite:wx.getStorageSync('scene') || '',
                    realName:'',
                    isLocked:0,
                    code:res.code,
                  }
                  neil.post(url, params, that.onSuccess, true);
                }
              });
            }
          }
        });
      }
    })
  },
  onSuccess: function (res) { //onSuccess成功回调
    let that = this;
    wx.setStorageSync('userInfo', res.data.result);
    wx.setStorageSync('isGetCarList', true);
    app.globalData.userInfo = res.data.result;
    console.log(app.globalData.userInfo);
    that.getCarList(res.data.result.userid);
    wx.navigateBack({
      delta: 1
    });
    let pages = getCurrentPages();
    let befoPage = pages[pages.length-2];
    befoPage.init();
  },
  getCarList(userid) {
    let url = '/api/xksxcx/postshopcar';
    let params = {
      id: userid,
    }
    neil.post(url, params, function (res) {
      let tempArr = res.data.result;
      tempArr.forEach(item => {
        if (item.isCheck) { //初始化将购物车默认选中id赋值
          wx.setStorageSync('shopbagid',item.shopbagid);
        }
      });
    },null,false)
  },

  // 取消 返回上一页面
  befoPage() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})