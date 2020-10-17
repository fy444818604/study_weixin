//logs.js
var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');

Page({
  data: {
    host: api.host,
    loginFlag: 0,//未登录为1，登陆后为2
    userInfo: new Object()
  },
  aaa(){
    wx.showModal({
      title: '提示',
      content: '是否跳转学习平台',
      success(res) {
        if (res.confirm) {
          wx.navigateToMiniProgram({
            appId: 'wx0bf1f71be247baa0',
            path: 'pages/user/user?id=123',
            extraData: {
              foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
              // 打开成功
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  onShow: function (options) {
   
    this.userInfo()
  },
  logout: function () {
    wx.removeStorageSync('user');
    wx.removeStorageSync('userId');
    wx.removeStorageSync('loginTime');
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      this.setData({ loginFlag: 1 })
    }
  },
  userInfo: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isNotEmpty(user)) {
      that.setData({ loginFlag: 2 })
    } else {
      that.setData({ loginFlag: 1 })
      wx.setNavigationBarTitle({
        title: '登录'
      })
    }
    if (that.data.loginFlag == 2) {
      that.setData({
        userInfo: user,
      })
      wx.setNavigationBarTitle({
        title: '个人中心'
      })
      // api.userInfo({
      //   success: function (res) {
      //     console.log(res);
      //     that.setData({
      //       userInfo: res.data.entity.user,
      //     })
      //   }
      // });
    }
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    api.login({
      data: {
        "account": e.detail.value.userName,
        "password": e.detail.value.password
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({ loginFlag: 2 })
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })

          wx.setStorageSync('user', res.data.entity);
          //utils.expire();
          that.userInfo();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            image: '/img/hint.png',
            duration: 3000,
          })
        }
      }
    });
  },
  register:function(e){
    wx.navigateTo({
      url: '/pages/web/register/register',
    })
  },
  forgetpwd: function (e) {
    wx.navigateTo({
      url: '/pages/web/forgetPassword/forgetPassword',
    })
  },
  weChatProgramLogin: function () {
    var that = this;
    //调用登录
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              //发起网络请求
              api.weChatProgramLogin({
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  if (res.data.success) {
                    api.thirdLoginReturn({
                      data: {
                        loginValue: res.data.entity.unionId,
                        profileType: "WEIXIN",
                        avator: res.data.entity.avatarUrl,
                        name: res.data.entity.nickName
                      },
                      success: function (res) {
                        if (res.data.success) {
                          if (res.data.entity.isBinding == 'true') {
                            // 登录
                            that.setData({ loginFlag: 2 })
                            wx.showToast({
                              title: "登录成功！",
                              icon: 'success',
                              duration: 2000
                            });
                            wx.setStorageSync('user', res.data.entity.user);
                            that.userInfo();
                          } else {
                            // 绑定
                            console.log('/pages/bunding/bunding/bunding?id=' + res.data.entity.userProfileId +
                              '&avatar=' + res.data.entity.userProfileAvatar +
                              '&name=' + res.data.entity.userProfileName);
                            wx.navigateTo({
                              url: '/pages/bunding/bunding/bunding?id=' + res.data.entity.userProfileId +
                                '&avatar=' + res.data.entity.userProfileAvatar +
                                '&name=' + res.data.entity.userProfileName
                            });
                          }
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            image: '/img/hint.png',
                            duration: 3000,
                          });
                        }
                      },
                      fail: function () {
                        wx.showToast({
                          title: "登录失败！",
                          icon: 'none',
                          image: '/img/hint.png',
                          duration: 3000,
                        });
                      }
                    });
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      image: '/img/hint.png',
                      duration: 3000,
                    });
                  }
                }
              });
            },
            fail: function () {
              wx.showToast({
                title: "登录失败！",
                icon: 'none',
                image: '/img/hint.png',
                duration: 3000,
              });
            }
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "登录失败！",
          icon: 'none',
          image: '/img/hint.png',
          duration: 3000,
        });
      }
    });
  },
  onLoad: function (options) {
    console.log("-------")
    if(options.token){
      api.authLogin({
        data:{},
        success: function (res) {
          console.log(res)
          if (res.data.success) {
            that.setData({ loginFlag: 2 })
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })

            wx.setStorageSync('user', res.data.entity);
            //utils.expire();
            that.userInfo();
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              image: '/img/hint.png',
              duration: 3000,
            })
          }
        }
      }, options.token)
    }
    console.log("-------")
    var that = this;
    api.websiteProfileInfo({
      data: {
        "type": 'serviceSwitch'
      },
      success: function (res) {
        that.setData({
          serviceSwitch: res.data.entity
        })
        if (that.data.serviceSwitch.live === 'ON') {
          app.editTabBarWithLive();
        } else {
          app.editTabBar();
        }
      }
    });
    api.websiteProfileInfo({
      data: {
        "type": 'WeChatProgramPay'
      },
      success: function (res) {
        var platform = wx.getSystemInfoSync().platform;
        if (api.isNotEmpty(res.data.entity.hasBuy) && api.isNotEmpty(platform) && platform != 'ios') {
          that.setData({
            hasBuy: res.data.entity.hasBuy
          });
        } else {
          that.setData({
            hasBuy: 'false'
          });
        }
      }
    });
  }
})