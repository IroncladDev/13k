import { backgrounds, foregrounds } from "@/lib/backgrounds"
import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"

export const introScene = () => {
    canvas
        .drawImage(backgrounds[2], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .drawImage(foregrounds[1], 0, 0, canvas.width / canvas.dpr, canvas.height / canvas.dpr)
        .strokeStyle(colors.fgui(0.5))
        .fillStyle(colors.ui(0.5))
        .lineWidth(2)
        .lineCap("round")
        .path()
        .moveTo(canvas.width / 2 - 200, 200)
        .lineTo(canvas.width / 2 + 180, 200)
        .lineTo(canvas.width / 2 + 200, 220)
        .lineTo(canvas.width / 2 + 200, 300)
        .lineTo(canvas.width / 2 - 180, 300)
        .lineTo(canvas.width / 2 - 200, 280)
        .lineTo(canvas.width / 2 - 200, 200)
        .moveTo(canvas.width / 2 - 200, 190)
        .lineTo(canvas.width / 2 - 200, 160)
        .lineTo(canvas.width / 2 - 30, 160)
        .lineTo(canvas.width / 2 - 30, 190)
        .lineTo(canvas.width / 2 - 200, 190)
        .moveTo(canvas.width / 2 - 200, 320)
        .lineTo(canvas.width / 2 + 200, 320)
        .lineTo(canvas.width / 2 + 200, 370)
        .lineTo(canvas.width / 2 + 180, 390)
        .lineTo(canvas.width / 2 - 200, 390)
        .lineTo(canvas.width / 2 - 200, 320)
        .close(2)
        .fillStyle(colors.white)
        .font("15px monospace")
        .align("left")
        .text("El Salvador, 2019", canvas.width / 2 - 190, 170, 600)
        .text(
            "The country is overrun with crime.\n\nNotorious gang members roam the streets, committing various crimes and terrorizing the people without consequence.",
            canvas.width / 2 - 190,
            210,
            400,
        )
        .text(
            "Under President Nayib Bukele's command, you're tasked with taking out the MS-13 gangs scattered throughout the country.",
            canvas.width / 2 - 190,
            330,
            400,
        )
        .align("center")
        .text("Gear up, soldier. It's time to take your country back.", canvas.width / 2, 430)
        .text("- Click to continue -", canvas.width / 2, canvas.height - 50)

    if (Game.clicked) {
        Game.scene = 1
    }
}
