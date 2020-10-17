var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');
Page({
  data: {
    host: api.host,
    orderDetail:'',
    orderList: '',
    orderId: 0,
    couponList:'',
    userAccount:'',
    yhmoney:0,
    couponObj:'',
    couponCode:'',
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
      that.data.orderId = options.orderId;
      //获取用户信息
      var user = wx.getStorageSync('user');
      var userId = 0;
      if (api.isNotEmpty(user)) {
        userId = user.userId;
      }
      //重新支付详情
      api.repayInfo({
        data: {
          "orderId": that.data.orderId
        },
        success: function (res) {
          if (res.data.success) {
            let orderList = res.data.entity.orderList;
            var couponObj = res.data.entity.couponCode;
            var couponCode='';
            if (api.isNotEmpty(couponObj)){
              couponCode = couponObj.couponCode;
            }
            that.setData({
              orderList: orderList,
              userAccount: res.data.entity.userAccount,
              couponList: res.data.entity.couponCodeList,
              totalPayMoney: res.data.entity.recharge,
              couponObj: couponObj,
              couponCode: couponCode,
              orderDetail: res.data.entity.trxorder,
              yhmoney: res.data.entity.trxorder.couponAmount
            })

            //检查使用优惠券
            var couponcode = options.couponcode;
            //var couponid = options.couponid;
            if (api.isNotEmpty(couponcode)) {
              api.checkCoupon({
                data: {
                  "couponCode": couponcode,
                  "userId": user.userId,
                  "requestId": res.data.entity.trxorder.orderNo,
                  "courseIds": '0'
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
                      totalPayMoney: (parseFloat(that.data.orderDetail.orderAmount) - parseFloat(res.data.entity.yhmoney)).toFixed(2)
                    })
                  }else{
                    wx.showToast({
                      title: res.data.message,
                      icon: 'fail',
                      duration: 2000
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
    },
    //跳转优惠券列表
    couponTap:function(){
      wx.navigateTo({
        url: '/pages/coupon/coupon/coupon?couponList=' + JSON.stringify(this.data.couponList) + '&orderId=' + this.data.orderId+'&payFrom=repay' ,
      })
    },
  /**
   * 重新支付
   */
  toPay: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          api.orderRepay({
            data: {
              "loginCode": res.code,
              "orderId": that.data.orderDetail.orderId,
              "payType": "WECHAT_PROGRAM",
              "couponcode": that.data.couponCode
            },
            success: function (res) {
              if (res.data.success) {
                if (res.data.entity.payState =='true'){
                    wx.navigateTo({
                      url: '/pages/web/ucenter/uc-oder/ucOder',
                    })
                }else{
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
                            url: '/pages/web/ucenter/uc-oder/ucOder',
                          })
                        }
                      },
                      'fail': function (res) {
                        console.log(res);
                        //跳转到重新支付
                        // wx.navigateTo({
                        //   url: '/pages/web/courseInfor/courseInfor?id=' + that.data.courseId,
                        // })
                      },
                      'complete': function (res) {
                        console.log(res);
                      }
                    })
                }
                
              }else{
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
})