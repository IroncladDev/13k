import { CanvasEngine, CtxParams } from "./index"

export class CanvasPath {
    engine: CanvasEngine
    constructor(engine: CanvasEngine) {
        this.engine = engine
        this.engine.context.beginPath()
    }

    moveTo(...args: CtxParams<"moveTo">) {
        this.engine.context.moveTo(...args)
        return this
    }

    lineTo(...args: CtxParams<"lineTo">) {
        this.engine.context.lineTo(...args)
        return this
    }

    roundRect(...args: CtxParams<"roundRect">) {
        this.engine.context["roundRect"](...args)
        return this
    }

    arc(...args: CtxParams<"arc">) {
        this.engine.context.arc(...args)
        return this
    }

    // 0 = stroke, no fill
    // 1 = fill, no stroke
    // 2 = fill, stroke
    close(mode: 0 | 1 | 2) {
        if (mode == 0 || mode == 2) {
            this.engine.context.stroke()
        }
        if (mode == 1 || mode == 2) {
            this.engine.context.fill()
        }
        this.engine.context.closePath()
        return this.engine
    }
}
