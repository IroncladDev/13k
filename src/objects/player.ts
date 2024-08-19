import Controls from "@/controls"
import Game from "@/game"
import { canvas } from "@/graphics/index"
import { constrain } from "@/utils/index"
import { Entity } from "./entity"

class Player extends Entity {
    speed: number = 5
    xAcc: number = 0.5

    constructor() {
        super(0, 0)
    }

    render() {
        canvas.fillStyle("red").fillRect(this.x, this.y, this.w, this.h)
    }

    moveX() {
        if (Controls.keysDown("ArrowRight", "d", "D")) {
            this.xVel += this.xAcc
        } else if (Controls.keysDown("ArrowLeft", "a", "A")) {
            this.xVel -= this.xAcc
        } else {
            this.xVel += (0 - this.xVel) / 10
        }

        this.xVel = constrain(this.xVel, -this.speed, this.speed)

        this.x += this.xVel
    }

    moveY() {
        if (this.canJump && Controls.keysDown("ArrowUp", "w", "W")) {
            this.yVel = -this.jumpForce
            this.canJump = false
        }

        if (this.yVel + Game.gravity < Game.maxVelocity) {
            this.yVel += Game.gravity
        }

        this.yVel = constrain(this.yVel, -this.jumpForce, Game.maxVelocity)
        this.y += this.yVel
    }
}

export const player = new Player()
