const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Roll =  require('roll');
    roll = new Roll();

module.exports = class DiceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dice',
            aliases: ['d'],
            group: 'roller',
            memberName: 'dice',
            description: 'Common dice notation roller.',
            args: [
                {
                    key: 'expression',
                    prompt: `Can't roll no dice`,
                    type: 'string',
                    validate: expression => {
                        try {
                            roll.roll(expression.replace(/\s+/g, '').trim());
                            return true;
                        }
                        catch(err) {
                            return `Can't roll \`${expression}\` dice.`
                        }
                    }
                }
            ]
        });
    };

    run(message, { expression }) {
        console.log(`Running $dice command, called by ${message.author.tag}`)
        const trimmed_input = expression.replace(/\s+/g, '').trim();
        const roll_object = roll.roll(trimmed_input)
        const result = roll_object.result;
        const rolled = roll_object.rolled;
        const Embed = new MessageEmbed()
            .setColor('0xff79c6')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`Rolled \`${result}\``)
            .addField('🎲 Dice', `\`[${rolled}]\``, true)
            .addField('\u200B', '\u200B', true)
            .addField('🔧 Input', `\`${trimmed_input}\``, true);
        
        message.embed(Embed)
            .then(message => {
                message.react('🎲')
                message.react('🔄')
            });
    };
};