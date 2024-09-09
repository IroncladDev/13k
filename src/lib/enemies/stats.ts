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
        speed: 5,
        health: [5, 15, 10],
    },
    {
        name: "Homeboy",
        description: "A general gang member",
        weapon: [10, 6],
        speed: 7,
        health: [7, 20, 15],
    },
    {
        name: "Clique Leader",
        description: "Leads lower-ranking gang members in carrying out organized operations",
        weapon: [1],
        speed: 7,
        health: [10, 25, 20],
    },
    {
        name: "Coordinator",
        description: "Organizes programs and enforces rules within the gang",
        weapon: [7, 9],
        speed: 5,
        health: [15, 30, 25],
    },
    {
        name: "Palabrero",
        description: "High-ranking leader and organizer within the gang",
        weapon: [3],
        speed: 6,
        health: [15, 35, 25],
    },
    {
        name: "Runner",
        description: "The bridge between the gang leaders and lower-ranking members",
        weapon: [10, 7],
        speed: 10,
        health: [10, 25, 20],
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
