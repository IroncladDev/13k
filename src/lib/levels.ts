import Game from "@/lib/game"
import { Block, blockMap } from "@/objects/block"
import { Enemy, enemyMap } from "@/objects/enemy"
import { Player } from "@/objects/player"

interface Level {
    map: Array<string>
    mainWeaponAmmo: number
    sideWeaponAmmo: number
    position: [number, number]
    name: string
}

export const levels: Array<Level> = [
    {
        name: "Tutorial",
        map: ["a@ 12a", "a 13a", "a 13a", "a 13a", "a 13a", "a 13a", "a15"],
        mainWeaponAmmo: 0,
        sideWeaponAmmo: 0,
        position: [710, 280],
    },
    {
        name: "San Miguel",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [680, 340],
    },
    {
        name: "La Unión",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [810, 380],
    },
    {
        name: "Usulután",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [600, 410],
    },
    {
        name: "Zacatecoluca",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [500, 370],
    },
    {
        name: "Cojutepeque",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [480, 300],
    },
    {
        name: "Llobasco",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [500, 260],
    },
    {
        name: "Santa Ana",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [320, 220],
    },
    {
        name: "Chalchuapa",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [270, 230],
    },
    {
        name: "Sonsonate",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [250, 310],
    },
    {
        name: "Acajutla",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [230, 350],
    },
    {
        name: "Izalco",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [290, 290],
    },
    {
        name: "Nueva San Salvador",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [350, 320],
    },
    {
        name: "San Salvador",
        map: ["@ 8r", "a10"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [390, 300],
    },
]

export const createLevel = () => {
    const level = levels[Game.level]

    Game.entities = []
    Game.blocks = []
    Game.bullets = []
    Game.particles = []
    Game.keys.clear()

    let player: Player

    for (let i = 0; i < level.map.length; i++) {
        const row = level.map[i]
        const chunks = row.match(/@|(([a-zA-Z]|\s)[0-9]*)/g)
        if (!chunks) continue

        let x = 0
        for (let j = 0; j < chunks.length; j++) {
            const chunk = chunks[j]
            const blockType: string = chunk[0]
            const repeat = Number(chunk.slice(1) || 1)

            if (blockType == "@") {
                player = new Player(x * Game.blockSize, i * Game.blockSize)
            } else if (enemyMap.includes(blockType)) {
                for (let q = 0; q < repeat; q++) {
                    Game.entities.push(
                        new Enemy(enemyMap[enemyMap.indexOf(blockType)], (q + x) * Game.blockSize, i * Game.blockSize),
                    )
                }
            } else if (blockType in blockMap) {
                for (let q = 0; q < repeat; q++) {
                    Game.blocks.push(new Block(blockType, (q + x) * Game.blockSize, i * Game.blockSize))
                }
            }

            x += repeat
        }
    }

    Game.entities.push(player!)
}
