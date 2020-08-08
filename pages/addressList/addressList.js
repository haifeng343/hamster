// pages/addressList/addressList.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否为iphoneX
    showId: 0, //默认选择
    userInfo: null, //个人信息
    list: [],
    pageIndex: 1, //页码数
    totalPageCount: 0, //总页码数
    pageSize: 10, //条数
    status: 0, //1上一页面过来 点击需要返回
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options) {
      that.setData({
        showId: options.id || 0,
        userInfo: wx.getStorageSync('userInfo'),
        status: options.status || 0
      })
    }
    if (that.data.userInfo) {
      that.init();
    }
  },
  onShow() {

  },

  init() {
    let that = this;
    let url = '/api/xkspc/postconsigneeinfo';
    let params = {
      userid: that.data.userInfo.userid,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
    };
    let temp = that.data.list || [];
    neil.post(url, params, function (res) {
      let tempArr = res.data.result.pageData;
      that.setData({
        pageIndex: res.data.result.pageIndex,
        totalPageCount: res.data.result.totalPageCount,
        pageSize: res.data.result.pageSize,
        list: that.data.pageIndex == 1 ? res.data.result.pageData : temp.concat(res.data.result.pageData),
      })
    })
  },
  //选择了哪个
  selectChange: util.debounce(function (e) {
    console.log(e.detail.value)
    let that = this;
    that.setData({
      showId: e.detail.value
    })
    if (that.data.status == 1) {
      // that.setBefoPage(e.detail.value);
    } else {

    }
    let url = '/api/xkspc/changeconsigneeinfo';
    let params = {
      id: parseFloat(e.detail.value), //设为默认直接传1
      userid: that.data.userInfo.userid,
      ischeck: 1,
    }
    neil.post(url, params, function (res) {
      that.init();
    }, null, false);
  }),
  // 比对设置上一页面的值
  setBefoPage: util.debounce(function (Id) {
    let that = this;
    if (that.data.status == 1) {
      let recevierInfo1;
      let tempArr = that.data.list;
      tempArr.forEach(item => {
        if (item.id == Id) {
          recevierInfo1 = item;
        }
      })
      let pages = getCurrentPages();
      let befoPage = pages[pages.length - 2];
      befoPage.setData({
        recevierId: Id,
        recevierInfo: recevierInfo1
      })
      befoPage.onShow();
      wx.navigateBack({
        delta: 1
      });
    }
  }),
  // 设置当前Id
  setId: util.debounce(function (e) {
    this.setData({
      showId: e.currentTarget.dataset.id
    })
    this.setBefoPage(e.currentTarget.dataset.id);
  }),

  // 点击出现菜单栏
  more: util.debounce(function (e){
    let that = this;
    let Item = e.currentTarget.dataset.item;
    let tempArr = that.data.list;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        // 编辑
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/addAddress/addAddress?address=' + JSON.stringify(Item),
          })
          // wx.setStorageSync('address', Item)
        }
        if (res.tapIndex == 1) {
          tempArr.forEach((item, index) => {
            if (item.id == Item.id) {
              wx.showModal({
                content: '是否删除该地址？',
                confirm: '确定',
                confirmColor: '#000',
                success(res1) {
                  if (res1.confirm) {
                    let url = '/api/xkspc/delconsigneeinfo';
                    neil.post(url, {
                      id: Item.id
                    }, function (res2) {
                      if (res2.data.success) {
                        tempArr.splice(index, 1);
                        wx.showToast({
                          title: '删除成功!',
                          icon: 'none',
                          duration: 2000
                        })
                        that.setData({
                          list: tempArr
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }),

  // 编辑
  edit: util.debounce(function (e) {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress?address=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }),

  // 删除
  deleted: util.debounce(function (e) {
    let Id = e.currentTarget.dataset.id;
    let that = this;
    let tempArr = that.data.list;
    tempArr.forEach((item, index) => {
      if (item.id == Id) {
        wx.showModal({
          content: '是否删除该地址？',
          confirm: '确定',
          confirmColor: '#000',
          success(res1) {
            if (res1.confirm) {
              let url = '/api/xkspc/delconsigneeinfo';
              neil.post(url, {
                id: Id
              }, function (res2) {
                if (res2.data.success) {
                  tempArr.splice(index, 1);
                  wx.showToast({
                    title: '删除成功!',
                    icon: 'none',
                    duration: 2000
                  })
                  that.setData({
                    list: tempArr
                  })
                }
              })
            }
          }
        })
      }
    })
  }),
  // 跳转到添加地址页面
  goAddress: util.debounce(function () {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress',
    })
  }),
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1
    })
    this.init();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.totalPageCount <= this.data.pageIndex) {
      return
    }
    let temp = this.data.pageIndex;
    temp++;
    this.setData({
      pageIndex: temp
    })
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})