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
  , version = nfc.version()
  , devices = nfc.scan()
  ;

console.log('version: ' + util.inspect(version, { depth: null }));
console.log('devices: ' + util.inspect(devices, { depth: null }));

function read(deviceID) {
  console.log('');
  var nfcdev = new nfc.NFC();

  nfcdev.on('read', function(tag) {
    console.log(util.inspect(tag, { depth: null }));
    if ((!!tag.data) && (!!tag.offset)) console.log(util.inspect(nfc.parse(tag.data.slice(tag.offset)), { depth: null }));
    nfcdev.stop();
  });

  nfcdev.on('error', function(err) {
    console.log(util.inspect(err, { depth: null }));
  });

  nfcdev.on('stopped', function() {
    console.log('stopped');
  });

  console.log(nfcdev.start(deviceID));
}

for (var deviceID in devices) read(deviceID);

/*
      url = urlJeedom + "&type=btsniffer&name=" + name + "&id=" + peripheral.address;

  		request({
  			url: url,
  			method: 'PUT',
  			json: {"device": peripheral.advertisement.localName,
        "rssi": "off",
        "address": peripheral.address,
        },
  		},

  		function (error, response, body) {
  			  if (!error && response.statusCode == 200) {
  				//console.log( response.statusCode);
  			  }else{
  			  	console.log( error );
  			  }
  			});
*/
