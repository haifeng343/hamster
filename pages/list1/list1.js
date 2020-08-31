// pages/list1/list1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showId1: 2,
    navList1: [{
        id: 1,
        name: '五金'
      },
      {
        id: 2,
        name: '口红'
      },
      {
        id: 3,
        name: '彩妆'
      },
      {
        id: 4,
        name: '香水'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showId1: options.id || 1
    })
  },
  setActive(e) {
    this.setData({
      showId1: e.currentTarget.dataset.id
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