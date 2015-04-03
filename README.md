# rtcninja-fake

Fake Node WebRTC plugin for [rtcninja](https://github.com/eface2face/rtcninja.js).

This module implements the WebRTC API for usage within Node/io.js. This is a fake module: nor media streams nor `DataChannel` are implemented, but just a fake `RTCPeerConnection`  class that generated a spoofed local SDP description with no media sections.

**rtcninja-fake** is just useful for testing WebRTC related libraries when no media is required.


## Installation

* With **npm**:

```bash
$ npm install --save rtcninja-fake
```


## Usage

```javascript
var rtcninja = require('rtcninja');
var rtcninjaFake = require('rtcninja-fake');

// Load rtcninja with the rtcninja-fake plugin.
rtcninja({plugin: rtcninjaFake});

console.log(rtcninja.hasWebRTC());
// => true
```


## Author

Iñaki Baz Castillo at [eFace2Face](http://eface2face.com).


## License

ISC.
