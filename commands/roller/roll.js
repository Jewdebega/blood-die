const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Roll =  require('roll');
    roll = new Roll();

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            aliases: ['r'],
            group: 'roller',
            memberName: 'roll',
            description: 'Dice roller for VtM V5.',
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
                    'default': '1',
                },
                {
                    key: 'hunger_die',
                    prompt: `Can't roll no dice`,
                    type: 'string',
                    validate: hunger_die => {
                        if (isNaN(parseInt(hunger_die)))
                            return `Can't roll \`${hunger_die}\` dice`;
                        else
                            return true;
                    },                    
                    'default': '0',
                },
            ],
        });
    };

    run(message, { die, hunger_die }) {
        console.log(`Running $roll command, called by ${message.author.tag}`)
        die = Math.abs(parseInt(die));
        if (die > 30)
            die = 30;
        hunger_die = Math.abs(parseInt(hunger_die));
        if (hunger_die > 5)
            hunger_die = 5

        if ( die - hunger_die < 0) {
            die = hunger_die;
            var die_roll = [];
        }
        else
            var die_roll = roll.roll(`${die-hunger_die}d10`).rolled;
        var hunger_die_roll = roll.roll(`${hunger_die}d10`).rolled;
        var modifiers = {tens: 0, critical: false, messy: false, bestial: false};
        var grammar = {die_noun: 'die', hunger_die_noun: 'die', success_noun: 'success'};
        var success = 0;

        die_roll.forEach(element => {
            if (element >= 6 && element < 10)
                success += 1;
            else if (element === 10) {
                success +=1;
                modifiers.tens +=1;
                if (modifiers.tens === 2) {
                    success += 2;
                    modifiers.tens = 0;
                    modifiers.critical = true;
                };
            };
        });

        hunger_die_roll.forEach(element => {
            if (element >= 6 && element < 10)
                success += 1;
            else if (element === 10) {
                success +=1;
                modifiers.tens +=1;
                if (modifiers.tens === 2) {
                    success += 2;
                    modifiers.tens = 0;
                    modifiers.critical = true;
                    modifiers.messy = true;
                };
            } else if ( element === 1) {
                modifiers.bestial = true;
            }
        });

        if ( die > 1 || die === 0)
            grammar.die_noun = 'dice';
        if ( hunger_die > 1 || hunger_die === 0)
            grammar.hunger_die_noun = 'dice';
        if ( success > 1 || success === 0)
            grammar.success_noun = 'successes';

        const Embed = new MessageEmbed()
            .setColor('0x8be9fd')
            .setTitle(`Rolled \`${success}\` ${grammar.success_noun}`)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(
                `${message.author.username} rolled a pool of \`${die}\` ${grammar.die_noun} with \`${hunger_die}\` Hunger ${grammar.hunger_die_noun} for a total of \`${success}\` ${grammar.success_noun}.`
            )
            .addFields(
                {
                    name: `🎲 ${grammar.die_noun.charAt(0).toUpperCase() + grammar.die_noun.slice(1)}:`,
                    value: `\`[${die_roll}]\``,
                    inline: true
                },
                {
                    name: `🩸 Hunger ${grammar.hunger_die_noun.charAt(0).toUpperCase() + grammar.hunger_die_noun.slice(1)}:`,
                    value: `\`[${hunger_die_roll}]\``,
                    inline: true
                },
            );

        if (modifiers.critical && ! modifiers.bestial && ! modifiers.messy) {
            Embed.setColor('0x50fa7b');
            Embed.addField(
                '💥 Critical Win',
                '*This roll can be a critical win.*',
                false
            );
        }
        else if (modifiers.critical && modifiers.bestial && !modifiers.messy) {
            Embed.setColor('0xff5555');
            Embed.addField(
                '💥 Critical Win | 👿 Bestial Failure',
                '*This roll can be either a critical win or a bestial failure.*',
                false
            );
        }
        else if (modifiers.messy && ! modifiers.bestial) {
            Embed.setColor('0xff5555');
            Embed.addField(
                '😈 Messy Critical',
                '*This roll can be a messy critical.*',
                false
            );
        }
        else if (modifiers.messy && modifiers.bestial) {
            Embed.setColor('0xff5555');
            Embed.addField(
                '😈 Messy Critical | 👿 Bestial Failure',
                '*This roll can be either a messy critical or a bestial failure.*',
                false
            );
        }
        else if (modifiers.bestial) {
            Embed.setColor('0xff5555');
            Embed.addField(
                '👿 Bestial Failure',
                '*This roll can be a bestial failure.*',
                false
            );
        };
        return message.embed(Embed);
    };
};