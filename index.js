//Clases necesarias
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection} = require('discord.js')
const dotenv = require('dotenv');

//Configurar el .env
dotenv.config();

//Crear el cliente
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});


//Colección de comandos
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'comandos');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[AVISO] El comando en ${filePath} no contiene una propiedad de "data" or "execute" necesaria.`);
	}
}

//Ejecución comandos
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No he encontrado un comando que coincida con [ ${interaction.commandName} ]`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '¡Tuve un error ejecutando este comando! :c', ephemeral: true });
	}
});



//Mensaje al estar listo
client.once(Events.ClientReady, c => {
	console.log(`¡${c.user.tag} está lista!`);
});


//Iniciar Sesión
client.login(process.env.TOKEN);
