// pages/web/course/courseList.js
//index.js
var app = getApp(),
  api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: api.host,
    loadingHidden: false,
    currentPage: 1,
    allCouList: [],
    totalPageSize: 1,
    scrollHeight: 0,
    filterdata: [
      []
    ],  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cateindex: -1,  //一级分类索引
    cateid: null,  //一级分类id
    subcateindex: 0, //二级分类索引
    subcateid: null, //二级分类id
    areaindex: 0,  //一级城市索引
    areaid: null,  //一级城市id
    subareaindex: 0,  //二级城市索引
    memberareaindex: -1,  //会员索引
    noDataCont: '当前条件下暂无课程',
    orderShow: [
      { "title": "综合排序", "key": "BYGONE" },
      { "title": "最新", "key": "NEW" },
      { "title": "最热", "key": "FOLLOW" },
      { "title": "价格从低到高", "key": "ASCENDING" },
      { "title": "价格从高到低", "key": "DESCENDING" }
    ],
    memberTypeList: [],//会员列表
    childSubjectList: [],//课程分类二级筛选
    subjectId: 0,
    order: "",//排序
    isFree: "",//是否免费
    memberTypeId: 0,//会员id
    sellType: "LIVE",//查询课程类型
    couFlag: 1//0代表对应分类下无课程，1代表有
  },
  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },
  fetchFilterData: function () { //获取筛选条件
    var that = this;
    api.querySubjectList({
      data: {
        "parentId": 0
      },
      success: function (res) {
        that.setData({
          filterdata: res.data.entity,
        })
      }
    });
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
  },
  setCateIndex: function (e) { //分类一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    var that = this;
    that.setData({
      cateindex: dataset.cateindex,
      cateid: dataset.cateid,
      subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
    });
    wx.setStorageSync("subjectId", dataset.cateid);
    that.data.subjectId = dataset.cateid;
    that.setData({
      allCouList: [],
      couFlag: 1,
      childSubjectList: []
    });
    that.data.currentPage = 1;
    this.initCourse();

    var subjectList = that.data.filterdata;
    for (var i = 0; i < subjectList.length; i++) {
      var subject = subjectList[i];
      if (subject.subjectId == dataset.cateid) {

        that.data.childSubjectList = subject.subjectList;
        that.setData({
          childSubjectList: that.data.childSubjectList
        })
      }
    }
  },
  setSubcateIndex: function (e) { //分类二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subcateindex: dataset.subcateindex,
      subcateid: dataset.subcateid,
    })

    wx.setStorageSync("subjectId", dataset.subcateid);
    this.data.subjectId = dataset.subcateid;
    this.setData({
      allCouList: [],
      couFlag: 1
    })
    this.data.currentPage = 1;
    this.initCourse();
    this.hideFilter();
  },
  setAreaIndex: function (e) { //排序方式筛选
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      order: dataset.orderval,
      areaindex: dataset.areaindex,
      subareaindex: d.areaindex == dataset.areaindex ? d.subareaindex : 0
    })
    wx.setStorageSync("order", dataset.orderval);
    this.setData({
      allCouList: [],
      couFlag: 1
    })
    this.data.currentPage = 1;
    this.initCourse();
    this.hideFilter();
  },

  //筛选 会员类型
  setScreenIndex: function (e) {
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      memberTypeId: dataset.screen,
      memberareaindex: dataset.memberareaindex
    })
    wx.setStorageSync("memberTypeId", dataset.screen);
    this.data.memberTypeId = dataset.screen;
    this.data.currentPage = 1;
  },

  //查询 条件筛选
  queryFilter: function (e) {
    const dataset = e.currentTarget.dataset;
    console.log(dataset.querytype);
    //课程类型
    if (dataset.querytype == "sellType") {
      if (this.data.sellTypePackage == 'PACKAGE') {
        this.setData({
          sellType: ""
        })
        this.data.sellTypePackage = "";
      } else {
        this.setData({
          sellType: dataset.val
        })
        this.data.sellTypePackage = dataset.val;
      }

    }
    //是否免费
    else if (dataset.querytype == "isFree") {
      if (this.data.isFree == "true") {
        this.setData({
          isFree: ""
        })
        this.data.isFree = "";
      } else {
        this.setData({
          isFree: dataset.val
        })
        this.data.isFree = dataset.val;
      }
    }
  },

  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },

  //确定提交搜索
  submitSearch: function () {
    this.setData({
      allCouList: [],
      couFlag: 0
    })
    this.data.currentPage = 1;
    this.initCourse();
    this.hideFilter();
  },
  //重置
  resetSearch: function () {
    this.setData({
      memberTypeId: 0,
      memberareaindex: -1,
      sellType: "",
      isFree: ""
    })
    this.data.currentPage = 1;
  },
  onLoad: function () {
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
        if (api.isNotEmpty(res.data.entity.hasBuy) && api.isNotEmpty(platform) ) {
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
    //  这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    var courseLiHeight =
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight - 50
          });
        }
      });
  },
  onShow: function (options) {
    this.data.allCouList = [];
    this.data.currentPage = 1;
    this.initCourse();
  },
  //加载下一页
  loadMore: function (e) {
    console.log("loadMore");
    if (this.data.totalPageSize >= this.data.currentPage) {

      this.data.currentPage += 1;
      this.setData({
        loadingHidden: false,
        currentPage: this.data.currentPage
      })
      this.initCourse(this.data.status);
      console.log(this.data.currentPage)
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onReachBottom: function (e) {
    console.log("onReachBottom");
    this.setData({
      currentPage: 1
    })
    this.data.allCouList = [];
    this.initCourse(this.data.status);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.web.company,
      desc: this.data.web.description,
      path: 'pages/web/index/index'
    }
  },
  initCourse: function (status) {
    var that = this;
    api.allCouList({
      data: {
        "currentPage": that.data.currentPage,
        "pageSize": 10,
        "subjectId": that.data.subjectId,
        "order": that.data.order,
        "memberTypeId": that.data.memberTypeId,
        "sellType_cou_pag": false,//只查询课程和套餐
        "sellType": that.data.sellType,//只查询课程
        "isFree": that.data.isFree
      },
      success: function (res) {
        if (res.data.success) {
          console.log(res)
          that.data.totalPageSize = res.data.entity.page.totalPageSize;
          that.data.allCouList = api.arrayConcat(that.data.allCouList, res.data.entity.courseList);
          that.data.filterdata = res.data.entity.parentSubjectList;
          that.data.memberTypeList = res.data.entity.memberTypeList;

          that.setData({
            allCouList: that.data.allCouList,
            filterdata: that.data.filterdata,
            memberTypeList: that.data.memberTypeList,
            loadingHidden: true
          })
          if (that.data.allCouList) {
            if (that.data.allCouList.length > 0) {
              that.setData({
                couFlag: 1
              })
            } else {
              that.setData({
                couFlag: 0
              })
            }
          }
        } else {
          that.setData({
            couFlag: 0
          })
        }
      },
      fail: function () {
        console.log("课程列表展示失败")
      }
    });
  },
  openCourse: function (event) {
    var courseId = event.currentTarget.dataset.courseid
    //console.log("on id is" + courseId);
    wx.navigateTo({
      url: '/pages/web/courseInfor/courseInfor?id=' + courseId,
    })
  }
})