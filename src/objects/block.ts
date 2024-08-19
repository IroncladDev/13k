import Game from "@/game"
import { canvas } from "@/graphics/index"
import { rectCollision } from "@/utils/index"
import { Entity } from "./entity"
import { player } from "./player"

export type BlockType = "0"

export class Block {
    x: number
    y: number
    type: BlockType

    constructor(type: BlockType, x: number, y: number) {
        this.type = type
        this.x = x
        this.y = y
    }

    render() {
        canvas
            .fillStyle("blue")
            .fillRect(this.x, this.y, Game.blockSize, Game.blockSize)
    }

    collideX() {
        if (this.isCollidingWith(player)) {
            if (player.xVel > 0) {
                player.x = this.x - player.w
            }

            if (player.xVel < 0) {
                player.x = this.x + Game.blockSize
            }
        }
    }

    collideY() {
        if (this.isCollidingWith(player)) {
            if (player.yVel > 0) {
                player.y = this.y - player.h
                player.canJump = true
            }

            if (player.yVel < 0) {
                player.y = this.y + Game.blockSize
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
}
