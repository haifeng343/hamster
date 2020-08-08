// pages/guide/guide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nineList:[1,2,3,4,5,6,7,8,9],
    // 自动播放
    aotuplay:false,
    // 视频列表
    list:[
      {
        id:1,
        src:'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
      },{
        id:2,
        src:'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
      },{
        id:3,
        src:'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
      },
    ]
    },

  /**
   * 生命周期函数--监听页面加载
   */
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
  gogogo(){
    wx.navigateTo({
      url: '/pages/webview1/webview1?http='+'http://127.0.0.1:8848/es789/xcx.html',
    })
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