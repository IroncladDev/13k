import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { sfx } from "@/lib/sfx"
import {
    angleTo,
    constrain,
    dist,
    pointFromAngle,
    pointRectCollision,
} from "@/lib/utils"
import { zzfx } from "@/lib/zzfx"
import { Bullet } from "./bullet"
import { Entity } from "./entity"
import { Player } from "./player"

export type EnemyType = "basic"

export const enemyMap: Record<string, EnemyType> = {
    e: "basic",
}

export class Enemy extends Entity {
    type: EnemyType
    weaponRotation: number = 0
    canSeePlayer: boolean = false
    canShootPlayer: boolean = false
    hasSeenPlayer: boolean = false

    constructor(type: keyof typeof enemyMap, x: number, y: number) {
        super(x, y)

        this.type = enemyMap[type]
    }

    render() {
        const speedWeightRatio = (this.speed - this.wp.weight) / this.speed

        canvas
            .push()
            .translate(this.x + this.w / 2, this.y + this.h)
            .rotate(this.baseRotation)
        // Legs
        canvas
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
        canvas
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
            .pop()
            .pop()

        canvas
            .push()
            .translate(
                this.x + this.w / 2 - 2.5 * this.baseScaleTo,
                this.y + 30 - 2.5,
            )
            .rotate(this.weaponRotation + (this.dir === -1 ? Math.PI : 0))
            .scale(this.dir, 1)
            .rotate(0)
        this.wp.draw(this.fireFrame, "rgb(25, 60, 5)")
        canvas.pop()
    }

    getPlayer() {
        return Game.entities.find(e => e instanceof Player) as Player
    }

    run() {
        const player = this.getPlayer()

        this.baseRotation += (this.rotateTo - this.baseRotation) / 5
        this.baseScaleTo += (this.dir - this.baseScaleTo) / 5
        this.movingDirTo += (this.movingDir - this.movingDirTo) / 5
        this.fireFrame += -this.fireFrame / (this.wp.frameDelay || 1)

        if (this.fireCooldown > 0) {
            this.fireCooldown -= this.wp.fireMode === "auto" ? 1 : 0.5
        }

        this.canSeePlayer = true

        const distToPlayer = dist(
            this.centerX,
            this.centerY,
            player.centerX,
            player.centerY,
        )
        const [ax, ay] = pointFromAngle(
            this.centerX,
            this.centerY,
            this.weaponRotation,
            distToPlayer,
        )

        this.canShootPlayer = pointRectCollision(
            ax,
            ay,
            player.x,
            player.y + this.wp.recoilY * 4,
            player.w,
            player.h,
        )

        let [barrelX, barrelY] = pointFromAngle(
            this.centerX,
            this.centerY + this.wp.barrelY,
            this.weaponRotation,
            this.wp.barrelX,
        )

        for (const block of Game.blocks) {
            if (
                block.lineCollision(
                    this.centerX,
                    this.y + 10,
                    player.centerX,
                    player.centerY,
                ).colliding
            ) {
                this.canSeePlayer = false
            }

            if (
                block.lineCollision(
                    barrelX,
                    barrelY,
                    player.centerX,
                    player.centerY,
                ).colliding
            ) {
                this.canShootPlayer = false
            }
        }

        if (this.canSeePlayer) {
            if (!this.hasSeenPlayer) this.hasSeenPlayer = true

            this.weaponRotation =
                angleTo(
                    this.centerX,
                    this.centerY,
                    player.centerX,
                    player.centerY,
                ) -
                this.recoilRotation * this.dir

            if (this.fireCooldown === 0 && this.canShootPlayer) {
                let sound = (
                    this.wp.sound ? sfx[this.wp.sound] : sfx["shoot1"]
                ).slice()
                sound[0] = 0.3
                zzfx(...sound)
                this.fireFrame = 1

                let [x, y] = pointFromAngle(
                    this.centerX,
                    this.centerY + this.wp.barrelY,
                    this.weaponRotation,
                    this.wp.barrelX,
                )

                Game.bullets.push(
                    new Bullet({
                        type: this.weapon,
                        x,
                        y,
                        r: this.weaponRotation,
                        speed: this.wp.bulletSpeed,
                        damage: this.wp.damage,
                        lifetime: this.wp.lifetime,
                    }),
                )

                this.xVel += Math.cos(this.weaponRotation) * -this.wp.recoilX
                this.recoilRotation += (Math.PI / 180) * this.wp.recoilY
                this.fireCooldown = this.wp.reload
            }
        }

        this.recoilRotation += -this.recoilRotation / 10
    }

    moveX() {
        const player = this.getPlayer()
        const range = this.wp.lifetime * this.wp.bulletSpeed

        if (this.hasSeenPlayer) {
            if (player.centerX > this.centerX) {
                this.dir = 1
            } else {
                this.dir = -1
            }

            if (player.centerX > this.centerX + Math.min(range / 2, 200)) {
                this.xVel += this.xAcc
                this.rotateTo = Math.PI / 32
                this.movingDir = 1
                this.dir = 1
            } else if (
                player.centerX <
                this.centerX - Math.min(range / 2, 200)
            ) {
                this.xVel -= this.xAcc
                this.rotateTo = -Math.PI / 32
                this.movingDir = -1
                this.dir = -1
            } else {
                this.movingDir = 0
            }
        }

        const speedCap = this.speed - this.wp.weight

        this.xVel += (0 - this.xVel) / 10
        this.xVel = constrain(this.xVel, -speedCap, speedCap)

        this.x += this.xVel
    }

    moveY() {
        const player = this.getPlayer()
        if (this.hasSeenPlayer && !this.canSeePlayer) {
            if (player.centerY < this.centerY) {
                this.yVel = -(this.jumpForce - this.wp.weight)
                this.canJump = false
            }
        }

        if (this.yVel + Game.gravity < Game.maxVelocity) {
            this.yVel += Game.gravity
        }

        this.yVel = constrain(this.yVel, -this.jumpForce, Game.maxVelocity)
        this.y += this.yVel
    }
}
