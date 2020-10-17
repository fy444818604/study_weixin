var app = getApp(),
  api = require('../../../utils/api.js'); 
Page({
  data:{
    loadingHidden:false,
    kpointContent:''
  },
  onLoad:function(options){
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }

    var that=this;
    wx.setNavigationBarTitle({
      title: options.name
    })
    api.kpointUrl({
      data: {
        "kpointId": options.id,
        "userId": userId
      },
      success: function (res) {
        var content = res.data.entity.text;
        console.log("++++++++++++++++")
        console.log(res);
        that.setData({
          kpointContent: content
        })
      }
    });
  },
  //加载下一页
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
});