var app = getApp(),
  api = require('../../../utils/api.js'),
  player = require('../../../utils/player.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'couponList':'',
    'courseId':0,
    'payFrom': ''//支付跳转来源
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var couponListTemp = JSON.parse(options.couponList);
    for (var i = 0; i < couponListTemp.length;i++){
      couponListTemp[i].startTime = couponListTemp[i].startTime.substring(0,10);
      couponListTemp[i].endTime = couponListTemp[i].endTime.substring(0, 10);
    }
    var that = this;
    that.setData({
      couponList: couponListTemp,
      courseId: options.courseId,
      orderId: options.orderId,
      payFrom: options.payFrom
    })
  },
  strMapToObj:function (strMap){  
    let obj= Object.create(null);  
    for(let[k, v] of strMap) {
      obj[k] = v;
    }  
    return obj;  
  },
  /**
   * 使用优惠券
   */
  userCoupon:function (e){
    wx.showToast({
      title: '使用优惠券',
      icon: 'loading',
      duration: 2000
    })

    var couponcode = e.currentTarget.dataset.couponcode;
    var couponid = e.currentTarget.dataset.couponid;
    
    //重新支付
    if (this.data.payFrom =='repay'){
      wx.navigateTo({
        url: '/pages/web/rePayment/rePayment?orderId=' + this.data.orderId + '&couponcode=' + couponcode + '&couponid=' + couponid,
      })
    }else{
      wx.navigateTo({
        url: '/pages/web/payment/payment?courseId=' + this.data.courseId + '&couponcode=' + couponcode + '&couponid=' + couponid,
      })
    }
    
  }  
})