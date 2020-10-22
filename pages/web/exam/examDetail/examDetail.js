// pages/web/exam/examDetail/examDetail.js
var app = getApp(),
  utils = require('../../../../utils/util.js'),
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
    name:'',
    type:0,
    status:''
  },

  exam() {
    var userId = 0;
    var user = wx.getStorageSync('user');
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    if (userId != 0){
      wx.navigateTo({
        url: '/pages/web/exam/examTest/examTest?id=' + this.data.id,
      })
    }else{
      utils.alertView('提示','请先登录')
    }
  },

  exam1() {
    wx.navigateTo({
      url: '/pages/testpaper/analyse/analyse?id=' + this.data.id,
    })
  },

  exam2() {
    this.handleChangeStatus()
  },

  // 上架/下架
  handleChangeStatus(e) {
    let id =this.data.id;
    let status = this.data.status;
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

  search() {
    let _this = this;
    var userId = 0;
    var user = wx.getStorageSync('user');
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.examInfo({
      data:{
        paperId: _this.data.id,
        userId: userId
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
          validityType: _this.data.validityType,
          status: queryPaper.status
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: options.type
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