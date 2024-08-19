import Controls from "./controls"
import Game from "./game"
import { canvas } from "./graphics/index"
import { Block } from "./objects/block"
import { player } from "./objects/player"
import { zzfx } from "./utils/zzfx"

const interval = 1000 / 60
let previousTime = 0
let frameCount = 0

// Initialize controls
Controls.init()

Game.entities.push(player)
Game.blocks.push(
    new Block("0", 0, 100),
    new Block("0", 100, 100),
    new Block("0", 300, 150),
)

// Game loop
;(function draw(currentTime: number) {
    const delta = currentTime - previousTime

    // Redraw frame at 60fps
    if (delta >= interval) {
        previousTime = currentTime - (delta % interval)
        frameCount++

        canvas
            .fillStyle("rgb(25, 25, 25)")
            .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)

        for (let entity of Game.entities) {
            entity.moveX()
            entity.render()
        }
        for (let block of Game.blocks) {
            block.render()
            block.collideX()
        }
        for (let entity of Game.entities) {
            entity.moveY()
        }
        for (let block of Game.blocks) {
            block.collideY()
        }

        if (Controls.clicked) {
            Controls.clicked = false
        }

        if (frameCount % 200 === 0) {
            // zzfx(...[, , 925, 0.04, 0.3, 0.6, 1, 0.3, , 6.27, -184, 0.09, 0.17])
        }
    }

    requestAnimationFrame(draw)
})(0)
