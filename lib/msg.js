var crypto = require('crypto'),
	fs = require('fs'),
	_ = require('underscore'),
	async = require('async'),
	request = require('request'),
	beautify = require('js-beautify');

module.exports = function(wx){
	var wxConfig = wx.config,
		wxHost = wxConfig.host,
		wxMsgListUri = wxConfig.msgListUri;

	wx.getMsgList = function(callback){
		var listSize = 999,	// as many as possible
			token = wx.getToken(),
			cookieJar = wx.getCookieJar();
		request({
			url: wxHost + wxMsgListUri,
			qs: {
				token: token,
				count: listSize,
				day: 7
			},
			jar: cookieJar
		}, function(err, res, body) {
			var msgList;
			try {
				msgList = JSON.parse(
					body.match(/list : \((\{.+\})\)/)[1]
				).msg_item;
			} catch (err) {
				callback(new Error('Error getting msgList'));
			}
			callback(null, msgList);
		});
	}

	wx.getStarMsgList = function(callback){
		var listSize = 999,	// as many as possible
			token = wx.getToken(),
			cookieJar = wx.getCookieJar();
		request({
			url: wxHost + wxMsgListUri,
			qs: {
				token: token,
				count: listSize,
				action: 'star'
			},
			jar: cookieJar
		}, function(err, res, body) {
			var starMsgList;
			try {
				starMsgList = JSON.parse(
					body.match(/list : \((\{.+\})\)/)[1]
				).msg_item;
			} catch (err) {
				callback(new Error('Error getting starMsgList'));
			}
			callback(null, starMsgList);
		});
	}

	return wx;
}