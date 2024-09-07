import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { Player } from "@/objects/player"

export const gameScene = () => {
    const player = Game.entities.find(entity => entity instanceof Player) as Player | undefined

    if (player?.dead) {
        Game.scene = 4
    }

    if (!player) return

    Game.cameraX += Game.cameraX.tween(canvas.canvasWidth / 2 - player.x - player.w / 2, 5)
    Game.cameraY += Game.cameraY.tween(canvas.canvasHeight / 2 - player.y - player.h / 2, 5)

    canvas
        .fillStyle("rgb(15,35,75)")
        .fillRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
        // Default font settings
        .font("15px monospace")
        .align("center")
        .baseLine("middle")

    canvas.push()
    canvas.translate(canvas.canvasWidth / 2, canvas.canvasHeight / 2)
    canvas.translate(-canvas.canvasWidth / 2 + Game.cameraX, -canvas.canvasHeight / 2 + Game.cameraY)

    Game.bullets = Game.bullets.filter(bullet => !bullet.dead)
    Game.particles = Game.particles.filter(particle => !particle.dead)

    for (const bullet of Game.bullets) {
        bullet.update()
        bullet.render()
    }
    for (const entity of Game.entities) {
        entity.render()
        entity.run()
        entity.moveX()
    }
    for (const block of Game.blocks) {
        block.run()
        block.collideX()
    }
    for (const entity of Game.entities) {
        entity.moveY()
    }
    for (const block of Game.blocks) {
        block.collideY()
        block.render()
    }
    for (const particle of Game.particles) {
        particle.run()
    }

    canvas.pop()

    player.renderUI()
}
