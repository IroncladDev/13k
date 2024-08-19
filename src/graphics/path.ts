import { CtxParams } from "./index"

export class CanvasPath {
    context: CanvasRenderingContext2D
    constructor(context: CanvasRenderingContext2D) {
        this.context = context
    }

    beginPath() {
        this.context.beginPath()
        return this
    }

    moveTo(...args: CtxParams<"moveTo">) {
        this.context.moveTo(...args)
        return this
    }

    lineTo(...args: CtxParams<"lineTo">) {
        this.context.lineTo(...args)
        return this
    }

    quadraticCurveTo(...args: CtxParams<"quadraticCurveTo">) {
        this.context.quadraticCurveTo(...args)
        return this
    }

    bezierCurveTo(...args: CtxParams<"bezierCurveTo">) {
        this.context.bezierCurveTo(...args)
        return this
    }

    arcTo(...args: CtxParams<"arcTo">) {
        this.context.arcTo(...args)
        return this
    }

    rect(...args: CtxParams<"rect">) {
        this.context.rect(...args)
        return this
    }

    roundRect(...args: CtxParams<"roundRect">) {
        this.context.roundRect(...args)
        return this
    }

    arc(...args: CtxParams<"arc">) {
        this.context.arc(...args)
        return this
    }

    ellipse(...args: CtxParams<"ellipse">) {
        this.context.ellipse(...args)
        return this
    }

    fill() {
        this.context.fill()
        return this
    }

    stroke() {
        this.context.stroke()
        return this
    }

    close() {
        this.context.closePath()
        return this
    }
}
