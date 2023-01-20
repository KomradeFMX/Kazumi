//Clases necesarias
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection} = require('discord.js')
const mongoose = require('./database/mondongo.js')
const Niveles = require('discord-xp')
const dotenv = require('dotenv');

//Configurar el .env
dotenv.config();

//Crear el cliente
const client = new Client({
    intents: [GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageTyping]
});


//Colección de comandos
client.commands = new Collection();

const eventsPath = path.join(__dirname, 'eventos');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


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

//Conexión con el módulo del MONDONGO
Niveles.setURL(process.env.MONDONGO)

mongoose.init()


//Iniciar Sesión---------------------
client.login(process.env.TOKEN);//  |
//----------------------------------
