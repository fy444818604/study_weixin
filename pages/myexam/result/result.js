// pages/myexam/result/result.js
const api = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    tabArr: [{
        index: 1,
        text: "考试结果"
      },
      {
        index: 2,
        text: "答题结果"
      },
      {
        index: 3,
        text: "试题分析"
      }
    ],
    radioItems: [{
        value: '1',
        name: '查看全部解析',
        checked: 'true'
      },
      {
        value: '2',
        name: '只看错题解析',
      }
    ],
    replyTime: "",
    endTime: "",
    testTime: "",
    userScore: 0,
    svgRate: 0,
    objectiveScore: 0,
    accuracy: 0,
    middleList: [],
    paperReportList: [],
  },

  handleChangeTab(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
      middleList: this.data.middleListLS
    })
  },

  radioChange(e) {
    let val = e.detail.value;
    if (val == "1") {
      this.setData({
        middleList: this.data.middleListLS
      })
    } else {
      let ls = JSON.parse(JSON.stringify(this.data.middleListLS))
      // let data = ls.map(item => {
      //   let arr = item.qstMiddleList
      //   // item.qstMiddleList.map((val,key) => {
      //   //   if (val.userAnswer == val.optAnswer) {
      //   //     console.log(arr)
      //   //   }
      //   // })
      //   for (var i = item.qstMiddleList.length-1;i>0;i--){
      //     if (item.qstMiddleList[i].userAnswer != item.qstMiddleList[i].optAnswer) {
      //       item.qstMiddleList.splice(i,1)
      //       return item
      //     }
      //   }
      // })
      let data = []
      for (let i = 0; i <= ls.length; i++) {
        if (ls[i] && ls[i].qstMiddleList){
          for (let j = 0; j <= ls[i].qstMiddleList.length; j++) {
            console.log(123)
            // let val = ls[i].qstMiddleList[j];
            // if (val && val.userAnswer != val.optAnswer) {
            //   ls[i].qstMiddleList.splice(j, 1)
            // }
          }
        }
      }
      console.log("ls", ls)

      // let data = ls.map((item,index) => {
      //   console.log("item,", item)
      //   item.qstMiddleList.map((val, key) => {
      //     // 答案：optAnswer 回答：userAnswer
      //     if (val.userAnswer == val.optAnswer) {
      //       item.qstMiddleList.splice(key,1)
      //     }
      //     return val;
      //   })
      //   return item;
      // })
      this.setData({
        middleList: data,
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let user = wx.getStorageSync("user")
    // let data = {
    //   id: options.id,
    //   userId: user.userId
    // }
    let data = {
      id: "1246025",
      userId: 3327
    }
    api.paperReport({
      data: {},
      success: res => {
        console.log("res", res)
        let data = res.data.entity;
        let arr = data.paperMiddleList.filter(item => {
          return item.type != 4 && item.type != 7
        })
        arr = arr.map(item => {
          let all = item.qstMiddleList.some(v => {
            return v.userAnswer
          })
          item.all = all;
          if (item.type == 5 || item.type == 2 || item.type == 1) {
            item.qstMiddleList.forEach(v => {
              let result1 = v.userAnswer ? v.userAnswer.split("") : []
              let result2 = v.optAnswer ? v.optAnswer.split("") : []
              result2 && v.optionList.forEach(k => {
                let result3 = result1.includes(k.optOrder)
                let result4 = result2.includes(k.optOrder)
                k.isFlag = result3;
                k.isAll = result4
                return k;
              })
              return v
            })
          }
          return item
        })
        arr = arr.filter(item => {
          return item.all
        })

        this.setData({
          replyTime: data.examPaper.replyTime,
          endTime: data.paperRecord.addTime,
          testTime: 0,
          userScore: data.paperRecord.userScore,
          svgRate: data.examPaper.score * data.examPaper.passRate * 0.01,
          objectiveScore: data.paperRecord.objectiveScore,
          accuracy: data.paperRecord.accuracy * 100,
          middleListResult: arr,
          middleList: arr,
          middleListLS: arr,
          paperReportList: data.queryPaperReport
        })
      }
    }, data)
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