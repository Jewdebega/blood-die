# Blood Die
### *A Discord bot for Vampire the Masquerade V5.*

Made with the Discord.JS and Commando API.

## Installation:
Click [this][1] link to add the bot to your server.

[1]: https://discord.com/api/oauth2/authorize?client_id=843168753759944744&permissions=116800&scope=bot

## Commands:
Blood Die expands on the default commands provided by Discord.JS and Commando.

### Roll
#### Syntax:
`$roll [total_dice] [hunger_dice] [difficulty]`
- `[total_dice]` Takes an int as the total amount of dice to roll.
- `[hunger_dice]` Takes an int as the amount of hunger dice to roll.
- `[difficulty]` Takes an int as the difficulty of the roll.

##### Aliases:
- `$r [total_dice] [hunger_dice] [difficulty]`

### Reroll
#### Syntax:
`$reroll [index1] [index2] [index3]`
- `[index1]` Takes the index of the first dice to be rerolled.
- `[index2]` Takes the index of the second dice to be rerolled.
- `[index3]` Takes the index of the third dice to be rerolled.

#### Aliases:
- `$rr [index1] [index2] [index3]`

### Check
#### Syntax:
`$check [total_dice]`
- `[total_dice]` The amount of dice to be rolled for the check.

#### Aliases:
- `$c [total_dice]`
- `$rouse [total_dice]`

### Oblivion
#### Syntax:
`$oblivion [total_dice]`
- `[total_dice]` The amount of dice to be rolled for the check.

#### Aliases:
- `$o [total_dice]`

### Dice
#### Syntax:
`$dice [expression]`
- `[expression]` The dice to be rolled in regular dice notation.

#### Aliases:
- `$d [expression]`

### Cointoss
#### Syntax:
`$cointoss`

#### Aliases:
- `$ct`
- `$toss`
- `$t`
- `$:coin:`