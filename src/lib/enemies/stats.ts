import { WeaponKey } from "../weapons"

export interface EnemyStats {
    name: string
    weapon: WeaponKey[]
    speed: number
    description: string
    /**
     * 0 = Head
     * 1 = Body
     * 2 = Legs
     */
    health: [number, number, number]
}

/**
 * Enemy stats
 * Format is in [index, code] format
 * [0,r] = recruit
 * [1,h] = homeboy
 * [2,c] = clique-leader
 * [3,p] = palabrero
 * [4,C] = coordinator
 * [5,R] = runner
 * [6,l] = leader
 * [7,t] = tutorial recruit (only pistol, weaker)
 */
export const enemies: Array<EnemyStats> = [
    {
        name: "Recruit",
        description: "Newly-recruited gang member",
        weapon: [5, 8],
        speed: 3,
        health: [6, 10, 7],
    },
    {
        name: "Homeboy",
        description: "A general gang member",
        weapon: [10, 6],
        speed: 5,
        health: [8, 15, 12],
    },
    {
        name: "Clique Leader",
        description: "Leads lower-ranking gang members in carrying out organized operations",
        weapon: [1],
        speed: 4,
        health: [9, 20, 15],
    },
    {
        name: "Coordinator",
        description: "Organizes programs and enforces rules within the gang",
        weapon: [8, 9],
        speed: 6,
        health: [10, 25, 20],
    },
    {
        name: "Palabrero",
        description: "High-ranking leader and organizer within the gang",
        weapon: [3],
        speed: 4,
        health: [12, 30, 25],
    },
    {
        name: "Runner",
        description: "The bridge between the gang leaders and lower-ranking members",
        weapon: [10, 7],
        speed: 8,
        health: [10, 17, 15],
    },
    {
        name: "Leader",
        description: "A member of the gang's board of directors overseeing operations over multiple regions",
        weapon: [4],
        speed: 5,
        health: [20, 35, 30],
    },
    {
        name: "Recruit",
        description: "Newly-recruited gang member",
        speed: 4,
        health: [5, 10, 10],
        weapon: [5],
    },
]
