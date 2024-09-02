import { canvas } from "@/lib/canvas/index"
import Game from "@/lib/game"
import { lineRectCollision, pointFromAngle, random } from "@/lib/utils"
import { WeaponKey } from "@/lib/weapons"
import { Entity } from "./entity"

export class Bullet {
    x: number
    y: number
    type: WeaponKey | "buckshot"
    r: number
    speed: number
    damage: number
    dead = false
    duration = 0
    lifetime = 0
    entity: Entity

    constructor({
        type,
        x,
        y,
        r,
        speed,
        damage,
        lifetime,
        entity,
    }: {
        type: WeaponKey
        x: number
        y: number
        r: number
        speed: number
        damage: number
        lifetime: number
        entity: Entity
    }) {
        this.type = type
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed
        this.damage = damage
        this.lifetime = lifetime
        this.entity = entity
    }

    render() {
        if (this.type === "buckshot") {
            canvas.fillStyle("white").roundFillRect(this.x - 2.5, this.y - 2.5, 5, 5)
        } else if (this.type !== "spas12") {
            canvas
                .fillStyle("white")
                .push()
                .translate(this.x, this.y)
                .rotate(this.r)
                .fillRect(-10, -2, 20, 4)
                .fillRect((-this.duration * this.speed) / 2, -1, (this.duration * this.speed) / 2, 2)
                .pop()
        }
    }

    update() {
        if (this.type === "spas12") {
            for (let i = 0; i < 10; i++) {
                Game.bullets.push(
                    new Bullet({
                        ...this,
                        type: "buckshot",
                        lifetime: 20,
                        speed: 40,
                        damage: 1,
                        r: this.r + random(-Math.PI / 48, Math.PI / 48),
                    }),
                )
            }
            this.dead = true
            return
        }

        this.x += this.speed * Math.cos(this.r)
        this.y += this.speed * Math.sin(this.r)
        this.duration++

        if (this.duration > this.lifetime) {
            this.dead = true
        }
    }

    hitPoints(): [number, number, number, number] {
        const p1 = pointFromAngle(this.x, this.y, this.r, this.speed / 2)
        const p2 = pointFromAngle(this.x, this.y, this.r + Math.PI, this.speed / 2)

        return [...p1, ...p2]
    }

    withRectCollision(x: number, y: number, w: number, h: number) {
        return lineRectCollision(...this.hitPoints(), x, y, w, h)
    }
}
