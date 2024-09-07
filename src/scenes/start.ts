import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"

export const startScene = () => {
    canvas
        .fillStyle("rgb(15,35,75,0.2)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .fillStyle("#fff")
        .align("center")
        .baseLine("top")
        .font("bold 25px monospace")
        .text("Salvadoran Reclamation: MS-13", canvas.canvasWidth / 2, 100)
        .text("- Click to start -", canvas.canvasWidth / 2, 200)

    if (Game.clicked) {
        if (Game.hasSeenIntro) {
            Game.scene = 1
        } else {
            Game.scene = 6
            Game.hasSeenIntro = true
        }
    }
}
