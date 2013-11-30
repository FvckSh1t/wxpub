var path = require('path'),
	config = module.exports = {};

var rootDir = config.rootDir = path.resolve(__dirname, '..');
config.dataDir = path.join(rootDir, 'data');