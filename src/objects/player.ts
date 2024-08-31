import Controls from "@/lib/controls"
import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { angleTo, constrain, dist, pointFromAngle } from "@/lib/utils"
import { sfx } from "@/lib/sfx"
import { zzfx } from "@/lib/zzfx"
import { Entity } from "./entity"
import { WeaponKey } from "@/lib/weapons"
import { levels } from "@/lib/levels"
import { Enemy } from "./enemy"

export class Player extends Entity {
    mouseRotation = 0
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

    constructor(x: number, y: number) {
        super(x, y)
    }

    run() {
        // Dead & Dying states
        if (
            this.y > levels[Game.level].map.length * Game.blockSize ||
            this.health.head <= 0 ||
            this.health.body <= 0 ||
            this.health.legs <= 0
        ) {
            this.dead = true
        }

        // Movement
        if (Controls.keysDown("ArrowRight", "d", "D")) {
            this.movingDir = 1
        } else if (Controls.keysDown("ArrowLeft", "a", "A")) {
            this.movingDir = -1
        } else {
            this.movingDir = 0
        }
        if (Controls.keysDown("ArrowUp", "w", "W", " ") && this.canJump) this.jump()

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

        this.mouseRotation = angleTo(this.centerX, this.centerY, mouseX, mouseY) - this.recoilRotation * this.dir

        // Run base behavior functions
        this.animateVars()

        // Handle bullet collisions
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
                    const enemyDist = dist(this.centerX, this.centerY, enemy.centerX, enemy.centerY)

                    if (
                        ((enemyDist < this.wp.range / 2 &&
                            (this.dir === 1 ? enemy.centerX > this.centerX : enemy.centerX < this.centerX)) ||
                            enemyDist < this.wp.range / 4) &&
                        enemy instanceof Enemy
                    ) {
                        enemy.health.body -= this.wp.damage
                        enemy.hasSeenPlayer = true
                        enemy.xVel -= this.wp.knockback * enemy.dir
                        enemy.yVel -= this.wp.knockback
                    }
                }
            } else {
                // TODO: some sort of alert system for enemies and nearby enemies
                this.shoot(this.mouseRotation)
            }

            this.hasFired = true
        }

        if (Controls.released && this.hasFired) {
            this.hasFired = false
        }
    }

    render() {
        const speedWeightRatio = this.wp.type === "meelee" ? 1 : (this.speed - this.wp.weight) / this.speed

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
                this.movingDirTo * ((Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) + Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(-2.5 * this.baseScaleTo, -25)
            .scale(this.dir, 1)
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
            const [x, y] = pointFromAngle(
                this.centerX,
                this.centerY + this.wp.barrelY,
                this.mouseRotation,
                this.wp.barrelX,
            )

            const [x2, y2] = pointFromAngle(x, y, this.mouseRotation, this.wp.lifetime * this.wp.bulletSpeed)

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
            .rotate(this.mouseRotation + (this.dir === -1 ? Math.PI : 0))
            .scale(this.dir, 1)
            .rotate(0)
        this.wp.render(this.fireFrame, "rgb(25, 60, 5)")
        canvas.pop()
    }
}
