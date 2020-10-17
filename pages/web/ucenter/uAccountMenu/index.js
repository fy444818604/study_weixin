// page/uAccount/menu.js
var api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var usertemp = wx.getStorageSync('user');
    if (api.isEmpty(usertemp)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    this.setData({
      user: usertemp
    })
  }
})