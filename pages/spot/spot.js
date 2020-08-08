// pages/spot/spot.js
const app = getApp();
const neil = require('../../utils/request.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否为iphoneX
    num: 1, //1身份识别 2银行卡识别

    name: '', //名字
    number: '', //证件号码
    valid_date: '', //证件有效期
    img1: '', //身份证正面
    img2: '', //身份证反面

    cardName: '', //持卡人姓名
    img3: '', //银行图片
    cardNumber: '', //银行卡号

    access_token: '', //拿着去识别图片
    userInfo: null,
    user: null, //用户个人信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options) {
      that.setData({
        num: options.num || 1
      })
    }
    if (options.num == 1) {
      wx.setNavigationBarTitle({
        title: '身份证',
      })
    }
    if (options.num == 2) {
      wx.setNavigationBarTitle({
        title: '银行卡',
      })
    }
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null,
      user: wx.getStorageSync('userInfo') || null, //用户个人信息
      name: wx.getStorageSync('userInfo').realname || '', //名字
      number: wx.getStorageSync('userInfo').idcardno || '', //证件号码
      valid_date: wx.getStorageSync('userInfo').card_expiryDate || '', //证件有效期
      img1: wx.getStorageSync('userInfo').cardImgone || '', //身份证正面
      img2: wx.getStorageSync('userInfo').cardImgtwo || '', //身份证反面
      cardName: '', //持卡人姓名
      img3: wx.getStorageSync('userInfo').bankimg || '', //银行图片
      cardNumber: wx.getStorageSync('userInfo').bankno || '', //银行卡号
    })
  },

  onShow() {

  },

  // 获取名字
  hasName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取证件号码
  hasNumber(e) {
    this.setData({
      number: e.detail.value
    })
  },

  // 获取证件有效期
  hasDate(e) {
    this.setData({
      valid_date: e.detail.value
    })
  },

  // 获取持卡人信息
  hasCardName(e) {
    console.log(e)
    this.setData({
      cardName: e.detail.value
    })
  },

  // 获取银行卡号
  hasCardNumber(e) {
    this.setData({
      cardNumber: e.detail.value
    })
  },

  // 上传身份证正面
  updateUserAfter() {
    let that = this;
    that.upload(1);
  },

  // 上传身份证反面
  updateUserBefore() {
    let that = this;
    that.upload(2);
  },

  // 银行卡上传
  updateCard() {
    let that = this;
    that.upload(3);
  },

  // 上传图片
  upload(status) {
    let that = this;
    wx.chooseImage({
      success(res) {
        console.log(res)
        wx.uploadFile({
          url: neil.baseUrl + '/api/xksxcx/ocridcrad', //开发者服务器地址
          filePath: res.tempFilePaths[0],
          name: 'file',
          success(res1) {
            let temp = JSON.parse(res1.data);
            that.sendCard(temp.result, status);
            if (status == 1) {
              that.setData({
                img1: temp.result,
              })
            }
            if (status == 2) {
              that.setData({
                img2: temp.result,
              })
            }
            if (status == 3) {
              that.setData({
                img3: temp.result,
              })
            }
          }
        })
      }
    })
  },
  sendCard(img, status) {
    let that = this;
    let url = '/api/xksxcx/ocridcradsss';
    let params = {
      userid: that.data.userInfo.userid,
      imgurl: img,
      cardtype: status,
    };
    neil.post(url, params, function (res) {
      console.log(res);
      if (status == 1) {
        that.setData({
          name: res.data.temp.name,
          number: res.data.temp.id,
          user: res.data.temp
        });
      }
      if (status == 2) {
        that.setData({
          valid_date: res.data.temp.valid_date,
        })
      }
      if (status == 3) {
        that.setData({
          cardNumber: res.data.temp.number
        })
      }
    })
  },

  // 保存
  save: util.debounce(function () {
    let that = this;
    //  身份录入
    if (that.data.num == 1) {
      if (!that.data.img1) {
        wx.showToast({
          title: '请上传本人身份证正面照',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (!that.data.img2) {
        wx.showToast({
          title: '请上传本人身份证反面照',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (!that.data.name) {
        wx.showToast({
          title: '请输入真实姓名',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (!that.data.number) {
        wx.showToast({
          title: '请输入证件号码',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.number.length !== 18) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (!that.data.valid_date) {
        wx.showToast({
          title: '请输入证件有效期',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      let url = "/api/xksxcx/editusercard";
      let params = {
        userid: that.data.userInfo.userid + '',
        gender: that.data.user.gender,
        realname: that.data.name,
        idcardno: that.data.number,
        card_expiryDate: that.data.valid_date,
        cardaddress: that.data.user.addr,
        cardImgone: that.data.img1,
        cardImgtwo: that.data.img2,
        national: that.data.nationality,
      }
      neil.post(url, params, function (res) {
        let userInfo1 = that.data.userInfo;
        userInfo1.cardImgone = that.data.img1;
        userInfo1.cardImgtwo = that.data.img2;
        userInfo1.realname = that.data.name;
        userInfo1.idcardno = that.data.number;
        userInfo1.card_expiryDate = that.data.valid_date;
        wx.setStorageSync('userInfo', userInfo1);
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1,
        })
        let pages = getCurrentPages();
        let befoPage = pages[pages.length - 2];
        befoPage.init();
      })
    }
    //  银行录入
    if (that.data.num == 2) {
      if (!that.data.cardNumber) {
        wx.showToast({
          title: '请输入银行卡号',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.cardNumber.length < 16) {
        wx.showToast({
          title: '请输入正确银行卡号',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      let url = '/api/xksxcx/edituserbank';
      let params = {
        userid: that.data.userInfo.userid + '',
        bankimg: that.data.img3,
        bankno: that.data.cardNumber,
      }
      neil.post(url, params, function (res) {
        let userInfo1 = that.data.userInfo;//暂无银行卡
        userInfo1.bankimg = that.data.img3;
        userInfo1.bankno = that.data.cardNumber;
        wx.setStorageSync('userInfo', userInfo1);
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1,
        })
        let pages = getCurrentPages();
        let befoPage = pages[pages.length - 2];
        befoPage.init();
      })
    }
  }, 500),

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})