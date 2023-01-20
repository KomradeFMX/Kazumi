const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Niveles = require('discord-xp')
const Canvas = require('canvas');
const { resolve } = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nivel')
		.addUserOption(option =>
			option.setName('miembro').setDescription('Persona de la que quieres ver el nivel'))
		.setDescription('Mira el progreso de tu nivel o el de otra persona'),

	async execute(interaction) {

        const user = interaction.options.getUser('miembro') || interaction.user;
		const miembro = await interaction.guild.members.fetch(user.id)
        const target = await Niveles.fetch(user.id, interaction.guild.id);

        if (!target) return interaction.reply({ content: 'Por lo que veo esta persona no tiene nivel aún :c', ephemeral: true });
        
        var nivelActual = target.level;
        const siguienteNivel = Niveles.xpFor(nivelActual + 1);

        //Personalización -----------------------------------
        const colorAcento = '#e7a8fe';                  /**/
        const wallpaper = './src/img/fondoNivel.png';  /**/
        //-----------------------------------------------

        //Hace el Canvas
        var nivel = {};
        nivel.crear = Canvas.createCanvas(1000, 300);
        nivel.contexto = nivel.crear.getContext('2d');
        //Carga la imagen de fondo
        const fondo = await Canvas.loadImage(wallpaper);
        nivel.contexto.drawImage(fondo, 0, 0, 1000, 300);

        Canvas.registerFont(resolve("./src/fonts/CONSOLA.TTF"), { family: "consola" });

        //El cuadrado donde va la pfp
        nivel.contexto.globalAlpha = 0.7;
        nivel.contexto.fillStyle = '#2c2c2c';
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(13, 13, 275, 275, [5, 5, 5, 5]);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        //El cuadrado donde va la info
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(305, 13, 675, 275, [5, 5, 5, 5]);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        //El que va encima del de la pfp
        nivel.contexto.globalAlpha = 1;
        nivel.contexto.fillStyle = colorAcento;
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(13, 13, 275, 25, [5, 5, 0, 0]);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        //El que va encima de la info
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(305, 13, 675, 25, [5, 5, 0, 0]);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        //Linea negra encima de las ventanas
        nivel.contexto.globalAlpha = 0.7;
        nivel.contexto.strokeStyle = 'black';
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(13, 13, 275, 275, [5, 5, 5, 5]);
        nivel.contexto.roundRect(305, 13, 675, 275, [5, 5, 5, 5]);
        nivel.contexto.moveTo(13, 39); // Move the pen to (30, 50)
        nivel.contexto.lineTo(288, 39); // Draw a line to (150, 100)
        nivel.contexto.moveTo(305, 39); // Move the pen to (30, 50)
        nivel.contexto.lineTo(980, 39); // Draw a line to (150, 100)
        nivel.contexto.stroke();
        nivel.contexto.closePath();



        //Circulitos
        nivel.contexto.globalAlpha = 1;
        nivel.contexto.beginPath();
        nivel.contexto.fillStyle = '#ed3838';
        nivel.contexto.arc(37, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.arc(329, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        nivel.contexto.beginPath();
        nivel.contexto.fillStyle = '#ed8d38';
        nivel.contexto.arc(52, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.arc(344, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        nivel.contexto.beginPath();
        nivel.contexto.fillStyle = '#abed38';
        nivel.contexto.arc(67, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.arc(359, 26, 5, 0, Math.PI * 2, true);
        nivel.contexto.fill();
        nivel.contexto.closePath();

        //Pasar el avatar a png y hacer que esté en alta resolución
        const avatar = miembro.displayAvatarURL({ extension: "png", size: 1024 });
        let cargaravatar = await Canvas.loadImage(avatar);
        //Dibujar la foto de perfil
        nivel.contexto.drawImage(cargaravatar, 38, 50, 225, 225);

        //Nombre de archivos (cursiladas)
        nivel.contexto.font = '14px consola';
        nivel.contexto.textAlign = 'left';
        nivel.contexto.fillStyle = '#ffffff';

        nivel.contexto.fillText('image.png', 82, 30);
        nivel.contexto.fillText('XP-Level.db', 375, 30);

        //Información de usuario
        nivel.contexto.font = '36px consola';
        //Nombre y tag
        nivel.contexto.fillText(`${miembro.user.tag}`, 328, 118);

        nivel.contexto.font = '30px consola';


        //ZONA DE NIVELES
            //Variables
            var nivelAnterior = nivelActual - 1;
            if (nivelAnterior == -1) {
                nivelAnterior = 0;
            };

            var xpNivelAnterior = Niveles.xpFor(nivelAnterior);
            const xpActual = target.xp - xpNivelAnterior;
            const xpSigNivel = siguienteNivel - xpNivelAnterior;
        //XP actual / necesaria
        nivel.contexto.fillText(`${xpActual} / ${xpSigNivel}`, 328, 170);
        //Nivel
        nivel.contexto.textAlign = 'right';
        nivel.contexto.fillText(`Nivel ${nivelActual}`, 955, 170);
        //Barra que contiene la XP total
        nivel.contexto.fillStyle = '#ffffff';
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(328, 184, 629, 50, [5, 5, 5, 5]);
        nivel.contexto.fill();
        nivel.contexto.closePath();
        //Barra que contiene la XP actual
        nivel.contexto.fillStyle = `${miembro.displayHexColor}`;
            //Calcula lo ancha que tiene que ser la barra
            const porcentaje = (xpActual / xpSigNivel);
            const anchoBarraXp = porcentaje * 629;
        nivel.contexto.beginPath();
        nivel.contexto.roundRect(328, 184, anchoBarraXp, 50, [5, 5, 5, 5]);
        nivel.contexto.fill();
        nivel.contexto.closePath();


        //Cargar la imagen al buffer
        let imagenfinal = new AttachmentBuilder(nivel.crear.toBuffer('image/png'), { name: `nivel_${miembro.id}.png` });
        //Canal en el que quieres enviar los mensajes de bienvenida
        //Enviar el texto y la foto
        await interaction.reply({ files: [imagenfinal] });
        nivel.contexto.clearRect(0, 0, 1000, 300);
	},
};