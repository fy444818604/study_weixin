// pages/myexam/result/result.js
const api = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    tabArr: [
      {
        index: 1,
        text:"考试结果"
      },
      {
        index: 2,
        text:"答题结果"
      },
      {
        index: 3,
        text:"试题分析"
      }
    ],
    radioItems: [
      {value: '1', name: '查看全部解析'},
      {value: '2', name: '只看错题解析', checked: 'true'},
    ],
    endTime: "", 
    testTime: "",
    userScore: 0,
    svgRate: 0,
    objectiveScore: 0,
    accuracy: 0,
  },

  handleChangeTab(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user= wx.getStorageSync("user")
    let data = {
      id: 1245953,
      userId: user.userId
    }
    api.reportDetail({
      data:{

      },
      success: res => {
        console.log("res", res)
        let data = res.data
        this.setData({
          endTime: data.paperRecord.addTime,
          testTime: 0,
          userScore: data.paperRecord.userScore,
          svgRate: data.examPaper.score*data.examPaper.passRate*0.01,
          objectiveScore: data.paperRecord.objectiveScore,
          accuracy: data.paperRecord.accuracy * 100
        })
      }
    },data)
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