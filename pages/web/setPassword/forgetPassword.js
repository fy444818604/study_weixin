// pages/web/register/register.js
var api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: options.token
    })
  },

  formSubmit: function (e) {
    var newPassword = e.detail.value.password;
    if (api.isEmpty(newPassword)) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if (newPassword != e.detail.value.pwdTwice) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    api.changePwd({
      data: {
        "token": this.data.token,
        "password": newPassword
      },
      success: function (res) {
        if (res.data.success) {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/web/logs/logs'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  }
})
