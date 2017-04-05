"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	irc.on("banlist", function(banlist) {
		var channel = banlist.channel;
		var bans = banlist.bans;
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

		var chan = network.getChannel(`Banlist for ${channel}`);
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.SPECIAL,
				name: `Banlist for ${channel}`
			});
			network.channels.push(chan);
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}

		bans.forEach((data) => {
			client.emit("msg", {
				chan: chan.id,
				msg: new Msg({
					time: Date.now(),
					type: Msg.Type.BANLIST,
					text: data.banned
				})
			});
		});
	});
};
