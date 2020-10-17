// pages/coupon/ucenter/uc-coupon/ucCoupon.js
var app = getApp(),
  api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    currentPage: 1,
    totalPageSize: 1,
    couponList:[],
    noUserdSum:0,
    hasUserdSum:0,
    overdue:0,
    status:1
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
            scrollHeight: res.windowHeight - 115
          });
        }
      });
  },
  onShow: function (options) {
    this.queryCouponList();
  },
  queryCouponList:function(e){
    var that = this;
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.myCouPon({
      data: {
        "userId": userId,
        "currentPage": that.data.currentPage,
        "pageSize": 7,
        "status": that.data.status
      },
      success: function (res) {
        if (res.data.success) {
          var couponList=res.data.entity.couponList
          for (var i = 0; i < couponList.length; i++) {
            couponList[i].startTime = couponList[i].startTime.substring(0, 10);
            couponList[i].endTime = couponList[i].endTime.substring(0, 10);
          }
          that.setData({
            couponList: api.arrayConcat(that.data.couponList, couponList),
            noUserdSum: res.data.entity.noUserdSum,
            hasUserdSum: res.data.entity.hasUserdSum,
            overdue: res.data.entity.overdue,
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
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onReachBottom: function (e) {
    console.log("onReachBottom");
    this.setData({
      currentPage: 1,
      couponList: []
    })
    this.queryCouponList();
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
      this.queryCouponList();
      console.log(this.data.currentPage)
    }
  },
  switchContent: function (e) {
    let status = e.currentTarget.dataset.status
    this.setData({ 
      status: status,
      currentPage:1,
      couponList: []
    })
    this.queryCouponList();
  },
  jumpCourseList: function(e){
    wx.switchTab({
      url: '/pages/web/course/courseList',
    })
  }
})