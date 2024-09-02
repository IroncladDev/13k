# The Bukele Protocol: MS-13 Takedown

## Todo
- ammo
- sounds for walking, jumping, contacting ground, bullet impacts, meelee impacts, dashing
- UI
- Shotgun
- PARTICLES
- Bullet trails / rendering

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
        - [ ] Doors (breakable blocks)
        - [x] Walls
        - [x] Level Rendering
    - [ ] Entity
        - [x] Graphics
        - [x] Attacks
        - [x] Movement
        - [x] Collisions
        - [x] Bullet collisions
            - [x] Headshots
            - [x] Legshots
            - [x] Bodyshots
        - [x] Meelee weapon collisions
        - [ ] Player
            - [x] Controls
            - [ ] Noise (?)
        - [ ] Soldiers (?)
            - [ ] Shoot at enemies 
            - [ ] Collapsing if shot in the leg
        - [x] Enemies
            - [x] Interactivity
                - [x] Noise detection & reaction
                - [x] Collapsing (?)
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
