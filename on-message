const { Events, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Niveles = require('discord-xp')
require('dotenv').config();

module.exports = {
	name: Events.MessageCreate,
	async execute (message) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const xpAleatoria = Math.floor(Math.random() * 50) + 1
        console.log(xpAleatoria)
        const haSubidoDeNivel = await Niveles.appendXp(message.author.id, message.guild.id, xpAleatoria);

        //El canal al que se enviarán los mensajes al subir nivel
        var canalNiveles = message.client.channels.cache.find(channel => channel.id == process.env.canalNiveles)

        if (haSubidoDeNivel) {
                const usuario = await Niveles.fetch(message.author.id, message.guild.id);
                const subirNivelEmbed = new EmbedBuilder()
                        .setTitle('¡Has subido de nivel!')
                        .setDescription(`${message.member} ha subido al nivel **${usuario.level}**\n¡Sigue así! ^^`)
                        .setFooter({ text: `${message.guild.name} - Niveles`, iconURL: `${message.guild.iconURL()}` });

                canalNiveles.send({ content: `${message.author}`, embeds: [subirNivelEmbed]})
        } 
        
	},
};
