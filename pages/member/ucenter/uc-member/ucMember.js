var app = getApp(),
  api = require('../../../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host: api.host,
    loadingHidden: false,
    memberShowInfo: '',
    openedMemberList:[],
    noOpenedMemberList:[],
    user:"",
    areaIndex: 0,
    area: ['1年 ￥150', '3个月 ￥45', '1个月 ￥15']
  },
  bindPickerChange: function (e) {
    var that=this;
    var memberid=e.target.dataset.memberid;
    var noOpenedMemberList = that.data.noOpenedMemberList;
    for (var i in noOpenedMemberList) {
      if (noOpenedMemberList[i].id == memberid){
        noOpenedMemberList[i].selectIndex = e.detail.value;
        noOpenedMemberList[i].selectSaleId = noOpenedMemberList[i].memberSaleArr[e.detail.value].buyId;
      }
      
    };

    that.setData({
      noOpenedMemberList: noOpenedMemberList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    api.associator({
      data: {
        "userId": userId
      },
      success: function (res) {
        if (res.data.success) {
          var noOpenedMemberList=res.data.entity.noOpenedMemberList;
          
          for (var i in noOpenedMemberList) {
            noOpenedMemberList[i].selectIndex = 0; // 选择的下标（添加新属性）
            var memberSaleArr=[];
            for (var j in noOpenedMemberList[i].memberSaleList) {
              var memberSale = noOpenedMemberList[i].memberSaleList[j];
              memberSale = { "showTitle": memberSale.description + "  ￥" + memberSale.price, "buyId": memberSale.id};
              memberSaleArr.push(memberSale);

              if(j==0){
                noOpenedMemberList[i].selectSaleId = memberSale.buyId;//默认购买第一个（添加新属性）
              }
            }
            
            console.log(memberSaleArr);
            noOpenedMemberList[i].memberSaleArr = memberSaleArr; // 添加新属性
          };

          that.setData({
            loadingHidden: true,
            memberShowInfo: res.data.entity.memberShowInfo,
            openedMemberList: res.data.entity.openedMemberList,
            noOpenedMemberList: noOpenedMemberList,
            user: user
          })
        }
      },
      fail: function () {
        console.log("fail")
      }
    });
  },
  //购买会员
  buyMember:function(e){
    console.log(e)

    var that = this;
    var memberid = e.target.dataset.memberid;
    var noOpenedMemberList = that.data.noOpenedMemberList;
    for (var i in noOpenedMemberList) {
      if (noOpenedMemberList[i].id == memberid) {
        console.log(noOpenedMemberList[i].selectSaleId);
        wx.navigateTo({
          url: '/pages/member/Member-payment/payment?memberSaleId=' + noOpenedMemberList[i].selectSaleId + '&memberShowInfo=' + that.data.memberShowInfo,
        })
      }
    };
  }
})