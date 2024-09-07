import { CanvasPath } from "./path"

export type CtxValue<T extends keyof CanvasRenderingContext2D> = CanvasRenderingContext2D[T]

export type CtxParams<T extends keyof CanvasRenderingContext2D> = Parameters<
    CtxValue<T> extends (...args: any) => any ? CtxValue<T> : never
>

export class CanvasEngine {
    context: CanvasRenderingContext2D
    dpr = 4 // window.devicePixelRatio || 1

    constructor(canvas: HTMLCanvasElement, options?: CanvasRenderingContext2DSettings) {
        this.context = canvas.getContext("2d", options) as CanvasRenderingContext2D

        canvas.width = this.context.canvas.width * this.dpr
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

    // Text
    font(font: CtxValue<"font">) {
        this.context.font = font
        return this
    }
    align(alignment: CtxValue<"textAlign">) {
        this.context.textAlign = alignment
        return this
    }
    baseLine(baseLine: CtxValue<"textBaseline">) {
        this.context.textBaseline = baseLine
        return this
    }
    text(text: string, x: number, y: number, maxWidth?: number) {
        const parts = text.split("\n")
        const lines: [string, number, number][] = []

        for (const part of parts) {
            if (maxWidth) {
                const words: string[] = part.split(" ")
                let line = ""
                let currentY = y

                for (let n = 0; n < words.length; n++) {
                    const testLine = line == "" ? words[n] : line + " " + words[n]
                    const testWidth = this.context.measureText(testLine).width

                    if (testWidth > maxWidth && n > 0) {
                        lines.push([line, x, currentY])
                        line = words[n]
                        currentY += parseInt(this.context.font, 10)
                    } else {
                        line = testLine
                    }
                }

                lines.push([line, x, currentY])
                y += parseInt(this.context.font, 10) * (lines.length > 0 ? 1 : 0) // Adjust y for new block of text
            } else {
                lines.push([part, x, y])
            }
        }

        for (const [lineText, lineX, lineY] of lines) {
            this.context.fillText(lineText, lineX, lineY)
        }

        return this
    }

    // Images
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
    scale(...args: CtxParams<"scale">) {
        this.context.scale(...args)
        return this
    }
    translate(...args: CtxParams<"translate">) {
        this.context.translate(...args)
        return this
    }
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
