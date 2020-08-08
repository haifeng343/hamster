// pages/information/information.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:app.globalData.isIphoneX,//判断是否为iphoneX

    name:'',//名字
    number:'',//证件号码
    valid_date:'',//证件有效期
    img1:'',//身份证正面
    img2:'',//身份证反面
    IsSuccess:false,//是否提交成功
    status:'',//1合伙人申请
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.status){
      that.setData({
        status:options.status
      })
    }
  },

  // 上传身份证正面
  updateUserAfter(){
    let that = this;
    that.upload(1);
  },

  // 上传身份证反面
  updateUserBefore(){
    let that = this;
    that.upload(2);
  },

  // 获取名字
  hasName(e){
    this.setData({
      name:e.detail.value
    })
  },

  // 获取证件号码
  hasNumber(e){
    this.setData({
      number:e.detail.value
    })
  },

  // 获取证件有效期
  hasDate(e){
    this.setData({
      valid_date:e.detail.value
    })
  },

  // 提交资料
  save(){
    let that = this;
    if(!that.data.name){
      wx.showToast({
        title: '请输入真实姓名',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.number){
      wx.showToast({
        title: '请输入证件号码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!that.data.valid_date){
      wx.showToast({
        title: '请输入证件有效期',
        icon:'none',
        duration:2000
      })
      return false;
    }
    
    that.setData({
      IsSuccess:true
    })
  },

  // 关闭弹窗
  closeDialog(){
    wx.navigateBack({
      delta:1
    })
  },


  // 上传图片
  upload(number){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        console.log(res)
        if(number==1){
          that.setData({
            img1:res.tempFilePaths[0]
          })
        }
        if(number==2){
          that.setData({
            img2:res.tempFilePaths[0]
          })
        }
        wx.uploadFile({
          url:'https://example.weixin.qq.com/upload',//开发者服务器地址
          filePath: res.tempFilePaths[0],
          name:'file',
          success(res1){
            console.log(res1)
            // 上传身份证正面
            if(number==1){
              wx.request({
                url: 'https://api.weixin.qq.com/cv/ocr/idcard?img_url? img_url='+that.data.img1+'&access_token='+that.data.access_token,
                success(res){
                  console.log(res)
                  that.setData({
                    name:res.data.name,
                    number:res.data.id
                  })
                }
              })
            }
            
            // 上传身份证反面
            if(number==2){
              wx.request({
                url: 'https://api.weixin.qq.com/cv/ocr/idcard?img_url? img_url='+that.data.img2+'&access_token='+that.data.access_token,
                success(res){
                  console.log(res)
                  that.setData({
                    valid_date:res.data.valid_date
                  })
                }
              })
            }

          }
        })
      }
    })
  },

  // 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})