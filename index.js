const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// GUILDS = 서버

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// 봇 서버 실행되면 딱 한번 실행되는 함수
client.once('ready', () => {
	console.log('준비 완료!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token)