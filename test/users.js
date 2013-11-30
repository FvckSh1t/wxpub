var async = require('async'),
	wxConfig = require('../config/wx'),
	wx = require('../lib/')(wxConfig);

async.waterfall([
	function(callback){
		wx.login(callback);
	},
	function(callback){
		wx.getGroupList(callback);
	},
	function(groupList, callback){
		wx.getAllUserList(function(err, userList){
			callback(err, groupList, userList);
		});
	}
], function(err, groupList, userList){
	if (err) throw err;
	console.log(groupList);
	console.log(userList);
	console.log('Users Count:', userList.length);
});