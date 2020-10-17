var app = getApp(),
  api = require('../../../../utils/api.js');
Page({
  data:{
    loadingHidden:false,
    currentPage:1,
    totalPageSize:1,
    messList:[],
    scrollHeight: 0,
    couFlag: 1//0代表对应无消息，1代表有
  },
  onLoad:function(options){
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
  delMess:function(e){
    var that = this;
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          api.delLetterInbox({
            data: {
              "id": e.target.dataset.id,
              "userId": userId
            },
            success: function (res) {
              console.log(res);
              if (res.data.success) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000,
                });
                that.setData({
                  messList: [],
                  currentPage: 1
                })
                that.initMessList();
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'error',
                  duration: 2000
                });
              }
            }
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  //加载上一页或者下拉刷新
  // refresh:function(e){
  //   this.data.currentPage=1;
  //   this.data.messList=[];
  //   this.initMessList;
  // },
  //加载下一页
  loadMore:function(e){
    if (this.data.totalPageSize >= this.data.currentPage) {
      this.data.currentPage += 1;
      this.setData({
        loadingHidden: false,
        currentPage: this.data.currentPage
      })
      this.initMessList();
      console.log(this.data.currentPage)
    }
  },
  onShow:function(){
    // 页面显示
    this.initMessList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  initMessList:function(){
    var that = this;
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.letter({
      data:{
        "userId":userId,
        "currentPage": that.data.currentPage,
        "pageSize": 5
      },
      success:function(res){
        console.log(res);
        if (res.data.success) {
          console.log("11111");
          that.data.totalPageSize = res.data.entity.page.totalPageSize;
          that.data.messList = api.arrayConcat(that.data.messList, res.data.entity.queryLetterList);
          that.setData({
            messList: that.data.messList,
            loadingHidden: true
          })
          if (that.data.messList.length > 0){
            console.log("22222");
            that.setData({
              couFlag: 1
            })
          }else{
            that.setData({
              couFlag: 0
            })
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'error',
            duration: 2000
          });
        }
      }
    });
  }
});