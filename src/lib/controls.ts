import { canvas } from "./canvas/index"

export default class Controls {
    static keys: Map<string, boolean> = new Map()
    static clicked: boolean = false
    static pressed: boolean = false
    static released: boolean = false
    static mouseX: number = 0
    static mouseY: number = 0

    static init() {
        window.addEventListener("keydown", event =>
            Controls.keys.set(event.key, true),
        )
        window.addEventListener("keyup", event =>
            Controls.keys.delete(event.key),
        )
        window.addEventListener("mousedown", () => (Controls.pressed = true))
        window.addEventListener("mouseup", () => (Controls.pressed = false, Controls.released = true))
        window.addEventListener("click", () => (Controls.clicked = true))
        c2d.addEventListener("mousemove", (event: any) => {
            const rect = c2d.getBoundingClientRect()

            Controls.mouseX =
                (event.clientX - rect.left) * (c2d.width / rect.width) / canvas.dpr
            Controls.mouseY =
                (event.clientY - rect.top) * (c2d.height / rect.height) / canvas.dpr
        })
    }

    static keysDown(...keys: string[]) {
        return keys.some(key => Controls.keys.has(key))
    }
}
