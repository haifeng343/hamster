//index.js
//获取应用实例
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');

Page({
  data: {
    showId: null, //给第几个添加选中class
    indicatorDots: true, //显示点
    IsTips: app.globalData.IsTips, //默认显示提示信息
    navList: [{
        id: 1,
        img: '../../image/i1.png',
        name: '质粒病毒'
      },
      {
        id: 2,
        img: '../../image/i2.png',
        name: '细胞提供'
      },
      {
        id: 3,
        img: '../../image/i3.png',
        name: '测序组学'
      },
      {
        id: 4,
        img: '../../image/i4.png',
        name: '病理实验'
      },
      {
        id: 5,
        img: '../../image/i5.png',
        name: '动物实验'
      },
      {
        id: 6,
        img: '../../image/i6.png',
        name: '细胞实验'
      },
      {
        id: 7,
        img: '../../image/i7.png',
        name: '分子检测'
      },
      {
        id: 8,
        img: '../../image/i8.png',
        name: '试剂抗体'
      },
      {
        id: 9,
        img: '../../image/i9.png',
        name: '更多'
      },
    ],
    navList1: [{
        id: 1,
        img: '../../image/p1.png',
        name: '五金'
      },
      {
        id: 2,
        img: '../../image/p2.png',
        name: '口红'
      },
      {
        id: 3,
        img: '../../image/p3.png',
        name: '彩妆'
      },
      {
        id: 4,
        img: '../../image/p4.png',
        name: '香水'
      },
    ],
    pc: wx.getStorageSync('pc') || 2,
    userInfo:wx.getStorageSync('userInfo') || null,
  },
  onLoad(options) {
    if(options.q){
      wx.setStorageSync('scene', decodeURIComponent(options.q).substring(30,decodeURIComponent(options.q).length) || null);
    }
    this.getPc();
    if (options.scene) {
      wx.setStorageSync('scene', options.scene || null);
    }
    wx.setNavigationBarColor({
      backgroundColor: '#327DFB',
      frontColor: '#ffffff'
    })
    if (this.data.pc == 1) {
      wx.setNavigationBarTitle({
        title: '小科鼠|科研优选互动平台',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '小科鼠',
      })
    }

  },
  init() {},
  onShow() {

  },
  toList() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  toShare() {
    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/share/share',
      })
    } else {
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
    }
  },

  addClass(e) {
    this.setData({
      showId: e.currentTarget.dataset.id
    })
    wx.getSystemInfo({
      success: (result) => {},
    })
  },

  //  关闭提示信息
  closeTips() {
    this.setData({
      IsTips: false
    })
    app.globalData.IsTips = false;
  },

  // 去到列表页面
  goList: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/list/list',
    });
    wx.setStorageSync('active', (e.currentTarget.dataset.id == 9 ? 1 : e.currentTarget.dataset.id))
  }),
  // 去到列表页面
  goList1: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/list1/list1?id=' + e.currentTarget.dataset.id,
    });
  }),

  // 去搜索页面
  toSearch: util.debounce(function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }),

  // 获取后台接口
  getPc() {
    let that = this;
    neil.post('/api/xksxcx/postgetnum', {
      id: 123456
    }, function (res) {
      that.setData({
        pc: res.data.result.num
      })
      console.log(res.data.result.num)
      wx.setStorageSync('pc', res.data.result.num)
    })
    // 先下载文件到本地  下载文件的域名要现在小程序后台的下载合法域名里先添加
    // wx.downloadFile({
    //   url: 'https://api.ybrshop.com/txtcf.txt',
    //   success(res) {
    //     //通过下载路径获取到文件信息 将文件编码转义
    //     let fs = wx.getFileSystemManager()
    //     // 注意编码格式为'utf-8'
    //     let result = fs.readFileSync(res.tempFilePath, "utf-8")
    //     that.setData({
    //       pc:result
    //     })
    //     console.log(result)
    //     wx.setStorageSync('pc', result)
    //   }
    // })

  },

  // 去分享
  goShare: util.debounce(function () {
    wx.navigateTo({
      url: '/pages/share/share',
    })
  }),

  /**
   * 用户点击右上角分享
   */
  onShareTimeline() {
    return {
      title: '小科鼠|科研优选互动平台',
      path: '/pages/index/index?scene=' + wx.getStorageSync('userInfo').invite,
      imageUrl: '../../image/sharePng.png'
    }
  },

  onShareAppMessage: function (res) {
    let that = this;
    // 来自页面按钮的分享
    if (res.form == 'button') {
      console.log(res.target, res)
    }
    return {
      title: '小科鼠|科研优选互动平台',
      path: '/pages/index/index?scene=' + wx.getStorageSync('userInfo').invite,
      imageUrl: '../../image/sharePng.png'
    }
  }
})