import { canvas } from "@/lib/canvas/index"
import { bodiesCanvas, headsCanvas, shirtColors, skinColors } from "@/lib/enemies/graphics"
import { enemies, EnemyStats, EnemyType } from "@/lib/enemies/stats"
import Game from "@/lib/game"
import { levels } from "@/lib/levels"
import { sfx } from "@/lib/sfx"
import { angleTo, dist, pointFromAngle, pointRectCollision } from "@/lib/utils"
import { zzfx } from "@/lib/zzfx"
import { Entity } from "./entity"
import { Player } from "./player"

export const enemyMap: Record<string, EnemyType> = {
    r: "recruit",
    h: "homeboy",
    c: "clique-leader",
    p: "palabrero",
    C: "coordinator",
    R: "runner",
    l: "leader",
}

export class Enemy extends Entity {
    type: EnemyType
    weaponRotation = 0
    canSeePlayer = false
    clearLineToPlayer = false
    canShootPlayer = false
    hasSeenPlayer = false
    health = {
        head: 5,
        body: 15,
        legs: 10,
    }
    maxHealth = {
        head: 5,
        body: 15,
        legs: 10,
    }
    player: Player | null = null
    // Head is still alive
    hasSurrendered = false
    stats: EnemyStats
    dying = false
    dyingFrame = 0
    headLeftImage: HTMLCanvasElement
    headRightImage: HTMLCanvasElement
    bodyImage: HTMLCanvasElement
    skinColor: string

    constructor(type: keyof typeof enemyMap, x: number, y: number) {
        super(x, y)

        const stats = enemies[type]

        this.type = enemyMap[type]
        this.health = { ...stats.health }
        this.maxHealth = { ...stats.health }
        this.weapon = stats.weapon[Math.floor(Math.random() * stats.weapon.length)]
        this.speed = stats.speed
        this.stats = stats

        const skinColorIndex = Math.floor(Math.random() * skinColors.length)
        const shirtColorIndex = Math.floor(Math.random() * shirtColors.length)

        this.skinColor = skinColors[skinColorIndex]

        const hairStyle = Math.floor(Math.random() * 2) * 4
        const headLeft = Math.floor(Math.random() * 3)
        const headRight = Math.floor(Math.random() * 3)
        const shirt = Math.floor(Math.random() * 12)

        this.headLeftImage = document.createElement("canvas")
        this.headRightImage = document.createElement("canvas")
        this.bodyImage = document.createElement("canvas")

        this.headLeftImage.width = 15 * canvas.dpr
        this.headLeftImage.height = 15 * canvas.dpr
        this.headRightImage.width = 15 * canvas.dpr
        this.headRightImage.height = 15 * canvas.dpr
        this.bodyImage.width = 25 * canvas.dpr
        this.bodyImage.height = 40 * canvas.dpr

        this.headLeftImage
            .getContext("2d")
            ?.putImageData(headsCanvas.getImageData(15 * (hairStyle + headLeft), skinColorIndex * 15, 15, 15), 0, 0)
        this.headRightImage
            .getContext("2d")
            ?.putImageData(headsCanvas.getImageData(15 * (hairStyle + headRight), skinColorIndex * 15, 15, 15), 0, 0)
        this.bodyImage
            .getContext("2d")
            ?.putImageData(bodiesCanvas.getImageData(25 * shirt, shirtColorIndex * 40, 25, 40), 0, 0)
    }

    run() {
        // Dead & Dying states
        if (this.y > levels[Game.level].map.length * Game.blockSize) this.dead = true
        if (this.health.head <= 0) this.dying = true
        if (this.health.body <= 0) {
            this.dying = this.health.body < -5
            this.hasSurrendered = !this.dying
            if (this.hasSurrendered) this.h = 60
        }
        if (this.health.legs <= 0) {
            this.hasSurrendered = true
            this.h = 60
        }
        if (this.dying || this.hasSurrendered) this.movingDir = 0
        if (this.dying) {
            this.xVel = 0
            this.movingDir = this.movingDirTo = 0
            this.dyingFrame += this.dyingFrame.tween(1, 10)
            this.baseRotation = (this.dir === 1 ? Math.PI / 2 : -Math.PI / 2) * this.dyingFrame
            return
        }

        this.animateVars()
        this.handleBulletCollisions(() => {
            this.hasSeenPlayer = true
        })

        if (this.hasSurrendered) {
            this.xVel = 0
            this.movingDir = 0
            this.movingDirTo = 0
            return
        }

        this.determineSight()

        // 4x slower fire rate cooldown for semiauto weapons
        if (this.fireCooldown > 0) {
            this.fireCooldown -= this.wp.type === "meelee" || this.wp.fireMode === "auto" ? 1 : 0.25
        }

        const player = this.getPlayer()

        // If the enemy can see the player
        if (this.canSeePlayer) {
            if (!this.hasSeenPlayer) this.hasSeenPlayer = true

            this.weaponRotation =
                angleTo(this.centerX, this.centerY, player.centerX, player.centerY) - this.recoilRotation * this.dir

            if (this.wp.type === "meelee") {
                const playerDist = dist(this.centerX, this.centerY, player.centerX, player.centerY)

                if (this.fireCooldown === 0 && playerDist < this.wp.range) {
                    if (playerDist < this.wp.range / 2) {
                        player.health.body -= this.wp.damage
                    }
                    this.xVel += 10 * this.dir
                    this.fireFrame = 1
                    this.fireCooldown = this.wp.reload
                }
                return
            }

            if (this.fireCooldown === 0 && this.canShootPlayer) {
                const sound = (this.wp.sound ? sfx[this.wp.sound] : sfx["shoot1"]).slice()
                sound[0] = 0.3
                zzfx(...sound)
                this.fireFrame = 1

                this.shoot(this.weaponRotation)
            }
        }

        // If the enemy has seen the player
        if (this.hasSeenPlayer) {
            const range = this.wp.type === "meelee" ? this.w * 2 : this.wp.lifetime * this.wp.bulletSpeed

            if (player.centerX > this.centerX) {
                this.dir = 1
            } else {
                this.dir = -1
            }

            if (player.centerX > this.centerX + Math.min(range / 2, 200)) {
                this.movingDir = 1
            } else if (player.centerX < this.centerX - Math.min(range / 2, 200)) {
                this.movingDir = -1
            } else {
                this.movingDir = 0
            }

            if (
                (!this.canSeePlayer || !this.clearLineToPlayer || player.centerY < this.centerY) &&
                this.canJump &&
                !this.dying &&
                !this.hasSurrendered
            ) {
                this.jump()
            }
        }
    }

    render() {
        const speedWeightRatio = this.wp.type === "meelee" ? 1 : (this.speed - this.wp.weight) / this.speed

        canvas
            .push()
            .translate(this.centerX, this.y + this.h - this.dyingFrame * 10)
            .rotate(this.baseRotation)
        // Legs
        canvas
            .strokeStyle(this.skinColor)
            .lineWidth(7.5)
            .lineCap("round")
            .push()
            .translate(-2.5 * this.baseScaleTo, this.hasSurrendered ? -5 : -25)
            .scale(this.dir, 1)
            .rotate(
                this.hasSurrendered
                    ? -Math.PI / 4
                    : this.movingDirTo * ((Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) +
                          Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(-2.5 * this.baseScaleTo, this.hasSurrendered ? -5 : -25)
            .scale(this.dir, 1)
            .rotate(
                this.hasSurrendered
                    ? -Math.PI / 3
                    : this.movingDirTo * ((-Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) +
                          Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(0, -this.h)
            .scale(this.dir, 1)
            .drawImage(this.bodyImage, -10, 20, 25 / canvas.dpr, 40 / canvas.dpr)
            .drawImage(
                this.dir === 1 ? this.headRightImage : this.headLeftImage,
                -2.5 + (this.hasSurrendered ? 7.5 : 0),
                2.5 + (this.hasSurrendered ? 5 : 0),
                15 / canvas.dpr,
                15 / canvas.dpr,
            )
            .pop()

        canvas
            .push()
            .translate(-2.5 * this.baseScaleTo, -52.5 + (this.hasSurrendered ? 20 : 0))
            .rotate(
                this.hasSurrendered
                    ? (Math.PI / 6) * this.dir
                    : this.dying
                      ? ((this.dyingFrame * -Math.PI) / 2) * this.dir
                      : this.weaponRotation + (this.dir === -1 ? Math.PI : 0),
            )
            .scale(this.dir, 1)
            .rotate(0)
        this.wp.render(this.fireFrame, this.skinColor, 5)
        canvas.pop().pop()

        if (this.hasSurrendered) {
            canvas
                .fillStyle("black")
                .fillRect(this.centerX - 10, this.y - 50, 5, 40)
                .fillStyle("white")
                .fillRect(this.centerX - 5, this.y - 45, 30, 20)
        }
    }

    getPlayer() {
        return this.player ?? (Game.entities.find(e => e instanceof Player) as Player)
    }

    determineSight() {
        const player = this.getPlayer()

        // Determine if a line can be drawn from the front of the enemy's head to the player
        this.canSeePlayer =
            (this.dir === 1 && player.centerX > this.centerX) || (this.dir === -1 && player.centerX < this.centerX)

        // Determine if a line from center of player and enemy can be drawn
        this.clearLineToPlayer = true

        // Determine if a line can be drawn from the gun to the player's center, including recoil offset
        this.canShootPlayer =
            this.wp.type === "meelee"
                ? false
                : pointRectCollision(
                      ...pointFromAngle(
                          this.centerX,
                          this.centerY,
                          this.weaponRotation,
                          dist(this.centerX, this.centerY, player.centerX, player.centerY),
                      ),
                      player.x,
                      player.y + this.wp.recoilY * 4,
                      player.w,
                      player.h,
                  )

        for (const block of Game.blocks) {
            if (block.lineCollision(this.centerX, this.y + 10, player.centerX, player.centerY).colliding) {
                this.canSeePlayer = false
                this.clearLineToPlayer = false
            }

            if (this.wp.type === "meelee") continue

            if (
                block.lineCollision(
                    ...pointFromAngle(
                        this.centerX,
                        this.centerY + this.wp.barrelY,
                        this.weaponRotation,
                        this.wp.barrelX,
                    ),
                    player.centerX,
                    player.centerY,
                ).colliding
            ) {
                this.canShootPlayer = false
            }
        }
    }
}
