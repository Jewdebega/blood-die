const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Roll =  require('roll');
    roll = new Roll();

module.exports = class RerollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reroll',
            aliases: ['rr'],
            group: 'roller',
            memberName: 'reroll',
            description: 'Re-rolls up to three dice of a VtM V5 roll.',
            args: [
                {
                    key: 'die1',
                    prompt: 'Which dice do you want to re-roll?',
                    type: 'string',
                    validate: die1 => {
                        if (isNaN(parseInt(die1)))
                            return `Can't roll \`${die1}\` dice`;
                        else
                            return true;
                    },
                    'default': '1'
                },
                {
                    key: 'die2',
                    prompt: 'Which dice do you want to re-roll?',
                    type: 'string',
                    validate: die2 => {
                        if (isNaN(parseInt(die2)))
                            return `Can't roll \`${die2}\` dice`;
                        else
                            return true;
                    },
                    'default': ''
                },
                {
                    key: 'die3',
                    prompt: 'Which dice do you want to re-roll?',
                    type: 'string',
                    validate: die3 => {
                        if (isNaN(parseInt(die3)))
                            return `Can't roll \`${die3}\` dice`;
                        else
                            return true;
                    },
                    'default': ''
                }
            ]
        });
    };

    run(message, { die1, die2, die3 }) {
        console.log(`Running $reroll command, called by ${message.author.tag}`)
        const { author } = message
        const indexes = [
            Math.abs(parseInt(die1)-1),
            Math.abs(parseInt(die2)-1),
            Math.abs(parseInt(die3)-1)
        ]
        if (message.reference === null)
            return  message.say(`<@${author.id}> Reply to the roll that you want to re-roll.`)
        
        const old_messageID = message.reference.messageID;
        var recievedEmbed;
        var newEmbed;

        message.channel.messages.fetch(old_messageID)
            .then(old_roll => {
                const { cache } = old_roll.reactions

                if (cache.find(reaction => reaction.client.user.id === this.client.user.id && reaction.emoji.name === '🎲'))
                    return old_roll.say(`<@${author.id}> \`$reroll\` is exclusive for VtM v5 rolls.`);
    
                if (cache.find(reaction => reaction.client.user.id === this.client.user.id && reaction.emoji.name === '🪙'))
                    return old_roll.say(`<@${author.id}> \`$reroll\` is exclusive for VtM v5 rolls.`);

                if (cache.find(reaction => reaction.client.user.id === this.client.user.id && reaction.emoji.name === '🔄'))
                    return old_roll.say(`<@${author.id}> Can't re-roll the same action twice.`);
                
                if (cache.find(reaction => (
                    reaction.client.user.id === this.client.user.id && (
                        reaction.emoji.name === '🩸' || reaction.emoji.name === '👍')
                    )))
                    return old_roll.say(`<@${author.id}> Can't re-roll checks.`);

                recievedEmbed = old_roll.embeds[0];

                if (author.username != recievedEmbed.author.name) {
                    return old_roll.say(`<@${author.id}> Can't re-roll other user's rolls.`)
                };

                newEmbed = new MessageEmbed(recievedEmbed).setTitle('Blank');
                var die_roll = recievedEmbed.fields[0].value.slice(2, -2).split(',');
                if (recievedEmbed.fields[1].value.slice(2, -2).split(',')[0] === '')
                    var hunger_die_roll = [];
                else
                    var hunger_die_roll = recievedEmbed.fields[1].value.slice(2, -2).split(',');
                var die = die_roll.length + hunger_die_roll.length
                var hunger_die = hunger_die_roll.length
                var rerolled_die = [];
                var modifiers = {tens: 0, critical: false, messy: false, bestial: false};
                var grammar = {die_noun: 'die', hunger_die_noun: 'die', success_noun: 'success', rerolled_die_noun: 'die'};
                var success = 0;

                indexes.forEach(element => {
                    if (!isNaN(parseInt(die_roll[element]))) {
                        rerolled_die.push(die_roll[element]);
                        die_roll[element] = roll.roll('1d10').result;
                    };
                });

                if (!(rerolled_die.length === 0)) {
                    old_roll.react('🔄');
                };

                die_roll.forEach(element => {
                    element = parseInt(element);
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
                    element = parseInt(element);
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
                if ( rerolled_die.length > 1 || hunger_die === 0)
                    grammar.rerolled_die_noun = 'dice';

                newEmbed.setTitle(`Rolled \`${success}\` ${grammar.success_noun}`);
                newEmbed.setAuthor(author.username, author.displayAvatarURL());
                newEmbed.setDescription(
                    `${author.username} re-rolled a pool of \`${die}\` ${grammar.die_noun} with \`${hunger_die}\` Hunger ${grammar.hunger_die_noun} for a total of \`${success}\` ${grammar.success_noun} after re-rolling \`${rerolled_die.length}\` ${grammar.rerolled_die_noun}.`
                );
                newEmbed.fields = [];
                newEmbed.addFields(
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
                    {
                        name: `🔄 Re-rolled ${grammar.rerolled_die_noun.charAt(0).toUpperCase() + grammar.rerolled_die_noun.slice(1)}:`,
                        value: `\`[${rerolled_die}]\``,
                        inline: true
                    }
                );
            
                if (modifiers.critical && ! modifiers.bestial && ! modifiers.messy) {
                    newEmbed.setColor('0x50fa7b');
                    newEmbed.addField(
                        '💥 Critical Win',
                        '*This roll can be a critical win.*',
                        false
                    );
                }
                else if (modifiers.critical && modifiers.bestial && !modifiers.messy) {
                    newEmbed.setColor('0xff5555');
                    newEmbed.addField(
                        '💥 Critical Win | 👿 Bestial Failure',
                        '*This roll can be either a critical win or a bestial failure.*',
                        false
                    );
                }
                else if (modifiers.messy && ! modifiers.bestial) {
                    newEmbed.setColor('0xff5555');
                    newEmbed.addField(
                        '😈 Messy Critical',
                        '*This roll can be a messy critical.*',
                        false
                    );
                }
                else if (modifiers.messy && modifiers.bestial) {
                    newEmbed.setColor('0xff5555');
                    newEmbed.addField(
                        '😈 Messy Critical | 👿 Bestial Failure',
                        '*This roll can be either a messy critical or a bestial failure.*',
                        false
                    );
                }
                else if (modifiers.bestial) {
                    newEmbed.setColor('0xff5555');
                    newEmbed.addField(
                        '👿 Bestial Failure',
                        '*This roll can be a bestial failure.*',
                        false
                    );
                };

                message.embed(newEmbed)
                    .then(message => message.react('🔄'))
            })
            .catch(err => console.log(err))
    };
};