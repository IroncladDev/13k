import Game from "@/lib/game"
import { Block, blockString, BlockType } from "@/objects/block"
import { Enemy, enemyMap } from "@/objects/enemy"
import { Player } from "@/objects/player"

interface Level {
    map: Array<string>
    mainWeaponAmmo: number
    sideWeaponAmmo: number
    position: [number, number]
    background: [number, number]
    name: string
    completed: boolean
    stars: number
    timeStarted: number
    timeEnded: number
}

// Star 1 = Take all enemies as prisoners
// Star 2 = Mission completed in under 2 minutes

export const levels: Array<Level> = [
    {
        name: "Tutorial",
        map: ["^@ 12^", `" 13"`, `" 13"`, `" 13"`, `" 13"`, `" 13"`, "[=13]"],
        mainWeaponAmmo: 0,
        sideWeaponAmmo: 0,
        position: [710, 280],
        background: [0, 1],
        completed: true,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "San Miguel",
        map: [
            ` @      r`,
            `^     {===>   ^`,
            `"    {)       "`,
            `"   {+)       "`,
            `[===LL]       "`,
            `        <=====]`,
            `^r           r^`,
            `"             "`,
            `"             "`,
            `[=============]`,
        ],
        mainWeaponAmmo: 30,
        sideWeaponAmmo: 17,
        position: [680, 340],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "La Unión",
        map: [
            `{==>`,
            `"@`,
            `"`,
            `"`,
            `[==>`,
            `     --`,
            `        --`,
            `           -`,
            `              ^    r     ^`,
            `             -"          "`,
            `            ^ "-------   "`,
            `          {=L=]          "`,
            `          "              "`,
            `          "       r      "`,
            `          "   -----------"`,
            `          "             h"`,
            `          "              "`,
            `          "              "`,
            `          ----------------`,
        ],
        mainWeaponAmmo: 50,
        sideWeaponAmmo: 17,
        position: [810, 380],
        background: [1, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Usulután",
        map: [
            `h       ^r`,
            `        "`,
            `---^-------------`,
            `   "`,
            `   "     ,c       ^`,
            `@  v     <===>   {)`,
            `                {+)`,
            `               {++)`,
            `-------------------`,
        ],
        mainWeaponAmmo: 50,
        sideWeaponAmmo: 60,
        position: [600, 410],
        background: [1, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Zacatecoluca",
        map: [
            `      h`,
            `      --`,
            `         --`,
            `^  c              `,
            `"   .       ^     `,
            `-----       v_    `,
            `          ^       `,
            `          "     -^`,
            ` @      ^ " ^    "`,
            ` <======L=L=L====]`,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
        ],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [500, 370],
        background: [2, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Cojutepeque",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [480, 300],
        background: [2, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Llobasco",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [500, 260],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Santa Ana",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [320, 220],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Chalchuapa",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [270, 230],
        background: [1, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Sonsonate",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [250, 310],
        background: [1, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Acajutla",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [230, 350],
        background: [2, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Izalco",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [290, 290],
        background: [2, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Nueva San Salvador",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [350, 320],
        background: [0, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "San Salvador",
        map: ["@ 10r", "<=10>"],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 60,
        position: [390, 300],
        background: [0, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
]

export const createLevel = () => {
    const level = levels[Game.level]

    Game.entities = []
    Game.blocks = []
    Game.bullets = []
    Game.particles = []
    Game.shotsFired = 0
    Game.tutorialStep = 0
    Game.hits = 0
    Game.frameRate = 60

    levels[Game.level].timeStarted = Date.now()

    let player: Player

    for (let i = 0; i < level.map.length; i++) {
        const row = level.map[i]
        const chunks = row.match(/@|(([^0-9]|\\s)[0-9]*)/g)
        if (!chunks) continue

        let x = 0
        for (let j = 0; j < chunks.length; j++) {
            const chunk = chunks[j]
            const blockType: string = chunk[0]
            const repeat = Number(chunk.slice(1) || 1)

            if (blockType == "@") {
                player = new Player(x * 50, i * 50)
            } else if (enemyMap.includes(blockType)) {
                for (let q = 0; q < repeat; q++) {
                    Game.entities.push(new Enemy(enemyMap[enemyMap.indexOf(blockType)], (q + x) * 50, i * 50))
                }
            } else if (blockString.includes(blockType)) {
                for (let q = 0; q < repeat; q++) {
                    Game.blocks.push(new Block(blockType as BlockType, (q + x) * 50, i * 50))
                }
            }

            x += repeat
        }
    }

    Game.entities.push(player!)
}

// TODO: remove
createLevel()
