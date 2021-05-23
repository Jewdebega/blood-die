const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Roll =  require('roll');
    roll = new Roll();

module.exports = class CoinTossCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cointoss',
            aliases: ['toss', 'ct', '🪙'],
            group: 'roller',
            memberName: 'cointoss',
            description: 'Toss a coin.',
        });
    };

    run(message) {
        console.log(`Running $cointoss command, called by ${message.author.tag}`);
        const coin = roll.roll('1d2').result;
        const Embed = new MessageEmbed()
            .setColor('0xf1fa8c')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            
        if (coin === 1) {
                Embed.setTitle('🪙 Heads')
                Embed.setDescription(`${message.author.username} tossed a coin and got heads.`)
            
            message.embed(Embed)
                .then(message => {
                    message.react('🪙')
                    message.react('🔄')
                });
        }
        else if (coin === 2) {
                Embed.setTitle('🪙 Tails')
                Embed.setDescription(`${message.author.username} tossed a coin and got tails.`)
        
            message.embed(Embed)
                .then(message => {
                    message.react('🪙')
                    message.react('🔄')
                });
        };
    };
};