import { WeaponKey } from "../weapons"

export interface EnemyStats {
    name: string
    weapon: WeaponKey | WeaponKey[]
    speed: number
    health: {
        head: number
        body: number
        legs: number
    }
}

export const enemies: Record<string, EnemyStats> = {
    ["recruit"]: {
        name: "Recruit",
        weapon: ["glock", "machete"],
        speed: 5,
        health: {
            head: 5,
            body: 15,
            legs: 10,
        },
    },

    ["homeboy"]: {
        name: "Homeboy",
        weapon: ["karambit", "autoglock"],
        speed: 7,
        health: {
            head: 7,
            body: 20,
            legs: 15,
        },
    },

    ["clique-leader"]: {
        name: "Clique Leader",
        weapon: ["ak47"],
        speed: 7,
        health: {
            head: 10,
            body: 25,
            legs: 20,
        },
    },

    ["palabrero"]: {
        name: "Palabrero",
        weapon: ["uzi"],
        speed: 6,
        health: {
            head: 15,
            body: 30,
            legs: 25,
        },
    },

    ["coordinator"]: {
        name: "Coordinator",
        weapon: ["spas12"],
        speed: 5,
        health: {
            head: 20,
            body: 35,
            legs: 30,
        },
    },

    ["runner"]: {
        name: "Runner",
        weapon: ["karambit", "uzi"],
        speed: 10,
        health: {
            head: 10,
            body: 25,
            legs: 20,
        },
    },

    ["leader"]: {
        name: "Leader",
        // Some sort of superweapon, switchable maybe?
        weapon: ["dragunov"],
        speed: 5,
        health: {
            head: 20,
            body: 35,
            legs: 30,
        },
    },
}

export type EnemyType = keyof typeof enemies
