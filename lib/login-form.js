var fs = require('fs'),
	_ = require('underscore'),
	beautify = require('js-beautify');

module.exports = function(wx){
	var wxConfig = wx.config,
		formFile = wxConfig.loginFormFile,
		defaultForm = {
			username: '', password: '', imgcode: ''
		},
		form;	// local copy

	wx.getLoginForm = function(){
		if (form) return form;
		try {
			return JSON.parse(
				fs.readFileSync(formFile)
			);
		} catch(err) {
			throw new Error('Invalid login-form data');
		}
	}

	wx.setLoginForm = function(_form, callback){
		form = _.defaults(	// pick and default keys
			_.pick(_form, _.keys(defaultForm)), defaultForm
		);
		var data = beautify.js(JSON.stringify(_form));
		fs.writeFile(formFile, data, function(err){	// save
			if (err) {
				return callback(
					new Error('Error writing login-form file')
				);
			}
			callback && callback(null);
		});
	}

	wx.updateLoginForm = function(part, callback){
		var old = wx.getLoginForm();
		return wx.setLoginForm(
			_.extend(old, part), callback
		);
	}

	return wx;
}