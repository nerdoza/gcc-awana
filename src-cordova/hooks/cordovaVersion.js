const { version } = require('../package.json')
const cordovaSetVersion = require('cordova-set-version')
cordovaSetVersion('./config.xml', version)