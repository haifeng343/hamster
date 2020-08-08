// pages/way/way.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,//1支付方式 2配送方式
    showId:1,//默认选择第一个
    // 支付列表
    payList:[
      {
        id:1,
        name:'微信支付',
        tag:'推荐',
        txt:'',
        flag:true
      },{
        id:2,
        name:'银行转账',
        tag:'',
        txt:'下单后联系客服获取收款账户信息',
        flag:false
      },{
        id:3,
        name:'现金支付',
        tag:'',
        txt:'下单后联系客服获取线下收款门店地址 ',
        flag:false
      },{
        id:4,
        name:'支付宝转账',
        tag:'',
        txt:'下单后联系客服获取支付宝收款账号',
        flag:false
      },
    ],
    // 配送方式
    deliveryList:[
      {
        id:1,
        name:'常温配送',
        txt:0,
        flag1:true,
        flag:false
      },{
        id:2,
        name:'干冰配送',
        txt:400,
        flag1:true,
        flag:false
      },{
        id:3,
        name:'自行取货',
        txt:0,
        flag1:false,
        flag:false
      },{
        id:4,
        name:'数据资料',
        txt:0,
        flag1:false,
        flag:false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    let num = 0;
    let optionsId = 0;
    if(options){
      num = options.num;
      optionsId = options.id;
      that.setData({
        num:options.num
      })
    }
    if(num==1){
      wx.setNavigationBarTitle({
        title:'支付方式'
      })
      let tempArr1 = that.data.payList;
      tempArr1.forEach(item=>{
        if(item.id == optionsId){
          item.flag = true;
        }else{
          item.flag = false;
        }
      })
      that.setData({
        payList:tempArr1
      })
    }else if(num ==2){
      wx.setNavigationBarTitle({
        title:"配送方式"
      })
      let tempArr2 = that.data.deliveryList;
      tempArr2.forEach(item=>{
        if(item.id == optionsId){
          item.flag = true;
        }else{
          item.flag = false;
        }
      })
      that.setData({
        deliveryList:tempArr2
      })
    }
  },

  //点击返回上一页面
  navgaTo(e){
    let that = this;
    let Id = e.currentTarget.dataset.id;
    console.log(Id)
    let [txt,delMoney] = ['',0];
    let pages = getCurrentPages();
    let befoPage = pages[pages.length-2];

    if(that.data.num == 1){
      let tempArr1 = that.data.payList;
      tempArr1.forEach(item=>{
        if(item.id == Id){
          item.flag = true;
          txt = item.name;
        }else{
          item.flag = false
        }
      })
      that.setData({
        payList:tempArr1,
      })

    befoPage.setData({
      payId:Id,
      payTxt:txt
    })

    }
    if(that.data.num == 2){
      let tempArr2 = that.data.deliveryList;
      tempArr2.forEach(item=>{
        if(item.id == Id){
          item.flag = true;
          txt = item.name;
          delMoney = item.txt;
        }else{
          item.flag = false
        }
      })
      that.setData({
        deliveryList:tempArr2,
      })

    befoPage.setData({
      delId:Id,
      delTxt:txt,
      delMoney:delMoney
    })
    befoPage.computedMount();

    }
    wx.navigateBack({
      delta:1
    });
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