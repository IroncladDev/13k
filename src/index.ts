import Controls from "./lib/controls"
import Game from "./lib/game"
import { canvas } from "./lib/canvas/index"
import { createLevel } from "./lib/levels"
import { WeaponKey } from "./lib/weapons"
import { Player } from "./objects/player"

const interval = 1000 / 60
let previousTime = 0

Controls.init()

createLevel()

const weaponKeys: Record<string, WeaponKey> = {
    "1": "ar15",
    "2": "1911",
    "3": "glock",
    "4": "ak47",
    "5": "mp5",
    "6": "uzi",
    "7": "m24",
}

// Game loop
;(function draw(currentTime: number) {
    const delta = currentTime - previousTime

    // Redraw frame at 60fps
    if (delta >= interval) {
        previousTime = currentTime - (delta % interval)
        Game.frameCount++

        const player = Game.entities.find(entity => entity instanceof Player)

        if (!player) return

        Game.cameraX +=
            (canvas.canvasWidth / 2 - player.x - player.w / 2 - Game.cameraX) /
            5
        Game.cameraY +=
            (canvas.canvasHeight / 2 - player.y - player.h / 2 - Game.cameraY) /
            5

        canvas
            .fillStyle("rgb(150, 150, 150)")
            .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)

        canvas.push()
        canvas.translate(Game.cameraX, Game.cameraY)

        Game.bullets = Game.bullets.filter(bullet => !bullet.dead)
        Game.particles = Game.particles.filter(particle => !particle.dead)
        Game.entities = Game.entities.filter(entity => !entity.dead)

        for (let bullet of Game.bullets) {
            bullet.update()
            bullet.render()
        }
        for (let entity of Game.entities) {
            entity.run()
            entity.moveX()
            entity.render()
        }
        for (let block of Game.blocks) {
            block.run()
            block.collideX()
        }
        for (let entity of Game.entities) {
            entity.moveY()
        }
        for (let block of Game.blocks) {
            block.collideY()
            block.render()
        }
        for (let particle of Game.particles) {
            particle.run()
        }

        for(const [key, weapon] of Object.entries(weaponKeys)) {
            if(Controls.keysDown(key)) {
                player.weapon = weapon
            }
        }

        canvas.pop()

        if (Controls.clicked) {
            Controls.clicked = false
        }

        if(Controls.released) {
            Controls.released = false
        }
    }

    requestAnimationFrame(draw)
})(0)
