// pages/web/register/register.js
var 
  api = require('../../../utils/api.js');
let Mcaptcha = require('../../../utils/mcaptcha.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cvs: {
      width: 132,
      height: 35   
    },
    registerController: [],//网站注册开关 
    randomCode: '',
    isShow: true,                    //按钮1隐藏，按钮2显示
    sec: 60,
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
      code: this.data.randomCode,
      inputCode:'',
      emailOrMobile:''
    })

    var that = this;
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
  getRandomCode: function (e) {
    var random = Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9);
    console.log(random);
    this.setData({
      randomCode: random
    })
  },
  //获取用户输入的
  emailOrMobileInput: function (e) {
    this.setData({
      emailOrMobile: e.detail.value
    })
  },
  //获取用户输入的验证码
  ramdomCodeInput: function (e) {
    this.setData({
      inputCode: e.detail.value
    })
  },
  //发送验证码
  getYzmFun: function (e) {
    console.log(e);
    var _this = this;
    

    var emailOrMobile = _this.data.emailOrMobile;
    var isInputMobile = (/^\d{11}$/.test(emailOrMobile))
    var isInputEmail = (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(emailOrMobile))
    if (_this.data.registerController.mobileRecovery == 'ON' && _this.data.registerController.emailRecovery != 'ON' && !isInputMobile) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    else if (_this.data.registerController.mobileRecovery != 'ON' && _this.data.registerController.emailRecovery != 'ON' && !isInputEmail) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    else if (!isInputEmail && !isInputMobile) {
      wx.showToast({
        title: '请输入正确的手机号或者邮箱',
        icon: 'none',
        duration: 3000,
      })
      return;
    }
    var inputCode = _this.data.inputCode;
    if (inputCode != _this.data.randomCode) {
      wx.showToast({
        title: '请输入正确的图片验证码',
        icon: 'none',
        duration: 3000,
      })
      return;
    }

    var that = _this;
    if (isInputMobile){
      api.getTelscode({
        data: {
          "sendType": 'findpass',
          "mobile": _this.data.emailOrMobile,
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
    }
    else if (isInputEmail) {
      api.sendEmailCode({
        data: {
          "email": _this.data.emailOrMobile,
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
    }
   
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

  },
  formSubmit: function (e) {
    console.log(e)
    var that = this;
    var randomCode = e.detail.value.randomCode;
    var emailOrMobile = e.detail.value.emailOrMobile;

    //开启手机验证码 验证18632305695  8275
    if (api.isEmpty(emailOrMobile)) {
      wx.showToast({
        title: '请输入手机号或者邮箱',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (api.isEmpty(randomCode)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    api.findPassCheck({
      data: {
        "emailOrMobile": emailOrMobile,
        "randomCode": randomCode
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          wx.navigateTo({
            url: '/pages/web/setPassword/forgetPassword?token=' + res.data.entity.token
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
  }
})
