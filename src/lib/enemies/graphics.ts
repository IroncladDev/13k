import { CanvasEngine } from "../canvas/index"
import { CanvasPath } from "../canvas/path"

type VariantList = Array<(canvas: CanvasEngine) => CanvasEngine>

export const shirtColors = ["#eee", "#ccc", "#aaa"]
export const skinColors = ["#d4c5b0", "#dbc8ab", "#c9b79b", "#b3a289", "#a19077"]

export const shirts: VariantList = [
    canvas => canvas.roundRect(0, 0, 25, 30, [25, 25, 5, 5]).fillStyle("#555").roundRect(2.5, 30, 20, 10, [0, 0, 5, 5]),
    canvas =>
        canvas
            .roundRect(2.5, 0, 20, 30, [25, 25, 5, 5])
            .roundRect(2.5, 15, 22.5, 15, [0, 5, 2, 5])
            .fillStyle("#333")
            .roundRect(5, 30, 17.5, 10, [0, 0, 5, 5]),
    canvas =>
        canvas
            .roundRect(2.5, 0, 20, 30, [25, 25, 0, 0])
            .roundRect(2.5, 0, 22.5, 15, 5)
            .fillStyle("#555")
            .roundRect(2.5, 30, 20, 10, [0, 0, 10, 10]),
    canvas =>
        canvas.roundRect(2.5, 0, 20, 30, [25, 25, 0, 0]).fillStyle("#333").roundRect(2.5, 30, 20, 10, [0, 0, 10, 10]),
]

export const tattoos: Array<(path: CanvasPath) => CanvasPath> = [
    // No tattoo
    path => path,
    // 13 tattoo
    path =>
        path
            .moveTo(3, 7)
            .lineTo(4, 6)
            .lineTo(4, 11)
            .moveTo(6, 7)
            .lineTo(7.5, 5.5)
            .lineTo(9, 7.5)
            .lineTo(8, 8.5)
            .lineTo(9, 9.5)
            .lineTo(7.5, 11.5)
            .lineTo(6, 10),
    // MS Tattoo
    path =>
        path
            .moveTo(2, 7)
            .lineTo(3, 6)
            .lineTo(3, 12)
            .moveTo(3, 7)
            .lineTo(4, 6)
            .lineTo(5, 7)
            .lineTo(5, 11.5)
            .moveTo(5, 7)
            .lineTo(6, 6)
            .lineTo(7, 7)
            .lineTo(7, 11)
            .moveTo(11, 7)
            .lineTo(9, 6)
            .lineTo(8, 8)
            .lineTo(11, 10)
            .lineTo(10, 12)
            .lineTo(8, 11),
    // Hand sign tattoo
    path =>
        path
            .moveTo(3, 5)
            .lineTo(5, 10)
            .lineTo(5, 13)
            .moveTo(5, 10)
            .lineTo(3, 9)
            .lineTo(2, 7)
            .moveTo(7, 13)
            .lineTo(7, 10)
            .lineTo(9, 5)
            .moveTo(3.5, 7)
            .lineTo(8.5, 7)
            .moveTo(6, 7)
            .lineTo(6, 9),
]

const hairStyles: VariantList = [
    // No hair
    // eslint-disable-next-line
    canvas => canvas,
    canvas =>
        canvas
            .lineWidth(1)
            .lineCap("round")
            .path()
            .arc(7.5, 7.5, 7, Math.PI, Math.PI * 1.8)
            .close(0),
    canvas =>
        canvas
            .lineWidth(2)
            .lineCap("round")
            .path()
            .arc(7.5, 7.5, 6.5, Math.PI, Math.PI * 1.8)
            .close(0),
]

const drawHeads = (canvas: CanvasEngine) => {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height)
    for (let s = 0; s < skinColors.length; s++) {
        canvas.push().translate(0, s * 15)
        for (let h = 0; h < hairStyles.length; h++) {
            canvas.push().translate(h * tattoos.length * 15, 0)
            for (let i = 0; i < tattoos.length; i++) {
                canvas
                    .push()
                    .translate(i * 15, 0)
                    .fillStyle(skinColors[s])
                    .roundRect(0, 0, 15, 15, 15)
                canvas.strokeStyle("rgba(0,0,0,0.5)")
                const path = hairStyles[h](canvas).strokeStyle("rgba(0,0,0,0.4)").lineWidth(0.5).path()
                tattoos[i](path).close(0).pop()
            }
            canvas.pop()
        }
        canvas.pop()
    }
}

const drawBodies = (canvas: CanvasEngine) => {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height)
    for (let S = 0; S < skinColors.length; S++) {
        canvas.push().translate(0, S * 40)
        for (let c = 0; c < shirtColors.length; c++) {
            canvas.push().translate(c * shirts.length * 25, 0)
            for (let s = 0; s < shirts.length; s++) {
                canvas.push().translate(s * 25, 0)
                canvas.fillStyle(shirtColors[c])
                shirts[s](canvas).fillStyle(skinColors[S]).roundRect(7.5, 5, 10, 10, 25).pop()
            }
            canvas.pop()
        }
        canvas.pop()
    }
}

const assortedHeadsCanvas = document.createElement("canvas")
const assortedBodiesCanvas = document.createElement("canvas")

assortedHeadsCanvas.width = 15 * hairStyles.length * tattoos.length
assortedHeadsCanvas.height = 15 * skinColors.length
assortedBodiesCanvas.width = 25 * shirts.length * shirtColors.length
assortedBodiesCanvas.height = 40 * skinColors.length

export const headsCanvas = new CanvasEngine(assortedHeadsCanvas, { willReadFrequently: true })
export const bodiesCanvas = new CanvasEngine(assortedBodiesCanvas, { willReadFrequently: true })

drawHeads(headsCanvas)
drawBodies(bodiesCanvas)
