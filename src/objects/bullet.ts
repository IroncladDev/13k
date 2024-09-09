import { canvas } from "@/lib/canvas/index"
import { colors } from "@/lib/constants"
import Game from "@/lib/game"
import { lineRectCollision, pointAt } from "@/lib/utils"
import { GunWeapon, WeaponKey, weapons } from "@/lib/weapons"
import { Entity } from "./entity"

export class Bullet {
    x: number
    y: number
    // 11 = buckshot
    type: WeaponKey | 11
    r: number
    dead = false
    duration = 0
    entity: Entity

    constructor({ type, x, y, r, entity }: { type: WeaponKey | 11; x: number; y: number; r: number; entity: Entity }) {
        this.type = type
        this.x = x
        this.y = y
        this.r = r
        this.entity = entity
    }

    get wp() {
        return weapons[this.type == 11 ? 3 : this.type] as GunWeapon
    }

    render() {
        if (this.type == 3) return

        const { isPistol, bulletSpeed } = this.wp
        const w = isPistol || this.type == 11 ? 1 : 2
        const trailSpeed = this.type == 11 ? 10 : isPistol ? 3 : 2

        canvas
            .fillStyle(colors.white)
            .strokeStyle("rgb(255,230,160)")
            .lineWidth(1)
            .push()
            .translate(this.x, this.y)
            .rotate(this.r)
            .path()
            .moveTo(-5, -w)
            .lineTo(0, 0)
            .lineTo(-5, w)
            .lineTo((-this.duration * bulletSpeed) / trailSpeed, 0)
            .lineTo(-5, -w)
            .close(2)
            .pop()
    }

    update() {
        if (this.type == 3) {
            for (let i = 10; i--; ) {
                Game.bullets.push(
                    new Bullet({
                        ...this,
                        type: 11,
                        r: this.r + Math.random() * (Math.PI / 24) - Math.PI / 48,
                    }),
                )
            }
            this.dead = true
            return
        }

        this.x += this.wp.bulletSpeed * Math.cos(this.r)
        this.y += this.wp.bulletSpeed * Math.sin(this.r)
        this.duration++

        if (this.duration > this.wp.lifetime) {
            this.dead = true
        }
    }

    hitPoints(): [number, number, number, number] {
        const p1 = pointAt(this.x, this.y, this.r, this.wp.bulletSpeed / 2)
        const p2 = pointAt(this.x, this.y, this.r + Math.PI, this.wp.bulletSpeed / 2)

        return [...p1, ...p2]
    }

    withRectCollision(x: number, y: number, w: number, h: number) {
        return lineRectCollision(...this.hitPoints(), x, y, w, h)
    }
}
