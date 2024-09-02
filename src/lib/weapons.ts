import { canvas } from "./canvas/index"
import { sfx } from "./sfx"
import { constrain } from "./utils"

type GunWeapon = {
    type: "gun"
    name: string
    reload: number
    recoilX: number
    recoilY: number
    lifetime: number
    damage: number
    bulletSpeed: number
    barrelX: number
    barrelY: number
    weight: number
    fireMode: "semi" | "auto"
    frameDelay: number
    sound?: keyof typeof sfx

    render(frame: number, armColor?: string, armWidth?: number): void
}

type MeeleeWeapon = {
    type: "meelee"
    name: string
    reload: number
    range: number
    frameDelay: number
    damage: number
    knockback: number
    sound?: keyof typeof sfx

    render(frame: number, armColor?: string, armWidth?: number): void
}

export const weapons: Record<string, GunWeapon | MeeleeWeapon> = {
    ["dragunov"]: {
        name: "Dragunov",
        reload: 20,
        recoilX: 10,
        recoilY: 15,
        lifetime: 50,
        damage: 10,
        bulletSpeed: 70,
        barrelX: 80,
        barrelY: -5,
        weight: 3.5,
        fireMode: "semi",
        sound: "shoot3",
        frameDelay: 1,
        type: "gun",

        render(_: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .roundRect(5, 7.5, 5, 15, [2, 0, 10, 2])
                .roundRect(5, 7.5, 40, 5, 2)
                .roundRect(25, 2.5, 60, 10, 5)
                .roundRect(25, 7.5, 5, 15, 2)
                .roundRect(30, 10, 10, 5, 2)
                .roundRect(40, 5, 80, 5, 2)
                .roundRect(100, 0, 5, 10, 2)
                .roundRect(75, 5, 10, 6, 2)
                .fill()
                .close()
                // Magazine
                .strokeStyle("black")
                .lineWidth(10)
                .lineCap("square")
                .path()
                .arc(75, 10, 20, Math.PI / 1.1, Math.PI)
                .stroke()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["machete"]: {
        type: "meelee",
        name: "Machete",
        reload: 10,
        frameDelay: 5,
        range: 50,
        damage: 5,
        knockback: 20,
        sound: "whoosh1",

        render(frame, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            const frameBounce = (Math.sin(constrain(frame, 0, 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.5)
                .translate(17.5, 2.5)
                .fillStyle("black")
                .push()
                .translate(7.5, 5)
                .rotate((Math.PI * frameBounce) / 2)
                .path()
                .roundRect(0, 0, 5, 15, 2)
                .roundRect(0, 10, 7, 5, 2)
                .roundRect(0, -45, 8, 50, [2, 5, 2, 2])
                .fill()
                .close()
                .pop()
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["baton"]: {
        type: "meelee",
        name: "Machete",
        reload: 10,
        frameDelay: 5,
        range: 40,
        damage: 4,
        knockback: 30,
        sound: "whoosh1",

        render(frame, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            const frameBounce = (Math.sin(constrain(frame, 0, 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.5)
                .translate(17.5, 2.5)
                .fillStyle("black")
                .push()
                .translate(7.5, 5)
                .rotate((Math.PI * frameBounce) / 2)
                .path()
                .roundRect(5, -15, 7, 25, 2)
                .roundRect(5.5, -35, 6, 35, 2)
                .roundRect(6, -55, 5, 35, 2)
                .roundRect(5, -55, 7, 5, 2)
                .fill()
                .close()
                .pop()
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["karambit"]: {
        type: "meelee",
        name: "Karambit",
        reload: 25,
        frameDelay: 10,
        range: 35,
        damage: 5,
        knockback: 10,
        sound: "whoosh1",

        render(frame, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            const frameBounce = (Math.sin(constrain(frame, 0, 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.25)
                .translate(17.5, 2.5)
                .strokeStyle("black")
                .lineWidth(2)
                .lineCap("square")
                .push()
                .translate(12, 5 + frameBounce * 5)
                .rotate(Math.PI * frameBounce * 4)
                .path()
                .ellipse(0, 0, 3, 3, 0, 0, Math.PI * 2)
                .stroke()
                .close()
                .lineWidth(4)
                .path()
                .arc(9, 5, 10, Math.PI / 2, Math.PI)
                .stroke()
                .close()
                .pop()
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["ar15"]: {
        name: "AR-15",
        reload: 6,
        recoilX: 2,
        recoilY: 3,
        lifetime: 60,
        damage: 2,
        bulletSpeed: 75,
        barrelX: 70,
        barrelY: -4,
        weight: 2,
        fireMode: "auto",
        sound: "shoot2",
        frameDelay: 1,
        type: "gun",

        render(_: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
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
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["glock"]: {
        name: "Glock",
        reload: 5,
        recoilX: 0,
        recoilY: 7,
        lifetime: 50,
        damage: 1,
        bulletSpeed: 25,
        barrelX: 50,
        barrelY: -11,
        weight: 0,
        fireMode: "semi",
        frameDelay: 3,
        type: "gun",

        render(frame: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
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
                .roundRect(35 - frame * 15, 0, 30, 7.5, 2)
                .roundRect(35, 1, 30, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, 2)
                .fill()
                .close()
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["autoglock"]: {
        name: "Full-auto Glock",
        reload: 4,
        recoilX: 0,
        recoilY: 4,
        lifetime: 50,
        damage: 1,
        bulletSpeed: 25,
        barrelX: 50,
        barrelY: -10,
        weight: 0,
        fireMode: "auto",
        frameDelay: 3,
        type: "gun",

        render(frame: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
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
                .roundRect(35 - frame * 15, 0, 30, 7.5, 2)
                .roundRect(35, 1, 30, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, 2)
                .fill()
                .close()
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["ak47"]: {
        name: "AK-47",
        reload: 7,
        recoilX: 2,
        recoilY: 4,
        lifetime: 30,
        damage: 2.5,
        bulletSpeed: 25,
        barrelX: 80,
        barrelY: -5,
        weight: 2.5,
        fireMode: "auto",
        sound: "shoot2",
        frameDelay: 1,
        type: "gun",

        render(_: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
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
                .arc(65, 10, 20, Math.PI / 1.5, Math.PI)
                .stroke()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["mp5"]: {
        name: "MP5",
        reload: 3,
        recoilX: 1,
        recoilY: 1,
        lifetime: 40,
        damage: 1,
        bulletSpeed: 30,
        barrelX: 50,
        barrelY: -9,
        weight: 1,
        fireMode: "auto",
        frameDelay: 1,
        type: "gun",

        render(_: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
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
                .roundRect(0, 0, 5, 10, 2)
                .fill()
                .close()
                .pop()
                .push()
                .translate(35, 5)
                .rotate(-Math.PI / 16)
                .path()
                .roundRect(0, 0, 20, 7.5, 2)
                .fill()
                .close()
                .pop()
                // Magazine
                .strokeStyle("black")
                .lineWidth(5)
                .lineCap("square")
                .path()
                .arc(62.5, 10, 20, Math.PI / 1.5, Math.PI)
                .stroke()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["uzi"]: {
        name: "Uzi",
        reload: 3,
        recoilX: 1,
        recoilY: 1.5,
        lifetime: 40,
        damage: 0.75,
        bulletSpeed: 20,
        barrelX: 50,
        barrelY: -10,
        weight: 0.5,
        fireMode: "auto",
        frameDelay: 1,
        type: "gun",

        render(_: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(1.7, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
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
                .arc(17.5, 5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
        },
    },
    ["m24"]: {
        name: "M24 SWS",
        reload: 65,
        recoilX: 5,
        recoilY: 15,
        lifetime: 100,
        damage: 15,
        bulletSpeed: 85,
        barrelX: 100,
        barrelY: -10,
        weight: 2.5,
        fireMode: "semi",
        frameDelay: 15,
        sound: "shoot3",
        type: "gun",

        render(frame: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            const frameBounce = (Math.sin(constrain(frame, 0, 0.5) * 2 * Math.PI) + 1) / 2

            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(1.8, 0.8)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
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
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .translate(25 - frameBounce * 15, 5)
                .scale(1, 1)
                .path()
                .arc(0, 0, 20 - frameBounce * 12.5, Math.PI / 4 - (Math.PI / 3) * frameBounce, Math.PI)
                .stroke()
                .close()
                .pop()
        },
    },
    ["spas12"]: {
        name: "SPAS-12",
        reload: 50,
        recoilX: 5,
        recoilY: 7,
        lifetime: 100,
        damage: 0,
        bulletSpeed: 40,
        barrelX: 50,
        barrelY: -10,
        weight: 1.5,
        fireMode: "semi",
        frameDelay: 15,
        sound: "shoot4",
        type: "gun",

        render(frame: number, armColor = "rgb(35, 80, 10)", armWidth = 5) {
            const frameBounce = (Math.sin(constrain(frame, 0, 0.5) * 2 * Math.PI) + 1) / 2

            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .scale(0.7, 0.8)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .stroke()
                .close()
                .pop()
                // Gun body
                .fillStyle("black")
                .path()
                .roundRect(15, 5, 7.5, 15, 2)
                .roundRect(20, 5, 10, 7.5, 2)
                .roundRect(10, 0, 40, 10, [5, 0, 0, 5])
                .roundRect(40, 0, 40, 12, 2)
                .roundRect(70, 1, 20, 5, 2)
                .roundRect(70, 7, 20, 5, 2)
                .roundRect(70 - frameBounce * 30, 10, 30, 5, 2)
                .fill()
                .close()
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(armWidth)
                .lineCap("round")
                .push()
                .translate(25, 5)
                .path()
                .moveTo(-15, 0)
                .lineTo(5 - frameBounce * 10, 10)
                .lineTo(50 - frameBounce * 30, 5)
                .stroke()
                .close()
                .pop()
        },
    },
}

export type WeaponKey = keyof typeof weapons
