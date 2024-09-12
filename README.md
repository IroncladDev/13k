# Salvadoran Reclamation: MS-13

My entry for [JS13K](https://js13kgames.com/) 2024.

Salvadoran Reclamation is a 2D shooter/platformer game where you play as a soldier in El Salvador to take out the MS-13 gangs scattered across the country.

## How to play

Play the tutorial in the game to learn how to play.

- WASD or Arrow Keys to Move
- Mouse to aim, hold Left mouse button to attack
- Shift to dash
- E to pick up ammo and/or weapons from defeated enemies
- 1, 2, 3 to switch between weapons
- Right-click to quickly switch to and strike with your meelee weapon

## Development

1. Ensure you have [nix](https://nixos.org) installed
2. Run `nix develop` to open a devshell. You may have to append special CLI args in order to use the `develop` command

- To run the dev server: `bun serve`
- To build the game: `bun run build`
- To find the best roadroller config: `bun run find-best-roadroller`
- To build with the best roadroller config: `bun run build-with-best-roadroller`

## Building the game

This years' theme was ["Triskaidekaphobia"](https://en.wikipedia.org/wiki/Triskaidekaphobia), which means "fear of the number 13".

When the theme was announced, I thought I was completely stumped. At that moment, I had the impression that people who thought of game jam ideas were more evil than serial killers.

I was wrong though. I had a lot of fun building the game and I'm happy how it turned out.

### Inspiration

After pondering on the word "triskaidekaphobia" for a while, I remembered a [video](https://x.com/nickshirleyy/status/1817106758432657852) I'd recently watched about the [Cecot prison](https://en.wikipedia.org/wiki/Terrorism_Confinement_Center) in El Salvador.

During Nayib Bukele's crackdown on crime in 2019, he build the prison and confined thousands of dangerous criminals there, many of who came from notorious gangs like MS-13 and Bario-18. 

Violent gangs like MS-13 terrorize people across the world, so I figured I'd adapt that to the theme.

### "What game engine?"

I decided to just use the raw canvas API with requestAnimationFrame for this one. I created a wrapper class around canvas that allowed me to chain methods like `canvas.fillStyle().fillRect().path()...` instead of `ctx.fillStyle()`, `ctx.fillRect()`, etc.

For the sound effects, I used [ZzFX](https://github.com/KilledByAPixel/ZzFX). I had so much fun tweaking the sound effects. I spent countless hours on it that I probably shouldn't have. But this little library is a lifesaver.

### Challenges

The hardest part of the game was coding out the behavior for enemies. When to shoot, pursue, walk back, and notify each other of an attack took almost a third of the game's development time. They still aren't looking right.

Level design was also a challenge, but I managed to make it work in the end after playing them through many times and making sure they worked.

Game balancing was tedious, but it wasn't terrible.

## Credits

 - ZzFX - [Zuper Zmall Zound Zynth](https://github.com/KilledByAPixel/ZzFX) - Micro Edition, MIT License - Copyright 2019 Frank Force
