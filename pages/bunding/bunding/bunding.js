var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: api.host,
    bundingFlag: 1,
    isShow: true,
    sec: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      avatar: options.avatar,
      name: options.name
    });
    //获取网站 注册开关
    api.websiteProfileInfo({
      data: {
        "type": 'registerController'
      },
      success: function (res) {
        that.setData({
          registerController: res.data.entity
        })
      }
    });
  },
  bundingNew: function () {
    var that = this;
    that.setData({ bundingFlag: 1 })
  },
  bundingOld: function () {
    var that = this;
    that.setData({ bundingFlag: 2 })
  },
  formSubmit: function (e) {
    var that = this
    if (that.data.bundingFlag === 1) {
      //用户名注册
      if (that.data.registerController.nameRegister == 'ON' && api.isEmpty(e.detail.value.userName)) {
        wx.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      //邮箱注册
      if (that.data.registerController.emailRegister == 'ON' && api.isEmpty(e.detail.value.email)) {
        wx.showToast({
          title: '请输入邮箱',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      //手机注册
      if (that.data.registerController.phoneRegister == 'ON' && api.isEmpty(e.detail.value.mobile)) {
        wx.showToast({
          title: '请输入手机',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      if (api.isEmpty(e.detail.value.password)) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      api.bundingNew({
        data: {
          "userProfileId": that.data.id,
          "userName": e.detail.value.userName,
          "email": e.detail.value.email,
          "mobile": e.detail.value.mobile,
          "mobileCode": e.detail.value.mobileCode,
          "password": e.detail.value.password
        },
        success: function (res) {
          if (res.data.success) {
            wx.showToast({
              title: "绑定成功！",
              icon: 'success',
              duration: 2000
            })
            wx.setStorageSync('user', res.data.entity.user);
            wx.navigateBack();
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
    }
    if (that.data.bundingFlag === 2) {
      api.bundingOld({
        data: {
          "account": e.detail.value.userName,
          "password": e.detail.value.password,
          "userProfileId": that.data.id
        },
        success: function (res) {
          if (res.data.success) {
            wx.showToast({
              title: "绑定成功！",
              icon: 'success',
              duration: 2000
            })
            wx.setStorageSync('user', res.data.entity);
            wx.navigateBack();
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
    }
  },
  //发送短信获取验证码
  getYzmFun: function (e) {
    console.log(e);
    var _this = this;
    var inputCode = _this.data.inputCode;

    var mobile = _this.data.mobile;
    if (!(/^\d{11}$/.test(mobile))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    var that = _this;
    api.getTelscode({
      data: {
        "sendType": 'register',
        "mobile": _this.data.mobile,
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          });
          //倒计时
          _this.countDown();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  //获取用户输入的手机
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  countDown: function (e) {
    var _this = this;
    //获取验证码倒计时
    var time = _this.data.sec　　//获取最初的秒数
    //code.getCode(_this, time);　　//调用倒计时函数

    _this.setData({
      isShow: false                    //按钮1隐藏，按钮2显示
    })
    var remain = _this.data.sec;             //用另外一个变量来操作秒数是为了保存最初定义的倒计时秒数，就不用在计时完之后再手动设置秒数
    var time = setInterval(function () {
      if (remain == 1) {
        clearInterval(time);
        _this.setData({
          sec: 60,
          isShow: true
        })
        return false      //必须有
      }
      remain--;
      _this.setData({
        sec: remain
      })
    }, 1000);
  }
})