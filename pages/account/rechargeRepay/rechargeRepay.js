var api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPayMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    //重新支付详情
    api.repayInfo({
      data: {
        "orderId": options.orderId
      },
      success: function (res) {
        if (res.data.success) {
          
          that.setData({
            totalPayMoney: res.data.entity.recharge,
            orderId: options.orderId
          })
        }
      },
      fail: function () {
        console.log("jhgjhgjhg")
      }
    });
  },

  formSubmit: function (e) {
    console.log(e)
    console.log(e.detail.value.rechargeMoney)
    if (isNaN(e.detail.value.rechargeMoney)){
      wx.showToast({
        title: '充值金额为数字',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    if (e.detail.value.rechargeMoney<5) {
      wx.showToast({
        title: '充值金额不能小于五元',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    var that = this;
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
          api.orderRepay({
            data: {
              "loginCode": res.code,
              "orderId": that.data.orderId,
              "payType": "WECHAT_PROGRAM",
              "couponcode": ''
            },
            success: function (res) {
              var orderIdTemp = res.data.entity.orderId;
              if (res.data.success) {
                if (res.data.entity.payState == 'true') {
                  wx.navigateTo({
                    url: '/pages/account/ucenter/uc-account/ucAccount',
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
                            url: '/pages/account/ucenter/uc-account/ucAccount',
                          })
                        }
                      },
                      'fail': function (res) {
                        console.log(res);
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
})