// pages/addAddress/addAddress.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否为iphoneX
    region: [], //省市区
    regionCode: [], //省市区对应地址
    customItem: '', //是否添加全部 
    IsShow: false, //显示省市区
    name: '', //姓名
    mobile: '', //手机号
    email: '', //邮箱
    detailAddress: '', //详细地址

    address: null, //从地址列表过来的个人信息编辑
    userInfo: null, //个人信息

    Id: '', //当前地址Id
    ischeck: false, //是否设为默认 true转为1 false为0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (options.address) {
      let address = JSON.parse(options.address);
      wx.setNavigationBarTitle({
        title: '编辑收货人',
      })
      that.setData({
        IsShow: true,
        address: address,
        Id: address.id + '',
        region: [address.provinceName, address.cityName, address.areaName],
        regionCode: [address.province_id + '', address.city_id + '', address.area_id + ''],
        name: address.username,
        mobile: address.phone,
        email: address.email,
        detailAddress: address.address,
        ischeck: address.ischeck == 1 ? true : false
      })
    }
  },

  onShow() {
    let that = this;

  },

  // 省市区选择
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value,
      IsShow: true,
      regionCode: e.detail.code
    })
  },
  bindNoChange(e) {
    this.setData({
      region: this.data.region
    })
  },
  // 收货人
  hasName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 联系方式
  hasMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 邮箱地址
  hasEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },
  // 详细地址
  hasDetailAddress(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  // 设置是否为默认
  selectChange(e) {
    let that = this;
    if (e.detail.value.length) {
      that.setData({
        ischeck: true
      })
    } else {
      that.setData({
        ischeck: false
      })
    }
    console.log(that.data.ischeck)
  },
  // 保存
  save:util.debounce(function()  {
    let that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.mobile) {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!app.globalData.mobileReg.test(that.data.mobile)) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.email) {
      wx.showToast({
        title: '请填写邮箱地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!app.globalData.emailReg.test(that.data.email)) {
      wx.showToast({
        title: '请填写正确的邮箱地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.IsShow) {
      wx.showToast({
        title: '请填写联系地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let url = that.data.address ? '/api/xkspc/editconsigneeinfo' : '/api/xkspc/addconsigneeinfo';
    let params = {
      id: that.data.address ? that.data.Id : '', //编辑还是添加
      userid: that.data.userInfo.userid,
      username: that.data.name,
      address: that.data.detailAddress,
      phone: that.data.mobile,
      province_id: parseFloat(that.data.regionCode[0]),
      city_id: parseFloat(that.data.regionCode[1]),
      area_id: parseFloat(that.data.regionCode[2]),
      provinceName: that.data.region[0],
      cityName: that.data.region[1],
      areaName: that.data.region[2],
      email: that.data.email,
      ischeck: that.data.ischeck == true ? 1 : 0,
    };
    neil.post(url, params, function (res) {
      wx.navigateBack({
        delta: 1
      })
      let pages = getCurrentPages();
      let befopage = pages[pages.length-2];
      befopage.init();
      that.setData({
        region: [],
        regionCode: [],
      })
    })
  }),

  // 取消
  cancel(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})