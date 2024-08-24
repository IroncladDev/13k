import Controls from "@/lib/controls"
import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { angleTo, constrain, pointFromAngle } from "@/lib/utils"
import { sfx } from "@/lib/sfx"
import { zzfx } from "@/lib/zzfx"
import { Bullet } from "./bullet"
import { Entity } from "./entity"
import { WeaponKey } from "@/lib/weapons"

export class Player extends Entity {
    mouseRotation: number = 0
    hasFired: boolean = false

    constructor(x: number, y: number) {
        super(x, y)
    }

    render() {
        const speedWeightRatio =
            (this.speed - this.wp.weight) / this.speed

        canvas
            .push()
            .translate(this.centerX, this.y + this.h)
            .rotate(this.baseRotation)
            // Legs
            .strokeStyle("rgb(25, 60, 5)")
            .lineWidth(7.5)
            .lineCap("round")
            .push()
            .translate(-2.5 * this.baseScaleTo, -25)
            .scale(this.dir, 1)
            .rotate(
                this.movingDirTo *
                    ((Math.sin((Game.frameCount / 5) * speedWeightRatio) *
                        Math.PI) /
                        4) +
                    Math.PI / 4,
            )
            .path()
            .beginPath()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(-2.5 * this.baseScaleTo, -25)
            .scale(this.dir, 1)
            .rotate(
                this.movingDirTo *
                    ((-Math.sin((Game.frameCount / 5) * speedWeightRatio) *
                        Math.PI) /
                        4) +
                    Math.PI / 4,
            )
            .path()
            .beginPath()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(-this.w / 2, -this.h)
            // Body
            .fillStyle("rgb(45, 100, 15)")
            .roundFillRect(10 - 2.5 * this.baseScaleTo, 20, 20, 40, 25)
            .fillStyle("rgb(35, 80, 10)")
            .roundFillRect(
                7.5 - 2.5 * this.baseScaleTo,
                20,
                25,
                30,
                [25, 25, 5, 5],
            )
            // Head
            .fillStyle("#F4DEB3")
            .roundFillRect(12.5, 2.5, 15, 15, 15)
            // Helmet
            .fillStyle("rgb(35, 80, 10)")
            .roundFillRect(10, 0, 20, 10, [
                20,
                20,
                2.5 + this.baseScaleTo * 2.5,
                2.5 - this.baseScaleTo * 2.5,
            ])
            .roundFillRect(15 - 5 * this.baseScaleTo, 10, 10, 5, [
                0,
                0,
                7.5 - this.baseScaleTo * 2.5,
                7.5 + this.baseScaleTo * 2.5,
            ])
            .pop()
            .pop()

        canvas
            .push()
            .translate(this.centerX - 2.5 * this.baseScaleTo, this.y + 30 - 2.5)
            .rotate(this.mouseRotation + (this.dir === -1 ? Math.PI : 0))
            .scale(this.dir, 1)
            .rotate(0)
        this.wp.draw(this.fireFrame, "rgb(25, 60, 5)")
        canvas.pop()
    }

    run() {
        const mouseX = Controls.mouseX - Game.cameraX
        const mouseY = Controls.mouseY - Game.cameraY

        this.baseRotation += (this.rotateTo - this.baseRotation) / 5
        this.baseScaleTo += (this.dir - this.baseScaleTo) / 5
        this.movingDirTo += (this.movingDir - this.movingDirTo) / 5
        this.mouseRotation =
            angleTo(this.centerX, this.centerY, mouseX, mouseY) -
            this.recoilRotation * this.dir
        this.fireFrame += -this.fireFrame / (this.wp?.frameDelay || 1)

        if (this.fireCooldown > 0) this.fireCooldown--

        if (
            Controls.pressed &&
            this.fireCooldown === 0 &&
            (this.wp.fireMode === "auto" ? true : !this.hasFired)
        ) {
            zzfx(...(this.wp.sound ? sfx[this.wp.sound] : sfx["shoot1"]))
            this.fireFrame = 1

            let [x, y] = pointFromAngle(
                this.centerX,
                this.centerY + this.wp.barrelY,
                this.mouseRotation,
                this.wp.barrelX,
            )

            Game.bullets.push(
                new Bullet({
                    type: this.weapon,
                    x,
                    y,
                    r: this.mouseRotation,
                    speed: this.wp.bulletSpeed,
                    damage: this.wp.damage,
                    lifetime: this.wp.lifetime,
                }),
            )

            this.xVel += Math.cos(this.mouseRotation) * -this.wp.recoilX
            this.recoilRotation += (Math.PI / 180) * this.wp.recoilY
            this.fireCooldown = this.wp.reload
            this.hasFired = true
        }

        if (Controls.released && this.hasFired) {
            this.hasFired = false
        }

        this.recoilRotation += -this.recoilRotation / 10

        if (mouseX > this.centerX) this.dir = 1
        else if (mouseX < this.centerX) this.dir = -1

        const weaponKeys: Record<string, WeaponKey> = {
            "1": "ar15",
            "2": "1911",
            "3": "glock",
            "4": "ak47",
            "5": "mp5",
            "6": "uzi",
            "7": "m24",
        }

        for (const [key, w] of Object.entries(weaponKeys)) {
            if (Controls.keysDown(key)) {
                this.weapon = w
            }
        }
    }

    moveX() {
        if (Controls.keysDown("ArrowRight", "d", "D")) {
            this.xVel += this.xAcc
            this.rotateTo = Math.PI / 32
            this.movingDir = 1
        } else if (Controls.keysDown("ArrowLeft", "a", "A")) {
            this.xVel -= this.xAcc
            this.rotateTo = -Math.PI / 32
            this.movingDir = -1
        } else {
            this.rotateTo = 0
            this.movingDir = 0
        }

        const speedCap = this.speed - this.wp.weight

        this.xVel += (0 - this.xVel) / 10
        this.xVel = constrain(this.xVel, -speedCap, speedCap)

        this.x += this.xVel
    }

    moveY() {
        if (this.canJump && Controls.keysDown("ArrowUp", "w", "W", " ")) {
            this.yVel = -(this.jumpForce - this.wp.weight)
            this.canJump = false
        }

        if (this.yVel + Game.gravity < Game.maxVelocity) {
            this.yVel += Game.gravity
        }

        this.yVel = constrain(this.yVel, -this.jumpForce, Game.maxVelocity)
        this.y += this.yVel
    }
}
