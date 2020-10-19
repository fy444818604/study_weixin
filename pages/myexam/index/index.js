// pages/myexam/index/index.js
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userId = wx.getStorageSync('user').userId;
    api.ucExamHistory({
      data: {
        userId: userId,
        currentPage: 1,
        pageSize: 10,
      },
      success: res => {
        console.log("res", res)
        let list = res.data.entity.queryPaperRecordList.map(item => {
          item.leaveTime = item.updateTime.substr(0,11)
        })

        this.setData({
          list: res.data.entity.queryPaperRecordList
        })
        
      }
    })
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