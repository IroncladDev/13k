import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"
import { createLevel, levels } from "@/lib/levels"
import { pointRect } from "@/lib/utils"

export const missionFailureScene = () => {
    canvas
        .drawImage(
            backgrounds[levels[Game.level].background[0]],
            0,
            0,
            canvas.width / canvas.dpr,
            canvas.height / canvas.dpr,
        )
        .drawImage(
            foregrounds[levels[Game.level].background[1]],
            0,
            0,
            canvas.width / canvas.dpr,
            canvas.height / canvas.dpr,
        )
        .fillStyle(colors.white)
        .align("center")
        .font(25, true)
        .text("Mission Failed", canvas.width / 2, 100)
        .fillStyle("rgb(35,55,95,0.4)")

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 125, canvas.height - 165, 250, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 125, canvas.height - 165, 250, 50, 10)
        if (Game.clicked) {
            createLevel()
            Game.scene = 2
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 175, canvas.height - 115, 350, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 175, canvas.height - 115, 350, 50, 10)

        if (Game.clicked) {
            Game.scene = 1
        }
    }

    canvas
        .fillStyle(colors.white)
        .font(20)
        .text("- [E] Retry -", canvas.width / 2, canvas.height - 147.5)
        .text("- [Q] Return to levels -", canvas.width / 2, canvas.height - 97.5)

    if (Game.keysPressedDown("e")) {
        createLevel()
        Game.scene = 2
    }

    if (Game.keysPressedDown("q")) {
        Game.scene = 1
        Game.level--
    }
}
