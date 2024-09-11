import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"
import { createLevel, levels } from "@/lib/levels"
import { pointRect } from "@/lib/utils"
import { Enemy } from "@/objects/enemy"

export const missionSuccessScene = () => {
    const level = levels[Game.level]
    const allPrisoners = (Game.entities.filter(e => e instanceof Enemy) as Enemy[]).every(
        e => e.hasSurrendered && !e.dead,
    )
    const underTwoMins = level.timeEnded - levels[Game.level].timeStarted < 120000
    const accuracy = Math.min(Game.shotsFired == 0 ? 1 : Game.hits / Game.shotsFired, 1)

    canvas
        .drawImage(backgrounds[level.background[0]], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .drawImage(foregrounds[level.background[1]], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .fillStyle(colors.white)
        .align("left")
        .font(15)
        .text("All enemies taken alive", canvas.width / 2 - 125, 200)
        .text("Completed in under 2 minutes", canvas.width / 2 - 125, 230)
        .text(`Accuracy (${(accuracy * 100).toFixed(0)}%) over 80%`, canvas.width / 2 - 125, 260)
        .align("center")
        .text("- [E] Continue -", canvas.width / 2, canvas.height - 150)
        .text("- [R] Retry -", canvas.width / 2, canvas.height - 100)
        .text("- [Q] Return to levels -", canvas.width / 2, canvas.height - 50)
        .font(25, true)
        .text("Mission Accomplished", canvas.width / 2, 100)
        .font(15)
        .fillStyle(allPrisoners ? colors.white : colors.dwhite(0.2))
        .text("⭐", canvas.width / 2 - 140, 200)
        .fillStyle(underTwoMins ? colors.white : colors.dwhite(0.2))
        .text("⭐", canvas.width / 2 - 140, 230)
        .fillStyle(accuracy > 0.8 ? colors.white : colors.dwhite(0.2))
        .text("⭐", canvas.width / 2 - 140, 260)

    canvas.fillStyle(colors.dwhite(0.2))

    const updateStars = () => {
        const starCount = [allPrisoners, underTwoMins, Math.round(accuracy) >= 0.8].filter(b => b).length
        if (starCount > levels[Game.level].stars) {
            levels[Game.level].stars = starCount
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 150, canvas.height - 160, 300, 35)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 150, canvas.height - 160, 300, 35, 5)

        if (Game.clicked) {
            updateStars()
            Game.level++
            createLevel()
            Game.scene = 2
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 150, canvas.height - 110, 300, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 150, canvas.height - 110, 300, 35, 5)

        if (Game.clicked) {
            updateStars()
            createLevel()
            Game.scene = 2
        }
    }

    if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 150, canvas.height - 60, 300, 50)) {
        c2d.style.cursor = "pointer"
        canvas.roundRect(canvas.width / 2 - 150, canvas.height - 60, 300, 35, 5)

        if (Game.clicked) {
            updateStars()
            Game.scene = 1
        }
    }

    if (Game.keysPressedDown("e")) {
        updateStars()
        Game.level++
        createLevel()
        Game.scene = 2
    }

    if (Game.keysPressedDown("r")) {
        updateStars()
        createLevel()
        Game.scene = 2
    }

    if (Game.keysPressedDown("q")) {
        updateStars()
        Game.scene = 1
    }
}
