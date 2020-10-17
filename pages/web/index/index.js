//index.js
var app = getApp(),
  api = require('../../../utils/api.js');
  Page({
    data:{
      host: api.host,
      imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    circular: true,
    freeCourseList:[],
    excellentCourse:[]
    },
    //页面分享
    onShareAppMessage: function () {
      return {
        title: this.data.web.company,
        desc: this.data.web.description,
        path: 'pages/web/index/index'
      }
    },
    onShow: function (options) {
      var that = this;
      api.freeCourse({
        data: {
          count:4
        },
        success: function (res) {
          console.log(res)
          var freeCourseList = res.data.entity;
          that.setData({
            freeCourseList: freeCourseList,
            loadingHidden: true,
          })
        },
        fail: function () {
          console.log("免费课程展示失败")
        }
      });
      api.excellentCourse({
        data: {
          count: 4
        },
        success: function (res) {
          console.log(res)
          var excellentCourse = res.data.entity;
          that.setData({
            excellentCourse: excellentCourse,
            loadingHidden: true,
          })
        },
        fail: function () {
          console.log("精品课程展示失败")
        }
      });
      api.hotCourse({
        data: {
          count: 4
        },
        success: function (res) {
          console.log(res)
          var hotCourse = res.data.entity;
          that.setData({
            hotCourse: hotCourse,
            loadingHidden: true,
          })
        },
        fail: function () {
          console.log("热门课程展示失败")
        }
      });
      api.websiteImages({
        data: {
          typeId: 27
        },
        success: function (res) {
          if (res.data.success) {
            that.setData({
              imgUrls: res.data.entity.websiteImagesList
            })
          }
        }
      });
    },
    openCourse: function (event) {
      var courseId = event.currentTarget.id
      //console.log("on id is" + courseId);
      wx.navigateTo({
        url: '/pages/web/courseInfor/courseInfor?id=' + courseId,
      })
    },
    onLoad: function() {
      var that = this;
      api.websiteProfileInfo({
        data: {
          "type": 'web'
        },
        success: function (res) {
          that.setData({
            web: res.data.entity
          })
        }
      });
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
          if (api.isNotEmpty(res.data.entity.hasBuy) && api.isNotEmpty(platform)) {
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
    },
  })
