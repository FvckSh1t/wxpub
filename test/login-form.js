var readline = require('readline'),
	async = require('async'),
	wxConfig = require('../config/wx'),
	wx = require('../lib/')(wxConfig);

var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

async.waterfall([
	function(callback){	// input
		console.log('Login form:');
		rl.question('<username> ', function(username){
			rl.question('<password> ', function(password){
				rl.question('[imgcode] ', function(imgcode){
					callback(null, {
						username: username,
						password: password,
						imgcode: imgcode
					});
				});
			});
		});
	},
	function(form, callback){	// save
		wx.setLoginForm(form, callback);
	}
], function(err){	// exit
	rl.close();
	console.log('Login-form file saved');
	if (err) throw err;
});