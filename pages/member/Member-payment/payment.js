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
    memberShowInfo:''
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      console.log(options)
      that.data.memberSaleId = options.memberSaleId;
      //获取用户信息
      var user = wx.getStorageSync('user');
      var userId = 0;
      if (api.isNotEmpty(user)) {
        userId = user.userId;
      }
      //获取开通会员详情
      api.payassociator({
        data: {
          "memberSaleId": that.data.memberSaleId,
          "userId": userId
        },
        success: function (res) {
          if (res.data.success) {
            let userAccount = res.data.entity.userAccount;
            that.setData({
              userAccount: userAccount,
              memberSale: res.data.entity.memberSale,
              totalPayMoney: res.data.entity.memberSale.price,
              authTime: res.data.entity.authTime,
              user: user,
              memberShowInfo: options.memberShowInfo
            })
          }
        },
        fail: function () {
          console.log("jhgjhgjhg")
        }
      });
    },
  /**
   * 购买下单
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
          api.addOrder({
            data: {
              "loginCode": res.code,
              "payType": "WECHAT_PROGRAM",
              "userId": userId,
              "couponcode": '',
              "orderType": "MEMBER",
              "otherId": that.data.memberSaleId,
              "type": "1",
              "bargainPublishId": "0"
            },
            success: function (res) {
              var orderIdTemp = res.data.entity.orderId;
              if (res.data.success) {
                if (res.data.entity.payState =='true'){
                    wx.navigateTo({
                      url: '/pages/web/courseInfor/courseInfor?id=' + that.data.courseId,
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
                        wx.navigateTo({
                          url: '/pages/member/member-rePayment/member-rePayment?orderId=' + orderIdTemp,
                        })
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