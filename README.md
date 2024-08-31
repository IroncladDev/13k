# The Bukele Protocol: MS-13 Takedown

## Todo
- dash function for player
- bullet knockback
- ammo

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
    - [x] Sound
- [ ] Base gameplay
    - [ ] Environment
        - [ ] Rooms
        - [ ] Doors
        - [ ] Walls
        - [x] Level Rendering
    - [ ] Entity
        - [ ] Graphics
        - [x] Attacks
        - [x] Movement
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
                - [x] When to surrender (?)
        - [ ] Hostages (?)
            - [ ] Deaths
    - [x] Weapons
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

- [ ] Reload indicator
- [ ] Semi and full-auto fire types
