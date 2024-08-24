import { canvas } from "./canvas/index"
import { sfx } from "./sfx"
import { constrain } from "./utils"

export type WeaponType = "long" | "rifle" | "smg" | "pistol" | "meelee"

export interface Weapon {
    name: string
    type: WeaponType
    damage: number
    recoilY: number
    recoilX: number
    lifetime: number
    reload: number
    barrelX: number
    barrelY: number
    bulletSpeed: number
    weight: number
    fireMode: "semi" | "auto"
    frameDelay: number
    sound?: keyof typeof sfx

    draw(frame: number, armColor?: string): void
}

export const weapons: Record<string, Weapon> = {
    ["ar15"]: {
        name: "AR-15",
        type: "long",
        reload: 6,
        recoilX: 1,
        recoilY: 3,
        lifetime: 50,
        damage: 10,
        bulletSpeed: 30,
        barrelX: 70,
        barrelY: -2.5,
        weight: 2,
        fireMode: "auto",
        sound: "shoot2",
        frameDelay: 1,

        draw(_: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .beginPath()
                .roundRect(5, 2.5, 15, 15, [2, 0, 10, 2])
                .roundRect(5, 2.5, 40, 5, 2)
                .roundRect(25, 2.5, 20, 10, 2)
                .roundRect(25, 2.5, 5, 20, 2)
                .roundRect(35, 2.5, 10, 25, [0, 2, 2, 5])
                .roundRect(40, 5, 42.5, 5, 2)
                .roundRect(47.5, 2.5, 20, 10, 2)
                .roundRect(72.5, 0, 7.5, 7.5, [2, 5, 0, 0])
                .roundRect(25, 0, 20, 10, [2, 2, 0, 0])
                .fill()
                .close()
                // Arm in front
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["1911"]: {
        name: "1911",
        type: "pistol",
        reload: 5,
        recoilX: 0,
        recoilY: 6,
        lifetime: 40,
        damage: 4,
        bulletSpeed: 30,
        barrelX: 50,
        barrelY: -15,
        weight: 0,
        fireMode: "semi",
        frameDelay: 1,

        draw(frame: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .push()
                .translate(40, 2.5)
                .rotate(Math.PI / 12)
                .roundFillRect(0, 0, 7.5, 20, 2)
                .pop()
                .path()
                .beginPath()
                .roundRect(35 - frame * 15, 0, 30, 7.5, [5, 3, 2, 2])
                .roundRect(32.5, 5, 10, 2, 2)
                .roundRect(40, 2, 25, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, [2, 2, 5, 2])
                .fill()
                .close()
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["glock"]: {
        name: "Full-auto Glock",
        type: "pistol",
        reload: 3,
        recoilX: 0,
        recoilY: 5,
        lifetime: 30,
        damage: 2,
        bulletSpeed: 20,
        barrelX: 50,
        barrelY: -15,
        weight: 0,
        fireMode: "auto",
        frameDelay: 3,

        draw(frame: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .push()
                .translate(40, 2.5)
                .rotate(Math.PI / 12)
                .roundFillRect(0, 0, 7.5, 20, 2)
                .roundFillRect(1, 0, 5, 40, 2)
                .roundFillRect(1, 35, 6, 5, 2)
                .pop()
                .path()
                .beginPath()
                .roundRect(35 - frame * 15, 0, 30, 7.5, 2)
                .roundRect(35, 1, 30, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, 2)
                .fill()
                .close()
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["ak47"]: {
        name: "AK-47",
        type: "rifle",
        reload: 9,
        recoilX: 1,
        recoilY: 5,
        lifetime: 30,
        damage: 15,
        bulletSpeed: 25,
        barrelX: 80,
        barrelY: -5,
        weight: 2.5,
        fireMode: "auto",
        sound: "shoot2",
        frameDelay: 1,

        draw(_: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .beginPath()
                .roundRect(5, 2.5, 5, 15, [2, 0, 10, 2])
                .roundRect(5, 7.5, 40, 5, 2)
                .roundRect(25, 2.5, 40, 10, 5)
                .roundRect(25, 7.5, 5, 15, 2)
                .roundRect(30, 10, 10, 5, 2)
                // .roundRect(40, 10, 10, 20, [0, 2, 2, 5])
                .roundRect(40, 5, 50, 5, 2)
                .roundRect(80, 0, 5, 10, 2)
                .roundRect(75, 5, 10, 6, 2)
                .fill()
                .close()
                // Magazine
                .strokeStyle("black")
                .lineWidth(10)
                .lineCap("square")
                .path()
                .beginPath()
                .arc(65, 10, 20, Math.PI / 1.5, Math.PI)
                .stroke()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["mp5"]: {
        name: "MP5",
        type: "smg",
        reload: 3,
        recoilX: 0,
        recoilY: 5,
        lifetime: 20,
        damage: 5,
        bulletSpeed: 20,
        barrelX: 50,
        barrelY: -10,
        weight: 1,
        fireMode: "auto",
        frameDelay: 1,

        draw(_: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .beginPath()
                .roundRect(10, 2.5, 5, 10, [2, 0, 10, 2])
                .roundRect(10, 2.5, 30, 5, 2)
                .roundRect(20, 0, 20, 8, [5, 2, 2, 2])
                .roundRect(20, 0, 40, 7.5, [5, 2, 2, 2])
                .roundRect(55, 3, 12.5, 4, 2)
                .roundRect(56, -4, 3, 10, 2)
                .roundRect(22.5, 7.5, 15, 5, 2)
                .roundRect(27.5, 10, 7.5, 5, 5)
                .fill()
                .close()
                .push()
                .translate(25, 10)
                .rotate(Math.PI / 12)
                .path()
                .beginPath()
                .roundRect(0, 0, 5, 10, 2)
                .fill()
                .close()
                .pop()
                .push()
                .translate(35, 5)
                .rotate(-Math.PI / 16)
                .path()
                .beginPath()
                .roundRect(0, 0, 20, 7.5, 2)
                .fill()
                .close()
                .pop()
                // Magazine
                .strokeStyle("black")
                .lineWidth(5)
                .lineCap("square")
                .path()
                .beginPath()
                .arc(62.5, 10, 20, Math.PI / 1.5, Math.PI)
                .stroke()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["uzi"]: {
        name: "Uzi",
        type: "smg",
        reload: 2,
        recoilX: 0.1,
        recoilY: 3,
        lifetime: 20,
        damage: 2,
        bulletSpeed: 20,
        barrelX: 50,
        barrelY: -10,
        weight: 0.5,
        fireMode: "auto",
        frameDelay: 1,

        draw(_: number, armColor: string = "rgb(35, 80, 10)") {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.7, 1)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .beginPath()
                .roundRect(5, 2.5, 2.5, 10, 2)
                .roundRect(5, 2.5, 25, 2.5, 2)
                .roundRect(25, 0, 30, 10, 2)
                .roundRect(27.5, 5, 6, 15, 2)
                .roundRect(28, 10, 4, 25, 2)
                .roundRect(32.5, 10, 7.5, 5, [0, 0, 5, 2])
                .roundRect(50, 2.5, 10, 4, 2)
                .roundRect(57.5, 1.5, 20, 6, 2)
                .roundRect(45, 10, 5, 10, 2)
                .fill()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .beginPath()
                .arc(17.5, 5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["m24"]: {
        name: "M24 SWS",
        type: "long",
        reload: 75,
        recoilX: 5,
        recoilY: 10,
        lifetime: 100,
        damage: 20,
        bulletSpeed: 50,
        barrelX: 100,
        barrelY: -10,
        weight: 3,
        fireMode: "semi",
        frameDelay: 15,
        sound: "shoot3",

        draw(frame: number, armColor: string = "rgb(35, 80, 10)") {
            let frameBounce = (Math.sin((constrain(frame, 0, 0.5) * 2) * Math.PI) + 1) / 2

            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.8, 0.8)
                .path()
                .beginPath()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .beginPath()
                .roundRect(5, 2.5, 15, 12.5, [2, 2, 5, 2])
                .roundRect(10, 2.5, 15, 10, [2, 2, 5, 2])
                .roundRect(20, 2.5, 15, 7.5, [2, 2, 5, 2])
                .roundRect(30, 5, 7.5, 7.5, [2, 2, 5, 5])
                .roundRect(30, 0, 40, 10, [5, 2, 5, 2])
                .roundRect(60, 0, 30, 7.5, [2, 2, 5, 2])
                .roundRect(80, 0, 50, 5, 2)
                .roundRect(40, -10, 5, 7.5, 2)
                .roundRect(40, -9, 25, 5, 2)
                .roundRect(60, -10, 5, 7.5, 2)
                .roundRect(47.5, -5, 2.5, 10, 2)
                .roundRect(55, -5, 2.5, 10, 2)
                .roundRect(35 - frameBounce * 20, 0, 25, 5, 2)
                .fill()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .translate(25 - (frameBounce * 15), 5)
                .scale(1, 1)
                .path()
                .beginPath()
                .arc(0, 0, 20 - (frameBounce * 12.5), Math.PI / 4 - (Math.PI / 3 * frameBounce), Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
}

export type WeaponKey = keyof typeof weapons
