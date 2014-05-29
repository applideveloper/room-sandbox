if (typeof(room) === "undefined") room = {};
if (typeof(room.logger) === "undefined") room.logger = {};

$(function() {
	function normalizeFunc(obj) {
		var type;
		if ($.isArray(obj)) {
			var newArray = [];
			for (var i=0; i<obj.length; i++) {
				type = typeof(obj[i]);
				if (type === "function") {
					newArray.push("(function)");
				} else if (type === "object") {
					newArray.push(normalizeFunc(obj[i]));
				} else {
					newArray.push(obj[i]);
				}
			}
			return newArray;
		} else {
			var newObj = {};
			for (var key in obj) {
				type = typeof(key);
				if (type === "function") {
					newObj[key] = "(function)";
				} else if (type === "object") {
					newObj[key] = normalizeFunc(obj[key]);
				} else {
					newObj[key] = obj[key];
				}
			}
			return newObj;
		}
	}
	room.logger.WsLogger = function(wsUrl, commandName) {
		var ws = new room.Connection(wsUrl);
		commandName = commandName || "log";
		this.log = function() {
			ws.request({
				"command": commandName,
				"data": normalizeFunc(arguments)
			});
		};
	};
	room.logger.nullLogger = {
		"log" : function() {}
	};
});