const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
//Base de datos del Roleo
const arrayRoleo = require("../src/json/roleo.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('abrazar')
        .setDescription('Abraza a alguien y haz que se sienta querido :D')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Miembro al que quieres abrazar').setRequired(true)),


	async execute(interaction) {

        //Función para escoger un número entre dos valores (min y max)
        function valorAleatorio(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        };

        //Obtener al miembro que se quiere abrazar
		const user = interaction.options.getUser('miembro');
		const miembro = await interaction.guild.members.fetch(user.id);

        if (miembro == interaction.member) return interaction.reply({ content: 'Es muy triste abrazarte a tí mism@ :c', ephemeral: true });

        //Obtener la lista del array en el JSON
        let gifsAbrazo = arrayRoleo[0].fotos.abrazos;

        //El embed con el gif correspondiente
        const abrazoEmbed = new EmbedBuilder()
        .setColor(interaction.guild.members.me.displayHexColor)
        .setImage(gifsAbrazo[valorAleatorio(0, gifsAbrazo.length)])
        .setFooter({ text: `${interaction.guild.name} - Roleo`, iconURL: `${interaction.guild.iconURL()}` });
    
        await interaction.reply({ content:`**${interaction.member.displayName}** ha dado un abrazo a ${miembro} iwi`, embeds: [abrazoEmbed] });
	},
};