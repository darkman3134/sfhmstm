const { Client, Collection, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow, ChannelType, PermissionsBitField } = require("discord.js");
const { createDatabase } = require("whisky.db");
const db = new createDatabase();

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Initializing the project
require("./handler")(client);

client.login(client.config.token);

let dcs = ""

client.on("ready", async (client) => {
  dcs = client.guilds.cache.get(client.config.serverId);
});

  client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "destekBtn") {
      
     if (db.get(`t_${interaction.user.id}`)) return interaction.reply({ content: "Zaten bir ticketınız mevcut.", ephemeral: true });
      
      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
               type: "text",
               parent: client.config.ticketCategory,
               permissionOverwrites: [
                 {
                     id: interaction.guild.id,
                     deny: ["VIEW_CHANNEL"]
                 },
                 {
                     id: interaction.user.id,
                     allow: ["VIEW_CHANNEL"]
                 },
                 {
                     id: client.config.ticketStaffRole,
                     allow: ["VIEW_CHANNEL"]
                 },
             ]
           }).then((zm) => {
             db.set(`t_${interaction.user.id}`, true)
             interaction.reply({ content: `\`✅\` Ticket kanalınız oluşturuldu. <#${zm.id}>`, ephemeral: true })

            const odaEmbed = new MessageEmbed()
             .setAuthor(`${dcs.name} - Ticket Sistemi`, dcs.iconURL({ dynamic: true }))
  .setDescription(`\`📞\` <@${interaction.user.id}>, yetkililerimiz sizin ile iletişime geçecektir. Lütfen bekleyin.`)
  .setFooter("HesapPxnel - Ticket Sistemi", dcs.iconURL({ dynamic: true }))
  .setColor("GREEN")
  .setThumbnail(dcs.iconURL({ dynamic: true }))

        const destekKapaButon = new MessageActionRow().addComponents([new MessageButton().setStyle("DANGER").setLabel("Ticketi Kapat").setEmoji("1107994095336554609").setCustomId(`dkBtn_${interaction.user.id}`)])

        zm.send({ content: `<@&${client.config.ticketStaffRole}>`, embeds: [odaEmbed], components: [destekKapaButon]})
});

      return
    }

  if (interaction.customId.startsWith("dkBtn_")) {

      let idCoz = interaction.customId.slice(6);

    if (!db.get(`t_${idCoz}`)) return interaction.deferUpdate();
    interaction.deferUpdate();

    db.delete(`t_${idCoz}`);

    if (client.config.ticketLog) {
      const channel = await client.channels.fetch(interaction.channel.id);
      let allMessages = [];
      let lastMessageId = null;

      while (true) {
        const messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });

        if (messages.size === 0) break;

        messages.forEach(message => {

          const messageData = `[${new Date(message.createdTimestamp).toLocaleString({ timeZone: "Europe/Istanbul" })}] ${message.author.username}: ${message.content}\n`;
          allMessages.push(messageData);
        });

        lastMessageId = messages.last().id;
      };

      if (allMessages.length != 1) {
        const buffer = Buffer.from(allMessages.slice(0,-1).reverse().join(""), 'utf-8');
      const attachment = new MessageAttachment(buffer, `ticket_${client.users.cache.get(idCoz).username}_log.txt`);

      await client.channels.cache.get(client.config.ticketLogChannel).send({ content: `Ticket Mesaj Kayıtları`, files: [attachment] });
      }
    };

    interaction.channel.permissionOverwrites.edit(idCoz, { VIEW_CHANNEL: false })

    interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`Bu ticket ${interaction.user} tarafından kapatıldı. Kanal **5 saniye** sonra silinecektir.`).setColor("#ff0000")] });

    setTimeout(function() {
      try {
        interaction.channel.delete();
      } catch (err) {
        interaction.channel.send({ embeds: [new MessageEmbed().setDescription(`Ticket kapatıldı ancak kanal silinemedi. :x:`).setColor("#ff0000")] })
      }
    }, 5000)
    return
  }
    
  });

// developed by youtube.com/@djsturkiye // Whisky Lorean