import Game from "./lib/game"
import { startScene } from "./scenes/title"
import { levelsScene } from "./scenes/levels"
import { missionSuccessScene } from "./scenes/mission-success"
import { missionFailureScene } from "./scenes/mission-failed"
import { winScene } from "./scenes/win"
import { gameScene } from "./scenes/game"
import { introScene } from "./scenes/cutscene"
import { canvas } from "./lib/canvas/index"

declare global {
    interface Number {
        tween(to: number, divisor: number): number
    }
}

Number.prototype.tween = function (to: number, divisor: number): number {
    return Math.fround((to - (this as number)) / divisor)
}

let previousTime = 0

Game.initControls()

// Game loop
function draw(currentTime: number) {
    const delta = currentTime - previousTime

    // Redraw frame at 60fps
    if (delta >= 1000 / Game.frameRate) {
        previousTime = currentTime - (delta % (1000 / Game.frameRate))
        Game.frameCount++

        c2d.style.cursor = "default"

        canvas.font(15).align("center")
        canvas.context.textBaseline = "top"
        canvas.context.lineJoin = "round"

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
}

draw(0)
