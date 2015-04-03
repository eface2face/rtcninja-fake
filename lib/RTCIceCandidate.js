/**
 * Expose the RTCIceCandidate class.
 */
module.exports = RTCIceCandidate;


function RTCIceCandidate(data) {
	this.candidate = data.candidate;
	this.sdpMid = data.sdpMid;
	this.sdpMLineIndex = data.sdpMLineIndex;
}
