import { Particle } from "@/objects/particle"
import { Block } from "../objects/block"
import { Bullet } from "../objects/bullet"
import { Entity } from "../objects/entity"
import { canvas } from "./canvas/index"

const Game = {
    gravity: 0.5,
    maxVelocity: 20,
    blockSize: 50,
    level: -1,
    entities: [] as Array<Entity>,
    blocks: [] as Array<Block>,
    bullets: [] as Array<Bullet>,
    particles: [] as Array<Particle>,
    frameCount: 0,
    cameraX: 0,
    cameraY: 0,
    snapshot: null as HTMLCanvasElement | null,
    hasSeenIntro: false,

    // Scenes
    // 0 = Start
    // 1 = Map
    // 2 = Game
    // 3 = Mission Success
    // 4 = Mission Failure
    // 5 = Win screen
    // 6 = Intro/cutscene
    scene: 0,

    // Controls
    keys: new Map<string, boolean>(),
    keysPressed: new Map<string, boolean>(),
    clicked: false,
    pressed: false,
    released: false,
    mouseX: 0,
    mouseY: 0,

    // Tutorial
    tutorialStep: 0,

    initControls() {
        window.addEventListener("keydown", event => {
            Game.keys.set(event.key.length == 1 ? event.key.toLowerCase() : event.key, true)
        })
        window.addEventListener("keyup", event => {
            Game.keys.delete(event.key.length == 1 ? event.key.toLowerCase() : event.key)
            Game.keysPressed.set(event.key.length == 1 ? event.key.toLowerCase() : event.key, true)
        })
        window.addEventListener("mousedown", () => (Game.pressed = true))
        window.addEventListener("mouseup", () => ((Game.pressed = false), (Game.released = true)))
        window.addEventListener("click", () => (Game.clicked = true))
        c2d.addEventListener("mousemove", (event: any) => {
            const rect = c2d.getBoundingClientRect()

            Game.mouseX = ((event.clientX - rect.left) * (c2d.width / rect.width)) / canvas.dpr
            Game.mouseY = ((event.clientY - rect.top) * (c2d.height / rect.height)) / canvas.dpr
        })
        c2d.addEventListener("contextmenu", (event: any) => event.preventDefault())
    },

    keysDown(...keys: string[]) {
        return keys.some(key => Game.keys.has(key))
    },

    keysPressedDown(...keys: string[]) {
        return keys.some(key => Game.keysPressed.has(key))
    },
}

export default Game
