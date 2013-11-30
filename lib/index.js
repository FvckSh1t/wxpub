module.exports = function(wxConfig){
	var wx = module.exports = {
			config: wxConfig
		}

	// load all parts
	var parts = [
			'login-form', 'login', 'msg', 'users'
		];
	parts.forEach(function(part){
		require('./' + part)(wx);
	});

	return wx;
}