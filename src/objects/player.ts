import Controls from "@/lib/controls"
import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { angleTo, constrain, dist, pointFromAngle } from "@/lib/utils"
import { sfx } from "@/lib/sfx"
import { zzfx } from "@/lib/zzfx"
import { Entity } from "./entity"
import { WeaponKey } from "@/lib/weapons"
import { Enemy } from "./enemy"

export class Player extends Entity {
    hasFired = false
    health = {
        head: 14,
        body: 30,
        legs: 15,
    }
    maxHealth = {
        head: 15,
        body: 30,
        legs: 15,
    }
    dashDelay = 100
    dashTime = 100
    sounds = {
        footstep: [false, false] as [boolean, boolean],
    }

    constructor(x: number, y: number) {
        super(x, y)

        this.speed = 7
    }

    run() {
        // Dead & Dying states
        if (this.health.head <= 0 || this.health.body <= 0 || this.health.legs <= 0) {
            this.dead = true
        }

        // Movement
        if (Controls.keysDown("ArrowRight", "d")) {
            this.movingDir = 1
        } else if (Controls.keysDown("ArrowLeft", "a")) {
            this.movingDir = -1
        } else {
            this.movingDir = 0
        }
        if (Controls.keysDown("ArrowUp", "w", " ") && this.canJump) {
            zzfx(...sfx["jump"])
            this.jump()
        }

        if (this.dashTime > 0) this.dashTime--

        if (this.dashTime === 0 && Controls.keysDown("Shift") && this.canJump && !this.isAgainstWall) {
            this.knockback += 20 * this.movingDir * -this.dir
            this.dashTime = this.dashDelay
        }

        // Misc weapon switching
        const weaponKeys: Record<string, WeaponKey> = {
            "1": "ar15",
            "2": "glock",
            "3": "autoglock",
            "4": "ak47",
            "5": "mp5",
            "6": "uzi",
            "7": "m24",
            "8": "karambit",
            "9": "machete",
            "0": "spas12",
            "q": "dragunov",
        }

        for (const [key, w] of Object.entries(weaponKeys)) {
            if (Controls.keysDown(key)) {
                this.weapon = w
            }
        }

        // Mouse
        const mouseX = Controls.mouseX - Game.cameraX
        const mouseY = Controls.mouseY - Game.cameraY

        if (mouseX > this.centerX) this.dir = 1
        else if (mouseX < this.centerX) this.dir = -1

        this.weaponRotation = angleTo(this.centerX, this.centerY, mouseX, mouseY)

        this.animateVars()
        this.handleBulletCollisions()

        if (this.fireCooldown > 0) this.fireCooldown--

        // Attacks
        if (
            Controls.pressed &&
            this.fireCooldown === 0 &&
            (this.wp.type === "meelee" || this.wp.fireMode === "semi" ? !this.hasFired : true)
        ) {
            zzfx(...(this.wp.sound ? sfx[this.wp.sound] : sfx["shoot1"]))
            this.fireFrame = 1

            // Meelee weapons
            if (this.wp.type === "meelee") {
                for (const enemy of Game.entities) {
                    const [x, y] = pointFromAngle(this.centerX, this.centerY, this.weaponRotationTo, this.wp.range)
                    const strikeDist = dist(x, y, enemy.centerX, enemy.centerY)

                    if (strikeDist < this.wp.range && enemy instanceof Enemy) {
                        zzfx(...sfx["strike"])
                        enemy.health.body -= this.wp.damage
                        if (!enemy.hasSurrendered && !enemy.dying) {
                            enemy.dir = this.x < enemy.x ? -1 : 1
                            enemy.knockback = this.wp.knockback
                            enemy.rotateTo += this.wp.knockback * 2 * (Math.PI / 180) * -enemy.dir
                        }
                    }
                }
            } else {
                // TODO: some sort of alert system for enemies and nearby enemies
                this.shoot(this.weaponRotationTo)
                this.notifyClosest(this.x)
            }

            this.hasFired = true
        }

        if (Controls.released && this.hasFired) {
            this.hasFired = false
        }
    }

    render() {
        const speedWeightRatio = this.wp.type === "meelee" ? 1 : (this.speed - this.wp.weight) / this.speed

        if (Math.floor(Math.cos((Game.frameCount / 2.5) * speedWeightRatio)) === 0 && this.movingDir !== 0) {
            this.sounds.footstep[1] = true
        } else {
            this.sounds.footstep[1] = false
        }

        if (this.sounds.footstep[1] && !this.sounds.footstep[0] && this.canJump) {
            zzfx(...sfx[Math.random() > 0.5 ? "footstep" : "footstep2"])
            this.sounds.footstep[0] = true
            setTimeout(() => {
                this.sounds.footstep[0] = false
            }, 200)
        }

        canvas
            .push()
            .translate(this.centerX, this.y + this.h)
            .rotate(this.baseRotation)
            // Legs
            .lineWidth(7.5)
            .lineCap("round")
            .strokeStyle("rgb(15, 50, 5)")
            .push()
            .translate(
                -2.5 * this.baseScaleTo + Math.cos((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 5,
                -25,
            )
            .scale(this.dirTo, 1 - Math.sin((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 0.15)
            .rotate(
                this.movingDirTo * ((Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) + Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .strokeStyle("rgb(35, 70, 15)")
            .push()
            .translate(
                -2.5 * this.baseScaleTo - Math.cos((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 5,
                -25,
            )
            .scale(this.dirTo, 1 + Math.sin((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 0.15)
            .rotate(
                this.movingDirTo * ((-Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) + Math.PI / 4,
            )
            .path()
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
            .roundFillRect(7.5 - 2.5 * this.baseScaleTo, 20, 25, 30, [25, 25, 5, 5])
            // Head
            .fillStyle("#F4DEB3")
            .roundFillRect(12.5, 2.5, 15, 15, 15)
            // Helmet
            .fillStyle("rgb(35, 80, 10)")
            .roundFillRect(10, 0, 20, 10, [20, 20, 2.5 + this.baseScaleTo * 2.5, 2.5 - this.baseScaleTo * 2.5])
            .roundFillRect(15 - 5 * this.baseScaleTo, 10, 10, 5, [
                0,
                0,
                7.5 - this.baseScaleTo * 2.5,
                7.5 + this.baseScaleTo * 2.5,
            ])
            .pop()
            .pop()

        if (this.wp.type === "gun") {
            const [x, y] = this.gunTip()
            const [x2, y2] = pointFromAngle(x, y, this.weaponRotationTo, this.wp.lifetime * this.wp.bulletSpeed)

            canvas
                .strokeStyle(
                    `rgba(255, 255, 255, ${constrain(Math.PI / 180 / this.recoilRotation / this.wp.recoilY, 0, 1) * 0.2})`,
                )
                .lineWidth(2)
                .path()
                .moveTo(x, y)
                .lineTo(x2, y2)
                .stroke()
                .close()
        }

        canvas
            .push()
            .translate(this.centerX - 2.5 * this.baseScaleTo, this.y + 30 - 2.5)
            .rotate(this.weaponRotationTo)
            .scale(1, this.dirTo)
            .rotate(0)
        this.wp.render(this.fireFrame, "rgb(25, 60, 5)")
        canvas.pop()
    }
}
