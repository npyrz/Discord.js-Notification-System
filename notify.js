const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("you do not have permission to use this command!");
    let role = message.guild.roles.cache.find(role => role.name === "DM-Notifications");
    role.members.forEach((x) => x.send(args.slice(0).join((" "))))
    message.delete()
 }
module.exports.help = {
name: 'notify'
}