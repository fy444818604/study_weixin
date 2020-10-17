// pages/web/register/register.js
var app = getApp(),
  utils = require("../../../utils/util.js"),
  api = require('../../../utils/api.js');
let Mcaptcha = require('../../../utils/mcaptcha.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerController: [],//网站注册开关    
    cvs: {
      width: 120,
      height: 35
    },
    randomCode:'',
    isShow: true,                    //按钮1隐藏，按钮2显示
    sec: 60,
    mobile:'',
    inputCode:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomCode();
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: this.data.cvs.width,
      height: this.data.cvs.height,
      code: this.data.randomCode
    })

    var that = this;
    //获取网站 注册开关
    api.websiteProfileInfo({
      data: {
        "type":'registerController'
      },
      success: function (res) {
        that.setData({
          registerController: res.data.entity
        })
      }
    });
  },

  /**
   * 刷新验证码
   */
  imgNewTap: function (e) {
    this.getRandomCode();
    //this.mcaptcha.refresh(this.data.randomCode);
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: this.data.cvs.width,
      height: this.data.cvs.height,
      code: this.data.randomCode
    })
  },
  /**
   * 获取验证码
   */
  getRandomCode:function(e){
    var random = Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9);
    console.log(random);
    this.setData({
      randomCode: random
    })
  },
  //获取用户输入的手机
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //获取用户输入的验证码
  registerRamdomCodeInput: function (e) {
    this.setData({
      inputCode: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this;
    var registerRamdomCode = e.detail.value.registerRamdomCode;
    var password = e.detail.value.password;
    var userName = e.detail.value.userName;
    var email = e.detail.value.email;
    var mobile = e.detail.value.mobile;
    
    //用户名注册
    if (that.data.registerController.nameRegister == 'ON' && api.isEmpty(userName)) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    //邮箱注册
    if (that.data.registerController.emailRegister == 'ON' && api.isEmpty(email)) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    //手机注册
    if (that.data.registerController.phoneRegister == 'ON' && api.isEmpty(mobile)) {
      wx.showToast({
        title: '请输入手机',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    //开启手机验证码 验证18632305695  8275
    if (that.data.registerController.phoneProving!='ON' && registerRamdomCode != that.data.randomCode){
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    //手机注册
    if (api.isEmpty(password)) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    
    api.register({
      data: {
        "userName": e.detail.value.userName,
        "email": e.detail.value.email,
        "mobile": e.detail.value.mobile,
        "mobileCode": e.detail.value.mobileCode,
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
          wx.navigateBack({
            url: '/pages/web/logs/logs'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            image: '/images/hint.png',
            duration: 3000,
          })
        }
      }
    });
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

    //开启手机验证码 验证
    if (inputCode != _this.data.randomCode) {
      wx.showToast({
        title: '请输入正确的图片验证码',
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

          //刷新验证码
          _this.getRandomCode();
          _this.mcaptcha = new Mcaptcha({
            el: 'canvas',
            width: _this.data.cvs.width,
            height: _this.data.cvs.height,
            code: _this.data.randomCode
          })
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
  countDown:function(e){
    var _this=this;
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
          sec: num,
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