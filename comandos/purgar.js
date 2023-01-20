const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgar')
		.addIntegerOption(option =>
			option.setName('mensajes').setDescription('Cantidad de mensajes que quieres borrar').setRequired(true))
		.setDescription('Borra mensajes en masa')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) {

		const cantidadMensajes = interaction.options.getInteger('mensajes');

        if (cantidadMensajes > 100 || cantidadMensajes < 1) {
            return interaction.reply({content: '¡Tienes que elegir un número entre **1** y **100**!', ephemeral: true});
        }

        await interaction.channel.bulkDelete(cantidadMensajes).catch(err => {
            return interaction.reply({content: 'Ocurrió un error borrando los mensajes debido a limitaciones de discord :c', ephemeral: true});
        })

        await interaction.reply({content: `¡Se han borrado con éxito **${cantidadMensajes}** mensajes!`, ephemeral: true})
	},
};
