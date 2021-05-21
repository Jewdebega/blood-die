const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Roll =  require('roll');
    roll = new Roll();

module.exports = class OblivionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'oblivion',
            aliases: ['o'],
            group: 'roller',
            memberName: 'oblivion_check',
            description: 'Rolls an Oblivion rouse check.',
            args: [
                {
                    key: 'die',
                    prompt: `Can't roll no dice`,
                    type: 'string',
                    validate: die => {
                        if (isNaN(parseInt(die)))
                            return `Can't roll \`${die}\` dice`;
                        else
                            return true;
                    },                 
                    'default': '1'
                }
            ]
        });
    };

    run(message, { die }) {
        console.log(`Running $oblivion command, called by ${message.author.tag}`)
        die = Math.abs(parseInt(die));
        var die_roll = roll.roll(`${die}d10`).rolled;
        var grammar = {die_noun: 'die', check: 'didn\'t pass'};
        var check = false;
        var stained = false;

        die_roll.forEach(element => {
            if (element >= 6)
                check = true;
            if (element === 1 || element === 10)
                stained = true;
        });

        if ( die > 1 || die === 0 )
            grammar.die_noun = 'dice';
        if ( check )
            grammar.check = 'passed';

        const Embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`${message.author.username} rolled a check and ${grammar.check}.`)
            .addFields(
                {
                    name: `🎲 ${grammar.die_noun.charAt(0).toUpperCase() + grammar.die_noun.slice(1)}:`,
                    value: `\`[${die_roll}]\``,
                    inline: true
                },
            );
        
        if (check) {
            Embed.setTitle('👍 Passed the check');
            Embed.setColor('0x50fa7b');
        }
        else {
            Embed.setTitle('🩸 Failed the check');
            Embed.setColor('0xff5555');
        };

        if (stained) {
            Embed.title = `${Embed.title} | 💀 Touched by the Abyss`
            Embed.description = `${Embed.description}
            Oblivion seeps into their soul, leaving a Stain on their Humanity.`
            Embed.setColor('0xbd93f9');
            Embed.addField(
                '💀 Stain',
                '*This check can be a Stain to your Humanity*',
                false
            )
        };

        message.embed(Embed)
            .then(message => {
                if (stained)
                    message.react('💀')
                if (check)
                    message.react('👍')
                else
                    message.react('🩸');
            });
    };
};