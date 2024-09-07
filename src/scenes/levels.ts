import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { createLevel, levels } from "@/lib/levels"
import { dist } from "@/lib/utils"

export const levelsScene = () => {
    canvas
        .fillStyle("rgb(15,35,75)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .strokeStyle("white")
        .lineWidth(2)
        .fillStyle("rgba(0,200,150,0.4)")
        .push()
        .translate(canvas.canvasWidth / 2, canvas.canvasHeight / 2)
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
        .stroke()
        .fill()
        .close()
        .pop()

    const points = levels.map(l => l.position)

    const path = canvas
        .strokeStyle("#fff6")
        .lineWidth(4)
        .lineJoin("round")
        .lineCap("round")
        .path()
        .moveTo(points[0][0], points[0][1])
    points.forEach(p => path.lineTo(p[0], p[1]))
    path.stroke().close()
    const progress = canvas.strokeStyle("#0fc6").path().moveTo(points[0][0], points[0][1])
    points.slice(0, Game.level + 2).forEach(p => progress.lineTo(p[0], p[1]))
    progress.stroke().close()

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i]
        canvas
            .fillStyle(Game.level + 1 > i ? "#0fc8" : Game.level + 1 == i ? "#fff" : "#fff3")
            .path()
            .arc(...level.position, 10, 0, Math.PI * 2)
            .fill()
            .close()

        if (Game.level + 1 == i) {
            canvas
                .strokeStyle("#fff8")
                .path()
                .arc(...level.position, 20, 0, Math.PI * 2)
                .stroke()
                .close()
        }

        canvas
            .align("center")
            .baseLine("bottom")
            .font(i == levels.length - 1 ? "15px monospace" : "10px monospace")
            .fillStyle("#000")
            .text(level.name, level.position[0], level.position[1] - 8 + (i == 12 ? 30 : 0))
            .fillStyle("#fff")
            .text(level.name, level.position[0], level.position[1] - 10 + (i == 12 ? 30 : 0))

        if (dist(Game.mouseX, Game.mouseY, ...level.position) < 10) {
            c2d.style.cursor = "pointer"

            if (Game.clicked) {
                Game.level = i
                createLevel()
                Game.scene = 2
            }
        }
    }
}
