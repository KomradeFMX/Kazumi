const { Events, AttachmentBuilder } = require('discord.js');
const { registerFont } = require('canvas')
const Canvas = require('canvas');
const { resolve } = require("path");

module.exports = {
	name: Events.GuildMemberAdd,

	async execute(member) {
        const canalBienvenida = member.guild.systemChannel;
        //Hace el Canvas
        var bienvenido = {};
        bienvenido.crear = Canvas.createCanvas(1000, 600);
        bienvenido.contexto = bienvenido.crear.getContext('2d');
        //Carga la imagen de fondo
        const fondo = await Canvas.loadImage('./src/img/welcum.png')
        bienvenido.contexto.drawImage(fondo, 0, 0, 1000, 600);

            Canvas.registerFont(resolve("./src/fonts/UpheavalPro.otf"), { family: "upheaval" });

            //Circulito detrás de la pfp
            bienvenido.contexto.globalAlpha = 0.3;
            bienvenido.contexto.beginPath();
            bienvenido.contexto.fillStyle = '#fdb3fe';
            bienvenido.contexto.arc(500, 203, 180, 0, Math.PI * 2, true);
            bienvenido.contexto.fill();
            bienvenido.contexto.closePath();
            bienvenido.contexto.globalAlpha = 1;

            //Recortar un circulo para la pfp
            bienvenido.contexto.beginPath();
            bienvenido.contexto.arc(500, 203, 165, 0, Math.PI * 2, true);
            bienvenido.contexto.closePath();
            bienvenido.contexto.save();
            bienvenido.contexto.clip();

            //Pasar el avatar de a png
            const avatar = member.displayAvatarURL({ extension: "png", size: 1024 });

            let cargaravatar = await Canvas.loadImage(avatar);

            //Dibujar la foto de perfil
            bienvenido.contexto.drawImage(cargaravatar, 335, 40, 330, 330);
            bienvenido.contexto.restore();


            //Nombre del usuario
            bienvenido.contexto.font = 'bold 90px upheaval';
            bienvenido.contexto.textAlign = 'center';
            bienvenido.contexto.fillStyle = '#ffffff';

            bienvenido.contexto.fillText(member.user.username, 500, 550);

            //Nomnbre del servidor
            bienvenido.contexto.font = 'bold 82px upheaval';
            bienvenido.contexto.textAlign = 'center';
            bienvenido.contexto.fillStyle = '#ffffff';

            bienvenido.contexto.fillText(`¡Bienvenid@ a ${member.guild.name}!`, 500, 462);

            //Cargar la imagen al buffer
            let imagenfinal = new AttachmentBuilder(bienvenido.crear.toBuffer('image/png'), { name: `welcum_${member.user.id}.png` });
            //Canal en el que quieres enviar los mensajes de bienvenida
            //Enviar el texto y la foto
            canalBienvenida.send({ content: `¡Bienvenid@ a ${member.guild.name}, ${member}!`, files: [imagenfinal] }); //No consigo mandar la imagen y el texto a la vez, si lo consigues haz eso
            bienvenido.contexto.clearRect(0, 0, 1000, 600);
	},
};
