import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { lineRectCollision } from "@/lib/utils"
import { Entity } from "./entity"
import { Player } from "./player"
import { zzfx } from "@/lib/zzfx"
import { sfx } from "@/lib/sfx"
import { Particle } from "./particle"

type BlockType = "a"

export const blockMap: Record<string, BlockType> = {
    a: "a",
}

export class Block {
    x: number
    y: number
    type: BlockType

    constructor(type: keyof typeof blockMap, x: number, y: number) {
        this.type = blockMap[type]
        this.x = x
        this.y = y
    }

    render() {
        canvas.fillStyle("grey").fillRect(this.x, this.y, Game.blockSize, Game.blockSize)
    }

    run() {
        for (const bullet of Game.bullets) {
            const [x, y, x2, y2] = bullet.hitPoints()

            if (lineRectCollision(x, y, x2, y2, this.x, this.y, Game.blockSize, Game.blockSize).colliding) {
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
            if (entity.isAgainstWall) entity.isAgainstWall = false
            if (this.isCollidingWith(entity)) {
                if (entity.xVel > 0) {
                    entity.x = this.x - entity.w
                    entity.xVel = 0
                    entity.isAgainstWall = true
                }

                if (entity.xVel < 0) {
                    entity.x = this.x + Game.blockSize
                    entity.xVel = 0
                    entity.isAgainstWall = true
                }
            }
        }
    }

    collideY() {
        for (const entity of Game.entities) {
            if (this.isCollidingWith(entity)) {
                if (entity.yVel > 0) {
                    entity.y = this.y - entity.h
                    entity.yVel = 0
                    if (!entity.canJump) {
                        if (entity instanceof Player) {
                            zzfx(...sfx[8])
                        }
                        entity.canJump = true
                    }
                }

                if (entity.yVel < 0) {
                    entity.y = this.y + Game.blockSize
                    entity.yVel *= -0.8
                }
            }
        }
    }

    isCollidingWith<T extends Entity>(entity: T) {
        return (
            this.x + Game.blockSize > entity.x &&
            this.x < entity.x + entity.w &&
            this.y + Game.blockSize > entity.y &&
            this.y < entity.y + entity.h
        )
    }

    lineCollision(x: number, y: number, x2: number, y2: number) {
        return lineRectCollision(x, y, x2, y2, this.x, this.y, Game.blockSize, Game.blockSize)
    }
}
