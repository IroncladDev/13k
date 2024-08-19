import { Block } from "./objects/block"
import { Entity } from "./objects/entity"

export default class Game {
    static gravity = 0.5
    static maxVelocity = 10
    static blockSize = 100
    static entities: Array<Entity> = []
    static blocks: Array<Block> = []
}
