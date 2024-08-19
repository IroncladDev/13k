import { CanvasPath } from "./path"
import { CanvasText } from "./text"

export type CtxValue<T extends keyof CanvasRenderingContext2D> =
    CanvasRenderingContext2D[T]

export type CtxParams<T extends keyof CanvasRenderingContext2D> = Parameters<
    CtxValue<T> extends (...args: any) => any ? CtxValue<T> : never
>

export class CanvasEngine {
    context: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D
    }

    get canvasWidth() {
        return this.context.canvas.width
    }

    get canvasHeight() {
        return this.context.canvas.height
    }

    // Rectangles
    fillRect(...args: CtxParams<"fillRect">) {
        this.context.fillRect(...args)
        return this
    }
    strokeRect(...args: CtxParams<"strokeRect">) {
        this.context.strokeRect(...args)
        return this
    }
    clearRect(...args: CtxParams<"clearRect">) {
        this.context.clearRect(...args)
        return this
    }

    // Paths
    path() {
        return new CanvasPath(this.context)
    }
    drawPath(callback: (path: CanvasPath) => void) {
        const path = this.path()
        path.beginPath()
        callback(path)
        path.close()
        return this
    }

    // Text
    text() {
        return new CanvasText(this.context)
    }
    drawText(callback: (text: CanvasText) => void) {
        const text = this.text()
        callback(text)
        return this
    }

    // Chainable style methods
    fillStyle(fillStyle: CtxValue<"fillStyle">) {
        this.context.fillStyle = fillStyle
        return this
    }
    textAlign(textAlign: CtxValue<"textAlign">) {
        this.context.textAlign = textAlign
        return this
    }
    textBaseline(textBaseline: CtxValue<"textBaseline">) {
        this.context.textBaseline = textBaseline
        return this
    }
    lineCap(lineCap: CtxValue<"lineCap">) {
        this.context.lineCap = lineCap
        return this
    }
    lineJoin(lineJoin: CtxValue<"lineJoin">) {
        this.context.lineJoin = lineJoin
        return this
    }
    lineWidth(lineWidth: CtxValue<"lineWidth">) {
        this.context.lineWidth = lineWidth
        return this
    }
    lineDashOffset(lineDashOffset: CtxValue<"lineDashOffset">) {
        this.context.lineDashOffset = lineDashOffset
        return this
    }
    strokeStyle(strokeStyle: CtxValue<"strokeStyle">) {
        this.context.strokeStyle = strokeStyle
        return this
    }

    // Chainable Transformations
    push() {
        this.context.save()
        return this
    }
    pop() {
        this.context.restore()
        return this
    }
    scaled(...args: CtxParams<"scale">) {
        this.context.scale(...args)
        return this
    }
    translated(...args: CtxParams<"translate">) {
        this.context.translate(...args)
        return this
    }
    rotated(...args: CtxParams<"rotate">) {
        this.context.rotate(...args)
        return this
    }
    pushpop(callback: (ctx: CanvasEngine) => void) {
        this.context.save()
        callback(this)
        this.context.restore()
        return this
    }

    fill(...args: CtxParams<"fill">) {
        this.context.fill(...args)
        return this
    }

    stroke(...args: CtxParams<"stroke">) {
        this.context.stroke(...args)
        return this
    }
}

export const canvas = new CanvasEngine(c2d)
