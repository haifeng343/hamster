function get(url,params,OnSuccess,OnFail,IsShowloading=true){
  request(url,params,"GET",OnSuccess,OnFail,IsShowloading)
}

function post(url,params,OnSuccess,OnFail,IsShowloading=true){
  request(url,params,"POST",OnSuccess,OnFail,IsShowloading)
}

const baseUrl = 'https://api.ybrshop.com'; //域名地址

function request(url,params,method,OnSuccess,OnFail,IsShowloading){
  if(IsShowloading){
    wx.showLoading({
      title: '加载中···',
    })
  }
  
  wx.request({
    url: baseUrl + url,
    data:params,
    method:method,
    header:{
      'Content-Type': 'application/json; charset=UTF-8', // 默认值
      'channelCode': 'wechat',
      'appVersion': '1.0.1',
      // 'usertoken':usertoken
    },
    success(res){
      if(IsShowloading){
        wx.hideLoading();
      }

      if(res.data.success == true){
        OnSuccess(res)
      }else{
        if(res.data.success == false && res.data.message !== '该商品暂无推荐'){
          wx.showToast({
            title: res.data.message,
            icon:'none',
            duration:2000
          })
        }
      }
    },
    fail(error){
      if(IsShowloading){
        wx.hideLoading();
      }
      
      if (OnFail) {
        OnFail(error);
      }

      wx.showToast({
        title: error.data?error.data.message:'网络错误',
        icon:'none',
        duration:2000
      })
    }
  })
}

module.exports = {
  get:get,
  post:post,
  baseUrl:baseUrl,
  baseImg:'https://admin.ybrshop.com/img/p/',
}