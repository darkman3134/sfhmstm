const { Message, Client, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "ticket",
    aliases: ['ticket'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
      if (!message.member.roles.cache.has(client.config.ticketStaffRole)) return message.channel.send("Bu komutu kullanmak için yeterli yetkiniz bulunmuyor. :x:")
      
        const destekEmbed = new MessageEmbed()
  .setAuthor(`${message.guild.name} - Ticket Sistemi`, message.guild.iconURL({ dynamic: true }))
  .setDescription(`Bir ticket oluşturmak için aşağıdaki butonu kullanın. :envelope_with_arrow:`)
  .setFooter("Whisky Lorean - Ticket Sistemi", message.guild.iconURL({ dynamic: true }))
  .setColor("GREEN")
  .setThumbnail(message.guild.iconURL({ dynamic: true }))

const destekButon = new MessageActionRow().addComponents([new MessageButton().setStyle("PRIMARY").setLabel("Ticket Oluştur").setEmoji("📩").setCustomId("destekBtn")])

  client.channels.cache.get(client.config.ticketChannel).send({ embeds: [destekEmbed], components: [destekButon]})
    },
};

// developed by youtube.com/@djsturkiye // Whisky Lorean