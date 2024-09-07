import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"

export const introScene = () => {
    canvas
        .fillStyle("#000")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        .fillStyle("#fff")
        .font("15px monospace")
        .align("center")
        .baseLine("middle")
        .text(
            "> El Salvador, 2019\n\nThe country is overrun with crime.\n\nViolent gang members roam the streets, committing various crimes and terrorizing the people without consequence.",
            canvas.canvasWidth / 2,
            50,
            600,
        )
        .text(
            "Under President Nayib Bukele's command, you're tasked with taking out the MS-13 gangs scattered throughout the country.\n\n\nGear up, soldier. It's time to take your country back.",
            canvas.canvasWidth / 2,
            200,
            600,
        )
        .text("- Click to continue -", canvas.canvasWidth / 2, canvas.canvasHeight - 50)

    if (Game.clicked) {
        Game.scene = 1
    }
}
