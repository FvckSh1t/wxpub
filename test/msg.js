var async = require('async'),
	wxConfig = require('../config/wx'),
	wx = require('../lib/')(wxConfig);

async.waterfall([
	function(callback){
		wx.login(callback);
	},
	function(callback){
		wx.getMsgList(callback);
	},
	function(msgList, callback){
		wx.getStarMsgList(function(err, starMsgList){
			callback(err, msgList, starMsgList);
		});
	}
], function(err, msgList, starMsgList){
	if (err) throw err;
	console.log(msgList);
	console.log('Msg Count:', msgList.length);
	console.log(starMsgList);
});