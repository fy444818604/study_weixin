// pages/web/exam/examTest/examTest.js
var app = getApp(),
  time,
  utils = require('../../../../utils/util.js'),
  api = require('../../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exam: [],
    allLength: 0,
    score: 0,
    list: [],
    current: 0,
    type: 0,
    title: '',
    name: '',
    everyScore: 0,
    num: 0,
    countDown: 0,
    countStr:'00:00:00',
    isTxt:false,
    paperId:0,
    record:[],
    subjectId:0,
    shadow:false
  },

  shadowSwitch() {
    let _this = this;
    this.setData({
      shadow: !_this.data.shadow
    })
  },

  setIndex(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let current = 0;
    this.data.list.map((v,i) => {
      if (v.id == index){
        current = i
      }
    })
    let _this = this;
    this.setData({
      current: current,
      title: _this.data.list[current].title,
      name: _this.data.list[current].name,
      everyScore: _this.data.list[current].everyScore,
      num: _this.data.list[current].num,
      type: _this.data.list[current].type,
      shadow: true
    })
    this.isTxt();
    
  },

  getRecord() {
    let array = []
    this.data.exam.map(v1 => {
      v1.qstMiddleList.map(v2 => {
        v2.active = false
      })
    })
    this.data.list.map(v => {
      // let isAnswer = v.optionList.some(item => {
      //   return item.active
      // })
      let isAnswer = v.userAnswer
      if (isAnswer) {
        
        let recordItem = {
          qstType: v.type,
          pointId: v.pointId,
          qstIdsLite: v.qstId,
          answerLite: v.optAnswer,
          score:v.score,
          paperMiddle: v.paperMiddle,
          userAnswer: v.userAnswer
        }
        array.push(recordItem)

        this.data.exam.map(v1 => {
          v1.qstMiddleList.map(v2 => {
            if(v2.id == v.id){
              v2.active = true
            }
          })
        })

        this.setData({
          exam:this.data.exam
        })
      }
    })
    return array
  },

  isTxt(){
    if (this.data.type == 4 || this.data.type == 6 || this.data.type == 7){
      this.setData({
        isTxt: false
      })
    }else{
      this.setData({
        isTxt: true
      })
    }
  },

  examChange(e) {
    let _this = this;
    this.setData({
      current: e.detail.current,
      title: _this.data.list[e.detail.current].title,
      name: _this.data.list[e.detail.current].name,
      everyScore: _this.data.list[e.detail.current].everyScore,
      num: _this.data.list[e.detail.current].num,
      type: _this.data.list[e.detail.current].type
    })
    this.isTxt();
  },

  optSelect(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    console.log(this.data.type)
    if (this.data.type == 1 || this.data.type == 3) {
      console.log(this.data.list[this.data.current].optionList)
      this.data.list[this.data.current].optionList.map(v => {
        v.active = false
      })
      this.data.list[this.data.current].optionList[index].active = true
      this.data.list[this.data.current].userAnswer = this.data.list[this.data.current].optionList[index].optOrder
      this.getNext();
    } else if (this.data.type == 2 || this.data.type == 5) {
      let str = '';
      this.data.list[this.data.current].optionList[index].active = !this.data.list[this.data.current].optionList[index].active;
      this.data.list[this.data.current].optionList.map(v => {
        if(v.active){
          str += v.optOrder
        }
      })
      this.data.list[this.data.current].userAnswer = str
    }

    this.setData({
      list: _this.data.list,
      record: this.getRecord()
    })

  },

  getNext(){
    if(this.data.current != this.data.list.length - 1){
      this.data.current++
      this.setData({
        current: this.data.current
      })
    }
  },

  setText(e){
    this.data.list[this.data.current].userAnswer = e.detail.value;
    this.setData({
      list: this.data.list,
      record: this.getRecord()
    })

  },

  pause() {
    utils.alertView('休息','休息一下再继续吧',this.count)
    clearInterval(time)
  },

  submitExam() {
    let _this = this;
    wx.showModal({
      title: '交卷',
      content: '确认交卷？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          _this.addPaperRecord(0)
        }
      }
    });
  },

  nextExam() {
    utils.alertView('开发', '开发中ING...')
    // this.addPaperRecord(1)
  },

  calcShow() {
    utils.alertView('开发', '开发中ING...')
  },

  addPaperRecord(val) {
    let _this = this;
    console.log(_this.data.record)
    api.submitExam({
      data: {
        userId: 3580,
        optype:val,
        type: 1,
        subjectId: _this.data.subjectId,
        testTime: Math.ceil(_this.data.countDown / 60),
        epId: _this.data.paperId,
        record: JSON.stringify(_this.data.record)
      },
      success(res) {
        console.log(res)
      }
    })
  },

  count() {
    time = setInterval(() => {
      if (this.data.countDown != 0) {
        this.data.countDown--
      } else {
        this.addPaperRecord(0)
        clearInterval(time)
      }
      this.setData({
        countDown: this.data.countDown,
        countStr: this.clock(this.data.countDown, 'hh:mm:ss')
      })
      
    }, 1000)
  },

  clock(time, fmt) {
    let h = Math.floor(time / (60 * 60));
    let hRemain = time % (60 * 60);
    let m = Math.floor(hRemain / 60);
    let mRemain = hRemain % 60;
    let s = mRemain;

    let obj = {
      "h+": ('00' + h).substr(-2),
      "m+": ('00' + m).substr(-2),
      "s+": ('00' + s).substr(-2),
    }

    for (let key in obj) {
      let pat = `(${key})`
      if (new RegExp(pat).test(fmt)) {
        let str = obj[key] + '';
        // RegExp.$1 hh mm ss贪婪匹配
        fmt = fmt.replace(RegExp.$1, str)
      }
    }
    return fmt;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      paperId: options.id
    })
    let _this = this;
    api.exam({
      data: {
        paperId: _this.data.paperId,
        userId: 3580
      },
      success: res => {
        console.log(res)
        let data = res.data.entity.paperMiddleList.sort((a, b) => {
          return a.sort - b.sort
        })
        data.map(v => {
          v.qstMiddleList.sort((a, b) => {
            return a.sort - b.sort
          })
        })
        let list = [];
        data.map(v => {
          let obj = {
            type: v.type,
            everyScore: v.score,
            num: v.num,
            name: v.name,
            title: v.title,
            paperMiddle: v.id,
            userAnswer:''
          }
          v.qstMiddleList.map(v1 => {
            v1 = Object.assign(v1, obj);
            v1.optionList.map(v => {
              v.active = false
            })
            list.push(v1)
          })
        })
        _this.setData({
          exam: data,
          list: list,
          title: list[0].title,
          name: list[0].name,
          everyScore: list[0].everyScore,
          num: list[0].num,
          type: list[0].type,
          countDown: res.data.entity.examPaper.replyTime * 60,
          subjectId: res.data.entity.examPaper.subjectId
        })
        this.isTxt();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.count()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})