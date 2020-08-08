// pages/log/log.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:2,//1米粒获取规则 2积分记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options){
      if(options.num == 1){
        wx.setNavigationBarTitle({
          title: '米粒获取记录',
        })
      }
      if(options.num == 2){
        wx.setNavigationBarTitle({
          title: '积分记录',
        })
      }
      that.setData({
        num : options.num
      })
    }
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