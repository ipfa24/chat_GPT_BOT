const { Client, Events, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const { DISCORD_BOT_TOKEN, OPEN_AI_KEY } = require("./config.json");

const client = new Client ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Bot Is Ready in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.substring(0,1) === "!"){
        const command = msg.content.substring(1).split(" ")[0];

        switch (command) {
            case "Ping":
                msg.channel.send("Pong");
                break;
            case "ask":
                const response = await askAI(
                    `Q:${msg.content.replace("!ask", " ")}\nA:`
                );
                msg.channel.send(`${response}`);
        }
    }
});

const askAI = async (question) => {
    const configuration = new Configuration({
        apiKey: OPEN_AI_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model:"text-davinci-003",
        prompt: question,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
    });
      console.log(response);
      return response.data.choices[0].text;
};

client.login(DISCORD_BOT_TOKEN);