export abstract class Entity {
    x: number
    y: number
    xVel: number = 0
    yVel: number = 0
    w: number = 25
    h: number = 50
    canJump: boolean = false
    health: number
    maxHealth: number
    jumpForce: number = 10

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.health = 10
        this.maxHealth = 10
    }

    abstract moveX(): void
    abstract moveY(): void
    abstract render(): void
}
