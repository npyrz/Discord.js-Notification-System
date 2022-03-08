const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
  require("dotenv").config();
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
client.commands = new Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);}
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) { client.once(event.name, (...args) => event.execute(...args));
    } else {client.on(event.name, (...args) => event.execute(...args));}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return; try { await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

  const maxMessageCount = parseInt(process.env.MAX_MESSAGE_COUNT);
  let lastStickyMessage = "";
  let messageCount = 0;
  let stickyMessageChannel = "";
  let stickyMessageContent = "";
  
  
  client.on("messageCreate", async function (message) {
	if (message.author.bot) {
	  return;
	}
  
	if (message.content.indexOf(process.env.PREFIX) !== 0) {
	  if (stickyMessageContent !== "") {
		if (message.channel.id === stickyMessageChannel) {
		  messageCount++;
		  if (messageCount === maxMessageCount) {
			await lastStickyMessage.delete();
			lastStickyMessage = await message.channel.send(stickyMessageContent);
			messageCount = 0;
		  }
		}
	  }
  
	  return;
	}
  
	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
  
	if (command === "sticky") {
	  if (
		message.author.id === process.env.OWNER
		|| message.member.roles.cache.has(process.env.ALLOWED_ROLES_ID)
	  ) {
		try {
		  stickyMessageChannel = message.channel.id;
		  stickyMessageContent = args.slice(0).join(" ");
		  lastStickyMessage = await message.channel.send(stickyMessageContent);
		  await message.delete();
		} catch (error) {
		  console.error(error);
		}
	  }
	} else if (command === "unsticky") {
	  if (
		message.author.id === process.env.OWNER
		|| message.member.roles.cache.has(process.env.ALLOWED_ROLES_ID)
	  ) {
		lastStickyMessage = "";
		messageCount = 0;
		stickyMessageChannel = "";
		stickyMessageContent = "";
		message.delete();
	  }
	}
  });
client.login(token);