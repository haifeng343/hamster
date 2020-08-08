// pages/search/search.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:neil.baseImg,
    keyword:'',//关键字
    pageIndex:1,//当前页码
    pageSize:10,//当前条数
    list: [],// 商品列表
    isShow:false,//是否显示end
    userInfo:null,//用户信息
    totalPageCount:'',//总条数
    shopCarList:[],//购物车购物包商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
    if(!that.data.userInfo){
      return;
    }
    that.getCarList();
  },
  init(){
    
  },

  // 获取到购物车列表
  getCarList() {
    let that = this;
    if (!that.data.userInfo) {
      return;
    }
    let url = '/api/xksxcx/postshopcar';
    let params = {
      id: that.data.userInfo.userid,
    }
    neil.post(url, params, function (res) {
      that.setData({
        shopCarList: res.data.result
      })
    }, null, false)
  },
  
  // 去商品详情页面
  toDetail:util.debounce(function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id+'&name='+e.currentTarget.dataset.name,
    })
  }),

  // 数据搜索
  search:util.debounce(function() {
    let that = this;
    if(!that.data.keyword){
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none',
        duration:2000
      })
      return false;
    }
    let url = '/api/xksxcx/postplaninfo';
    let tempArr1 = that.data.carList || []
    let params = {
      planname: that.data.keyword,
      typeid: '0',
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
    }
    neil.post(url, params, function (res) {
      let tempArr = res.data.result.pageData;
      let temp = that.data.list;
      tempArr.forEach(item => {
        item.flag = true;
        if(item.pic){
          item.imgc = item.pic;
        }else if(item.picone){
          item.pic = item.picone
        }else if(item.pictwo){
          item.pic = item.pictwo
        }else if(item.picthree){
          item.pic = item.picthree
        }
        if(tempArr1.length){
          tempArr1.forEach(item1=>{
            if(item1.planid == item.planid){
              item.flag = false;
            }
          })
        }
      });
      if(that.data.pageIndex == res.data.result.endRecordIndex){
        that.setData({
          isShow:true
        })
      }
      that.setData({
        list: that.data.pageIndex == 1?tempArr:temp.concat(tempArr),
        pageIndex:res.data.result.pageIndex,
        pageSize:res.data.result.pageSize,
        totalPageCount:res.data.result.totalPageCount
      })
    })
  }),

  // 将当前商品添加进购物车
  addCardCount:util.debounce(function(e) {
    let that = this;
    if(!that.data.userInfo){
      wx.navigateTo({
        url: '/pages/warrant/warrant',
      })
      return false;
    }
    let Id = e.currentTarget.dataset.id;
    let url = '/api/xksxcx/addshopcar';
    let params = {
      planid:Id,
      userid:that.data.userInfo.userid,
      num:1,
      shoptype:2,//1不累加 2累加
    };
    neil.post(url, params, function (res) {
      if(res.data.success){
        wx.showToast({
          title: '已成功添加进购物车',
          icon: 'none',
          duration: 2000
        })
      }
    }, null, false);
  }),

  // 获取关键字
  hasKeyWord(e){
    this.setData({
      keyword:e.detail.value
    })
  },

  // 清除搜索内容
  clearInput(){
    this.setData({
      keyword:''
    })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageIndex:1
    })
    this.search();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.totalPageCount<=this.data.pageIndex){
      return
    }
    let temp = this.data.pageIndex;
    temp++;
    this.setData({
      pageIndex:temp
    })
    this.search();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})