// pages/share/share.js
const app = getApp();
const util = require('../../utils/util.js');
const neil = require('../../utils/request.js');
const aa = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //是否是iPhoneX
    windowWidth:app.globalData.windowWidth,//手机可视宽度
    windowHeight:app.globalData.windowHeight,//手机可视高度
    contentTxt: '123', //邀请码
    invite: '', //我的邀请码
    userInfo:null,//个人信息
    baseImgUrl:'',//base64图片地址
    isDialog:false,//显示弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
  },
  init(){

  },
  getShare() {
    let that = this;
    if(that.data.userInfo){
      let url = '/am/cps/postpromotioncode';
      let params = {
        userid:that.data.userInfo.userid,
        invite:that.data.userInfo.invite,
        nickname:that.data.userInfo.nickname,
      }
      neil.post(url,params,function(res){
        that.getBase64ImageUrl(res.data.result);
      },null,true)
    }
  },

  onShow() {
    let that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo') || null,//
      invite: wx.getStorageSync('userInfo').invite || ''//我的分享码
    })
  },

  // 点击朋友圈显示海报
  showDialog(){
    this.getShare();
    this.setData({
      isDialog:true
    })
  },
  // 点击关闭海报弹窗
  closeDialog(){
    this.setData({
      isDialog:false
    })
  },

  // 点击保存图片到本地图库分享朋友圈
  create(){
    let that = this;
    // console.log('that.data.baseImgUrl:', that.data.baseImgUrl)   //base64图片
    aa.writeFile({//xx.writeFile 将 ArrayBuffer 写为本地用户路径的二进制图片文件。
      filePath:wx.env.USER_DATA_PATH+'/share.png', //生成本地目录 以及命名
      data: that.data.baseImgUrl.slice(22), //截取data:image/png;base64,字段  若没有base的请求头可直接写base64图片地址
      encoding:'base64',//base64格式
      success: res => {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/share.png',//保存到本地相册以及图片命名
          success: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (err) {//失败吊起保存授权
            console.log(err)
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {//没有保存本地图片的授权
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  showCancel: false,
                  success(res1){
                    wx.openSetting({//打开本地授权
                      success(settingdata){
                        console.log('settingRes',settingRes);
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {//获取到保存图片到本地的授权
                          wx.showModal({
                            title: '提示',
                            content: '获取权限成功,再次点击图片即可保存',
                            showCancel: false,
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限失败，将无法保存到相册哦~',
                            showCancel: false,
                          })
                        }
                      },
                      fail(error){
                        console.log("error",error)
                      },
                      complete(completeData){
                        console.log("completeData", completeData)
                      }
                    })
                  }
                })
            }
          },
          complete(res){
            wx.hideLoading();
          }
        })
        console.log(res)
      }
    })
  },

  getBase64ImageUrl(data) {
    // 获取到base64Data
    var base64Data = data;
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    /// 刷新数据
  //  console.log(base64ImgUrl)
    this.setData({
      baseImgUrl:base64ImgUrl
    })
  },

  // 复制验证码
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res1) {
            wx.showToast({
              title: '复制成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  saveImg(){

  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline(){
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