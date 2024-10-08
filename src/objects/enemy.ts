import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import { bodiesCanvas, headsCanvas, shirtColors, skinColors } from "@/lib/enemies/graphics"
import { enemies, EnemyStats } from "@/lib/enemies/stats"
import Game from "@/lib/game"
import { sfx } from "@/lib/sfx"
import { dist, normalizeToRange, pointAt, pointRect } from "@/lib/utils"
import { GunWeapon, LongWeaponKey, MeeleeWeaponKey, ShortWeaponKey } from "@/lib/weapons"
import { zzfx } from "@/lib/zzfx"
import { Entity } from "./entity"
import { Player } from "./player"

const firstNames = ["Carlos", "Javier", "Miguel", "Diego", "Sergio", "Alejandro", "Luis", "Antonio", "Raul", "Pablo"]

const lastNames = [
    "Gomez",
    "Lopez",
    "Martinez",
    "Sanchez",
    "Hernandez",
    "Ramirez",
    "Torres",
    "Castillo",
    "Vasquez",
    "Pérez",
]

export const enemyMap = "rhcCpRlt"

export class Enemy extends Entity {
    type: number
    canSeePlayer = false
    baseLineToPlayer = false
    canShootPlayer = false
    hasSeenPlayer = false
    player: Player | null = null
    hasSurrendered = false
    stats: EnemyStats
    dyingFrame = 0
    headLeftImage: HTMLCanvasElement
    headRightImage: HTMLCanvasElement
    bodyImage: HTMLCanvasElement
    skinColor: string
    skinColorDarker: string
    weaponTaken = false
    isHovered = false
    hoverDelay = 25
    name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`

    constructor(type: string, x: number, y: number) {
        super(x, y)

        const stats = enemies[enemyMap.indexOf(type)]

        this.type = enemyMap.indexOf(type)
        this.health = this.maxHealth = { ...stats.health }
        this.weapon = stats.weapon[Math.floor(Math.random() * stats.weapon.length)]
        this.speed = stats.speed
        this.stats = stats

        const skinColorIndex = Math.floor(Math.random() * skinColors.length)
        const shirtColorIndex = Math.floor(Math.random() * shirtColors.length)

        this.skinColor = skinColors[skinColorIndex]
        this.skinColorDarker = skinColors?.[skinColorIndex + 1] || this.skinColor

        const hairStyle = Math.floor(Math.random() * 2) * 4
        const headLeft = Math.floor(Math.random() * 3)
        const headRight = Math.floor(Math.random() * 3)
        const shirt = Math.floor(Math.random() * 12)

        this.headLeftImage = document.createElement("canvas")
        this.headRightImage = document.createElement("canvas")
        this.bodyImage = document.createElement("canvas")

        this.headLeftImage.width =
            this.headLeftImage.height =
            this.headRightImage.width =
            this.headRightImage.height =
                15 * canvas.dpr
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

    checkHealth() {
        if (this.health[1] <= 0) {
            if (this.health[1] < -10) {
                this.dead = true
            } else {
                this.hasSurrendered = true
            }
        }
        if (this.health[0] <= 0) this.dead = true
        if (this.health[2] <= 0) {
            this.hasSurrendered = true
        }
        if (this.hasSurrendered) this.h = 60
        if (this.dead) {
            this.h = 80
            this.hasSurrendered = false
        }
    }

    run() {
        this.checkHealth()
        this.animateVars()

        if (!this.dead)
            this.handleBulletCollisions(bullet => {
                if (bullet.entity instanceof Player) {
                    Game.hits++
                }

                this.checkHealth()

                if (!this.hasSurrendered && !this.dead) {
                    const minRot = normalizeToRange(bullet.r)
                    this.dir = minRot > -Math.PI / 2 && minRot < Math.PI / 2 ? -1 : 1
                }
            })

        if (
            this.dead
                ? pointRect(
                      Game.mouseX - Game.cameraX,
                      Game.mouseY - Game.cameraY,
                      this.x - this.h / 4,
                      this.y + this.h - 25,
                      this.h,
                      25,
                  )
                : // Hitbox if dead
                  pointRect(Game.mouseX - Game.cameraX, Game.mouseY - Game.cameraY, this.x, this.y, this.w, this.h) &&
                  !Game.pressed
        ) {
            this.hoverDelay--

            if (this.hoverDelay <= 0) {
                this.isHovered = true
            }
        } else {
            this.hoverDelay = 25
            this.isHovered = false
        }

        const player = this.player || (Game.entities.find(e => e instanceof Player) as Player)

        if (player && !this.player) this.player = player

        if (this.hasSurrendered || this.dead) {
            if (dist(this.centerX, this.centerY, player.centerX, player.centerY) < 35 && !this.weaponTaken) {
                if (player.arsenal[2][0] != this.weapon) {
                    let text = ""

                    if (this.wp.type == 0 && this.wp.isPistol) {
                        if (player.arsenal[1][0] != this.weapon) text = "[E] take weapon"
                        else text = "[E] take ammo"
                    } else if (player.arsenal[0][0] != this.weapon) text = "[E] take weapon"
                    else if (player.arsenal[0][0] == this.weapon) text = "[E] take ammo"

                    canvas
                        .fillStyle(colors.white)
                        .align("center")
                        .font()
                        .text(text, this.centerX, this.y + this.h - 105)

                    if (player.arsenal[1][0] != this.weapon && this.wp.type == 0 && this.wp.isPistol) {
                        canvas.text("[R] take ammo", this.centerX, this.y + this.h - 90)
                        if (Game.keysPressedDown("r")) {
                            player.arsenal[1][1] += (this.wp as GunWeapon).capacity
                            player.currentWeapon = 1
                            this.weaponTaken = true
                        }
                    }

                    if (Game.keysPressedDown("e")) {
                        if (this.wp.type == 0 && this.wp.isPistol) {
                            if (player.arsenal[1][0] != this.weapon) {
                                player.arsenal[1][0] = this.weapon as ShortWeaponKey
                            }
                            player.arsenal[1][1] += (this.wp as GunWeapon).capacity
                            player.currentWeapon = 1
                        } else if (this.wp.type == 0) {
                            if (player.arsenal[0][0] == this.weapon) {
                                player.arsenal[0][1] += (this.wp as GunWeapon).capacity
                            } else {
                                player.arsenal[0][0] = this.weapon as LongWeaponKey
                                player.arsenal[0][1] = (this.wp as GunWeapon).capacity
                            }
                            player.currentWeapon = 0
                        } else {
                            player.arsenal[2][0] = this.weapon as MeeleeWeaponKey
                            player.currentWeapon = 2
                        }
                        this.weaponTaken = true
                    }
                }
            }
            if (this.hasSurrendered) {
                this.xVel = this.movingDir = this.movingDirTo = 0
                return
            }

            this.xVel = this.movingDir = this.movingDirTo = 0
            this.dyingFrame += this.dyingFrame.tween(1, 10)
            this.baseRotation = (Math.PI / 2) * this.dir * this.dyingFrame
            return
        }

        // Determine if a line can be drawn from the enemy's facing direction to the player
        this.canSeePlayer =
            (this.dir == 1 && player.centerX > this.centerX) || (this.dir == -1 && player.centerX < this.centerX)

        // Determine if a line from the base of the enemy to the player can be drawn
        // Used for deciding whether to jump or not
        this.baseLineToPlayer = true

        // Determine if a line can be drawn from the gun to the player's center
        const [gx, gy] = this.gunTip()
        const playerDist = player.dist(gx, gy)
        const [x2, y2] = pointAt(gx, gy, this.weaponRotationTo, playerDist)
        this.canShootPlayer =
            this.wp.type == 1
                ? false
                : pointRect(x2, y2, player.x, player.y, player.w, player.h) &&
                  playerDist < this.wp.lifetime * this.wp.bulletSpeed

        for (const block of Game.blocks) {
            if (block.lineCollision(this.centerX, this.y + 10, player.centerX, player.y + 10).colliding) {
                this.canSeePlayer = false
            }

            // -1 to account for block collision
            if (
                block.lineCollision(this.centerX, this.y + this.h - 1, player.centerX, player.y + player.h - 1)
                    .colliding
            ) {
                this.baseLineToPlayer = false
            }

            if (this.wp.type == 1) continue

            if (
                block.lineCollision(gx, gy, x2, y2).colliding ||
                block.lineCollision(this.centerX, this.centerY, gx, gy).colliding
            ) {
                this.canShootPlayer = false
            }
        }

        // 4x slower fire rate cooldown for semiauto weapons
        if (this.fireCooldown > 0) {
            this.fireCooldown -= this.wp.type == 1 ? 0.5 : this.wp.isSemi ? 0.5 : 1
        }

        // If the enemy can see the player
        if (this.canSeePlayer) {
            if (!this.hasSeenPlayer) this.hasSeenPlayer = true

            if (this.wp.type == 1) {
                this.weaponRotation = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX)

                const [x, y] = pointAt(this.centerX, this.centerY, this.weaponRotationTo, this.wp.length)
                const strikeX = Math.min(Math.max(x, player.x), player.x + player.w)
                const strikeY = Math.min(Math.max(y, player.y), player.y + player.h)
                const strikeDist = dist(x, y, strikeX, strikeY)

                if (this.fireCooldown == 0 && strikeDist < this.wp.range) {
                    const sound = (sfx[4] as Array<number | undefined>).slice()
                    sound[0] = 0.3
                    zzfx(...sound)

                    player.health[1] -= this.wp.damage
                    player.knockback = (this.wp.knockback / 2) * player.dir * (player.x < this.x ? 1 : -1)
                    player.timeSinceDamaged = 0
                    setTimeout(() => zzfx(...sfx[11]), 250)
                    this.fireFrame = 1
                    this.fireCooldown = this.wp.reload
                    this.notifyClosest(this.x)
                }
            } else {
                this.weaponRotation = Math.atan2(player.centerY - gy, player.centerX - gx)

                if (this.fireCooldown == 0 && this.canShootPlayer) {
                    const sound = (this.wp.sound ? sfx[this.wp.sound] : sfx[0]).slice()
                    sound[0] = 0.3
                    zzfx(...sound)
                    this.fireFrame = 1

                    this.shoot(this.weaponRotationTo)
                    this.notifyClosest(this.x)
                }
            }
        }

        // If the enemy has seen the player
        if (this.hasSeenPlayer) {
            if (player.centerX > this.centerX) {
                this.dir = 1
            } else if (player.centerX < this.centerX) {
                this.dir = -1
            }

            if (this.wp.type == 1) {
                if (Math.abs(this.centerX - player.centerX) > this.wp.range) {
                    this.movingDir = player.centerX > this.centerX ? 1 : -1
                } else {
                    this.movingDir = 0
                }
                if (!this.baseLineToPlayer && this.canJump) {
                    this.jump()
                }
            } else {
                const range = this.wp.lifetime * this.wp.bulletSpeed

                if (!this.canShootPlayer || playerDist > Math.min(range, canvas.width / 3)) {
                    this.movingDir = player.centerX > this.centerX ? 1 : -1
                } else if (this.canShootPlayer) {
                    if (playerDist < this.wp.barrelX)
                        this.movingDir = -(player.centerX > this.centerX ? 1 : -1) as -1 | 1
                    else this.movingDir = 0
                }

                if (!this.baseLineToPlayer && !this.canSeePlayer && this.canJump) {
                    this.jump()
                }
            }
        }
    }

    render() {
        const speedWeightRatio = this.wp.type || (this.speed - this.wp.weight) / this.speed

        canvas
            .push()
            .translate(this.centerX - this.dyingFrame * this.dir * 40, this.y + this.h - this.dyingFrame * 10)
            .rotate(this.baseRotation)
        // Legs
        canvas
            .strokeStyle(this.skinColor)
            .lineWidth(7.5)
            .lineCap("round")
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
            .close(0)
            .pop()
            .strokeStyle(this.skinColorDarker)
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
            .close(0)
            .pop()
            .push()
            .translate(0, -this.h)
            .scale(this.dir, 1)
            .drawImage(this.bodyImage, -15, 20, 25 / canvas.dpr, 40 / canvas.dpr)
            .drawImage(
                this.dir == 1 ? this.headRightImage : this.headLeftImage,
                -7.5 + (this.hasSurrendered ? 7.5 : 0),
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
                    ? Math.PI / 2 + (Math.PI / 6) * -this.dir
                    : this.dead
                      ? this.dyingFrame * -(Math.PI / 2)
                      : this.weaponRotationTo,
            )
            .scale(1, this.dirTo)
            .rotate(0)
        this.wp.render(this.fireFrame, this.skinColor, this.weaponTaken ? colors.transparent : colors.black)
        canvas.pop().pop()

        if (
            this.weaponTaken
                ? this.hasSurrendered
                : this.hasSurrendered &&
                  this.player &&
                  dist(this.centerX, this.centerY, this.player.centerX, this.player.centerY) > 35
        ) {
            canvas
                .fillStyle(colors.white)
                .roundRect(this.centerX - 11, this.y - 51, 7, 42, 5)
                .roundRect(this.centerX - 13.5, this.y - 56, 12, 12, 5)
                .path()
                .moveTo(this.centerX - 10, this.y - 50)
                .lineTo(this.centerX - 10, this.y - 20)
                .lineTo(this.centerX + 25, this.y - 35)
                .close(2)
                .fillStyle(colors.black)
                .roundRect(this.centerX - 10, this.y - 50, 5, 40, 5)
                .roundRect(this.centerX - 12.5, this.y - 55, 10, 10, 5)
        }
    }
}
