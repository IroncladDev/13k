import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { createLevel } from "@/lib/levels"

export const missionFailureScene = () => {
    canvas
        .fillStyle("rgb(15,35,75,0.2)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .fillStyle("#fff")
        .align("center")
        .baseLine("top")
        .font("bold 25px monospace")
        .text("Mission Failed", canvas.canvasWidth / 2, 100)
        .text("Click to continue", canvas.canvasWidth / 2, 200)

    if (Game.clicked) {
        createLevel()
        Game.scene = 2
    }
}
