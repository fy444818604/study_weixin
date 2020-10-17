// pages/web/courseInfor/courseInfor.js
var app = getApp(),
  api = require('../../../utils/api.js'),
  player = require('../../../utils/player.js');

var cc = getApp().globalData.ccsdk;
Page({
  data: {
    host: api.host,
    avatorSource: '',
    userName: '',
    course: '',
    couKpoint: [],
    courseListOfPackge:[],
    videoPlay: true,
    videoSrc: '',
    courseId: 0,
    kpointId: 0,
    askInfo: '',
    contentType: 'catlog',
    loadingHidden: false,
    currentKpointId: 0,
    couType: '',
    mplay: true,
    isPlayActive: false,
    currentPage: 1,
    couFlag: 1,//0代表对应分类下无课程，1代表有
    isPay: false,//课程是否支付
    progress:0,
    duration:'00:00:00',
    //新cc直播的参数
    groupId: "",
    password: "",//密码
    btnType: "allow",//按钮类型
    errorHintText: "",
    hint: false,//提示
    loading: false,//加载中
    roomTitle: "",//
    desc: "",//简介
    announcement: "",//公告
    pdfView: 0,//文档模块
    chatView: 0,//聊天模块
    qaView: 0,//问答模块
    viewerName: "",//观看者昵称
    viewerId: "",//观看者id
    isLogin: true,
    groupid: "",//groupid
    //cc直播回放属性
    room_info: {},
    template_info: {},
  },
  onShow: function () {
    cc.live.quit();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var self = this;
    //模版信息
    cc.live.on("template_info", function (data) {
      self.setData({
        pdfView: data.pdfView,
        chatView: data.chatView,
        qaView: data.qaView,
      });
    });

    //观看者信息
    cc.live.on("viewer_info", function (data) {
      self.setData({
        viewerName: data.name,
        viewerId: data.id
      });
    });

    //简介
    cc.live.on("room_info", function (data) {
      self.setData({
        roomTitle: data.name,
        desc: data.desc
      });
    });

    //公告
    cc.live.on("announcement_info", function (data) {
      self.setData({
        announcement: data ? data : "暂无"
      });
    });

    //groupid
    cc.live.on("groupid_info", function (data) {
      self.setData({
        groupid: data
      });
    });

    //live_time_info
    cc.live.on("live_time_info", function (data) {
      console.log("live_time_info", data);
    });

    cc.replay.on("live_time_info", function (data) {
      console.log("live_time_info", data);
    });

    cc.replay.on("player_load", function (data) {
      // console.log('player_load', data);
    });

    cc.replay.on("room_info", function (data) {
      // console.log('room_info', data);
      self.setData({
        room_info: data
      });
    });

    cc.replay.on("template_info", function (data) {
      // console.log('template_info', data);
      self.setData({
        template_info: data
      });
    });

    cc.replay.on("groupid_info", function (data) {
      // console.log('groupid_info', data);
      self.setData({
        groupid: data
      });
    });

    cc.replay.on("viewerid_info", function (data) {
      console.log("viewerid_info", data);
      self.setData({
        viewerid: data.viewerid
      });
    });

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
    console.log(options)
    var that = this;
    that.data.courseId = options.id;
    //通过小程序码访问
    var scene = decodeURIComponent(options.scene);
    console.info("scene: " + scene);
    if (scene != "undefined" && scene != null && scene != "") {
      let info_arr = [];
      info_arr = scene.split(',');
      let id = info_arr[0];
      console.info("id: " + id);
      that.data.courseId = id;
    }
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.allCouInfo({
      data: {
        "courseId": that.data.courseId,
        "userId": userId
      },
      success: function (res) {
        console.log(res.data.entity.course.context)
        if (res.data.success) {
          let course = res.data.entity.course;
          //富文本内容 替换相对路劲
          course.context = course.context.replace(/src=\"\//g, "src=\"" + that.data.host + "\/");
          //富文本内容 图片自适应
          course.context = course.context.replace(/<img/g, "<img style='width:100%;height:auto;display:block;'");
          that.data.kpointId = res.data.entity.defaultKpointId
          wx.setStorageSync("courseId", options.courseId);
          wx.setStorageSync("kpointId", res.data.entity.defaultKpointId);
          console.log(res.data.entity.isFav, res.data.entity.isPlay)
          if (!(res.data.entity.isFav || res.data.entity.isPlay)) {
            that.setData({
              isPlayActive: true
            })
          }
          that.setData({
            course: course,
            loadingHidden: true,
            currentKpointId: res.data.entity.defaultKpointId,
            isPay:res.data.entity.isok
          })
          let content = course.context;
          if (api.isNotEmpty(res.data.entity.course.sellType)) {
            if (res.data.entity.course.sellType == "LIVE") {
              that.setData({
                learnBtn: '进入直播',
                videoSrc: res.data.entity.course.freeurl,
                liveFlag: 1
              })
            }
          }
        }
      },
      fail:function(){
        
      }
    });
    that.asseslist();
    that.couKpoint();
    that.courseListOfPackge();
  },
  onUnload: function () {
    wx.removeStorageSync("kpointId");
    wx.removeStorageSync('courseId');
    wx.removeStorageSync('videoPlayInfo');
  },
  addFavFunc: function () {
    var that = this;
    var couId = wx.getStorageSync('courseId');
    api.addFavorite({
      data: {
        "courseId": couId,
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isPlayActive: false
          })
        }
      }
    });
  },
  //课程章节列表
  couKpoint:function () {
    var that = this;
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.CourseKpoint({
      data:{ 
        courseId: that.data.courseId,
        userId: userId
      },
      success : function (res){
        console.info(res.data);
        that.setData({
          couKpoint: res.data.entity.parentKpointList
        })
        for (var i in that.data.couKpoint) {
          that.data.couKpoint[i].flag = false; // 添加新属性
        };
      }
    })
  },
    //课程章节列表折叠
  showChapter:function(e){
    var index = parseInt(e.currentTarget.dataset.param);
    var key = "couKpoint[" + index + "].flag";
    var val = this.data.couKpoint[index].flag;

    for (var i in this.data.couKpoint) {
      if (i!=index){
        this.data.couKpoint[i].flag = false;
      }
    };
    console.log(val);
    this.setData({
      [key]: !val,
      couKpoint: this.data.couKpoint
    })
  },
  //套餐课程列表
  courseListOfPackge:function(){
    var that = this;
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.allCouInfo({
      data: {
        courseId: that.data.courseId,
        userId: userId
      },
      success: function (res) {
        console.log(res.data.entity.courseListOfPackge);
        that.setData({
          courseListOfPackge: res.data.entity.courseListOfPackge
        })
      
      }
    })
  },
  openCourse: function (event) {
    var courseId = event.currentTarget.dataset.courseid
    //console.log("on id is" + courseId);
    wx.navigateTo({
      url: '/pages/web/courseInfor/courseInfor?id=' + courseId,
    })
  },
  //发表评论
  addAssess: function (e) {
    var that = this;
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先去登录哦~',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/web/logs/logs'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (e.detail.value.content == '') {
      wx.showToast({
        title: "请输入评论内容",
        icon: 'none',
        // image: '/img/hint.png',
        duration: 3000,
      })        
    } else {
      var userId = user.userId;
      api.addAssess({
        data: {
          "userId": userId,
          "type": 2,
          "otherId": that.data.courseId,
          "content": e.detail.value.content
        },
        success: function (res) {
          if (res.data.success) {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
            that.setData({
              askInfo: ''
            })
            that.asseslist();
          }else{
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              // image: '/img/hint.png',
              duration: 3000,
            })
          }
        }
      });
    }
  },
    //课程评论
  asseslist: function () {
    var that = this;
    api.CourseAssessList({
      data: {
        "otherId": that.data.courseId,
        "page.currentPage": that.data.currentPage
      },
      success: function (res) {
        console.log(res)
        if (!api.isEmpty(res.data.entity.commentList)){
          let assessList = res.data.entity.commentList;
          if (assessList.length > 0) {
            that.setData({
              assessList: assessList,
              couFlag: 1
            })
          } else {
            that.setData({
              couFlag: 0
            })
          } 
        } else{
          that.setData({
            couFlag: 0
          })
        }
      }
    });
  },
  togglePlay: function (e) {// 立即开始
    var user = wx.getStorageSync('user');
    if (api.isEmpty(user)) {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先去登录哦~',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/login/login'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      var kpointId = wx.getStorageSync("kpointId");
      this.playKpoint(kpointId);
      this.setData({
        videoPlay: false
      })
    }
  },
  switchContent: function (e) {
    let type = e.target.dataset.type
    let course = this.data.course
    this.setData({ course: course, contentType: type })
  },
  openKpoint: function (e) {//切换节点
    console.log(e);
    var that = this;
    var self = this;
    
    var user = wx.getStorageSync('user');
    var couType = e.currentTarget.dataset.type;
    var url = e.currentTarget.dataset.url;
    wx.setStorageSync('kpointId', e.currentTarget.dataset.kpointid);
    //如果未登录则弹提示用户登录
    if (api.isEmpty(user)) {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先去登录哦~',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/web/logs/logs'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
       
      })
      return;
    }
      if (couType === 'PDF') {
        wx.setStorageSync('pdfUrl', that.data.host + e.currentTarget.dataset.url);
        this.setData({
          currentKpointId: wx.getStorageSync('kpointId'),
          videoPlay: true
        })
        console.log("pdf")
        this.pdfFunc();
      } else if (couType === 'AUDIO') {
        var mp3Url = that.data.host + e.currentTarget.dataset.url;
        this.setData({ couType: 'AUDIO', mp3Url: mp3Url, videoPlay: false, currentKpointId: wx.getStorageSync('kpointId') })
        this.audioCtx = wx.createAudioContext('myAudio')
        this.audioCtx.setSrc(mp3Url)
        this.audioCtx.play()
        this.setData({
          mplay: false,
          videoPlay: false
        })
      } else if (couType === 'TXT') {
        console.log("TXT")
        wx.navigateTo({
          url: '/pages/web/playHall/index?id=' + e.currentTarget.dataset.kpointid + '&name=' + e.currentTarget.dataset.name,
        })
        this.setData({
          currentKpointId: wx.getStorageSync('kpointId'),
          videoPlay: true
        })
      } else if (couType === 'VIDEO') {
        
        this.setData({
          currentKpointId: wx.getStorageSync('kpointId'),
          couType: 'VIDEO',
          videoPlay: false
        })
        //判断是否应该加载该播放器
        var playflag = this.playKpoint(e.currentTarget.dataset.kpointid);
        if (!playflag){
            return;
        }
        this.videoContext = wx.createVideoContext('myVideo');
        this.videoContext.seek(0);
        // console.log(this.data.couType,this.data.videoPlay)
      } else if (couType === 'LIVE') {
        var kpointId = wx.getStorageSync('kpointId');
        //获取用户信息
        var user = wx.getStorageSync('user');
        var userId = 0;
        if (api.isNotEmpty(user)) {
          userId = user.userId;
        }
        api.kpointUrl({// 获取节点播放链接
          data: {
            "kpointId": kpointId,
            "userId": userId
          },
          success: function (res) {
            
            if (res.data.success) {
              if (res.data.entity.videotype === 'baijiayun') {
                wx.navigateTo({
                  url: '/pages/live/baijiayunLive/baijiayunLive?kpointId=' + wx.getStorageSync('kpointId'),
                })
              } else if (res.data.entity.videotype === '96koo') {
                wx.navigateTo({
                  url: '/pages/live/96kooLive/96kooLive?kpointId=' + wx.getStorageSync('kpointId'),
                })
              } else if (res.data.entity.videotype === 'keNewLive') {
                //96刻直播
                api.kpointUrl({// 获取节点播放链接
                  data: {
                    "kpointId": kpointId,
                    "userId": userId
                  },
                  success: function (res) {
                    if (res.data.success) {
                      console.log("res" + res);
                      //登录
                      cc.live.init({
                        userId: res.data.entity.userId,
                        roomId: res.data.entity.url,
                        userName: res.data.entity.name,
                        password: res.data.entity.playPass,
                        // userId: "9812F29912041A80",
                        // roomId: "AECD5C1896D157599C33DC5901307461",
                        // userName: "5121",
                        // password: "",
                        groupid: "",
                        viewercustomua: "ios",
                        viewercustominfo: "{\"exportInfos\": [{\"key\": \"城市\", \"value\": \"北京\"}, {\"key\": \"姓名\", \"value\": \"哈哈\"}]}",
                        wx: wx,
                        success: function (data) {
                          
                          console.log("登录成功回调", data);

                          // self.setData({
                          //   loading: false
                          // });
                          var str = "&roomTitle=" + encodeURIComponent(self.data.roomTitle)
                            + "&desc=" + encodeURIComponent(self.data.desc)
                            + "&announcement=" + encodeURIComponent(self.data.announcement)
                            + "&pdfView=" + encodeURIComponent(self.data.pdfView)
                            + "&chatView=" + encodeURIComponent(self.data.chatView)
                            + "&qaView=" + encodeURIComponent(self.data.qaView)
                            + "&viewerName=" + encodeURIComponent(self.data.viewerName)
                            + "&groupid=" + encodeURIComponent(self.data.groupid)
                            + "&viewerId=" + encodeURIComponent(self.data.viewerId);

                          wx.navigateTo({
                            url: "/pages/live/cclive/live/player/player?" + str
                          });

                        },
                        fail: function (res) {
                          console.log("登录失败回调", res);
                          self.hint(res.message);
                        }
                      });
                    }
                  }
                });
              } else if (res.data.entity.videotype === 'keNewLivePlayBack') {
                //96刻直播回放
                api.kpointUrl({// 获取节点播放链接
                  data: {
                    "kpointId": kpointId,
                    "userId": userId
                  },
                  success: function (res) {
                    if (res.data.success) {
                      console.log("res" + res);

                      //96刻直播回放登录
                      cc.replay.init({
                        userId: res.data.entity.userId,
                        roomId: res.data.entity.url,
                        userName: res.data.entity.name,
                        recordId: res.data.entity.recordId,
                        viewername: res.data.entity.name,
                        viewertoken: res.data.entity.playPass,
                        groupid: "",
                        wx: wx,
                        success: function (res) {
                          if (!self.data.isLogin) {
                            return false;
                          }
                          console.log("登录成功回调", res);
                          self.setData({
                            loading: false
                          });

                          var room_info = encodeURIComponent(JSON.stringify(self.data.room_info));
                          var template_info = encodeURIComponent(JSON.stringify(self.data.template_info));
                          var groupid = encodeURIComponent(self.data.groupid);
                          var viewerid = encodeURIComponent(self.data.viewerid);
                          var json = "room_info=" + room_info + "&template_info=" + template_info + "&groupid=" + groupid + "&viewerid=" + viewerid;
                          wx.navigateTo({
                            url: "/pages/live/cclive/replay/replay/replay?" + json
                          });
                        },
                        fail: function (res) {
                          console.log("登录失败回调", res);
                          self.hint(res.message);
                        }
                      });
                    }
                  }
                });



              }
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 3000,
              })
            }
          }
        });
      } else{
        wx.showToast({
          title: "暂不支持此类型",
          icon: 'none',
          // image: '/img/hint.png',
          duration: 3000,
        })
      }
    
  },
  pdfFunc: function () {
    this.setData({ loadingHidden: false })
    var that = this;
    wx.downloadFile({
      url: wx.getStorageSync('pdfUrl'),
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            that.setData({ loadingHidden: true })
            wx.showToast({
              title: '加载中',
              icon: 'loading',
              duration: 10
            })

            setTimeout(function () {
              wx.hideToast()
            }, 3000)
          },
          fail: function (err) {
            console.log(err)
            that.setData({ loadingHidden: true })
            wx.showToast({
              title: '打开文档失败',
              icon: 'fail',
              duration: 2000
            })
          }
        })
      }
    })
  },
  playKpoint: function (kpointId) {// 播放视频
    var that = this;
    //获取用户信息
    var user = wx.getStorageSync('user');
    var userId = 0;
    if (api.isNotEmpty(user)) {
      userId = user.userId;
    }
    api.kpointUrl({// 获取节点播放链接
      data: {
        "kpointId": kpointId,
        "userId": userId
      },
      success: function (res) {
        console.log(res);
        if (res.data.success) {
          if (res.data.entity.type == 'VIDEO') {// 视频
            //console.log("VIDEO")
            //本地视频
            if (res.data.entity.videotype == 'LOCALVIDEO') {
              that.setData({
                videoPlay: false,
                videoSrc: that.data.host + res.data.entity.videoUrl
              })
            } 
            //外链视频
            else if (res.data.entity.videotype == 'IFRAME') {
              that.setData({
                videoPlay: false,
                videoSrc:res.data.entity.videoUrl
              })
            } 
            else if (res.data.entity.videotype == '96koo') {
              player.getKe96({
                data: {
                  'videoId': res.data.entity.videoUrl
                },
                success: function (res) {
                  that.setData({
                    videoPlay: false,
                    videoSrc: res
                  })
                }
              });
              // this.videoCtx = wx.createVideoContext("myVideo");
              // this.videoCtx.play();
            }
          }
          
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            // image: '/img/hint.png',
            duration: 3000,
          })
          return false;
        }
        return true;
      }
    });
  },
  audioPlay: function (e) {
    this.audioCtx.play()
    this.setData({
      mplay: false
    })
  },
  funtimeupdate: function (e) {
    var duration = this.formatTime(e.detail.duration - e.detail.currentTime);

    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    console.log('音乐播放进度为' + progress + '%')
    this.setData({
      progress: progress,
      duration: duration
    })
  },
  //格式化显示时间
  formatTime:function(seconds) {
    return [
      parseInt(seconds / 60 / 60),
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ]
      .join(":")
      .replace(/\b(\d)\b/g, "0$1");
  },
  audioPause: function () {
    this.audioCtx.pause()
    this.setData({
      mplay: true
    })
  },
  backFun: function () {
    this.setData({
      videoPlay: true
    })
  },
  backFun1: function () {
    console.log(11112121212);
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
  // 购买方法
  buyTap: function (e) {
    if(this.data.hasBuy == 'true') {
      wx.navigateTo({
        url: '/pages/web/payment/payment?courseId=' + this.data.courseId,
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请前往PC端进行课程定制',
        success: function (res) {
          if (res.confirm);
        }
      });
    }
  },
   // 购买方法
  lookNow: function (e) {
    this.openKpoint();
  }
})