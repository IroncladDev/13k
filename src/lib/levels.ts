import Game from "@/lib/game"
import { Block, blockMap } from "@/objects/block"
import { Enemy, enemyMap } from "@/objects/enemy"
import { Player } from "@/objects/player"

export interface Level {
    map: Array<string>
}

export const levels: Array<Level> = [
    {
        map: ["", " 8a", " 7@a", "a5 3a5", " 5a5", " 10a5e", " 15a"],
    },
]

export function createLevel() {
    const level = levels[Game.level]

    Game.entities = []
    Game.blocks = []
    Game.bullets = []
    Game.particles = []

    for (let i = 0; i < level.map.length; i++) {
        const row = level.map[i]
        const chunks = row.match(/@|(([a-z]|\s)[0-9]*)/g)
        if (!chunks) continue

        let x = 0
        for (let j = 0; j < chunks.length; j++) {
            const chunk = chunks[j]
            const blockType: string = chunk[0]
            const repeat = Number(chunk.slice(1) || 1)

            if (blockType === "@") {
                Game.entities.push(
                    new Player(x * Game.blockSize, i * Game.blockSize),
                )
            } else if (blockType in enemyMap) {
                for(let q = 0; q < repeat; q++) {
                    Game.entities.push(
                        new Enemy(
                            enemyMap[blockType],
                            (q + x) * Game.blockSize,
                            i * Game.blockSize,
                        ),
                    )
                }
            } else if (blockType in blockMap) {
                for (let q = 0; q < repeat; q++) {
                    Game.blocks.push(
                        new Block(
                            blockType,
                            (q + x) * Game.blockSize,
                            i * Game.blockSize,
                        ),
                    )
                }
            }

            x += repeat
        }
    }
}
