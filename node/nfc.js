var request = require('request');

var urlJeedom = '';
var name = '';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// print process.argv
process.argv.forEach(function(val, index, array) {
	switch ( index ) {
		case 2 : urlJeedom = val; break;
		case 3 : name = val; break;
	}
});

var nfc  = require('nfc').nfc
  , util = require('util')
  , devices = nfc.scan()
  ;

var nfcdev = new nfc.NFC();
nfcdev.on('read', function(tag) {
	console.log((new Date()) + " : Tag " + tag.uid);
  url = urlJeedom + "&type=nfc&name=" + name + "&uid=" + tag.uid;
	request({
		url: url,
		method: 'PUT'
	},

	function (error, response, body) {
			if (!error && response.statusCode == 200) {
			//console.log( response.statusCode);
			}else{
				console.log( error );
			}
		});
}).start();

nfcdev.on('error', function(err) {
  console.log(err);
});

nfcdev.on('stopped', function() {
  console.log('stopped');
});
