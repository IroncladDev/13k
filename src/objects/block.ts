import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import {
    lineRectCollision,
    pointFromAngle,
    rectCollision,
} from "@/lib/utils"
import { Entity } from "./entity"

export type BlockType = "a"

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
        canvas
            .fillStyle("grey")
            .fillRect(this.x, this.y, Game.blockSize, Game.blockSize)
    }

    run() {
        for (let bullet of Game.bullets) {
            let [x, y] = pointFromAngle(bullet.x, bullet.y, bullet.r, 10)
            let [x2, y2] = pointFromAngle(
                bullet.x,
                bullet.y,
                bullet.r + Math.PI,
                10,
            )

            if (
                lineRectCollision(
                    x,
                    y,
                    x2,
                    y2,
                    this.x,
                    this.y,
                    Game.blockSize,
                    Game.blockSize,
                ).colliding
            ) {
                bullet.dead = true
            }
        }
    }

    collideX() {
        for (const entity of Game.entities) {
            if (this.isCollidingWith(entity)) {
                if (entity.xVel > 0) {
                    entity.x = this.x - entity.w
                }

                if (entity.xVel < 0) {
                    entity.x = this.x + Game.blockSize
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
                    entity.canJump = true
                }

                if (entity.yVel < 0) {
                    entity.y = this.y + Game.blockSize
                    entity.yVel *= -0.8
                }
            }
        }
    }

    private isCollidingWith<T extends Entity>(entity: T) {
        return rectCollision(
            entity.x,
            entity.y,
            entity.w,
            entity.h,
            this.x,
            this.y,
            Game.blockSize,
            Game.blockSize,
        )
    }

    lineCollision(x: number, y: number, x2: number, y2: number) {
        return lineRectCollision(x, y, x2, y2, this.x, this.y, Game.blockSize, Game.blockSize)
    }
}
