//app.js
App({
  onLaunch: function () {
    let that = this;
    that.autoUpdate();
    // 购物车的数据是否需要更新
    wx.setStorageSync('isGetCarList', false);

    // 用户第一次登录是否进入引导页
    // if(wx.getStorageSync('userInfo')){
    //   wx.navigateTo({
    //     url: '/pages/guide/guide',
    //   })
    // }
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        that.globalData.windowWidth = res.windowWidth * 2;
        that.globalData.windowHeight = res.windowHeight;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })

    // 获取到手机设备信息
    wx.getSystemInfo({
      success(res) {
        that.globalData.windowWidth = parseFloat(res.windowWidth) * 2;
        that.globalData.windowHeight = parseFloat(res.windowHeight) * 2;
      },
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  autoUpdate() {
    let that = this;
    if (wx.canIUse('getUpdateManager')) {
      let updateManager = wx.getUpdateManager();
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success(res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                } else if (res.cancel) {
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success(res) {
                      that.autoUpdate()
                      return;
                    }
                  })
                }
              }
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          })
        }
      })
    }else{
       // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
       wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    isIphoneX: false,
    mobileReg: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/, //校验手机号
    emailReg: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/, //校验邮箱
    bankReg: /^([1-9]{1})(\d{14}|\d{18})$/, //银行卡验证
    IsTips: true,
    carList: [],
  }
})