const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banear')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Miembro al que quieres sancionar').setRequired(true))
        .addStringOption(option =>
            option.setName('razón').setDescription('Razón por la que vas a banear a este usuario'))
		.setDescription('Bloquea el acceso de un usuario a este servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {

        try{
            var user = interaction.options.getUser('miembro');
            var miembro = await interaction.guild.members.fetch(user.id);
        }
        catch (err) {
            await interaction.reply({content: 'No parece que este usuario esté en el servidor...', ephemeral: true});
        }

        //No permitir el comando si el autor no tiene permisos
        if (miembro.id == interaction.member.id) {
            return interaction.reply({content: "No te voy a banear a tí mismo >:c", ephemeral: true});
        }
        else if (interaction.member.roles.highest.position < miembro.roles.highest.position) {
            return interaction.reply({content: "No puedes banear a alguien con un rol superior al tuyo >:o", ephemeral: true});
        }
        else if (!miembro.bannable) {
            return interaction.reply({content: "No puedo banear a ese usuario :c", ephemeral: true});
        }
      
        //Feedback en el servidor
            const banEmbed = new EmbedBuilder()
                .setColor('#e01616')
                .setTitle(`Se ha baneado a ${user.username}`)
                .setDescription(`El usuario ${user.username} ha sido baneado por la siguiente razón:\n${interaction.options.getString('razón')}`)
                .setThumbnail(`${user.avatarURL()}`)
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

            //Notificación al usuario
            const notificacionEmbed = new EmbedBuilder()
            .setColor('#e01616')
            .setTitle(`¡Has sido banead@ de ${interaction.guild.name}!`)
            .addFields(
                {name: 'Responsable:', value: `${interaction.member}`},
                {name: 'Razón:', value: `${interaction.options.getString('razón')}`},

            )
            .setThumbnail(`${interaction.guild.iconURL()}`)
            .setFooter({ text: `${interaction.guild.name} - Sanciones`, iconURL: `${interaction.guild.iconURL()}` });


            await interaction.reply({embeds: [banEmbed]});
            await user.send({embeds: [notificacionEmbed]});
            await miembro.ban({reason: `${interaction.options.getString('razón')}`});
	},
};
