function initCCUrl(params) {
  wx.request({
    url: 'https://p.bokecc.com/servlet/getvideofile?vid=' + params.data.vid + '&siteid=' + params.data.siteid + '&divid=&width=300&useragent=Android&version=20140214&hlssupport=1',
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      var data = JSON.parse(res.data.substring(5, res.data.length - 1));
      var ccplayUrl = data.copies[0].playurl;
      params.success(ccplayUrl);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}
function getTencentUrl(params) {
  wx.request({
    url: 'https://play.video.qcloud.com/index.php?interface=Vod_Api_GetPlayInfo&1=1&file_id=' + params.data.fileId + '&app_id=' + params.data.appId + '&refer=play.video.qcloud.com&_=' + Date.parse(new Date()),
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      params.success && params.success(res.data.data.file_info.image_video.videoUrls[1].url)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

function getPolyvUrl(params) {
  wx.request({
    url: 'https://v.polyv.net/uc/services/rest?method=getById',
    data: params.data,
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      console.log(res.data.data[0].mp4)
      //params.success && params.success(res.data);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

function initKe96(params) {
  wx.request({
    url: 'https://v.96koo.net/common/getVideoInfoJsonP',
    data: params.data,
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      res = JSON.parse(res.data.substring(5, res.data.length - 2));
      params.success && params.success(res.video_low_url)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

const getCCUrl = (params) => initCCUrl(params);
const getKe96 = (params) => initKe96(params);
module.exports = {
  getCCUrl,
  getTencentUrl,
  getPolyvUrl,
  getKe96
}