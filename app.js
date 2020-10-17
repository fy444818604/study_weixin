//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //状态的底部  
  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  editTabBarWithLive: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBarWithLive;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  globalData: {
    userInfo: null,
    pop: 2,
    num: 0,
    //cc直播的全局变量
    ccsdk: requirePlugin('ccsdk'),
    tabBar: {
      "color": "#666",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/web/index/index",
          "text": "首页",
          "iconPath": "/img/home_tab.png",
          "selectedIconPath": "/img/home_tab_selected.png",
          "clas": "menu-item",
          "selectedColor": "#000",
          active: true
        },
        {
          "pagePath": "/pages/web/course/courseList",
          "text": "课程",
          "iconPath": "/img/course_tab.png",
          "selectedIconPath": "/img/course_tab_selected.png",
          "selectedColor": "#000",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/web/exam/exam",
          "text": "考试",
          "iconPath": "/img/course_tab.png",
          "selectedIconPath": "/img/course_tab_selected.png",
          "selectedColor": "#000",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/web/logs/logs",
          "text": "我的",
          "iconPath": "/img/my_tab.png",
          "selectedIconPath": "/img/my_tab_selected.png",
          "selectedColor": "#000",
          "clas": "menu-item",
          active: false
        }
      ],
      "position": "bottom"
    },
    tabBarWithLive: {
      "color": "#666",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/web/index/index",
          "text": "首页",
          "iconPath": "/img/home_tab.png",
          "selectedIconPath": "/img/home_tab_selected.png",
          "clas": "menu-item-with-live",
          "selectedColor": "#000",
          active: true
        },
        {
          "pagePath": "/pages/web/course/courseList",
          "text": "课程",
          "iconPath": "/img/course_tab.png",
          "selectedIconPath": "/img/course_tab_selected.png",
          "selectedColor": "#000",
          "clas": "menu-item-with-live",
          active: false
        },
        // {
        //   "pagePath": "/pages/live/liveList/liveList",
        //   "text": "直播",
        //   "iconPath": "/img/live_tab.png",
        //   "selectedIconPath": "/img/live_tab_selected.png",
        //   "selectedColor": "#000",
        //   "clas": "menu-item-with-live",
        //   active: false
        // },
        {
          "pagePath": "/pages/web/logs/logs",
          "text": "我的",
          "iconPath": "/img/my_tab.png",
          "selectedIconPath": "/img/my_tab_selected.png",
          "selectedColor": "#000",
          "clas": "menu-item-with-live",
          active: false
        }
      ],
      "position": "bottom"
    }
  }
})