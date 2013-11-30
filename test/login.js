var wxConfig = require('../config/wx'),
	wx = require('../lib/')(wxConfig);

wx.login(function(err){
	if (err) throw err;
});