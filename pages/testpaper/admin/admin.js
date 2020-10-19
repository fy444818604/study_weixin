// pages/testpaper/admin.js
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parper: [
      {
        index: 0,
        text: "普通试卷"
      },
    ],
    userId: "",
    currentPage: 1,
    pageSize: 10,
    totalPageSize: null,
    paperList: [{}],
    name: "", // 搜索
  },
  handleSearch(e) {
    this.setData({
      currentPage: 1,
      name: e.detail.value,
    })
    this.getData();
  },
  // 跳转到详情
  handlePushAnalyse(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/testpaper/analyse/analyse?id=' + id,
    })
  },

  // 上架/下架
  handleChangeStatus(e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    status == "normal" ? status = "frozen" : status = "normal"
    wx.showLoading()
    api.updPaperState({
      data: {
        status: status,
        exampaperId: id
      },
      success: (res) => {
        console.log("res", res)
        wx.hideLoading()
        this.setData({
          name: "",
          currentPage: 1
        })
        this.getData()
      }
    })
  },
  // 获取数据list
  getData() {
    wx.showLoading()
    api.allParper({
      data: {
        name: this.data.name,
        currentPage: this.data.currentPage
      },
      success: (res) => {
        wx.hideLoading()
        this.setData({
          currentPage: this.data.currentPage += 1,
          paperList: res.data.paperList,
          totalPageSize: res.data.page.totalPageSize
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = wx.getStorageSync('user')
    this.setData({
      userId: user.userId,
    })
    this.getData();
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
    if(this.data.currentPage > this.data.totalPageSize) {
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
  onShareAppMessage: function () {

  }
})