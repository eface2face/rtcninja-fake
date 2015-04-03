/**
 * Expose the RTCSessionDescription class.
 */
module.exports = RTCSessionDescription;


/**
 * Dependencies.
 */
var randomNumber = require('random-number').generator({
	min: 100000000,
	max: 999999999,
	integer: true
}),


/**
 * Local variables.
 */
	emptySDP = '' +
		'v=0\r\n' +
		'o=- ' + randomNumber() + ' 2 IN IP4 127.0.0.1\r\n' +
		's=-\r\n' +
		't=0 0\r\n' +
		'a=msid-semantic: WMS\r\n';


function RTCSessionDescription(data) {
	this.type = data.type;
	this.sdp = data.sdp;

	// If no sdp is given create one.
	if (!this.sdp) {
		this.sdp = emptySDP;
	}
}
