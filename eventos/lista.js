const { Events } = require('discord.js');
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');

//Configurar el .env
dotenv.config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        const commands = [];
        // Leer todos los comandos
        const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
	        const command = require(`../comandos/${file}`);
	        commands.push(command.data.toJSON());
        }

        // Instancia  del modulo REST
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        // D E P L O Y
        (async () => {
	    try {
		    console.log(`Se están refrescando ${commands.length} (/) comandos espera...`);

		    // Refrescar comandos
		    const data = await rest.put(
                Routes.applicationCommands(process.env.clientId),
                { body: commands },
            );

		    console.log(`He refrescado con éxito ${data.length} (/) comandos c:`);
	        } catch (error) {
		        // errores
		        console.error(error);
	        }
        })();

		console.log(`¡${client.user.tag} está lista!`);
        client.user.setStatus("online");
	},
};
