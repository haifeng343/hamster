const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',//金额
    orderno:'',//订单号
    dayTime: util.formatTime(new Date()),//下单时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        money:options.realpay || 0,
        orderno:options.orderno || '',
      })
    }
    console.log(11111)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  //  订单列表
  look(){
    wx.redirectTo({
      url: '/pages/order/order',
    })
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

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