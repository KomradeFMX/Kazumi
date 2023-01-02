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
        // Grab all the command files from the commands directory you created earlier
        const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
	        const command = require(`../comandos/${file}`);
	        commands.push(command.data.toJSON());
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        // and deploy your commands!
        (async () => {
	    try {
		    console.log(`Se están refrescando ${commands.length} (/) comandos espera...`);

		    // The put method is used to fully refresh all commands in the guild with the current set
		    const data = await rest.put(
                Routes.applicationCommands(process.env.clientId),
                { body: commands },
            );

		    console.log(`He refrescado con éxito ${data.length} (/) comandos c:`);
	        } catch (error) {
		        // And of course, make sure you catch and log any errors!
		        console.error(error);
	        }
        })();

		console.log(`¡${client.user.tag} está lista!`);
        client.user.setStatus("online");
	},
};
