const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Miembro del que quieres ver el avatar'))
		.setDescription('Descarga la foto de perfil de un miembro'),

	async execute(interaction) {

		const user = interaction.options.getUser('miembro') || interaction.user;
		const miembro = await interaction.guild.members.fetch(user.id)

		const avatarEmbed = new EmbedBuilder()
			.setColor(miembro.displayHexColor)
			.setTitle(`¡Este es el avatar de ${miembro.user.username}!`)
            .setDescription(`[PNG](${miembro.displayAvatarURL({ extension: "png", size: 1024 })}) | [JPG](${miembro.displayAvatarURL({ extension: "jpg", size: 1024 })}) | [GIF](${miembro.displayAvatarURL({ extension: "gif", size: 1024 })}) | [PFP](${miembro.user.avatarURL({ extension: "png", size: 1024 })})`)
			.setImage(miembro.displayAvatarURL({ extension: "png", size: 1024 }))
			.setFooter({ text: `${interaction.guild.name} - Miembros`, iconURL: `${interaction.guild.iconURL()}` })

		await interaction.reply({ embeds: [avatarEmbed] });
	},
};