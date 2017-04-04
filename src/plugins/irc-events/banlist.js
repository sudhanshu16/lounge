"use strict";

var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	irc.on("banlist", function({channel, bans}) {
		var lobby = network.channels[0];
		if (!bans) {
			var msg = new Msg({
				time: Date.now(),
				type: Msg.Type.ERROR,
				text: "Banlist empty"
			});
			lobby.pushMessage(client, msg, true);
			return;
		}

		lobby.pushMessage(client, new Msg({
			time: Date.now(),
			type: Msg.Type.MESSAGE,
			text: `Banlist for ${channel}`
		}), true);

		bans.forEach((data) => {
			lobby.pushMessage(client, new Msg({
				time: Date.now(),
				type: Msg.Type.MESSAGE,
				text: data.banned
			}), true);
		});
	});
};
