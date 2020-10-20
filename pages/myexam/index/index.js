// pages/myexam/index/index.js
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize: 10,
    totalPageSize: 0,
    list: []
  },

  exam(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/web/exam/examTest/examTest?id=' + id,
    })
  },

  getData() {
    const userId = wx.getStorageSync('user').userId;
    api.ucExamHistory({
      data: {
        sellType: "examPaper",
        userId: 3386,
        currentPage: this.data.currentPage,
        pageSize: 10,
      },
      success: res => {
        console.log("res", res)
        let result = res.data.paperRecordList.map(item => {
          return item.epId
        });
        let list = res.data.paperList.map(item => {
          result.forEach(v => {
            if (item.id == v) {
              item.isHistroy = true;
            }
          })
          item.leaveTime = item.updateTime && item.updateTime.substr(11)
          item.endTime = item.endTime.substring(5, 16)
          item.notJoin = Math.abs(item.notJoin)
          return item;
        })
        this.setData({
          totalPageSize: res.data.page.totalPageSize,
          urrentPage: this.data.currentPage += 1,
          list: list
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.currentPage > this.data.totalPageSize) {
      wx.showToast({
        icon: 'none',
        title: '已无更多数据',
      })
    } else {
      this.getData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})