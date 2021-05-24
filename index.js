
// Blood Die, a Discord bot for Vampire the Masquerade V5  
//==========================================================>>
// Main `index.js` file for the bot.

"use strict";

// Import requirements.
const { MongoClient } = require('mongodb');
const MongoDBProvider = require('commando-provider-mongo')
const { CommandoClient } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const path = require('path');

// Generates the bot object.
const client =  new CommandoClient({
    commandPrefix: '$',
    owner: process.env.OWNERID,
});

client.setProvider(
    MongoClient.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWROD}@blooddie.knwhi.mongodb.net/botdb?retryWrites=true&w=majority`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(client => new MongoDBProvider(client, 'BloodDie'))
        .catch(err => console.log(err))
).catch(err => console.log(err))

// Registers the commands.
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['roller', 'Dice Rollers']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

// On 'ready' event.
client.once('ready', () => {
    // Notifies on the console that the bot has succesfully logged in.
    console.log(`Logged in as ${client.user.tag}!`);
    // Sets the bot's activity to 'VtM V5'
    client.user.setActivity('VtM V5');
});

// On 'message' event.
client.on('message', message => {

    // Filter for collecting reroll reactions for the $dice command.
    const dice_filter = (reaction, user) => {
        return reaction.emoji.name === '🔄' && user.id != message.author.id && message.author.id === client.user.id && message.reactions.cache.find(old_reaction => old_reaction.me && old_reaction.emoji.name === '🎲' && message.embeds[0].author.name === user.username);
    };
    // Reaction Collector for the $dice command.
    const dice_collector = message.createReactionCollector(dice_filter, { time: 20000, max: 1 });
    // On 'collect' event.
    dice_collector.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}, re-rolling...`);
        const roll_input = message.embeds[0].fields[2].value.slice(1,-1);
        const roll_object = roll.roll(roll_input);
        const result = roll_object.result;
        const rolled = roll_object.rolled;
        const newEmbed = new MessageEmbed(message.embeds[0]);
        newEmbed.fields = [];
        newEmbed.setTitle(`Rolled \`${result}\``);
        newEmbed.addField('🎲 Dice:', `\`[${rolled}]\``, true);
        newEmbed.addField('\u200B', '\u200B', true);
        newEmbed.addField('🔧 Input', `\`${roll_input}\``, true);

        message.embed(newEmbed)
            .then(message => {
                message.react('🎲');
                message.react('🔄');
            });
    });
    // On 'end' event.
    dice_collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
    
    // Filter for collecting reactions for the $cointoss command.
    const coin_filter = (reaction, user) => {
        return reaction.emoji.name === '🔄' && user.id != message.author.id && message.author.id === client.user.id && message.reactions.cache.find(oldreaction => oldreaction.me && oldreaction.emoji.name === '🪙' && message.embeds[0].author.name === user.username);
    };
    // Reaction Collector for the $cointoss command.
    const coin_collector = message.createReactionCollector(coin_filter, { time: 20000, max: 1 });
    // On 'collect' event.
    coin_collector.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}, re-rolling...`);
        const coin = roll.roll('1d2').result;
        const Embed = new MessageEmbed(message.embeds[0])

        if (coin === 1) {
                Embed.setTitle('🪙 Heads')
                Embed.setDescription(`${message.author.username} tossed a coin and got heads`)
            
            message.embed(Embed)
                .then(message => {
                    message.react('🪙')
                    message.react('🔄')
                });
        }
        else if (coin === 2) {
                Embed.setTitle('🪙 Tails')
                Embed.setDescription(`${message.author.username} tossed a coin and got tails`)
        
            message.embed(Embed)
                .then(message => {
                    message.react('🪙')
                    message.react('🔄')
                });
        };
    });
    // On 'end' event.
    coin_collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
});

// On 'error' event.
client.on('error', console.error);

// Logs in the bot with it's token.
client.login(process.env.TOKEN);