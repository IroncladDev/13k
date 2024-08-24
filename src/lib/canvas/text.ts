import { CtxParams, CtxValue } from "./index"

export class CanvasText {
    context: CanvasRenderingContext2D
    constructor(context: CanvasRenderingContext2D) {
        this.context = context
    }

    font(font: CtxValue<"font">) {
        this.context.font = font
        return this
    }

    align(alignment: CtxValue<"textAlign">) {
        this.context.textAlign = alignment
        return this
    }

    baseLine(textBaseline: CtxValue<"textBaseline">) {
        this.context.textBaseline = textBaseline
        return this
    }

    dir(dir: CtxValue<"direction">) {
        this.context["direction"] = dir
        return this
    }

    filled(...args: CtxParams<"fillText">) {
        this.context.fillText(...args)
    }

    stroked(...args: CtxParams<"strokeText">) {
        this.context.strokeText(...args)
    }
}
