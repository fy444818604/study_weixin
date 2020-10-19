// pages/testpaper/analyse/analyse.js
var api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: "1",
    avgScore: 0, // 平均分
    minScore: 0, // 最低分
    maxScore: 0, // 最高分
    joinNum: 0, // 实考人数
    passNum: 0, // 及格人数
    passRate: 0, // 及格率
    rate: 0, // 及格分
    level: "", // 难度
    score: 0, // 总分
    titles: [],
    recordList: [],
  },
  handleChangeTab(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index
    })
  },
  getData(id) {
    api.paperAnalysis({
      data: {},
      success: res => {
        const paperStatistics = res.data.paperStatistics;
        const examPaper = res.data.examPaper;
        this.setData({
          avgScore: paperStatistics.avgScore,
          minScore: paperStatistics.minScore,
          maxScore: paperStatistics.maxScore,
          joinNum: paperStatistics.joinNum,
          passNum: paperStatistics.passNum,
          passRate: paperStatistics.passRate,
          level: examPaper.level,
          score: examPaper.score,
          rate: Math.floor(examPaper.score * examPaper.passRate / 100)
        })
      }
    }, id)
  },
  getChart(id) {
    api.paperAnalysisChart({
      data: {
        time: 10,
        pass: this.data.score * this.data.rate / 100,
        miss: ""
      },
      success: res => {
        let data = res.data;
        let nums =  data.nums.split(",")
        let titles =  data.titles.split(",")
        let arr = nums.map(item => {
          let obj = {}
          obj.val = item;
          return obj
        })
        for (let i = 0; i < arr.length; i++) {
          arr[i].text = titles[i]
        }
        this.setData({
          titles: arr
        })
      }
    },id)
  },
  getRecordList(id) {
    api.recordList({
      data: {
        queryOrderType: 'userScoreDESC'
      },
      success: res => {
        this.setData({
          recordList: res.data.queryPaperRecordList
        })
      }
    },id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
    this.getChart(options.id)
    this.getRecordList(options.id)
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