const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usuario')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Miembro del que quieres ver la información'))
		.setDescription('Mira información sobre tí u otro usuario'),

	async execute(interaction) {

		const user = interaction.options.getUser('miembro') || interaction.user;
		const miembro = await interaction.guild.members.fetch(user.id)

		if(miembro.user.bot){
			await interaction.reply({content: 'No puedes ver la información sobre un bot', ephemeral: true})
			return;
		}

		//Cosos del apodo
		if(miembro.displayName == miembro.user.username){
			apodo = 'No establecido'
		} else {
			apodo = miembro.displayName
		}


		const exampleEmbed = new EmbedBuilder()
			.setColor(miembro.displayHexColor)
			.setTitle(`Información sobre ${miembro.user.username}`)
			.setThumbnail(`${miembro.displayAvatarURL()}`)
			.addFields(
				{ name: 'Apodo:', value: `${apodo}`, inline: true },
				{ name: 'Rol superior:', value: `${miembro.roles.highest}`, inline: true },
				{ name: 'Nivel:', value: '5', inline: true },
				{ name: 'Fecha de unión:', value: `${moment.utc(miembro.joinedAt).format('DD/MM/YY')}`, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Estado:', value: `[${miembro.presence.status}] ${miembro.presence.activities[0].state}`},
				{ name: 'ID:', value: `${miembro.id}`, inline: true },
				{ name: 'Fecha de creación:', value: `${moment.utc(miembro.createdAt).format('DD/MM/YY')}`, inline: true },
			)
			.setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

		await interaction.reply({embeds: [exampleEmbed]})
	},
};
