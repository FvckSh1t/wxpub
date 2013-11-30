var path = require('path'),
	config = require('./'),
	wxConfig = module.exports = {};

// url & uri
wxConfig.host = 'https://mp.weixin.qq.com';
wxConfig.loginUri = '/cgi-bin/login';
wxConfig.imgcodeUri = '/cgi-bin/verifycode';
wxConfig.msgListUri = '/cgi-bin/message?t=message/list&lang=zh_CN';
wxConfig.userListUri = '/cgi-bin/contactmanage?t=user/index&lang=zh_CN';

// file & dir
var wxDataDir = wxConfig.dataDir = path.join(config.dataDir);
wxConfig.loginFormFile = path.join(wxDataDir, 'login-form.json');
wxConfig.imgcodeFile = path.join(wxDataDir, 'imgcode.jpg');
wxConfig.sessionFile = path.join(wxDataDir, 'session.json');

wxConfig.loginCycle = 1000 * 60 * 15;	// 15min