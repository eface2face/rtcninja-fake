/**
 * Expose an object with WebRTC Errors.
 */
var errors = module.exports = {},


/**
 * Local variables.
 */
	IntermediateInheritor = function () {};


IntermediateInheritor.prototype = Error.prototype;


/**
 * Add cusotm errors.
 */
addError('InvalidStateError');
addError('InvalidSessionDescriptionError');
addError('InternalError');


function addError(name) {
	errors[name] = function () {
		var tmp = Error.apply(this, arguments);

		this.name = tmp.name = name;
		this.message = tmp.message;

		Object.defineProperty(this, 'stack', {
			get: function () {
				return tmp.stack;
			}
		});

		return this;
	};

	errors[name].prototype = new IntermediateInheritor();
}

