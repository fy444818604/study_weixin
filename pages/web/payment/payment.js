var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');
Page({
  data: {
    host: api.host,
    course: '',
    courseId: 0,
    couponList:'',
    userAccount:'',
    yhmoney:0,
    couponcode:'',
    totalPayMoney:0
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      api.websiteProfileInfo({
        data: {
          "type": 'serviceSwitch'
        },
        success: function (res) {
          that.setData({
            serviceSwitch: res.data.entity
          })
        }
      });
      console.log(options)
      that.data.courseId = options.courseId;
      //获取用户信息
      var user = wx.getStorageSync('user');
      var userId = 0;
      if (api.isNotEmpty(user)) {
        userId = user.userId;
      }
      api.allCouInfo({
        data: {
          "courseId": that.data.courseId,
          "userId": userId
        },
        success: function (res) {
          if (res.data.success) {
            let course = res.data.entity.course;
            that.setData({
              course: course,
              totalPayMoney: course.currentPrice - that.data.yhmoney
            })

            //检查使用优惠券
            var couponcode = options.couponcode;
            //var couponid = options.couponid;
            if (api.isNotEmpty(couponcode)) {
              api.checkCoupon({
                data: {
                  "couponCode": couponcode,
                  "userId": user.userId,
                  "requestId": "",
                  "courseIds": that.data.courseId
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.success) {
                    wx.showToast({
                      title: '使用优惠券',
                      icon: 'success',
                      duration: 2000
                    })
                    that.setData({
                      yhmoney: res.data.entity.yhmoney,
                      couponcode: couponcode,
                      totalPayMoney: (parseFloat(that.data.course.currentPrice) - parseFloat(res.data.entity.yhmoney)).toFixed(2)
                    })
                  }
                }
              })
            }
          }
        },
        fail: function () {
          console.log("jhgjhgjhg")
        }
      });
      
      //查询优惠券list
      api.queryByCourse({
        data:{
          "courseId": that.data.courseId,
          "userId": userId
        },
        success: function(res){
          if (res.data.success) {
            console.log(res.data.entity);
            that.setData({
              couponList: res.data.entity
            })
          }
        }
      });
      //账户余额
      api.myAccount({
        data:{
          "userId": userId
        },
        success: function (res){
          if (res.data.success) {
            console.log("asdssssssss"+res.data.entity);
            that.setData({
              userAccount: res.data.entity.userAccount
            })
          }
        }
      })
    },
    //跳转优惠券列表
    couponTap:function(){
      console.log(this.data.couponList);
      wx.navigateTo({
        url: '/pages/coupon/coupon/coupon?couponList=' + JSON.stringify(this.data.couponList) + '&courseId=' + this.data.courseId ,
      })
    },
  /**
   * 购买下单
   */
  toPay: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先去登录哦~',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/web/logs/logs'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            console.log(res.code)
            var userId = 0;
            var user = wx.getStorageSync('user');
            if (api.isNotEmpty(user)) {
              userId = user.userId;
            }
            api.addOrder({
              data: {
                "loginCode": res.code,
                "payType": "WECHAT_PROGRAM",
                "userId": userId,
                "couponcode": that.data.couponcode,
                "orderType": "COURSE",
                "otherId": that.data.courseId,
                "type": "1",
                "bargainPublishId": "0"
              },
              success: function (res) {
                var orderIdTemp = res.data.entity.orderId;
                if (res.data.success) {
                  if (res.data.entity.payState == 'true') {
                    wx.navigateTo({
                      url: '/pages/web/courseInfor/courseInfor?id=' + that.data.courseId,
                    })
                  } else {
                    wx.requestPayment(
                      {
                        'timeStamp': res.data.entity.timeStamp,
                        'nonceStr': res.data.entity.nonceStr,
                        'package': res.data.entity.info_package,
                        'signType': 'MD5',
                        'paySign': res.data.entity.paySign,
                        'success': function (res) {
                          if (res.errMsg === "requestPayment:ok") {
                            wx.navigateTo({
                              url: '/pages/web/courseInfor/courseInfor?id=' + that.data.courseId,
                            })
                          }
                        },
                        'fail': function (res) {
                          console.log(res);
                          //跳转到重新支付
                          wx.navigateTo({
                            url: '/pages/web/rePayment/rePayment?orderId=' + orderIdTemp,
                          })
                        },
                        'complete': function (res) {
                          console.log(res);
                        }
                      })
                  }

                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'fail',
                    duration: 2000
                  })
                }
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
  }
})