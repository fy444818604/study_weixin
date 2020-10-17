var app = getApp(),
  utils = require("../../../../utils/util.js"),
  api = require('../../../../utils/api.js');
Page({
  data:{
    host: api.host,
    loadingHidden:true,
    user:'',
    contentType:'basic',
    username:'',
    mobile:'',
    newTel:'',
    newEmail: '',
    temFile:'',
    isShow: true,                    //按钮1隐藏，按钮2显示
  },
  onLoad:function(options){
    this.userInfoInit();
    let type = options.type;
    this.setData({
      contentType: type
    });
    if (this.data.contentType === 'basic'){
      wx.setNavigationBarTitle({
        title: '个人信息'
      })
    } else if(this.data.contentType === 'avator'){
      wx.setNavigationBarTitle({
        title: '修改头像'
      })
    } else if (this.data.contentType === 'password') {
      wx.setNavigationBarTitle({
        title: '密码设置'
      })
    } else if (this.data.contentType === 'mobile') {
      wx.setNavigationBarTitle({
        title: '手机号修改'
      })
    } else if (this.data.contentType === 'email') {
      wx.setNavigationBarTitle({
        title: '邮箱修改'
      })
    };
    console.log(this.data.contentType);
  },
  //用户信息初始化
  userInfoInit:function(e){
    var that = this;
    var userId = 0;
    var user = wx.getStorageSync('user');
    if(api.isNotEmpty(user)){
      userId = user.userId;
    }
    api.queryUserById({
      data:{
        "userId":userId
      },
      success:function(res){
        console.log("+++++++++++++++");
        console.log(res);
        console.log("+++++++++++++++");
        if(res.data.success){
          that.setData({
             user: res.data.entity.user,
             username: res.data.entity.user.showName,
             mobile: res.data.entity.user.mobile
          }) 
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'error',
            duration: 2000,
          });
        }
      }
    });
    // api.queryUserBinding({
    //   data: {
    //     "userId": userId
    //   },
    //   success: function (res) {
    //     console.log("----------------");
    //     console.log(res);
    //     console.log("-----------");
    //     if (res.data.success) {
    //       // that.setData({
    //       //   user: res.data.entity.user,
    //       //   username: res.data.entity.user.nickname,
    //       //   mobile: res.data.entity.user.mobile
    //       // })
    //     } else {
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'error',
    //         duration: 2000,
    //       });
    //     }
    //   }
    // })
  },
  //新手机号的获取
  newTelGet:function(e){
    this.setData({
      newTel: e.detail.value
    })
  },
  //新邮箱号的获取
  newEmailGet: function (e) {
    this.setData({
      newEmail: e.detail.value
    })
  },
  //基本信息的修改
  basicFormSubmit: function(e){
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userName = e.detail.value.userName;
    if (api.isEmpty(userName)) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var showName = e.detail.value.showName;
    if (api.isEmpty(showName)) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var mobile = e.detail.value.mobile;
    if (api.isEmpty(mobile)) {
      wx.showToast({
        title: '请输入手机',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var email = e.detail.value.email;
    if (api.isEmpty(email)) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    var userId = user.userId;
    console.log(e.detail.value)
    api.updateUser({
      data: {
        "userId": userId,
        "userName": userName,
        "showName": showName,
        "email": email,
        "mobile": mobile
      },
      success: function (res) {
        if (res.data.success) {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: 'success',
            duration: 2000
          })
          wx.setStorageSync('user', res.data.entity);
        }
      }
    })
  },
  //密码修改
  passwordSubmit: function (e) {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var nowPassword = e.detail.value.oldpwd;
    if (api.isEmpty(nowPassword)) {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var newPassword = e.detail.value.pwd;
    if (api.isEmpty(newPassword)) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var userId = user.userId;
    console.log(e.detail.value)
    if (newPassword === e.detail.value.pwdTwice){
      api.updatePwd({
        data: {
          "userId": userId,
          "nowPassword": nowPassword,
          "newPassword": newPassword,
          "confirmPwd": e.detail.value.pwdTwice,
        },
        success: function (res) {
          if (res.data.success) {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //发送短信获取验证码
  getYzmFun:function(){
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userId = user.userId;
    api.getTelscode({
      data: {
        "sendType": 'register',
        "mobile": that.data.newTel,
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //发送邮件获取验证码
  getEmailYzmFun() {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userId = user.userId;
    api.getEmailscode({
      data: {
        "sendType": 'register',
        "email": that.data.newEmail,
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //修改手机号
  mobileFormSubmit:function(e){
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userId = user.userId;
    api.mobileUpdate({
      data: {
        "userId": userId,
        "mobile": e.detail.value.tel, 
        "code": e.detail.value.verifyCode
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //修改邮箱
  emailFormSubmit: function (e) {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userId = user.userId;
    api.emailUpdate({
      data: {
        "userId": userId,
        "email": e.detail.value.newEmail,
        "code": e.detail.value.verifyCode
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //修改头像
  avatorFormSubmit: function (e) {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/web/logs/logs'
      });
      return;
    }
    var userId = user.userId;
    var imgUrl = e;
    console.log(imgUrl)
    api.updateImg({
      data: {
        "userId": userId,
        "picImg": imgUrl
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.setStorageSync('user', res.data.entity);
          that.setData({
            user: res.data.entity
          })
        }
      }
    })
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })

  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          temFile: res.tempFilePaths[0]
        })
        _this.avatorUpload()
      }
    })
  },
  avatorUpload:function(){
    console.log(this.data.temFile)
    var that=this;
    wx.uploadFile({
      url: this.data.host + '/image/appupload',
      filePath: this.data.temFile,
      name: 'imgFile',
      formData:{},
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      success: function (res) {
        console.log(JSON.parse(res.data).url);
    
        if (res.statusCode == 200 && !res.data.result_code) {
          that.avatorFormSubmit(JSON.parse(res.data).url);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //加载上一页或者下拉刷新
  refresh:function(e){
   
  },
  //加载下一页
  loadMore:function(e){
   
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
});