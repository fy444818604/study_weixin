var md5 = require('md5.js');
const host = "http://192.168.38.222:8080"
// const host = "https://xx.ysclass.net"
// const host = "https://wx.inxedu.com"
const wxRequest = function (params, url) {
  var timestamp = Date.parse(new Date()) / 1000;
  var sign = md5.hex_md5("inxedu" + timestamp);
  params.data['sign'] = sign;
  params.data['timestamp'] = timestamp;
  // console.log(host + url +"?timestamp="+timestamp+"&sign="+sign);
  wx.request({
    url: host + url,
    data: params.data || {},
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }, // 设置请求的 header
    success: function (res) {
      params.success && params.success(res);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
};
var isEmpty = function (str) {
  if (str == null || typeof str == "undefined" ||
    str == "") {
    return true;
  }
  return false;
}
var isNotEmpty = function (str) {
  return !isEmpty(str);
}
var arrayConcat = function (arr, arr1) {
  arr = arr.concat(arr1);
  return arr;
}
var arrayPush = function (arr, params) {
  arr = arr.push(params);
  return arr;
}
const login = (params) => wxRequest(params, "/webapp/login");
const userInfo = (params) => wxRequest(params, "/webapp/queryUserById");
const register = (params) => wxRequest(params, "/webapp/createuser");
const freeCourse = (params) => wxRequest(params, "/webapp/front/freeCourse");
const excellentCourse = (params) => wxRequest(params, "/webapp/front/recommenCourse");
const hotCourse = (params) => wxRequest(params, "/webapp/front/topCourse");
const ucIndex = (params) => wxRequest(params, "/webapp/front/topCourse");
const allCouList = (params) => wxRequest(params, "/webapp/cou/list");
const allCouInfo = (params) => wxRequest(params, "/webapp/front/couinfo");
const CourseAssessList = (params) => wxRequest(params, "/webapp/ajax/queryCommon");
const CourseKpoint = (params) => wxRequest(params, "/webapp/front/kpoint");
const addAssess = (params) => wxRequest(params, "/webapp/ajax/addcomment");
const websiteProfileInfo = (params) => wxRequest(params, "/webapp/websiteProfile/info");
const getTelscode = (params) => wxRequest(params, "/webapp/sendPhoneRegister");
const kpointUrl = (params) => wxRequest(params, "/webapp/weChat/kpointUrl");
const addOrder = (params) => wxRequest(params, "/webapp/addOrder");
const queryByCourse = (params) => wxRequest(params, "/webapp/coupon/queryByCourse");
const myAccount = (params) => wxRequest(params, "/webapp/myAccount");
const myCouPon = (params) => wxRequest(params, "/webapp/myCouPon");
const myCourse = (params) => wxRequest(params, "/webapp/myCourse");
const myOrderList = (params) => wxRequest(params, "/webapp/myOrderList");
const associator = (params) => wxRequest(params, "/webapp/user/associator");
const activationcard = (params) => wxRequest(params, "/webapp/course/activationcard");
const letter = (params) => wxRequest(params, "/webapp/letter");
const delLetterInbox = (params) => wxRequest(params, "/webapp/delLetterInbox");
const queryUserById = (params) => wxRequest(params, "/webapp/queryUserById");
const updateUser = (params) => wxRequest(params, "/webapp/updateUser");
const updateImg = (params) => wxRequest(params, "/webapp/user/updateImg");
const updatePwd = (params) => wxRequest(params, "/webapp/updatePwd");
const checkCoupon = (params) => wxRequest(params, "/webapp/coupon/check");
const cancleoder = (params) => wxRequest(params, "/webapp/cancleoder");
const repayInfo = (params) => wxRequest(params, "/webapp/order/repayInfo");
const orderRepay = (params) => wxRequest(params, "/webapp/order/repay");
const payassociator = (params) => wxRequest(params, "/webapp/user/payassociator");
const sendEmailCode = (params) => wxRequest(params, "/webapp/user/sendEmailCode");
const findPassCheck = (params) => wxRequest(params, "/webapp/user/findPassCheck");
const changePwd = (params) => wxRequest(params, "/webapp/user/changePwd");
const websiteImages = (params) => wxRequest(params, "/webapp/websiteImages");
const weChatProgramLogin = (params) => wxRequest(params, "/webapp/weChatProgramLogin");
const thirdLoginReturn = (params) => wxRequest(params, "/webapp/thirdLogin/return");
const bundingOld = (params) => wxRequest(params, "/webapp/user/bundingOld");
const bundingNew = (params) => wxRequest(params, "/webapp/user/bundingNew");
const authLogin = (params, params1) => wxRequest(params, `/webapp/authLogin?accesstoken=${params1}`)
const exam = (params) => wxRequest(params, `/webapp/exam/paperAnswer`)
const submitExam = (params) => wxRequest(params, `/webapp/exam/addPaperRecord1`)

// const submitExam = (params) => wxRequest(params, `/webapp/exam/addPaperRecord`)
const myExam = (params) => wxRequest(params, `/webapp/exam/queryMyExam`)
const allParper = (params) => wxRequest(params, `/webapp/paper/list/examPaper`)
const updPaperState = (params) => wxRequest(params, `/webapp/paper/updPaperState`)
const paperAnalysis = (params, id) => wxRequest(params, `/webapp/examPaper/paperAnalysis/${id}`)
const paperAnalysisChart = (params, id) => wxRequest(params, `/webapp/examPaper/paperAnalysisChart/${id}`)
const recordList = (params, id) => wxRequest(params, `/webapp/examPaper/recordList/${id}`)
const paperReport = (params) => wxRequest(params, `/webapp/exam/paperReport`)
const reportDetail = (params,obj) => wxRequest(params, `/webapp/paper/report/${obj.id}/${obj.userId}`)
const ucExamHistory = (params) => wxRequest(params, `/webapp/exam/ucExamHistory`)


module.exports = {
  host,
  isEmpty,
  isNotEmpty,
  arrayConcat,
  login,
  register,
  freeCourse,
  excellentCourse,
  hotCourse,
  allCouList,
  allCouInfo,
  CourseAssessList,
  CourseKpoint,
  arrayPush,
  addAssess,
  websiteProfileInfo,
  getTelscode,
  kpointUrl,
  addOrder,
  queryByCourse,
  myAccount,
  myCouPon,
  myCourse,
  myOrderList,
  associator,
  activationcard,
  letter,
  delLetterInbox,
  queryUserById,
  updateUser,
  updateImg,
  updatePwd,
  checkCoupon,
  cancleoder,
  repayInfo,
  orderRepay,
  payassociator,
  sendEmailCode,
  findPassCheck,
  changePwd,
  websiteImages,
  weChatProgramLogin,
  thirdLoginReturn,
  bundingOld,
  bundingNew,
  authLogin,
  exam,
  submitExam,
  myExam,
  allParper,
  updPaperState,
  paperAnalysis,
  paperAnalysisChart,
  recordList,
  paperReport,
  reportDetail,
  ucExamHistory
}