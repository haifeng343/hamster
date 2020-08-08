// pages/convert/convert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        id:1,
        name:'GUCCI 花之舞女性淡香水 30ml',
        price:79999
      },
      {
        id:2,
        name:'GUCCI 花之舞女性淡香水 30ml',
        price:79999
      },
      {
        id:3,
        name:'GUCCI 花之舞女性淡香水 30ml',
        price:79999
      },
      {
        id:4,
        name:'GUCCI 花之舞女性淡香水 30ml',
        price:79999
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 米粒记录
  goLog(){
    wx.navigateTo({
      url: '/pages/log/log?num=1',
    })
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