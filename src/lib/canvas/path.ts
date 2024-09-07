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

    arcTo(...args: CtxParams<"arcTo">) {
        this.engine.context.arcTo(...args)
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

    fill() {
        this.engine.context.fill()
        return this
    }

    stroke() {
        this.engine.context.stroke()
        return this
    }

    close() {
        this.engine.context.closePath()
        return this.engine
    }
}
