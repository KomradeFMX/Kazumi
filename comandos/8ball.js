const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const arrayRespuestas = require("../src/json/8ball.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.addStringOption(option =>
			option.setName('pregunta').setDescription('Escribe lo que quieres preguntarme').setRequired(true))
		.setDescription('Deja que el destino (yo) te de una respuesta a tu pregunta'),

	async execute(interaction) {
        //La frase que ha dado el usuario
        const frase = interaction.options.getString('pregunta');

        //Función para escoger un número entre dos valores (min y max)
        function valorAleatorio(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        };

        //La variable con todas las respuestas disponibles en el array
        const respuestas = arrayRespuestas.respuestas;

        //El embed final con la respuesta
        const embedRespuesta = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle('¡El destino ha elegido!')
            .addFields(
                { name: 'Frase:', value: `${frase}`, inline: true },
                { name: 'Respuesta:', value: `${respuestas[valorAleatorio(0, respuestas.length)]}`, inline: true }
            )
            .setFooter({ text: `${interaction.guild.name} - Azar`, iconURL: `${interaction.guild.iconURL()}` })

            //Responder a la interacción
            await interaction.reply({embeds: [embedRespuesta]});
	},
};