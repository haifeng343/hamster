// pages/guide/guide.js

var distance1 //手指移动的距离1

var distance2 //手指移动的距离2
Page({

  /**
   * 页面的初始数据
   */
  data: {
    direction: 'all',
    nineList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 53, 34, 56],
    onetouch: true, //是否第一次触碰

    fontsize: 14, //初始字体大小
    // 自动播放
    aotuplay: false,
    username:"admin",
    password:"123",
    // 视频列表
    list: [{
      id: 1,
      src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
    }, {
      id: 2,
      src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
    }, {
      id: 3,
      src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594294540994&di=25bd5a6dfdf314f99011f4e9d44a7734&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg',
    }, ],
    nav: [
      'username',
      'applytime',
      'address',
      'number',
      'phone'
    ],
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    multiIndex: [0, 0],
    
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
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  gogogo() {
    wx.navigateTo({
      url: '/pages/webview1/webview1?http=' + 'http://127.0.0.1:8848/es789/xcx.html',
    })
  },
  /**

    * 双手指触发开始 计算开始触发两个手指坐标的距离

    */

  touchstartCallback: function (e) {

    // 单手指缩放开始，不做任何处理

    if (e.touches.length == 1) return

    this.setData({

      onetouch: false

    })

    // 当两根手指放上去的时候，将距离(distance)初始化。

    let xMove = e.touches[1].clientX - e.touches[0].clientX;

    let yMove = e.touches[1].clientY - e.touches[0].clientY;

    //计算开始触发两个手指坐标的距离

    distance1 = Math.sqrt(xMove * xMove + yMove * yMove);

    this.setData({

      onetouch: false

    })

  },

  /**

  * 双手指移动  计算两个手指坐标和距离

  */

  touchmoveCallback: function (e) {

    // 单手指缩放不做任何操作

    if (e.touches.length == 1) return;

    //双手指运动 x移动后的坐标和y移动后的坐标

    let xMove = e.touches[1].clientX - e.touches[0].clientX;

    let yMove = e.touches[1].clientY - e.touches[0].clientY;

    //双手指运动新的 ditance

    distance2 = Math.sqrt(xMove * xMove + yMove * yMove);

  },

  bindtouchendCallback(e) {

    //计算移动的过程中实际移动了多少的距离

    let distanceDiff = distance1 - distance2;

    // 单手指缩放不做任何操作

    if (!this.data.onetouch) {

      if (distance1 > distance2 && this.data.fontsize > 10) {

        //console.log(this.data.fontsize)

        let fontsize = this.data.fontsize - 4

        this.setData({

          fontsize: fontsize

        })

        wx.showToast({

          title: '字体大小' + fontsize + "px",

          icon: '',

          image: '../../images/font.png',

          duration: 1000,

          mask: true,

          success: function (res) {},

          fail: function (res) {},

          complete: function (res) {},

        })

      } else if (distance1 < distance2 && this.data.fontsize < 23) {

        //console.log(this.data.fontsize)

        let fontsize = this.data.fontsize + 4

        this.setData({
          fontsize: fontsize
        })

        wx.showToast({
          title: '字体大小' + fontsize + "px",
          duration: 1000,
        })

      }

      this.setData({

        onetouch: true,

      })

    }

  },

  changeScale(e) {
    console.log(e)
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