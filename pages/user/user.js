// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:wx.getStorageSync('userInfo') || null,//用户的个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow(){
    this.init();
  },

  init(){
    this.setData({
      user:wx.getStorageSync('userInfo') || null,//用户的个人信息
    })
  },

  // 点击跳转到资料录入
  goMyOrder(e){
    wx.navigateTo({
      url: '/pages/spot/spot?num='+e.currentTarget.dataset.num,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})