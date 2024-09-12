import Game from "@/lib/game"
import { Block, blockString, BlockType } from "@/objects/block"
import { Enemy, enemyMap } from "@/objects/enemy"
import { Player } from "@/objects/player"
import { LongWeaponKey, ShortWeaponKey } from "./weapons"

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
    longWeapon?: LongWeaponKey
    shortWeapon?: ShortWeaponKey
}

export const levels: Array<Level> = [
    {
        name: "Tutorial",
        map: ["^@ 12^", `" 13"`, `" 13"`, `" 13"`, `" 13"`, `" 13"`, `v_13v`],
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
            ` 5@`,
            ` 5--`,
            ` 8--`,
            ` 11--`,
            ` 19r 5^`,
            ` 14^ 10"`,
            ` 10_4v-7 3"`,
            ` 10" 14"`,
            ` 10" 14"`,
            ` 10" 7r 6"`,
            ` 10" 3-11"`,
            ` 10" 13h"`,
            ` 10" 14"`,
            ` 10" 14"`,
            ` 10v_14v`,
        ],
        mainWeaponAmmo: 50,
        sideWeaponAmmo: 17,
        position: [680, 340],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Usulután",
        map: [` @      r`, ` 6^-4 2^`, ` 6" 6"`, ` 4^ " 6"`, `__o_v_v 6"`, ` 8-5"`, `^r 10r"`, `" 12"`, `v_12v`],
        mainWeaponAmmo: 50,
        sideWeaponAmmo: 34,
        position: [600, 410],
        background: [1, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Zacatecoluca",
        map: [`h 7^r`, ` 8"`, `-3^-13`, ` 3"`, ` 3" 5,c 7^`, `@  v 5-5 4"`, ` 16^ "`, ` 16" "`, `-19`],
        mainWeaponAmmo: 50,
        sideWeaponAmmo: 34,
        position: [500, 370],
        background: [2, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Cojutepeque",
        map: [
            `r 15r`,
            `-4^ 4^-7`,
            ` 4" 4"`,
            ` 4" 3-"`,
            ` 4"`,
            ` 4"-`,
            ` 4" h`,
            ` 4-6`,
            ` 13--`,
            ` 4^ 3c 13`,
            ` 4" 3. 7^ 5`,
            ` 4-5 7v_ 4`,
            ` 14^`,
            ` 5@ 6^ " 6^`,
            ` 4_8v_v_6v`,
        ],
        mainWeaponAmmo: 60,
        sideWeaponAmmo: 17,
        position: [480, 300],
        background: [2, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Llobasco",
        map: [
            ` 9^`,
            ` 8@"`,
            ` 9" 8^`,
            ` 6_3v_8v`,
            ` 3^ 16p`,
            ` 3" 17.`,
            ` 3" 15^--`,
            ` 3" 3r 3^ 3h 3"`,
            ` 3"_7v_6 "`,
            ` 19"`,
            `, p 16"`,
            `-3^ 15"`,
            ` 3" 15"`,
            ` 3" 15"`,
            ` 3" 4h 3^ 3 3"`,
            ` 3v _7v_6"`,
            `^-- 16"`,
            `"p 17"`,
            `" 9^ 5rh "`,
            `v_9v_8"`,
        ],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 34,
        position: [500, 260],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Santa Ana",
        map: [
            ` 7^ 4r 5@ 5r 4^`,
            ` 7" 3, . 3, . 3, . 3"`,
            ` 7" 3-3 3-3 3-3 3"`,
            ` 7" 21"`,
            ` 7" 6c 8p 5"`,
            ` 7" 21"`,
            ` 7v _19 v`,
            `^ 35^`,
            `" 35"`,
            `"_ 4^ 4C 6C 6C 4^ 4_"`,
            `" 4p"-23"p 4"`,
            `v_5v 23v_5v`,
        ],
        mainWeaponAmmo: 120,
        sideWeaponAmmo: 34,
        position: [320, 220],
        background: [0, 1],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
    },
    {
        name: "Chalchuapa",
        map: [
            `^ 9^ 15"`,
            `" c 5c " 15"`,
            `-3^  _^-3 8R 3C  "`,
            ` 3" 3" 18"`,
            ` 3"_  " 18"`,
            ` 3" 3"-16^--`,
            ` 3"  _v p 4c 4p 4"`,
            ` 3" 4, .  , .  , . 3v`,
            ` 3"_ 3-3  -3  -3 8@`,
            ` 3"`,
            ` 3v_27`,
        ],
        mainWeaponAmmo: 30,
        sideWeaponAmmo: 120,
        position: [270, 230],
        background: [1, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
        longWeapon: 2,
        shortWeapon: 6,
    },
    {
        name: "Sonsonate",
        map: [
            `^ 3@^`,
            `" 4"`,
            `" 4"`,
            `" -3"-6^-4^`,
            `" 4" 6" 4"`,
            `" 4" 6v 4"`,
            `" 4" 11"`,
            `"  r "  R 7r"`,
            `"-3 " -5^ 3_"`,
            `" 4" 6" 4"`,
            `" 4" 6"_   "`,
            `" 4" 6" 4"`,
            `" h  " 5l" 3_"`,
            `" -10"r 3"`,
            `" 11"_ 3"`,
            `" 11" 4"`,
            `" 11v 3_"`,
            `" c  ^ 8p  "`,
            `v_4v_11v`,
        ],
        mainWeaponAmmo: 150,
        sideWeaponAmmo: 120,
        position: [250, 310],
        background: [1, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
        shortWeapon: 6,
    },
    {
        name: "Acajutla",
        map: [
            ` 3^  ^-7^ 7^-8  ^`,
            ` 3" _v 7" 7" 10"`,
            ` 3" 10" 7" c 8"`,
            ` 3"_8  " 7" _9"`,
            ` 3" 10" 7" 10"`,
            ` 3" 7rp " 7" C 5R  "`,
            ` 3"  _7<) 7" 10"`,
            ` 3" 10" 7"-8^ "`,
            ` 3"_ 9" 7" 4c 3v "`,
            ` 3"  c 7" 7" 3. 6"`,
            ` 3" 3. 6" 7"-5 5"`,
            ` 3"-4 5_" 7" 10"`,
            ` 3" 10" 7" 10"`,
            ` 3" R 8" 7" _9"`,
            ` 3" 6^ 3" 7" 10"`,
            ` 3v_6v_  " 7" 10"`,
            ` 14" 7" 10"`,
            ` 13_" 7"  C  ^  R "`,
            `@ 13" 7" 5" 4"`,
            `_14v 7v_5v_4v`,
        ],
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
        map: [
            ` 22, 4R.`,
            ` 22{T5}`,
            `@ 10, 4rrh.  (o+o+o)_`,
            ` 11{T7}  (+5)`,
            `{T5} 4(o+o+o+o)  (o+o+o)_`,
            `(o+o+o) 4(+7)  (+5) 19^`,
            `(+5) 4(o+o+o+o)  (o+o+o)_ 18"`,
            `(o+o+o) 4(+7)  (+5) 19"`,
            `(+5) 4(+7)  (+5)_ 18"`,
            `(+5) 4(+7)  (+5) 6, C 6c . "`,
            `(+5) 4(+7)  (+5)_ 5{T10} "`,
            `(+5) 4(+7)  (+5) 6(+10) "`,
            `(+5) 4(+7)  (+5)_ 5(+10) "`,
            `(+5) 4(+7)  (+5) 6(+10) "`,
            `[L5] 4[L7]  [L5]_ 5(+10) "`,
            ` 35(+10) "`,
            ` 30_5[L10] v`,
            `,R 3. 6, 3h . 4, p 4"`,
            `-31`,
        ],
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
        map: [
            `^ 7^ 4^__`,
            `"_ 3, p" 3_" 8__`,
            `" 4-4 4" 16__`,
            `"_ 10_" 23__`,
            `" 4^ 7" 32-3^`,
            `"_ 3"c . 3_" 34R"`,
            `" 4-4 4" 35"`,
            `"_ 10_" 32_3v`,
            `" 12" l 22__`,
            `"_ 4@ 5_" 2. 12__`,
            `" 4,  . 4"-4 4__`,
            `"_ 3-4 3_"`,
            `" 12"`,
            `"_ 10_"`,
            `" R 8c "`,
            `v_12v`,
        ],
        mainWeaponAmmo: 30,
        sideWeaponAmmo: 60,
        position: [350, 320],
        background: [0, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
        longWeapon: 2,
        shortWeapon: 6,
    },
    {
        name: "San Salvador",
        map: [
            `__o-9 5-3^-- 5^ 4-13^`,
            `"R 18" 7" 17"`,
            `" . 9^ 7" 7" 17"`,
            `--^ 8r" 5hh" 7"  C 14"`,
            `  " 8-9" 7"-9 8"`,
            `  " 17" 7" 17"`,
            `  "cC 5, 9" 7" 9.7c"`,
            `  "-10 6p" 5__v 8-9"`,
            `  " 15__" 5"l 18"`,
            `  " 14r C" 5" . 7, 9"`,
            `  " 8-9" 5--^-9 8"`,
            `  " 4^ 12" 7" 17"`,
            `  " R  " c 10" 7" 8p. 6p"`,
            `  "-9 8" 7" 8-9"`,
            `  " 17" 7" 17"`,
            `  " 9. 6h" 7"c 6, 9"`,
            `  " 8-9" 7"-9 8"`,
            `  " r 14@" 7" 17"`,
            `  " 7, 9" 7"Rr 7. 5C "`,
            `  -19 7-19`,
        ],
        mainWeaponAmmo: 150,
        sideWeaponAmmo: 60,
        position: [390, 300],
        background: [0, 0],
        completed: false,
        stars: 0,
        timeStarted: 0,
        timeEnded: 0,
        shortWeapon: 6,
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
