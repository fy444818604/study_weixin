var app = getApp(),
  api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: api.host,
    loadingHidden: false,
    currentPage: 1,
    totalPageSize: 1,
    courseList: [],
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    var courseLiHeight =
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight
          });
        }
      });
  },

  onShow: function (options) {
    this.data.courseList = [];
    this.data.currentPage = 1;
    this.initCourse();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onReachBottom: function (e) {
    console.log("onReachBottom");
    this.setData({
      currentPage: 1
    })
    this.data.courseList = [];
    this.initCourse(this.data.status);
  },
  //加载下一页
  loadMore: function (e) {
    console.log("loadMore");
    if (this.data.totalPageSize >= this.data.currentPage) {

      this.data.currentPage += 1;
      this.setData({
        loadingHidden: false,
        currentPage: this.data.currentPage
      })
      this.initCourse(this.data.status);
      console.log(this.data.currentPage)
    }
  },
  initCourse: function (status) {
    var that = this;
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    if (userId == 0) {
      wx.navigateTo({
        url: 'pages/web/logs/logs',
      })
      return;
    }
    api.myCourse({
      data: {
        "userId": userId,
        "currentPage": that.data.currentPage,
        "pageSize": 7,
        "ifOver": 'false',
        "sellType": 'COURSE'
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            courseList: api.arrayConcat(that.data.courseList, res.data.entity.courseList),
            loadingHidden: true,
            totalPageSize: res.data.entity.page.totalPageSize
          })
        }
      },
      fail: function () {
        console.log("fail")
      }
    });
  },
  openCourse: function (event) {
    var courseId = event.currentTarget.dataset.courseid
    //console.log("on id is" + courseId);
    wx.navigateTo({
      url: '/pages/web/courseInfor/courseInfor?id=' + courseId,
    })
  }
})