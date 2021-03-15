const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({
  disableEveryone: true
});
const CurrentTimers = new Map();
const client = new Discord.Client();

var stickyMessage = null;

bot.on('message', message => {
  var messageContent = message.content;
  if (message.member != null) {
     if (message.member.hasPermission("ADMINISTRATOR")) {
        if (messageContent.split(" ")[0].charAt(0) === '!') {
           var command = messageContent.split(" ");
           switch (command[0].toLowerCase()) {
              case "!sticky":
                 var message = "__**⚠️ Stickied Message ⚠️:**__ ";
                 for (var i = 1; i < command.length; i++) {
                    message += command[i] + " ";
                 }
                 message.channel.send(message).then(message => {
                    stickyMessage = message;
                 });
                 message.delete();
                 break;
              case "!unsticky":
                 message.delete();
                 stickyMessage.delete();
                 stickyMessage = null;
                 break;
              default:
           }
        }
     }
  }
  if (stickyMessage != null && message.content !== stickyMessage.content && message.channel === stickyMessage.channel) {
     message.channel.send(stickyMessage.content)
        .then(message => {
           stickyMessage.delete();
           stickyMessage = message;
        });
  }

});

bot.login();
