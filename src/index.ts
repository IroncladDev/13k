import Game from "./lib/game"
import { drawBodies, drawHeads, headsCanvas, bodiesCanvas } from "./lib/enemies/graphics"
import { startScene } from "./scenes/start"
import { levelsScene } from "./scenes/levels"
import { missionSuccessScene } from "./scenes/success"
import { missionFailureScene } from "./scenes/failure"
import { winScene } from "./scenes/win"
import { gameScene } from "./scenes/game"
import { introScene } from "./scenes/intro"

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

Game.initControls()

// Game loop
;(function draw(currentTime: number) {
    const delta = currentTime - previousTime

    // Redraw frame at 60fps
    if (delta >= interval) {
        previousTime = currentTime - (delta % interval)
        Game.frameCount++

        c2d.style.cursor = "default"

        if (Game.scene == 0) {
            startScene()
        } else if (Game.scene == 1) {
            levelsScene()
        } else if (Game.scene == 2) {
            gameScene()
        } else if (Game.scene == 3) {
            missionSuccessScene()
        } else if (Game.scene == 4) {
            missionFailureScene()
        } else if (Game.scene == 5) {
            winScene()
        } else if (Game.scene == 6) {
            introScene()
        }

        Game.keysPressed.clear()

        if (Game.clicked) {
            Game.clicked = false
        }

        if (Game.released) {
            Game.released = false
        }
    }

    requestAnimationFrame(draw)
})(0)
