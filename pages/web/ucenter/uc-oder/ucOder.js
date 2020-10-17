var api = require('../../../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host: api.host,
    loadingHidden: false,
    currentPage: 1,
    totalPageSize: 1,
    orderList: [],
    scrollHeight: 0,
    state:'ALL'//查询类型：ALL全部SUCCESS已完成 INIT未完成CANCEL已取消REFUND已退款
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
            scrollHeight: res.windowHeight-39
          });
        }
      });
  },

  onShow: function (options) {
    this.data.orderList = [];
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
    this.data.orderList = [];
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
    api.myOrderList({
      data: {
        "userId": userId,
        "currentPage": 1,
        "pageSize": 5,
        "state": that.data.state
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            orderList: api.arrayConcat(that.data.orderList, res.data.entity.orderList),
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
    var trxordertype = event.currentTarget.dataset.trxordertype;
    if (trxordertype == "MEMBER") {
      wx.navigateTo({
        url: '/pages/member/ucenter/uc-member/ucMember'
      })
    } else {
      wx.navigateTo({
        url: '/pages/web/courseInfor/courseInfor?id=' + courseId
      })
    }
  },
  updStateQuery: function (e) {
    this.setData({
      state: e.currentTarget.dataset.state, 
      currentPage: 1
    })
    this.data.orderList = [];
    this.initCourse(this.data.status);
  },
  //重新支付
  repayoder: function (e) {
    var ordertype = e.currentTarget.dataset.ordertype;
    if (ordertype =='COURSE'){
      wx.navigateTo({
        url: '/pages/web/rePayment/rePayment?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (ordertype =='MEMBER'){
      wx.navigateTo({
        url: '/pages/member/member-rePayment/member-rePayment?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (ordertype == 'ACCOUNT') {
      wx.navigateTo({
        url: '/pages/account/rechargeRepay/rechargeRepay?orderId=' + e.currentTarget.dataset.orderid,
      })
    }else{
      wx.showToast({
        title: '暂不支持此订单的重新支付，请到电脑端操作',
        icon: 'success',
        duration: 2000
      })
    }
   
  },
  //取消订单
  cancleoder: function(e){
    var that=this
    api.cancleoder({
      data: {
        "orderId": e.currentTarget.dataset.orderid
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            currentPage: 1,
            orderList:[]
          })
          that.initCourse();
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 2000
          })
        }
      },
      fail: function () {
        console.log("fail")
      }
    })
  }
})