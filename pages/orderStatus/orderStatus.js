// pages/orderStatus/orderStatus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsStatus:1,//1支付成功 2选择支付 3支付失败
    status:0,//状态
    txt:'',//审核失败原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if(options){
      that.setData({
        IsStatus:options.IsStatus || 0,
        status:options.status || 0,
        txt:options.txt || '',
      })
    }
    if(options.status){
      wx.setNavigationBarTitle({
        title: '审核状态',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '订单状态',
      })
    }
  },

  goGift(){

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})