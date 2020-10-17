var api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    currentPage: 1,
    totalPageSize: 1,
    scrollHeight: 0,
    userAccount:[],
    accList:[],
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
            scrollHeight: res.windowHeight-132-37
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.accList = [];
    this.data.currentPage = 1;
    this.initData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onReachBottom: function (e) {
    console.log("onReachBottom");
    this.setData({
      currentPage: 1
    })
    this.data.accList = [];
    this.initData(this.data.status);
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
      this.initData(this.data.status);
      console.log(this.data.currentPage)
    }
  },
  initData: function (status) {
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
    api.myAccount({
      data: {
        "userId": userId,
        "currentPage": that.data.currentPage,
        "pageSize": 8
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            accList: api.arrayConcat(that.data.accList, res.data.entity.accList),
            loadingHidden: true,
            totalPageSize: res.data.entity.page.totalPageSize,
            userAccount: res.data.entity.userAccount
          })
        }
      },
      fail: function () {
        console.log("fail")
      }
    });
  },
  //到充值页面
  toRecharge:function(){
    wx.navigateTo({
      url: '/pages/account/recharge/recharge',
    })
  }
})