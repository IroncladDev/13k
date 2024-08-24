import { Particle } from "@/objects/particle"
import { Block } from "../objects/block"
import { Bullet } from "../objects/bullet"
import { Entity } from "../objects/entity"

export default class Game {
    static gravity = 0.5
    static maxVelocity = 20
    static blockSize = 50
    static level = 0
    static entities: Array<Entity> = []
    static blocks: Array<Block> = []
    static bullets: Array<Bullet> = []
    static particles: Array<Particle> = []
    static frameCount = 0
    static cameraX = 0
    static cameraY = 0
}
