//图片地址
var share_imgurl = "http://mmbiz.qpic.cn/mmbiz/9OwLibM3EYaq99oD6D4qrWCBqniciarRJwicGbRqtPNxMBnD0STJObBrD19HtXCoKnnSUJfc4mdOKhn2zLDInWcCIQ/640";
//分享地址
var link ="http://172.30.23.77/weixin/play";
//分享内容
var content = "12334325674865";
//分享标题
var title  = "填写内容！！！";
window.shareData = {
"imgUrl": share_imgurl,
"timeLineLink": link,
"sendFriendLink": link,
"weiboLink": link,
"tTitle": title,
"tContent": content,
"fTitle": title,
"fContent": content,
"wContent": content
};

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	    
	    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
	        WeixinJSBridge.invoke('sendAppMessage', {
	            "img_url": window.shareData.imgUrl,
	            "link": window.shareData.timeLineLink,
	            "desc": window.shareData.tContent,
	            "title": window.shareData.tTitle
	        }, function(res) {
	        	document.location.href = mebtnopenurl;
	        })
	    });

	    WeixinJSBridge.on('menu:share:timeline', function(argv) {
	        WeixinJSBridge.invoke('shareTimeline', {
	            "img_url": window.shareData.imgUrl,
	            "link": window.shareData.timeLineLink,
	            "desc": window.shareData.tContent,
	            "title": window.shareData.tTitle
	        }, function(res) {
	        	document.location.href = mebtnopenurl;
	        });
	    });
	}, false);