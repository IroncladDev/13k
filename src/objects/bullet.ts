import { canvas } from "@/lib/canvas/index"
import { WeaponKey } from "@/lib/weapons"

export class Bullet {
    x: number
    y: number
    type: WeaponKey
    r: number
    speed: number
    damage: number
    dead: boolean = false
    duration: number = 0
    lifetime: number = 0

    constructor({
        type,
        x,
        y,
        r,
        speed,
        damage,
        lifetime,
    }: {
        type: WeaponKey
        x: number
        y: number
        r: number
        speed: number
        damage: number
        lifetime: number
    }) {
        this.type = type
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed
        this.damage = damage
        this.lifetime = lifetime
    }

    render() {
        canvas
            .fillStyle("white")
            .push()
            .translate(this.x, this.y)
            .rotate(this.r)
            .fillRect(-10, -2, 20, 4)
            .fillRect(
                (-this.duration * this.speed) / 2,
                -1,
                (this.duration * this.speed) / 2,
                2,
            )
            .pop()
    }

    update() {
        this.x += this.speed * Math.cos(this.r)
        this.y += this.speed * Math.sin(this.r)
        this.duration++

        if (this.duration > this.lifetime) {
            this.dead = true
        }
    }
}
