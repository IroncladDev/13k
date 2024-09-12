import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import { shirts, skinColors, tattoos } from "@/lib/enemies/graphics"
import Game from "@/lib/game"
import { weapons } from "@/lib/weapons"

export const startScene = () => {
    canvas
        .drawImage(backgrounds[1], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .drawImage(foregrounds[0], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)

    canvas
        .push()
        .translate(0, 200)
        .scale(7, 7)
        .push()
        .translate(0, 0)
        .strokeStyle(colors.bodySecondary)
        .lineWidth(5)
        .lineCap("round")
        .path()
        .arc(35, 20, 17, -Math.PI / 5, Math.PI / 2)
        .close(0)
        .fillStyle("rgb(45,100,15)")
        .roundRect(7.5, 20, 20, 40, 25)
        .fillStyle(colors.body)
        .roundRect(5, 20, 25, 30, [25, 25, 5, 5])
        .fillStyle("#F4DEB3")
        .roundRect(12.5, 2.5, 15, 15, 15)
        .fillStyle(colors.body)
        .roundRect(10, 0, 20, 10, [20, 20, 5, 0])
        .roundRect(10, 10, 10, 5, [0, 0, 5, 10])
        .pop()
        .push()
        .translate(17.5, 50)
        .rotate(-Math.PI / 3)
    weapons[0].render(0, colors.transparent, colors.black)
    canvas
        .pop()
        .strokeStyle(colors.bodySecondary)
        .lineWidth(5)
        .lineCap("round")
        .path()
        .arc(32, 30, 15, Math.PI / 8, Math.PI)
        .close(0)
        .pop()
        .push()
        .translate(canvas.width - 250, 200)
        .scale(7, 7)
        .fillStyle(skinColors[3])
        .roundRect(7.5, 2.5, 15, 15, 15)
        .fillStyle("#b5b5b5")
        .push()
        .translate(5, 20)
    shirts[0](canvas)
    canvas.push().translate(19, 27).scale(-1, 1)
    weapons[7].render(0, colors.transparent, colors.black)
    canvas
        .pop()
        .fillStyle(skinColors[3])
        .roundRect(7.5, 5, 10, 10, 25)
        .pop()
        .strokeStyle(skinColors[3])
        .lineWidth(5)
        .lineCap("round")
        .path()
        .arc(-2.5, 30, 20, 0, Math.PI / 2)
        .close(0)
        .strokeStyle("#0008")
        .lineWidth(0.5)
        .push()
        .translate(8, 5)
        .scale(0.8, 0.8)
    const path = canvas.path()
    tattoos[2](path).close(0).pop().push().translate(13, 24).scale(0.7, 0.7)
    const path2 = canvas.path()
    tattoos[1](path2)
        .close(0)
        .pop()
        .pop()
        .fillStyle(colors.white)
        .align("center")
        .font(45, true)
        .text("Salvadoran Reclamation: MS-13", canvas.width / 2, 100)
        .font(25)
        .text("- Click to start -", canvas.width / 2, canvas.height - 100)

    if (Game.clicked) {
        if (Game.hasSeenIntro) {
            Game.scene = 1
        } else {
            Game.scene = 6
            Game.hasSeenIntro = true
        }
    }
}
