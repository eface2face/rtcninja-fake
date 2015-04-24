/**
 * Expose the RTCPeerConnection class.
 */
module.exports = RTCPeerConnection;


/**
 * Dependencies.
 */
var
	debug = require('debug')('rtcninja:FakePlugin:RTCPeerConnection'),
	debugerror = require('debug')('rtcninja:ERROR:FakePlugin:RTCPeerConnection'),
	EventTarget = require('./EventTarget'),
	RTCSessionDescription = require('./RTCSessionDescription'),
	InvalidStateError = require('./errors').InvalidStateError,
	InvalidSessionDescriptionError = require('./errors').InvalidSessionDescriptionError,
	InternalError = require('./errors').InternalError,

/**
 * Status.
 */
	RTCSignalingState = {
		'stable':               'stable',
		'have-local-offer':     'have-local-offer',
		'have-remote-offer':    'have-remote-offer',
		'have-local-pranswer':  'have-local-pranswer',
		'have-remote-pranswer': 'have-remote-pranswer',
		'closed':               'closed'
	},
	RTCIceGatheringState = {
		'new':       'new',
		'gathering': 'gathering',
		'complete':  'complete'
	},
	RTCIceConnectionState = {
		'new':          'new',
		'checking':     'checking',
		'connected':    'connected',
		'completed':    'completed',
		'failed':       'failed',
		'disconnected': 'disconnected',
		'closed':       'closed'
	};


function RTCPeerConnection(config) {
	debug('new()');

	this.config = config;
	this.localDescription = null;
	this.remoteDescription = null;

	// Status.
	this.signalingState = undefined;
	this.iceGatheringState = undefined;
	this.iceConnectionState = undefined;

	// Make this an EventTarget.
	EventTarget.call(this);

	// Set initial status.
	setSignalingState.call(this, RTCSignalingState.stable);
	setIceGatheringState.call(this, RTCIceGatheringState.new);
	setIceConnectionState.call(this, RTCIceConnectionState.new);

	// Run the ICE gatherer.
	runIceGatherer.call(this);
}


/**
 * Public API.
 */


RTCPeerConnection.prototype.createOffer = function (successCallback, failureCallback, options) {  // jshint ignore:line
	debug('createOffer()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "createOffer()", the RTCPeerConnection signalingState is "closed"');
	}

	var self = this;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		var description = new RTCSessionDescription({type: 'offer'});

		if (successCallback) {
			successCallback(description);
		}
	});
};


RTCPeerConnection.prototype.createAnswer = function (successCallback, failureCallback, options) {  // jshint ignore:line
	debug('createAnswer()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "createAnswer()", the RTCPeerConnection signalingState is "closed"');
	}

	var self = this;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		var description = new RTCSessionDescription({type: 'answer'});

		if (successCallback) {
			successCallback(description);
		}
	});
};


RTCPeerConnection.prototype.setLocalDescription = function (description, successCallback, failureCallback) {  // jshint ignore:line
	debug('setLocalDescription()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "setLocalDescription()", the RTCPeerConnection signalingState is "closed"');
	}

	var self = this;

	this.localDescription = description;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		switch (self.signalingState) {
			case RTCSignalingState['stable']:
				if (description.type === 'offer') {
					setSignalingState.call(self, RTCSignalingState['have-local-offer']);
					if (successCallback) {
						successCallback();
					}
				} else {
					debugerror('setLocalDescription() | invalid session description of type "%s" while in "stable" signaling state', description.type);
					if (failureCallback) {
						failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "stable" signaling state'));
					}
				}
				break;

			case RTCSignalingState['have-remote-offer']:
			case RTCSignalingState['have-local-pranswer']:
				if (description.type === 'answer') {
					setSignalingState.call(self, RTCSignalingState['stable']);
					if (successCallback) {
						successCallback();
					}
				} else if (description.type === 'pranswer') {
					setSignalingState.call(self, RTCSignalingState['have-local-pranswer']);
					if (successCallback) {
						successCallback();
					}
				} else {
					debugerror('setLocalDescription() | invalid session description of type "%s" while in "%s" signaling state', description.type, self.signalingState);
					if (failureCallback) {
						failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "' + self.signalingState + '" signaling state'));
					}
				}
				break;

			case RTCSignalingState['have-local-offer']:
			case RTCSignalingState['have-remote-pranswer']:
				debugerror('setLocalDescription() | invalid session description of type "%s" while in "%s" signaling state', description.type, self.signalingState);
				if (failureCallback) {
					failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "' + self.signalingState + '" signaling state'));
				}
				break;

			default:
				throw new InternalError('setLocalDescription() | unknown signaling state "' + self.signalingState + '"');
		}
	});
};


RTCPeerConnection.prototype.setRemoteDescription = function (description, successCallback, failureCallback) {  // jshint ignore:line
	debug('setRemoteDescription()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "setRemoteDescription()", the RTCPeerConnection signalingState is "closed"');
	}

	var self = this;

	this.remoteDescription = description;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		switch (self.signalingState) {
			case RTCSignalingState['stable']:
				if (description.type === 'offer') {
					setSignalingState.call(self, RTCSignalingState['have-remote-offer']);
					if (successCallback) {
						successCallback();
					}
				} else {
					debugerror('setRemoteDescription() | invalid session description of type "%s" while in "stable" signaling state', description.type);
					if (failureCallback) {
						failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "stable" signaling state'));
					}
				}
				break;

			case RTCSignalingState['have-local-offer']:
			case RTCSignalingState['have-remote-pranswer']:
				if (description.type === 'answer') {
					setSignalingState.call(self, RTCSignalingState['stable']);
					if (successCallback) {
						successCallback();
					}
				} else if (description.type === 'pranswer') {
					setSignalingState.call(self, RTCSignalingState['have-remote-pranswer']);
					if (successCallback) {
						successCallback();
					}
				} else {
					debugerror('setRemoteDescription() | invalid session description of type "%s" while in "%s" signaling state', description.type, self.signalingState);
					if (failureCallback) {
						failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "' + self.signalingState + '" signaling state'));
					}
				}
				break;

			case RTCSignalingState['have-remote-offer']:
			case RTCSignalingState['have-local-pranswer']:
				debugerror('setRemoteDescription() | invalid session description of type "%s" while in "%s" signaling state', description.type, self.signalingState);
				if (failureCallback) {
					failureCallback(new InvalidSessionDescriptionError('invalid session description of type "' + description.type + '" while in "' + self.signalingState + '" signaling state'));
				}
				break;

			default:
				throw new InternalError('setRemoteDescription() | unknown signaling state "' + self.signalingState + '"');
		}
	});
};


RTCPeerConnection.prototype.addIceCandidate = function (candidate, successCallback, failureCallback) {  // jshint ignore:line
	debug('addIceCandidate()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "addIceCandidate()", the RTCPeerConnection signalingState is "closed"');
	}

	var self = this;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		if (successCallback) {
			successCallback();
		}
	});
};


RTCPeerConnection.prototype.getLocalStreams = function () {
	debug('getLocalStreams()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "getLocalStreams()", the RTCPeerConnection signalingState is "closed"');
	}

	return [];
};


RTCPeerConnection.prototype.getRemoteStreams = function () {
	debug('getRemoteStreams()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "getRemoteStreams()", the RTCPeerConnection signalingState is "closed"');
	}

	return [];
};


RTCPeerConnection.getStreamById = function (streamId) {  // jshint ignore:line
	debug('getStreamById()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "getStreamById()", the RTCPeerConnection signalingState is "closed"');
	}

	return null;
};


RTCPeerConnection.prototype.addStream = function (stream) {  // jshint ignore:line
	debug('addStream()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "addStream()", the RTCPeerConnection signalingState is "closed"');
	}

	throw new InternalError('addStream() not implemented');
};


RTCPeerConnection.prototype.removeStream = function (stream) {  // jshint ignore:line
	debug('removeStream()');

	if (this.signalingState === RTCSignalingState.closed) {
		throw new InvalidStateError('Failed to execute "removeStream()", the RTCPeerConnection signalingState is "closed"');
	}

	throw new InternalError('removeStream() not implemented');
};


RTCPeerConnection.prototype.close = function () {
	debug('close()');

	if (this.signalingState === RTCSignalingState.closed) {
		return;
	}

	setIceConnectionState.call(this, RTCIceConnectionState.closed);
	setSignalingState.call(this, RTCSignalingState.closed);
};


/**
 * Private API.
 */


function setSignalingState(state) {
	if (this.signalingState === RTCSignalingState.closed) {
		return;
	}

	if (!RTCSignalingState[state]) {
		throw new InternalError('wrong RTCSignalingState "' + state + '"');
	}

	if (this.signalingState === state) {
		return;
	}

	this.signalingState = state;
	this.dispatchEvent({type: 'signalingstatechange'});

	if (this.localDescription && this.remoteDescription) {
		runIceConnector.call(this);
	}
}


function setIceGatheringState(state) {
	if (this.signalingState === RTCSignalingState.closed) {
		return;
	}

	if (!RTCIceGatheringState[state]) {
		throw new InternalError('wrong RTCIceGatheringState "' + state + '"');
	}

	if (this.iceGatheringState === state) {
		return;
	}

	this.iceGatheringState = state;
	this.dispatchEvent({type: 'icegatheringstatechange'});
}


function setIceConnectionState(state) {
	if (this.signalingState === RTCSignalingState.closed) {
		return;
	}

	if (!RTCIceConnectionState[state]) {
		throw new InternalError('wrong RTCIceConnectionState "' + state + '"');
	}

	if (this.iceConnectionState === state) {
		return;
	}

	this.iceConnectionState = state;
	this.dispatchEvent({type: 'iceconnectionstatechange'});
}


function runIceGatherer() {
	var self = this;

	setImmediate(function () {
		if (this.signalingState === RTCSignalingState.closed) {
			return;
		}

		setIceGatheringState.call(self, RTCIceGatheringState.gathering);

		setImmediate(function () {
			if (self.signalingState === RTCSignalingState.closed) {
				return;
			}

			setIceGatheringState.call(self, RTCIceGatheringState.complete);

			// Emit null ICE candidate.
			self.dispatchEvent({
				type: 'icecandidate',
				candidate: null
			});
		});
	});
}


function runIceConnector() {
	var self = this;

	setImmediate(function () {
		if (self.signalingState === RTCSignalingState.closed) {
			return;
		}

		setIceConnectionState.call(self, RTCIceConnectionState.checking);

		setImmediate(function () {
			if (self.signalingState === RTCSignalingState.closed) {
				return;
			}

			setIceConnectionState.call(self, RTCIceConnectionState.connected);

			setImmediate(function () {
				if (self.signalingState === RTCSignalingState.closed) {
					return;
				}

				setIceConnectionState.call(self, RTCIceConnectionState.completed);
			});
		});
	});
}
