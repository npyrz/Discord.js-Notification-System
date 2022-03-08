const { SlashCommandBuilder } = require('@discordjs/builders');
const { rolePerm, roleDM } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notfiy')
        .setDescription('Notify users who have the role by direct message from the bot!')
        .addStringOption(option => option.setName('message').setDescription('The message you want sent to the users who have the role!')),
                async execute(interaction) {
                    if(interaction.member.roles.cache.has(rolePerm)) {
                    const string = await interaction.options.getString('message');
                    let role = interaction.guild.roles.cache.find(role => role.id === roleDM);
                    role.members.forEach((x) => x.send(string))
        }
    },
};