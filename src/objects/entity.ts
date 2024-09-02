import Game from "@/lib/game"
import { levels } from "@/lib/levels"
import { constrain, dist, normalizeAngle, pointFromAngle } from "@/lib/utils"
import { WeaponKey, weapons } from "@/lib/weapons"
import { Bullet } from "./bullet"
import { Enemy } from "./enemy"

export abstract class Entity {
    x: number
    y: number
    xVel = 0
    yVel = 0
    speed = 5
    w = 40
    h = 80
    xAcc = 0.5
    baseRotation = 0
    rotateTo = 0
    baseScaleTo = 1
    movingDir: -1 | 0 | 1 = 0
    movingDirTo = 0
    recoilRotation = 0
    fireFrame = 0
    canJump = false
    isAgainstWall = false
    jumpForce = 12
    dirTo = 1
    dir: -1 | 1 = 1
    weapon: WeaponKey = "spas12"
    fireCooldown = 0
    dead = false
    weaponRotation = 0
    weaponRotationTo = 0
    knockback = 0
    abstract health: {
        head: number
        body: number
        legs: number
    }
    abstract maxHealth: {
        head: number
        body: number
        legs: number
    }

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    get centerX() {
        return this.x + this.w / 2
    }

    get centerY() {
        return this.y + this.h / 2
    }

    get wp() {
        return weapons[this.weapon]
    }

    shoot(r: number) {
        if (this.wp.type === "meelee") return

        const [x, y] = pointFromAngle(this.centerX, this.centerY + this.wp.barrelY, r, this.wp.barrelX)

        Game.bullets.push(
            new Bullet({
                type: this.weapon,
                x,
                y,
                r,
                speed: this.wp.bulletSpeed,
                damage: this.wp.damage,
                lifetime: this.wp.lifetime,
                entity: this,
            }),
        )

        if (this.movingDir !== 0) this.xVel += Math.cos(r) * -this.wp.recoilX
        this.recoilRotation += (Math.PI / 180) * this.wp.recoilY
        this.weaponRotationTo -= this.recoilRotation * this.dir
        this.fireCooldown = this.wp.reload
    }

    moveX() {
        if (this.movingDir === 1) {
            this.xVel += this.xAcc
            this.rotateTo += this.rotateTo.tween(Math.PI / 32, 5)
        } else if (this.movingDir === -1) {
            this.xVel -= this.xAcc
            this.rotateTo += this.rotateTo.tween(-Math.PI / 32, 5)
        } else {
            this.rotateTo += this.rotateTo.tween(0, 5)
        }

        const speedCap =
            (this.speed - (this.wp.type === "meelee" ? 0 : this.wp.weight)) / (this.movingDir !== this.dir ? 2 : 1)

        this.xVel += this.xVel.tween(0, 10)
        this.xVel = constrain(this.xVel, -speedCap, speedCap)

        this.x += this.xVel - this.knockback * this.dir
    }

    moveY() {
        if (this.y > levels[Game.level].map.length * Game.blockSize + 500) this.dead = true

        if (this.yVel + Game.gravity < Game.maxVelocity) {
            this.yVel += Game.gravity
        }

        this.yVel = constrain(this.yVel, -this.jumpForce, Game.maxVelocity)
        this.y += this.yVel
    }

    animateVars() {
        this.baseRotation += this.baseRotation.tween(this.rotateTo, 5)
        this.baseScaleTo += this.baseScaleTo.tween(this.dir, 5)
        this.movingDirTo += this.movingDirTo.tween(this.movingDir, 5)
        this.fireFrame += this.fireFrame.tween(0, this.wp.frameDelay || 1)
        this.recoilRotation += this.recoilRotation.tween(0, 10)
        this.dirTo += this.dirTo.tween(this.dir, 5)
        this.weaponRotationTo += this.weaponRotationTo.tween(
            normalizeAngle(this.weaponRotation, this.weaponRotationTo),
            5,
        )
        this.knockback += this.knockback.tween(0, 5)
    }

    handleBulletCollisions(onCollide?: (bullet: Bullet) => void) {
        for (const bullet of Game.bullets) {
            if (bullet.entity === this) continue

            const headCollision = bullet.withRectCollision(
                this.x + this.w / 4 + 10 * this.movingDirTo,
                this.y,
                this.w / 2,
                20,
            )
            const bodyCollision = bullet.withRectCollision(
                this.x + this.w / 8 + 7.5 * this.movingDirTo + (this.dir === -1 ? 5 : 0),
                this.y + 20,
                25,
                40,
            )
            const legsCollision = bullet.withRectCollision(
                this.x + this.w / 8 + 7.5 * this.movingDirTo + (this.dir === -1 ? 5 : 0),
                this.y + 60,
                25,
                20,
            )

            if (headCollision.colliding || bodyCollision.colliding || legsCollision.colliding) {
                if (headCollision.colliding) {
                    this.health.head -= bullet.damage
                    this.knockback = bullet.damage * 2
                    this.rotateTo += bullet.damage * 10 * (Math.PI / 180) * -this.dir
                    onCollide?.(bullet)
                }

                if (bodyCollision.colliding) {
                    this.health.body -= bullet.damage
                    this.knockback = bullet.damage
                    onCollide?.(bullet)
                }

                if (legsCollision.colliding) {
                    this.health.legs -= bullet.damage
                    this.knockback = bullet.damage
                    this.rotateTo += bullet.damage * 5 * (Math.PI / 180) * this.dir
                    onCollide?.(bullet)
                }

                bullet.dead = true
            }
        }
    }

    notifyClosest(x: number) {
        setTimeout(() => {
            const currentThis = Game.entities[Game.entities.indexOf(this)]

            if (!currentThis) return

            const closestEnemy = Game.entities
                .filter(
                    e =>
                        !("hasFired" in e) &&
                        e !== currentThis &&
                        !(e as Enemy).hasSurrendered &&
                        !(e as Enemy).dying &&
                        !(e as Enemy).hasSeenPlayer,
                )
                .sort(
                    (a, b) =>
                        a.dist(currentThis.centerX, currentThis.centerY) -
                        b.dist(currentThis.centerX, currentThis.centerY),
                )[0]

            if (closestEnemy) {
                closestEnemy.dir = x < closestEnemy.centerX ? -1 : 1
            }
        }, 500)
    }

    jump() {
        this.yVel = -(this.jumpForce - (this.wp.type === "meelee" ? 0 : this.wp.weight))
        this.canJump = false
    }

    dist(x: number, y: number) {
        return dist(this.centerX, this.centerY, x, y)
    }

    gunTip(): [number, number] {
        return this.wp.type === "meelee"
            ? [this.centerX, this.centerY]
            : pointFromAngle(this.centerX, this.centerY + this.wp.barrelY, this.weaponRotationTo, this.wp.barrelX)
    }

    abstract render(): void
    abstract run(): void
}
