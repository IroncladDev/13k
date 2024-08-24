import { WeaponKey, weapons } from "@/lib/weapons"

export abstract class Entity {
    x: number
    y: number
    xVel: number = 0
    yVel: number = 0
    speed: number = 5
    w: number = 40
    h: number = 80
    xAcc: number = 0.5
    baseRotation: number = 0
    rotateTo: number = 0
    baseScaleTo: number = 1
    movingDir: -1 | 0 | 1 = 0
    movingDirTo: number = 0
    recoilRotation: number = 0
    fireFrame: number = 0
    canJump: boolean = false
    health: number
    maxHealth: number
    jumpForce: number = 12
    dir: -1 | 1 = 1
    weapon: WeaponKey = "ak47"
    fireCooldown: number = 0
    dead: boolean = false

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.health = 10
        this.maxHealth = 10
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

    abstract moveX(): void
    abstract moveY(): void
    abstract render(): void
    abstract run(): void
}
