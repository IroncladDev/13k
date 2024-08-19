export default class Controls {
    static keys: Map<string, boolean> = new Map()
    static clicked: boolean = false
    static pressed: boolean = false

    static init() {
        window.addEventListener("keydown", event =>
            Controls.keys.set(event.key, true),
        )
        window.addEventListener("keyup", event =>
            Controls.keys.delete(event.key),
        )
        window.addEventListener("mousedown", () => (Controls.pressed = true))
        window.addEventListener("mouseup", () => (Controls.pressed = false))
        window.addEventListener("click", () => (Controls.clicked = true))
    }

    static keysDown(...keys: string[]) {
        return keys.some(key => Controls.keys.has(key))
    }
}
