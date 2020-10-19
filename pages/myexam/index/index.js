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
        sellType: "examPaper",
        userId: 3386,
        currentPage: 1,
        pageSize: 10,
      },
      success: res => {
        console.log("res", res)
        let result = res.data.paperRecordList.map(item => {
          return item.epId
        });
        console.log("result", result)
        
        let list = res.data.paperList.map(item => {
          result.forEach(v => {
            console.log("v", v)
            console.log("item", item)
            if(item.id == v) {
              item.isHistroy = true;
            }
          })
          item.leaveTime = item.updateTime && item.updateTime.substr(11)
          item.notJoin = Math.abs(item.notJoin)
          
          return item;
        })
        console.log("list", list)


        this.setData({
          list: list
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