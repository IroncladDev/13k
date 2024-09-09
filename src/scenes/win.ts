import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"
import { pointRect } from "@/lib/utils"

export const winScene = () => {
    canvas
        .drawImage(backgrounds[1], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .drawImage(foregrounds[0], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .fillStyle("rgb(15,35,75,0.2)")
        .fillRect(0, 0, canvas.width, canvas.height)
        .fillStyle(colors.white)
        .align("center")
        .font("bold 35px monospace")
        .text("Operation Complete", canvas.width / 2, 100)
        .font("15px monospace")
        .text("You completed all the missions successfully. Thanks for playing.", canvas.width / 2, 200)
        .text("- [E] Return to levels -", canvas.width / 2, canvas.height - 100)
        .text("- [R] Main menu -", canvas.width / 2, canvas.height - 50)
        .fillStyle(colors.dwhite(0.2))

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 150, canvas.height - 110, 300, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 150, canvas.height - 110, 300, 35, 5)

        if (Game.clicked) {
            Game.scene = 1
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 150, canvas.height - 60, 300, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 150, canvas.height - 60, 300, 35, 5)

        if (Game.clicked) {
            Game.scene = 0
        }
    }

    if (Game.keysPressedDown("e")) {
        Game.scene = 1
    }

    if (Game.keysPressedDown("r")) {
        Game.scene = 0
    }
}
