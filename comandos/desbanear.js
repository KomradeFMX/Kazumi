const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('desbanear')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Miembro al que quieres retirar la sanción').setRequired(true))
        .addStringOption(option =>
            option.setName('razón').setDescription('Razón por la que vas a quitar la sanción a este usuario'))
		.setDescription('Devuelve el acceso de un usuario a este servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {

		const usuario = interaction.options.getUser('miembro');
        const idUsuario = usuario.id;

        //No permitir el comando si el autor no tiene permisos
        if (idUsuario == interaction.member.id) {
            return interaction.reply({content: "Pero si no estás baneado, bob@", ephemeral: true});
        }

        //Está baneado el usuario???
        try {
            //Quitar el ban al usuario
            await interaction.guild.bans.remove(idUsuario);
            //Feedback en el servidor
            const unbanEmbed = new EmbedBuilder()
            .setColor('#4dcc3f')
            .setTitle(`Se ha desbaneado a ${usuario.username}`)
            .setDescription(`El usuario ${usuario.username} ha sido desbaneado por la siguiente razón:\n${interaction.options.getString('razón')}`)
            .setThumbnail(`${usuario.avatarURL()}`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });
        
            await interaction.reply({embeds: [unbanEmbed]});
        } 
        catch(err) {
            interaction.reply({content: 'Este usuario no está baneado... aún.', ephemeral: true});
        }

	},
};
