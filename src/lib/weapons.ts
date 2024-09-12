import { canvas } from "./canvas/index"

export type GunWeapon = {
    /**
     * Type 0 = gun, type 1 = meelee
     */
    type: 0
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
    isSemi?: boolean
    frameDelay: number
    isPistol?: boolean
    sound?: number
    // x, y, width, height, color, delay?
    shell?:
        | [number, number, number, number, [number, number, number]]
        | [number, number, number, number, [number, number, number], number]
    capacity: number
    offset: [number, number]

    render(frame: number, armColor: string, color: string): void
}

export type MeeleeWeapon = {
    /**
     * Type 0 = gun, type 1 = meelee
     */
    type: 1
    name: string
    reload: number
    range: number
    length: number
    frameDelay: number
    damage: number
    knockback: number
    offset: [number, number]

    render(frame: number, armColor: string, color: string): void
}

export type LongWeaponKey = 0 | 1 | 2 | 3 | 4
export type ShortWeaponKey = 4 | 5 | 6
export type MeeleeWeaponKey = 7 | 8 | 9
/**
 * Weapons
 * Format is in index = weapon format
 * 0 = AR-15
 * 1 = AK-47
 * 2 = M24 SWS
 * 3 = Spas-12
 * 4 = Glock 19
 * 5 = Full auto Glock
 * 6 = Uzi
 * 7 = machete
 * 8 = Baton
 * 9 = Karambit
 */
export type WeaponKey = LongWeaponKey | ShortWeaponKey | MeeleeWeaponKey

export const weapons: Array<GunWeapon | MeeleeWeapon> = [
    {
        name: "AR-15",
        reload: 6,
        recoilX: 2,
        recoilY: 3,
        lifetime: 60,
        damage: 2,
        bulletSpeed: 60,
        barrelX: 80,
        barrelY: -4,
        weight: 2,
        sound: 1,
        frameDelay: 1,
        type: 0,
        shell: [50, 0, 10, 3, [186, 170, 104]],
        capacity: 25,
        offset: [0, 0],

        render: (_: number, armColor, color) =>
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
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
                .close(1)
                // Arm in front
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0),
    },
    {
        name: "AK-47",
        reload: 7,
        recoilX: 2,
        recoilY: 4,
        lifetime: 30,
        damage: 2.5,
        bulletSpeed: 55,
        barrelX: 80,
        barrelY: -5,
        weight: 2.5,
        sound: 1,
        frameDelay: 1,
        type: 0,
        shell: [50, -2, 10, 3, [186, 170, 104]],
        capacity: 30,
        offset: [-5, -2.5],

        render: (_: number, armColor, color) =>
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(2, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
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
                .close(1)
                // Magazine
                .strokeStyle(color)
                .lineWidth(10)
                .lineCap("square")
                .path()
                .arc(65, 10, 20, Math.PI / 1.5, Math.PI)
                .close(0)
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0),
    },
    {
        name: "M24 SWS",
        reload: 50,
        recoilX: 5,
        recoilY: 15,
        lifetime: 100,
        damage: 15,
        bulletSpeed: 70,
        barrelX: 100,
        barrelY: -10,
        weight: 2.5,
        isSemi: true,
        frameDelay: 15,
        sound: 2,
        type: 0,
        shell: [45, -2, 15, 4, [186, 170, 104]],
        capacity: 5,
        offset: [-10, 0],

        render(frame, armColor, color) {
            const frameBounce = (Math.sin(Math.min(Math.max(frame, 0), 0.5) * 2 * Math.PI) + 1) / 2

            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.8, 0.8)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
                .path()
                .roundRect(5, 2.5, 15, 12.5, [2, 2, 5, 2])
                .roundRect(10, 2.5, 15, 10, [2, 2, 5, 2])
                .roundRect(20, 2.5, 15, 7.5, [2, 2, 5, 2])
                .roundRect(30, 5, 7.5, 7.5, [2, 2, 5, 5])
                .roundRect(30, 0, 20, 10, [5, 2, 5, 2])
                .roundRect(40, 0, 30, 7.5, [2, 2, 5, 2])
                .roundRect(60, 0, 40, 5, 2)
                .roundRect(30, -10, 5, 7.5, 2)
                .roundRect(30, -9, 25, 5, 2)
                .roundRect(50, -10, 5, 7.5, 2)
                .roundRect(37.5, -5, 2.5, 10, 2)
                .roundRect(45, -5, 2.5, 10, 2)
                .roundRect(35 - frameBounce * 20, 0, 25, 5, 2)
                .close(1)
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .translate(25 - frameBounce * 15, 5)
                .scale(1, 1)
                .path()
                .arc(0, 0, 20 - frameBounce * 12.5, Math.PI / 4 - (Math.PI / 3) * frameBounce, Math.PI)
                .close(0)
                .pop()
        },
    },
    {
        name: "SPAS-12",
        reload: 50,
        recoilX: 5,
        recoilY: 7,
        lifetime: 20,
        damage: 1,
        bulletSpeed: 40,
        barrelX: 90,
        barrelY: -10,
        weight: 1.5,
        isSemi: true,
        frameDelay: 15,
        sound: 2,
        type: 0,
        shell: [45, 0, 12, 5, [145, 46, 33], 200],
        capacity: 8,
        offset: [-7.5, 0],

        render(frame, armColor, color) {
            const frameBounce = (Math.sin(Math.min(Math.max(frame, 0), 0.5) * 2 * Math.PI) + 1) / 2

            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .translate(25, 5)
                .path()
                .moveTo(5 - frameBounce * 10, 10)
                .lineTo(50 - frameBounce * 30, 5)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
                .path()
                .roundRect(15, 5, 7.5, 15, 2)
                .roundRect(20, 5, 10, 7.5, 2)
                .roundRect(10, 0, 40, 10, [5, 0, 0, 5])
                .roundRect(40, 0, 40, 12, 2)
                .roundRect(70, 1, 20, 5, 2)
                .roundRect(70, 7, 20, 5, 2)
                .roundRect(70 - frameBounce * 30, 10, 30, 5, 2)
                .close(1)
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(0.7, 0.8)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
        },
    },
    {
        name: "Glock 19",
        reload: 10,
        recoilX: 0,
        recoilY: 7,
        lifetime: 50,
        damage: 1.5,
        bulletSpeed: 35,
        barrelX: 60,
        barrelY: -11,
        weight: 1,
        isSemi: true,
        frameDelay: 3,
        type: 0,
        isPistol: true,
        shell: [50, -5, 7, 3, [186, 170, 104]],
        capacity: 17,
        offset: [2.5, 2.5],

        render: (frame, armColor, color) =>
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
                .push()
                .translate(40, 2.5)
                .rotate(Math.PI / 12)
                .roundRect(0, 0, 7.5, 20, 2)
                .pop()
                .path()
                .roundRect(35 - frame * 15, 0, 30, 7.5, 2)
                .roundRect(35, 1, 30, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, 2)
                .close(1)
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .close(0)
                .pop(),
    },
    {
        name: "Full-auto Glock",
        reload: 5,
        recoilX: 0,
        recoilY: 4,
        lifetime: 12,
        damage: 1,
        bulletSpeed: 35,
        barrelX: 60,
        barrelY: -10,
        weight: 1,
        frameDelay: 3,
        type: 0,
        isPistol: true,
        shell: [50, -5, 7, 3, [186, 170, 104]],
        capacity: 33,
        offset: [5, -7.5],

        render: (frame, armColor, color) =>
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.5, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
                .push()
                .translate(40, 2.5)
                .rotate(Math.PI / 12)
                .roundRect(0, 0, 7.5, 20, 2)
                .roundRect(1, 0, 5, 40, 2)
                .roundRect(1, 35, 6, 5, 2)
                .pop()
                .path()
                .roundRect(35 - frame * 15, 0, 30, 7.5, 2)
                .roundRect(35, 1, 30, 4, 1)
                .roundRect(42.5, 2.5, 10, 10, 2)
                .close(1)
                // Arm in front
                .push()
                .scale(1.25, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 8, Math.PI)
                .close(0)
                .pop(),
    },
    {
        name: "Uzi",
        reload: 4,
        recoilX: 1,
        recoilY: 1.5,
        lifetime: 15,
        damage: 0.75,
        bulletSpeed: 40,
        barrelX: 70,
        barrelY: -10,
        weight: 1,
        frameDelay: 1,
        type: 0,
        isPistol: true,
        shell: [40, 0, 5, 2, [186, 170, 104]],
        capacity: 50,
        offset: [10, 0],

        render: (_: number, armColor, color) =>
            canvas
                // Arm in back
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .push()
                .scale(1.7, 1)
                .path()
                .arc(17.5, 2.5, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
                // Gun body
                .fillStyle(color)
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
                .close(1)
                // Arm in front
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(17.5, 5, 15, Math.PI / 4, Math.PI)
                .close(0),
    },
    {
        type: 1,
        name: "Machete",
        reload: 10,
        frameDelay: 5,
        range: 30,
        damage: 4,
        knockback: 20,
        length: 45,
        offset: [-27.5, -20],

        render(frame, armColor, color) {
            const frameBounce = (Math.sin(Math.min(Math.max(frame, 0), 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.5)
                .translate(17.5, 2.5)
                .fillStyle(color)
                .push()
                .translate(7.5, 5)
                .rotate((Math.PI * frameBounce) / 2)
                .path()
                .roundRect(0, 0, 5, 15, 2)
                .roundRect(0, 10, 7, 5, 2)
                .roundRect(0, -45, 8, 50, [2, 5, 2, 2])
                .close(1)
                .pop()
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
        },
    },
    {
        type: 1,
        name: "Baton",
        reload: 10,
        frameDelay: 5,
        range: 35,
        damage: 3,
        knockback: 30,
        length: 60,
        offset: [-32.5, -15],

        render(frame, armColor, color) {
            const frameBounce = (Math.sin(Math.min(Math.max(frame, 0), 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.5)
                .translate(17.5, 2.5)
                .fillStyle(color)
                .push()
                .translate(7.5, 5)
                .rotate((Math.PI * frameBounce) / 2)
                .path()
                .roundRect(5, -15, 7, 25, 2)
                .roundRect(5.5, -35, 6, 35, 2)
                .roundRect(6, -55, 5, 35, 2)
                .roundRect(5, -55, 7, 5, 2)
                .close(1)
                .pop()
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
        },
    },
    {
        type: 1,
        name: "Karambit",
        reload: 25,
        frameDelay: 5,
        range: 25,
        damage: 5,
        knockback: 10,
        length: 30,
        offset: [-25, -25],

        render(frame, armColor, color) {
            const frameBounce = (Math.sin(Math.min(Math.max(frame, 0), 0.5) * 2 * Math.PI) + 1) / 2
            canvas
                .push()
                .translate(0, 0)
                .rotate(frameBounce * Math.PI - Math.PI / 1.25)
                .translate(17.5, 2.5)
                .strokeStyle(color)
                .lineWidth(2)
                .lineCap("square")
                .push()
                .translate(12, 5 + frameBounce * 5)
                .rotate(Math.PI * frameBounce * 4)
                .path()
                .arc(0, 0, 3, 0, Math.PI * 2)
                .close(0)
                .lineWidth(4)
                .path()
                .arc(9, 5, 10, Math.PI / 2, Math.PI)
                .close(0)
                .pop()
                .strokeStyle(armColor)
                .lineWidth(5)
                .lineCap("round")
                .path()
                .arc(0, 0, 15, Math.PI / 4, Math.PI)
                .close(0)
                .pop()
        },
    },
]
