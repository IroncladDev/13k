# The Bukele Protocol: MS-13 Takedown

## Known bugs
- [ ] Z-index of "[E] to take weapon" text is wrong

## Todo
- [ ] Option to skip tutorial
- [ ] Return to main menu option after winning or losing level
- [ ] Timeout after killing all enemies to next level, maybe make player press [E]?
- [x] Player getting shot & hit sound effect
- [x] ADD HOVERING TO TUTORIAL
- [x] ammo & items
    - [x] Weapon Drops
    - [x] Magazines
    - [x] Inventory (max 1 long weapon, 1 short weapon, 1 meelee weapon, 6 misc items (?))
    - [x] Out of ammo indicator
- [x] UI
    - [x] Health indications
    - [x] Enemy inspection 
    - [x] Ammo Count
    - [x] Weapon stats & selection
    - [x] Better scope
    - [x] Custom cursor
    - [x] Health regeneration
    - [x] Tutorial
- [x] PARTICLES
    - [x] Sparks
    - [x] Muzzle flash
    - [x] Blood
    - [ ] Dirt from walking (?)
- [ ] Blocks
    - [ ] Doors (different hitbox), can be shot through and broken
    - [ ] Different types of blocks
        - [ ] Concrete
- [ ] Backgrounds & Environment for different levels
    - [ ] Dawn
    - [ ] Dusk
    - [ ] Night
- [x] scenes, transitions
- [ ] Levels
- [ ] Make weapons buttons and tutorial button clickable (?)

- [ ] Optimization
    - [x] Downsize string names
    - [ ] Name things more similarly
    - [ ] Hex colors instead of rgb
    - [x] Arrow functions
    - [ ] Use == instead of ===

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
        - [x] Player
            - [x] Controls
            - [ ] Noise (?)
        - [x] Enemies
            - [x] Interactivity
                - [x] Noise detection & reaction
                - [x] Collapsing (?)
                - [x] When to surrender (?)
    - [x] Weapons
    - [ ] Items
        - [ ] Type (weapon, clip, medical, etc)
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

