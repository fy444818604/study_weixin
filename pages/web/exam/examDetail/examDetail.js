// pages/web/exam/examDetail/examDetail.js
var app = getApp(),
  api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    levelList: {
      'simple': '简单',
      'commonly': '中等',
      'difficulty': '困难'
    },
    sellType:'',
    describtion: '',
    level:'',
    joinFrequency:'',
    replyTime:0,
    qstCount:0,
    subjectName:'',
    name:''
  },

  exam() {
    wx.navigateTo({
      url: '/pages/web/exam/examTest/examTest?id=' + this.data.id,
    })
  },

  search() {
    let _this = this;
    api.examInfo({
      data:{
        paperId: _this.data.id,
        userId: 3580
      },
      success:res => {
        console.log(res)
        let paperType = res.data.entity.paperType
        let queryPaper = res.data.entity.queryPaper
        _this.data.describtion = paperType.describtion
        _this.data.sellType = queryPaper.sellType == 'examPaper'?'普通考试':'其它考试'
        _this.data.level = _this.data.levelList[queryPaper.level]
        _this.data.joinFrequency = queryPaper.joinFrequency == 0 ? '无限次' : queryPaper.joinFrequency
        _this.data.replyTime = queryPaper.replyTime + "分"
        _this.data.qstCount = queryPaper.qstCount
        _this.data.name = queryPaper.name
        _this.data.subjectName = queryPaper.subjectName
        _this.data.validityType = queryPaper.validityType == 'byTime' ? queryPaper.validityData : queryPaper.validityData + "天"
        _this.setData({
          describtion: _this.data.describtion,
          sellType: _this.data.sellType,
          level: _this.data.level,
          joinFrequency: _this.data.joinFrequency,
          replyTime: _this.data.replyTime,
          qstCount: _this.data.qstCount,
          name: _this.data.name,
          subjectName: _this.data.subjectName,
          validityType: _this.data.validityType
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.search()
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