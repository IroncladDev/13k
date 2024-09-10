import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { lineRectCollision } from "@/lib/utils"
import { Entity } from "./entity"
import { Player } from "./player"
import { zzfx } from "@/lib/zzfx"
import { sfx } from "@/lib/sfx"
import { Particle } from "./particle"

export type BlockType =
    | "=" // Top-bottom wall
    | "_" // Bottom platform
    | "-" // Top platform
    | '"' // Left-right wall
    | "'" // Left platform
    | "|" // Right platform
    | "o" // Full-sided block
    | "." // Sniper shield left
    | "," // Sniper shield right
    | "<" // Left cap
    | ">" // Right cap
    | "^" // Top cap
    | "v" // Bottom cap
    | "[" // Bottom-left L
    | "]" // Bottom-right L
    | "{" // Top-left L
    | "}" // Top-right L
    | "+" // Void
    | "(" // left-facing wall
    | ")" // right-facing wall
    | "T" // top-facing wall
    | "L" // bottom-facing wall

export const blockString = `,=_-"'|o.,<>^v[]{}+()TL`

export class Block {
    x: number
    y: number
    type: BlockType
    // x, y, w, h
    hitbox: [number, number, number, number]

    constructor(type: BlockType, x: number, y: number) {
        this.type = type
        this.x = x
        this.y = y
        this.hitbox = [0, 0, 50, 50]

        if (this.type == ".") this.hitbox = [40, 25, 10, 25]
        if (this.type == ",") this.hitbox = [0, 25, 10, 25]
        if (this.type == "-" || this.type == "T") this.hitbox = [0, 0, 50, 10]
        if (this.type == "_" || this.type == "L") this.hitbox = [0, 40, 50, 10]
        if (this.type == "'" || this.type == "(") this.hitbox = [0, 0, 10, 50]
        if (this.type == "|" || this.type == ")") this.hitbox = [40, 0, 10, 50]
    }

    render() {
        const [x, y, w, h] = this.hitbox

        canvas.push().translate(this.x, this.y)
        if (this.type == "T" || this.type == "L" || this.type == "(" || this.type == ")" || this.type == "+") {
            canvas.fillStyle("#112").fillRect(0, 0, 50, 50)
        }
        if (
            this.type == "." ||
            this.type == "," ||
            this.type == "'" ||
            this.type == "|" ||
            this.type == "_" ||
            this.type == "-" ||
            this.type == "(" ||
            this.type == ")" ||
            this.type == "T" ||
            this.type == "L"
        ) {
            canvas.fillStyle("#334").fillRect(x, y, w, h)
        } else if (this.type != "+") {
            canvas.fillStyle("#334").fillRect(0, 0, 50, 50)
            if (this.type == "<") canvas.fillStyle("#112").fillRect(10, 10, 40, 30)
            if (this.type == ">") canvas.fillStyle("#112").fillRect(0, 10, 40, 30)
            if (this.type == "^") canvas.fillStyle("#112").fillRect(10, 10, 30, 40)
            if (this.type == "v") canvas.fillStyle("#112").fillRect(10, 0, 30, 40)
            if (this.type == "=") canvas.fillStyle("#112").fillRect(0, 10, 50, 30)
            if (this.type == '"') canvas.fillStyle("#112").fillRect(10, 0, 30, 50)
            if (this.type == "o") canvas.fillStyle("#112").fillRect(10, 10, 30, 30)
            if (this.type == "[") canvas.fillStyle("#112").fillRect(10, 0, 40, 40)
            if (this.type == "]") canvas.fillStyle("#112").fillRect(0, 0, 40, 40)
            if (this.type == "{") canvas.fillStyle("#112").fillRect(10, 10, 40, 40)
            if (this.type == "}") canvas.fillStyle("#112").fillRect(0, 10, 40, 40)
        }

        canvas.fillStyle("#334")

        canvas.pop()
    }

    run() {
        for (const bullet of Game.bullets) {
            if (bullet.entity instanceof Player) {
                const [gx, gy] = bullet.entity.gunTip()
                const { colliding } = this.lineCollision(bullet.entity.centerX, bullet.entity.centerY, gx, gy)

                if (colliding) {
                    bullet.dead = true
                    return
                }
            }

            const [x, y, x2, y2] = bullet.hitPoints()

            if (this.lineCollision(x, y, x2, y2).colliding) {
                for (let i = 2 + Math.floor(Math.random() * 10); i--; ) {
                    Game.particles.push(
                        new Particle({
                            type: 2,
                            x,
                            y,
                            r: bullet.r + Math.PI + (Math.random() * (Math.PI / 12) - Math.PI / 24),
                            lifetime: Math.random() * 10,
                        }),
                    )
                }
                bullet.dead = true
            }
        }
    }

    collideX() {
        for (const entity of Game.entities) {
            if (this.isCollidingWith(entity)) {
                if (entity.xVel > 0) {
                    entity.x = this.x - entity.w + this.hitbox[0]
                    entity.xVel = 0
                }

                if (entity.xVel < 0) {
                    entity.x = this.x + this.hitbox[0] + this.hitbox[2]
                    entity.xVel = 0
                }
            }
        }
    }

    collideY() {
        for (const entity of Game.entities) {
            if (this.isCollidingWith(entity)) {
                if (entity.yVel > 0) {
                    entity.y = this.y - entity.h + this.hitbox[1]
                    entity.yVel = 0
                    if (!entity.canJump) {
                        if (entity instanceof Player) {
                            zzfx(...sfx[8])
                        }
                        entity.canJump = true
                    }
                }

                if (entity.yVel < 0) {
                    entity.y = this.y + this.hitbox[1] + this.hitbox[3]
                    entity.yVel *= -0.8
                }
            }
        }
    }

    isCollidingWith<T extends Entity>(entity: T) {
        const [x, y, w, h] = this.hitbox

        return (
            this.x + x + w > entity.x &&
            this.x + x < entity.x + entity.w &&
            this.y + y + h > entity.y &&
            this.y + y < entity.y + entity.h
        )
    }

    lineCollision(x: number, y: number, x2: number, y2: number) {
        return lineRectCollision(
            x,
            y,
            x2,
            y2,
            this.x + this.hitbox[0],
            this.y + this.hitbox[1],
            this.hitbox[2],
            this.hitbox[3],
        )
    }
}
