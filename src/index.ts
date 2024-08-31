import Controls from "./lib/controls"
import Game from "./lib/game"
import { canvas } from "./lib/canvas/index"
import { createLevel } from "./lib/levels"
import { Player } from "./objects/player"
import { angleTo, dist, pointFromAngle } from "./lib/utils"
import { drawBodies, drawHeads, headsCanvas, bodiesCanvas } from "./lib/enemies/graphics"

declare global {
    interface Number {
        tween(to: number, divisor: number): number
    }
}

Number.prototype.tween = function (to: number, divisor: number): number {
    return Math.fround((to - (this as number)) / divisor)
}

drawBodies(bodiesCanvas)
drawHeads(headsCanvas)

const interval = 1000 / 60
let previousTime = 0
let zoomDist = 0
const cursorCameraOffset: [number, number] = [0, 0]

Controls.init()

createLevel()

// Game loop
;(function draw(currentTime: number) {
    const delta = currentTime - previousTime

    // Redraw frame at 60fps
    if (delta >= interval) {
        previousTime = currentTime - (delta % interval)
        Game.frameCount++

        const player = Game.entities.find(entity => entity instanceof Player)

        if (player?.dead) {
            createLevel()
        }

        if (!player) return

        Game.cameraX += Game.cameraX.tween(canvas.canvasWidth / 2 - player.x - player.w / 2, 5)
        Game.cameraY += Game.cameraY.tween(canvas.canvasHeight / 2 - player.y - player.h / 2, 5)

        canvas.fillStyle("rgb(100, 150, 200)").fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)

        canvas.push()
        canvas.translate(canvas.canvasWidth / 2, canvas.canvasHeight / 2)
        zoomDist += zoomDist.tween(
            dist(canvas.canvasWidth / 2, canvas.canvasHeight / 2, Controls.mouseX, Controls.mouseY) / 3,
            10,
        )
        const cursorAngle = angleTo(Controls.mouseX, Controls.mouseY, canvas.canvasWidth / 2, canvas.canvasHeight / 2)
        const [x, y] = pointFromAngle(0, 0, cursorAngle, zoomDist)
        cursorCameraOffset[0] += cursorCameraOffset[0].tween(x, 10)
        cursorCameraOffset[1] += cursorCameraOffset[1].tween(y, 10)
        canvas.scale(1 - zoomDist / canvas.canvasWidth, 1 - zoomDist / canvas.canvasWidth)
        canvas.translate(
            -canvas.canvasWidth / 2 + Game.cameraX + cursorCameraOffset[0],
            -canvas.canvasHeight / 2 + Game.cameraY + cursorCameraOffset[1],
        )

        Game.bullets = Game.bullets.filter(bullet => !bullet.dead)
        Game.particles = Game.particles.filter(particle => !particle.dead)
        Game.entities = Game.entities.filter(entity => !entity.dead)

        for (const bullet of Game.bullets) {
            bullet.update()
            bullet.render()
        }
        for (const entity of Game.entities) {
            entity.run()
            entity.moveX()
            entity.render()
        }
        for (const block of Game.blocks) {
            block.run()
            block.collideX()
        }
        for (const entity of Game.entities) {
            entity.moveY()
        }
        for (const block of Game.blocks) {
            block.collideY()
            block.render()
        }
        for (const particle of Game.particles) {
            particle.run()
        }

        canvas.pop()

        if (Controls.clicked) {
            Controls.clicked = false
        }

        if (Controls.released) {
            Controls.released = false
        }
    }

    requestAnimationFrame(draw)
})(0)
