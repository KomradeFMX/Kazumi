const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Niveles = require('discord-xp')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-nivel')
		.addUserOption(option =>
			option.setName('miembro').setDescription('La persona a la que quieres editar el nivel').setRequired(true))
        .addStringOption(option =>
                option.setName('categoría')
                    .setDescription('Que quieres editar al usuario')
                    .setRequired(true)
                    .addChoices(
                        { name: 'XP', value: 'XP' },
                        { name: 'Nivel', value: 'nivel' },
                    ))
        .addStringOption(option =>
                option.setName('acción')
                    .setDescription('Que acción quieres realizar')
                    .setRequired(true)
                    .addChoices(
                        { name: 'añadir', value: 'añadir' },
                        { name: 'ajustar', value: 'ajustar' },
                        { name: 'restar', value: 'restar' },
                    ))
        .addIntegerOption(option =>
                    option.setName('valor')
                    .setDescription('El valor que quieres usar').setRequired(true))
        
		.setDescription('Edita el nivel de una persona')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) {

        const user = interaction.options.getUser('miembro');
		const usuarioNivel = await Niveles.fetch(user.id, interaction.guild.id)
        //Si no encuentra al usuario en la DB devolver
        if (!usuarioNivel) return interaction.reply({ content:'Parece que ese usuario no tiene un nivel aún <:ypienso:1065195685504364604>', ephemeral: true });

        const categoria = interaction.options.getString('categoría');
        const accion = interaction.options.getString('acción');
        const valor = interaction.options.getInteger('valor');

        //Si el usuario quiere modificar el XP
        if (categoria == "XP") {
            if (accion == "añadir") {
                try {
                    await Niveles.appendXP(user.id, interaction.guild.id, valor);
                    await interaction.reply({ content: `Se le ha añadido **${valor}** de XP a <@${user.id}> <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error sumando XP a un usuario' + err);
                    return;
                }
            }
            else if (accion == "ajustar") {
                try {
                    await Niveles.setXP(user.id, interaction.guild.id, valor);
                    await interaction.reply({ content: `Ahora <@${user.id}> tiene **${valor}**XP <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error ajustando la XP a un usuario' + err);
                    return;
                }
            }
            else if (accion == "restar") {
                try {
                    await Niveles.subtractXP(user.id, interaction.guild.id, valor);
                    await interaction.reply({ content: `Se le ha quitado **${valor}** de XP a <@${user.id}> <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error restando XP a un usuario' + err);
                    return;
                }
            }
        }

        //Si el usuario quiere modificar el nivel
        if (categoria == "nivel") {
            if (accion == "añadir") {
                try {
                    await Niveles.appendLevel(user.id, interaction.guild.id, valor);
                    await interaction.reply({ content: `Se le han añadido **${valor}** niveles a <@${user.id}> <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error sumando nivel a un usuario' + err);
                    return;
                }
            }
            else if (accion == "ajustar") {
                try {
                    await Niveles.setLevel(user.id, interaction.guild.id, valor);
                    await interaction.reply({ content: `Ahora <@${user.id}> tiene el nivel **${valor}** <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error ajustando el nivel a un usuario' + err);
                    return;
                }
            }
            else if (accion == "restar") {
                try {
                    await Niveles.subtractLevel(user.id, interaction.guild.id, valor);
                    await interaction.reply({content: `Se le han quitado **${valor}** niveles a <@${user.id}> <:nem_okai:1065201511954665472>`, ephemeral: true });
                } catch (err) {
                    interaction.reply({ content: 'Tuve un error con la base de datos <:peepo_cafe:1065197877447630938>', ephemeral: true });
                    console.log('Error restando nivel a un usuario' + err);
                    return;
                }
            }
        }

        }
	}