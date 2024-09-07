import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { createLevel } from "@/lib/levels"

export const winScene = () => {
    canvas
        .fillStyle("rgb(15,35,75,0.2)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .fillStyle("#fff")
        .align("center")
        .baseLine("top")
        .font("bold 25px monospace")
        .text("You won absolutely nothing", canvas.canvasWidth / 2, 100)
        .text("Return to main menu", canvas.canvasWidth / 2, 200)

    if (Game.clicked) {
        Game.level = 0
        createLevel()
        Game.scene = 0
    }
}
