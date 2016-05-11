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

url = urlJeedom + "&type=nfc&name=" + name;

var nfc = require('nfc').nfc;
var n = new nfc().NFC;

var currentTag;
var removeDelay = 100;
var removeTimer;

function handleDetect(uid) {
	var a = Array.prototype.slice.call(uid).map(function(b) {
		var s = b.toString(16);
		if (s.length < 2) {
			s = '0'+s;
		}
		return s;
	}).join('-').toUpperCase();
	clearTimeout(removeTimer);
	if (a !== currentTag) {
		currentTag = a;
		console.log('Detect : ' + currentTag);
		request({
			url: url,
			method: 'PUT',
			json: {"uid": currentTag,
			"event": "detect",
			},
		},

		function (error, response, body) {
				if (!error && response.statusCode == 200) {
				//console.log( response.statusCode);
				}else{
					console.log( error );
				}
			});
	}
	removeTimer = setTimeout(handleRemove,removeDelay);
}

function handleRemove() {
	console.log('Remove : ' + currentTag);
	request({
		url: url,
		method: 'PUT',
		json: {"uid": currentTag,
		"event": "remove",
		},
	},

	function (error, response, body) {
			if (!error && response.statusCode == 200) {
			//console.log( response.statusCode);
			}else{
				console.log( error );
			}
		});

	currentTag = undefined;
}

function handleEvent(e) {
	//push to pusher
	pusher.trigger('camarillo', 'scan-uid', e);
	console.log(JSON.stringify(e));
}

n.on('uid', function(uid) {
	handleDetect(uid);
});

n.start();
