var $=require("../jquery");module.exports=function(r,t){var n=0;return $.each(r,function(r,e){if(e.ip===t.ip&&e.port===t.port)return n=r,!1}),n===r.length-1?n=0:n++,r[n]};