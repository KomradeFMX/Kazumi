const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No he encontrado un comando que coincida con [ ${interaction.commandName} ]`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Tuve un error ejecutando este comando: ${interaction.commandName}`);
			console.error(error);
		}
	},
};
