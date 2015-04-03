/**
 * Modified work from authors:
 * @author mrdoob / http://mrdoob.com/
 * @author Jesús Leganés Combarro "Piranna" <piranna@gmail.com>
 */


/**
 * Expose the EventTarget class.
 */
module.exports = EventTarget;


function EventTarget() {
	var listeners = {};

	this.addEventListener = function (type, listener) {
		if (listeners[type] === undefined) {
			listeners[type] = [];
		}

		if (listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	};

	this.dispatchEvent = function (event) {
		var self = this;

		setImmediate(function () {
			var listenerArray = listeners[event.type] || [],
				dummyListener = self['on' + event.type],
				i, len;

			if (typeof dummyListener === 'function') {
				listenerArray.push(dummyListener);
			}

			for (i = 0, len = listenerArray.length; i < len; i++) {
				listenerArray[i].call(self, event);
			}
		});
	};

	this.removeEventListener = function (type, listener) {
		var index = listeners[type].indexOf(listener);

		if (index !== -1) {
			listeners[type].splice(index, 1);
		}
	};
}
