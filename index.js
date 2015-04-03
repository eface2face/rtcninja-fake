/**
 * Expose the rtcninjaFake object.
 */
var
	FakePlugin = module.exports = {},


/**
 * Dependencies.
 */
	RTCPeerConnection = require('./lib/RTCPeerConnection'),
	RTCSessionDescription = require('./lib/RTCSessionDescription'),
	RTCIceCandidate = require('./lib/RTCIceCandidate');


/**
 * Required check for rtcninja.
 * Return true if no WebRTC is detected in the global namespace.
 */
FakePlugin.isRequired = function () {
	if (global.RTCPeerConnection || global.webkitRTCPeerConnection || global.mozRTCPeerConnection) {
		return false;
	} else {
		return true;
	}
};


/**
 * Required check for rtcninja.
 * Just return true as this is a fake plugin for Node.js.
 */
FakePlugin.isInstalled = function () {
	return true;
};


/**
 * Required interface for rtcninja.
 */
FakePlugin.interface = {
	RTCPeerConnection:      RTCPeerConnection,
	RTCSessionDescription:  RTCSessionDescription,
	RTCIceCandidate:        RTCIceCandidate,
	canRenegotiate:         true
};
