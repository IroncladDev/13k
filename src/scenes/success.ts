import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { createLevel, levels } from "@/lib/levels"
import { pointRect } from "@/lib/utils"
import { Enemy } from "@/objects/enemy"

export const missionSuccessScene = () => {
    const bountyScore = (Game.entities.filter(e => e instanceof Enemy && (e.hasSurrendered || e.dying)) as Enemy[])
        .map(e => (e.hasSurrendered ? e.stats.bountyAlive : e.stats.bountyDead))
        .reduce((a, b) => a + b, 0)

    canvas
        .fillStyle("rgb(15,35,75,0.4)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .fillStyle("#fff")
        .align("center")
        .baseLine("top")
        .font("bold 25px monospace")
        .text("Mission Accomplished", canvas.canvasWidth / 2, 100)
        .text("Total Bounty Earned: $" + bountyScore, canvas.canvasWidth / 2, 150)
        .fillStyle("rgb(35,55,95,0.4)")

    if (pointRect(Game.mouseX, Game.mouseY, canvas.canvasWidth / 2 - 125, canvas.canvasHeight - 165, 250, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundFillRect(canvas.canvasWidth / 2 - 125, canvas.canvasHeight - 165, 250, 50, 10)
        if (Game.clicked) {
            Game.level++
            createLevel()
            Game.scene = 2
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.canvasWidth / 2 - 175, canvas.canvasHeight - 115, 350, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundFillRect(canvas.canvasWidth / 2 - 175, canvas.canvasHeight - 115, 350, 50, 10)

        if (Game.clicked) {
            Game.scene = 1
        }
    }

    canvas
        .fillStyle("#fff")
        .font("20px monospace")
        .text("- [E] Continue -", canvas.canvasWidth / 2, canvas.canvasHeight - 147.5)
        .text("- [Q] Return to menu -", canvas.canvasWidth / 2, canvas.canvasHeight - 97.5)

    if (Game.keysPressedDown("e")) {
        Game.level++
        createLevel()
        Game.scene = 2
    }

    if (Game.keysPressedDown("q")) {
        Game.scene = 1
    }
}
