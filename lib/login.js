var crypto = require('crypto'),
	fs = require('fs'),
	_ = require('underscore'),
	async = require('async'),
	request = require('request'),
	beautify = require('js-beautify'),
	token;

// set cookie jar
var cookieJar = request.jar();
request = request.defaults({ jar: cookieJar });

module.exports = function(wx){
	var wxConfig = wx.config,
		wxHost = wxConfig.host,
		wxLoginUri = wxConfig.loginUri,
		wxImgcodeUri = wxConfig.imgcodeUri,
		imgcodeFile = wxConfig.imgcodeFile,
		sessionFile = wxConfig.sessionFile
		loginCycle = wxConfig.loginCycle;

	wx.getToken = function(){
		return token;
	}
	wx.getCookieJar = function(){
		return cookieJar;
	}

	wx.login = function(callback){
		async.waterfall([
			function(callback){	// submit form
				var form = wx.getLoginForm(),
					_form = {
						username : form.username,
						pwd : md5(form.password),
						imgcode : form.imgcode,
						f : 'json'
					}
				request({
					url: wxHost + wxLoginUri,
					method: 'post',
					headers: {	// header-referer needed
						Referer: wxHost
					},
					form: _form,
					json: true
				}, function(err, res, obj){
					if (err) {
						return callback(
							new Error('Error parsing login result')
						);
					}
					wx.updateLoginForm({	// clear imgcode
						imgcode: ''
					});
					callback(null, obj['ErrCode'], obj['ErrMsg']);
				});
			},
			function(errCode, homeUrl, callback){
				if (! _.contains([0, 65201, 65202], errCode)) {
					var loginErr = new Error(
							'Login failed, ErrCode: ' + errCode
						),
						form = wx.getLoginForm();
					if (errCode === -6) {	// imgcode showed up
						console.log('Imgcode showed up');
						request({
							url: wxHost + wxImgcodeUri,
							qs: {
								r: Date.now(),
								username: form.username
							},
							encoding: null	// as buffer
						}, function(err, res, buffer){	// save imgcode
							fs.writeFileSync(imgcodeFile, buffer);
							console.log('Imgcode file saved');
							callback(null, loginErr);
						});
					} else {
						callback(null, loginErr);
					}
					return;
				}
				console.log('Login successfully');
				token = homeUrl.match(/token=(.+)$/)[1];	// get token
				callback(null, null);
			},
			function(loginErr, callback){	// save session
				var data = beautify.js(JSON.stringify({
						token: token,
						cookies: cookieJar.cookies
					}));
				fs.writeFile(sessionFile, data, function(err){
					if (err) {
						return callback(
							new Error('Error writing session file')
						);
					}
					console.log('Session file saved');
					callback(loginErr);
				});
			}
		], function(err){
			callback(err);
		});
	}
	wx.stopKeepLogin = function(){
		clearInterval(keepLoginTimerId);
	}
	wx.startKeepLogin = function(){
		wx.stopKeepLogin();	// stop first
		keepLoginTimerId = setInterval(wx.login, loginCycle);
	}

	return wx;
}

function md5(str){	// md5
	return crypto.createHash('md5').update(str).digest('hex');
}

// case when login
/*
switch (n) {
case "-1":
i = "系统错误，请稍候再试。";
break;
case "-2":
i = "帐号或密码错误。";
break;
case "-3":
i = "您输入的帐号或者密码不正确，请重新输入。";
break;
case "-4":
i = "不存在该帐户。";
break;
case "-5":
i = "您目前处于访问受限状态。";
break;
case "-6":
i = "请输入图中的验证码", r();
return;
case "-7":
i = "此帐号已绑定私人微信号，不可用于公众平台登录。";
break;
case "-8":
i = "邮箱已存在。";
break;
case "-32":
i = "您输入的验证码不正确，请重新输入", r();
break;
case "-200":
i = "因频繁提交虚假资料，该帐号被拒绝登录。";
break;
case "-94":
i = "请使用邮箱登陆。";
break;
case "10":
i = "该公众会议号已经过期，无法再登录使用。";
break;
case "65201":
case "65202":
i = "成功登陆，正在跳转...", location.href = t.ErrMsg;
return;
case "0":
i = "成功登陆，正在跳转...", location.href = t.ErrMsg;
return;
case "-100":
i = '海外帐号请在公众平台海外版登录,<a href="http://admin.wechat.com/">点击登录</a>';
break;
default:
i = "未知的返回。";
return;
}
*/