import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"
import { createLevel, levels } from "@/lib/levels"
import { dist, pointRect } from "@/lib/utils"

export const levelsScene = () => {
    canvas
        // Background
        .drawImage(backgrounds[1], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .drawImage(foregrounds[0], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .fillStyle(colors.white)
        .align("center")
        .font("bold 25px monospace")
        .text("Level Select", canvas.width / 2, 50)

    // Roughly-drawn shape of El Salvador
    canvas
        .strokeStyle("white")
        .lineWidth(2)
        .fillStyle(colors.ui(0.6))
        .push()
        .translate(canvas.width / 2, canvas.height / 2)
        .scale(1.25, 1.25)
        .translate(-295, -145)
        .path()
        .moveTo(0, 150)
        .lineTo(0, 140)
        .lineTo(70, 70)
        .lineTo(90, 90)
        .lineTo(150, 30)
        .lineTo(170, 30)
        .lineTo(140, 0)
        .lineTo(200, 0)
        .lineTo(240, 20)
        .lineTo(280, 20)
        .lineTo(340, 80)
        .lineTo(380, 80)
        .lineTo(380, 110)
        .lineTo(420, 110)
        .lineTo(440, 90)
        .lineTo(480, 90)
        .lineTo(500, 110)
        .lineTo(550, 110)
        .lineTo(570, 130)
        .lineTo(570, 190)
        .lineTo(590, 190)
        .lineTo(560, 290)
        .lineTo(420, 290)
        .lineTo(240, 240)
        .lineTo(100, 230)
        .lineTo(0, 150)
        .close(2)
        .pop()

    const currentLevel = levels.filter(l => l.completed).length

    const points = levels.map(l => l.position)

    const path = canvas
        .strokeStyle(colors.dwhite(0.4))
        .lineWidth(4)
        .lineCap("round")
        .path()
        .moveTo(points[0][0], points[0][1])
    points.forEach(p => path.lineTo(p[0], p[1]))
    path.close(0)
    const progress = canvas.strokeStyle(colors.ui(0.4)).path().moveTo(points[0][0], points[0][1])
    points.slice(0, currentLevel + 1).forEach(p => progress.lineTo(p[0], p[1]))
    progress.close(0)

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i]
        canvas
            .fillStyle(
                (currentLevel == 1 && i == 0 && levels[0].stars == 0) || currentLevel == i
                    ? colors.white
                    : level.completed
                      ? colors.fgui(0.5)
                      : colors.dwhite(0.3),
            )
            .path()
            .arc(...level.position, 10, 0, Math.PI * 2)
            .close(1)

        if (currentLevel == i || (currentLevel == 1 && i == 0 && levels[0].stars == 0)) {
            canvas
                .strokeStyle(colors.dwhite(0.6))
                .lineWidth(3)
                .path()
                .arc(...level.position, 15 + Math.sin(Game.frameCount / 10) * 2, 0, Math.PI * 2)
                .close(0)
        }

        canvas
            .align("center")
            .font("10px monospace")
            .fillStyle(colors.black)
            .text(level.name, level.position[0], level.position[1] - 23 + (i == 12 ? 35 : 0))
            .fillStyle(colors.white)
            .text(level.name, level.position[0], level.position[1] - 25 + (i == 12 ? 35 : 0))

        if (level.stars > 0)
            canvas.text(`⭐`.repeat(level.stars), level.position[0], level.position[1] - 37.5 + (i == 12 ? 60 : 0))

        if (dist(Game.mouseX, Game.mouseY, ...level.position) < 10) {
            if (currentLevel < i) {
                c2d.style.cursor = "not-allowed"
            } else {
                c2d.style.cursor = "pointer"

                if (Game.clicked) {
                    Game.level = i
                    createLevel()
                    Game.scene = 2
                }
            }
        }
    }

    if (currentLevel < levels.length - 1) {
        canvas
            .fillStyle(colors.white)
            .align("center")
            .text(`- [E] Take on ${levels[currentLevel].name} -`, canvas.width / 2, canvas.height - 50)

        if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 125, canvas.height - 57.5, 250, 25)) {
            c2d.style.cursor = "pointer"
            canvas.fillStyle(colors.dwhite(0.2)).roundRect(canvas.width / 2 - 125, canvas.height - 57.5, 250, 25, 10)
            if (Game.clicked) {
                Game.level = currentLevel
                createLevel()
                Game.scene = 2
            }
        }

        if (Game.keysPressedDown("e")) {
            Game.level = currentLevel
            createLevel()
            Game.scene = 2
        }
    }

    if (currentLevel == 1 && !levels[0].completed) {
        canvas.text(`- [R] Start tutorial -`, canvas.width / 2, canvas.height - 25).fillStyle(colors.dwhite(0.2))

        if (pointRect(Game.mouseX, Game.mouseY, canvas.width / 2 - 125, canvas.height - 32.5, 250, 25)) {
            c2d.style.cursor = "pointer"
            canvas.fillStyle(colors.dwhite(0.2)).roundRect(canvas.width / 2 - 125, canvas.height - 32.5, 250, 25, 10)
            if (Game.clicked) {
                Game.level = 0
                createLevel()
                Game.scene = 2
            }
        }

        if (Game.keysPressedDown("r")) {
            Game.level = 0
            createLevel()
            Game.scene = 2
        }
    }
}
