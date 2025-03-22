const client = require("../index");

client.on("ready", () => {
    client.user.setActivity(`${client.config.botStatus}`);
    console.log(`${client.user.tag} ile giriş yapıldı!`)
});

// developed by youtube.com/@djsturkiye // Whisky Lorean