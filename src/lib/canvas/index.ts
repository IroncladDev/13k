import { CanvasPath } from "./path"

export type CtxValue<T extends keyof CanvasRenderingContext2D> = CanvasRenderingContext2D[T]

export type CtxParams<T extends keyof CanvasRenderingContext2D> = Parameters<
    CtxValue<T> extends (...args: any) => any ? CtxValue<T> : never
>

export class CanvasEngine {
    context: CanvasRenderingContext2D
    dpr = 4 // window.devicePixelRatio || 1

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d") as CanvasRenderingContext2D

        // eslint-disable-next-line
        canvas.width = this.context.canvas.width * this.dpr
        // eslint-disable-next-line
        canvas.height = this.context.canvas.height * this.dpr

        this.context.scale(this.dpr, this.dpr)
    }

    get canvasWidth() {
        return this.context.canvas.width / this.dpr
    }

    get canvasHeight() {
        return this.context.canvas.height / this.dpr
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
    roundFillRect(...args: CtxParams<"roundRect">) {
        this.context.beginPath()
        this.context["roundRect"](...args)
        this.context.fill()
        this.context.closePath()
        return this
    }

    // Paths
    path() {
        return new CanvasPath(this)
    }

    // Images
    // eslint-disable-next-line
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number) {
        this.context.drawImage(image, sx, sy, sw * this.dpr, sh * this.dpr)
        return this
    }
    putImageData(imagedata: ImageData, dx: number, dy: number) {
        this.context.putImageData(imagedata, dx, dy)
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
    // eslint-disable-next-line
    scale(...args: CtxParams<"scale">) {
        this.context.scale(...args)
        return this
    }
    // eslint-disable-next-line
    translate(...args: CtxParams<"translate">) {
        this.context.translate(...args)
        return this
    }
    // eslint-disable-next-line
    rotate(...args: CtxParams<"rotate">) {
        this.context.rotate(...args)
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

    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings) {
        return this.context.getImageData(sx * this.dpr, sy * this.dpr, sw * this.dpr, sh * this.dpr, settings)
    }
}

export const canvas = new CanvasEngine(c2d)
