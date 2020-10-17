var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');
Page({
  data: {
    host: api.host,
    memberSaleId: 0,
    userAccount:'',
    totalPayMoney:0,
    memberSale:'',
    authTime:'',
    user:'',
    memberShowInfo:'',
    orderId:0
  },

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
          //查询当前会员信息
          if (res.data.success) {
            api.associator({
              data: {
                "userId": userId
              },
              success: function (res) {
                if (res.data.success) {
                
                  that.setData({
                    memberShowInfo: res.data.entity.memberShowInfo,
                    orderId: options.orderId
                  })
                }
              }
            })

            let userAccount = res.data.entity.userAccount;
            that.setData({
              userAccount: userAccount,
              memberSale: res.data.entity.memberSale,
              totalPayMoney: res.data.entity.recharge,
              authTime: res.data.entity.authTime,
              user: user
            })
          }
        },
        fail: function () {
          console.log("jhgjhgjhg")
        }
      });
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
              "couponcode":''
            },
            success: function (res) {
              if (res.data.success) {
                if (res.data.entity.payState =='true'){
                  wx.navigateTo({
                    url: '/pages/member/ucenter/uc-member/ucMember',
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
                            url: '/pages/member/ucenter/uc-member/ucMember',
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