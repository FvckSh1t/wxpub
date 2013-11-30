var crypto = require('crypto'),
	fs = require('fs'),
	_ = require('underscore'),
	async = require('async'),
	request = require('request'),
	beautify = require('js-beautify');

module.exports = function(wx){
	var wxConfig = wx.config,
		wxHost = wxConfig.host,
		wxUserListUri = wxConfig.userListUri;

	wx.getGroupList = function(callback){
		var token = wx.getToken(),
			cookieJar = wx.getCookieJar();
		request({
			url: wxHost + wxUserListUri,
			qs: {
				token: token,
				pageidx: 0,
				pagesize: 0,
				type: 0
			},
			jar: cookieJar
		}, function(err, res, body) {
			var groupList;
			try {
				groupList = JSON.parse(
					body.match(/groupsList : \((\{.+\})\)/)[1]
				).groups;
			} catch (err) {
				return callback(
					new Error('Error getting groupList')
				);
			}
			callback(null, groupList);
		});
	}

	// groupid - 0: 未分组, 1: 黑名单, 2: 星标组
	wx.getUserListByGroup = function(groupId, callback){
		var listSize = 999,	// as many as possible
			token = wx.getToken(),
			cookieJar = wx.getCookieJar();
		request({
			url: wxHost + wxUserListUri,
			qs: {
				token: token,
				pageidx: 0,
				type: 0,
				pagesize: listSize,
				groupid: groupId
			},
			jar: cookieJar
		}, function(err, res, body) {
			var userList;
			try {
				userList = JSON.parse(
					body.match(/friendsList : \((\{.+\})\)/)[1]
				).contacts;
			} catch (err) {
				return callback(
					new Error('Error getting userList')
				);
			}
			callback(null, userList);
		});
	}

	wx.getAllUserList = function(callback){
		wx.getGroupList(function(err, groupList){
			// get id list of not-empty groups
			var groupIds = _(groupList).chain()
					.filter(function(group){
						return group.cnt > 0;
					}).pluck('id').value();
			async.mapSeries(
				groupIds,
				wx.getUserListByGroup,
				function(err, lists){
					if (err) return callback(err);
					var userList = _.flatten(lists);
					callback(null, userList);
				}
			);
		});
	}

	return wx;
}