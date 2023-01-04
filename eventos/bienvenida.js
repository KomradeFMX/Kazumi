const { Events, AttachmentBuilder } = require('discord.js');
const { registerFont } = require('canvas')
const Canvas = require('canvas');
const { resolve } = require("path");

module.exports = {
	name: Events.GuildMemberAdd,

	async execute(member, client) {
        const canalBienvenida = member.guild.systemChannel;
        //Hace el Canvas
        var bienvenido = {};
        bienvenido.crear = Canvas.createCanvas(1000, 600);
        bienvenido.contexto = bienvenido.crear.getContext('2d');
        //Carga la imagen de fondo
        const fondo = await Canvas.loadImage('./src/img/welcum.png')
        bienvenido.contexto.drawImage(fondo, 0, 0, 1000, 600);

            Canvas.registerFont(resolve("./src/fonts/UniSansHeavy.otf"), { family: "unisans" });

            //Recortar un circulo para la pfp
            bienvenido.contexto.beginPath();
            bienvenido.contexto.arc(500, 208, 165, 0, Math.PI * 2, true);
            bienvenido.contexto.closePath();
            bienvenido.contexto.save();
            bienvenido.contexto.clip();

            //Pasar el avatar de a png
            const avatar = member.displayAvatarURL({ extension: "png" });

            let cargaravatar = await Canvas.loadImage(avatar);

            //Dibujar la foto de perfil
            bienvenido.contexto.drawImage(cargaravatar, 335, 43, 330, 330);
            bienvenido.contexto.restore();


            //Nombre del usuario
            bienvenido.contexto.font = 'bold 72px unisans';
            bienvenido.contexto.textAlign = 'center';
            bienvenido.contexto.fillStyle = '#ffffff';

            bienvenido.contexto.fillText(member.user.username, 500, 560);

            //Nomnbre del servidor
            bienvenido.contexto.font = 'bold 82px unisans';
            bienvenido.contexto.textAlign = 'center';
            bienvenido.contexto.fillStyle = '#ffffff';

            bienvenido.contexto.fillText(`¡Bienvenid@ a ${member.guild.name}`, 500, 462);

            //Cargar la imagen al buffer
            let imagenfinal = new AttachmentBuilder(bienvenido.crear.toBuffer('image/png'), { name: 'welcum.png' });
            //Canal en el que quieres enviar los mensajes de bienvenida
            //Enviar el texto y la foto
            canalBienvenida.send({ content: `¡Bienvenid@ a ${member.guild.name}, ${member}!`, files: [imagenfinal] }); //No consigo mandar la imagen y el texto a la vez, si lo consigues haz eso
            bienvenido.contexto.clearRect(0, 0, 1000, 600);
	},
};
