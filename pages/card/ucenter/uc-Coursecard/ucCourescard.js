var app = getApp(),
  api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  formSubmit: function (e) {
    console.log(e)
    var that = this;
    var cardCode = e.detail.value.cardCode;
    var cardCodePassword = e.detail.value.cardCodePassword;

   
    if (api.isEmpty(cardCode)) {
      wx.showToast({
        title: '请输入卡名',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if (api.isEmpty(cardCodePassword)) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    if (userId == 0) {
      wx.navigateTo({
        url: 'pages/web/logs/logs',
      })
      return;
    }
    api.activationcard({
      data: {
        "userId": userId,
        "cardCode": cardCode,
        "cardCodePassword": cardCodePassword,
        "type": 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })


          wx.navigateBack({
            url: '/pages/web/ucenter/uc-coures/ucCoures'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            image: '/img/hint.png',
            duration: 3000,
          })
        }
      }
    });
  }
})