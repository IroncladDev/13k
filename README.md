# The Bukele Protocol: MS-13 Takedown

## Gameplay

### From a high level

2D platformer-shooter

### The twist

Instead of killing everyone and everything like in a normal shooter, your goal is to take them as prisoners.

If armed with a gun, shoot them. If not armed with a long-range weapon, they will fall to the ground if shot.

If surprised from behind 

- gangsters with long weapons will surrender
- gangsters with meelee weapons will attack you if you're in range 50% of the time, surrendering 50% of the time
- gangsters with pistols will attack 75% of the time, surrendering 25% of the time
- they can't see you if you don't make noise
- they can't see you through a door
- they can hear gunshots through doors, will investigate
- if shot in the leg, they will fall to the ground but can still shoot. They surrender if it's a short range weapon
- if shot in the head, they instantly die if it's a long-range weapon

You can handcuff them and leave them to be picked up later.

## Story

### From a high level

You play as an El Salvadorian soldier, on a mission to take down the MS-13 gangs.

### Intro

1. Someone is walking in the dark. A gangster from MS-13 approaches. 
2. As the sun's rays are visible, you can see the tatoos on the gangster's face. He's holding a gun.
3. The gangster walks away holding a purse, blood visible on his hands. The sun's rays shine over the horizon.
4. The memory of the event fades away, revealing the face of a young soldier.
5. The picture zooms out, Nayib Bukele is being elected as the new president of El Salvador.

## Controls

- WASD / Arrow keys to move
- Space or W to jump
- Mouse to aim and shoot
- V for meelee attack
- E to pick up items / interact
- Number keys to switch weapons

## TODO

- [x] Base framework
    - [x] Game loop
    - [x] Drawing methods (rect, circle, text, etc)
    - [x] Input
    - [ ] Sound (?)
- [ ] Base gameplay
    - [ ] Environment
        - [ ] Rooms
        - [ ] Doors
        - [ ] Walls
        - [ ] Level Rendering
    - [ ] Entity
        - [ ] Graphics
        - [ ] Attacks
        - [ ] Movement
        - [x] Collisions
        - [ ] Bullet collisions
            - [ ] Headshots
            - [ ] Legshots
            - [ ] Bodyshots
        - [ ] Meelee weapon collisions
        - [ ] Player
            - [x] Controls
            - [ ] Noise
        - [ ] Soldiers (?)
            - [ ] Shoot at enemies 
            - [ ] Collapsing if shot in the leg
        - [ ] Enemies
            - [ ] Interactivity
                - [ ] Noise detection & reaction
                - [ ] Collapsing (?)
                - [ ] When to surrender (?)
        - [ ] Hostages (?)
            - [ ] Deaths
    - [ ] Weapons
    - [ ] Items
        - [ ] Type (weapon, clip, medical, etc)
    - [ ] Collidable objects & crouching (?)
- [ ] Scenes
    - [ ] Intro
        - Four-piece comic introduction (might be better as svg + html)
    - [ ] Map (maybe html / svg / css?)
        - You can go to any level
        - Each level only shows difficulty
        - Clicking on one shows the stats such as enemy count, size, hostage count, etc
        - Thirteen levels
        - Help menu is a popover
    - [ ] Game
    - [ ] Post-level
        - Shows objectives and total score
    - [ ] End (maybe html / svg / css?)
        - Only if you beat all levels

## Misc ideas

PTSD whenever you enter a room with a hostage
