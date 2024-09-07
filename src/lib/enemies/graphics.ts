import { CanvasEngine } from "../canvas/index"

const assortedHeadsCanvas = document.createElement("canvas")
const assortedBodiesCanvas = document.createElement("canvas")

type VariantList = Array<(canvas: CanvasEngine) => void>

export const shirtColors = ["#f5f5f5", "#d5d5d5", "#b5b5b5"]
export const skinColors = ["#d4c5b0", "#dbc8ab", "#c9b79b", "#b3a289", "#a19077"]

const shirts: VariantList = [
    canvas => {
        canvas
            .roundFillRect(0, 0, 25, 30, [25, 25, 5, 5])
            .fillStyle("#555")
            .roundFillRect(2.5, 30, 20, 10, [0, 0, 5, 5])
    },
    canvas => {
        canvas
            .roundFillRect(2.5, 0, 20, 30, [25, 25, 5, 5])
            .roundFillRect(2.5, 15, 22.5, 15, [0, 5, 2, 5])
            .fillStyle("#333")
            .roundFillRect(5, 30, 17.5, 10, [0, 0, 5, 5])
    },
    canvas => {
        canvas
            .roundFillRect(2.5, 0, 20, 30, [25, 25, 0, 0])
            .roundFillRect(2.5, 0, 22.5, 15, 5)
            .fillStyle("#555")
            .roundFillRect(2.5, 30, 20, 10, [0, 0, 10, 10])
    },
    canvas => {
        canvas
            .roundFillRect(2.5, 0, 20, 30, [25, 25, 0, 0])
            .fillStyle("#333")
            .roundFillRect(2.5, 30, 20, 10, [0, 0, 10, 10])
    },
]

const tattoos: VariantList = [
    // No face tattoo
    // eslint-disable-next-line
    _ => {},
    // 13 tattoo
    canvas => {
        canvas
            .path()
            .moveTo(3, 7)
            .lineTo(4, 6)
            .lineTo(4, 11)
            .moveTo(6, 7)
            .lineTo(7.5, 5.5)
            .lineTo(9, 7.5)
            .lineTo(8, 8.5)
            .lineTo(9, 9.5)
            .lineTo(7.5, 11.5)
            .lineTo(6, 10)
            .stroke()
            .close()
    },
    // MS Tattoo
    canvas => {
        canvas
            .path()
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
            .lineTo(8, 11)
            .stroke()
            .close()
    },
    // Hand sign tattoo
    canvas => {
        canvas
            .path()
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
            .lineTo(6, 9)
            .stroke()
            .close()
    },
]

const hairStyles: VariantList = [
    // No hair
    // eslint-disable-next-line
    _ => {},
    canvas => {
        canvas
            .lineWidth(1)
            .lineCap("round")
            .path()
            .arc(7.5, 7.5, 7, Math.PI, Math.PI * 1.8)
            .stroke()
            .close()
    },
    canvas => {
        canvas
            .lineWidth(2)
            .lineCap("round")
            .path()
            .arc(7.5, 7.5, 6.5, Math.PI, Math.PI * 1.8)
            .stroke()
            .close()
    },
]

export const drawHeads = (canvas: CanvasEngine) => {
    canvas.context.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
    for (let s = 0; s < skinColors.length; s++) {
        canvas.push()
        canvas.translate(0, s * 15)
        for (let h = 0; h < hairStyles.length; h++) {
            canvas.push()
            canvas.translate(h * tattoos.length * 15, 0)
            for (let i = 0; i < tattoos.length; i++) {
                canvas
                    .push()
                    .translate(i * 15, 0)
                    .fillStyle(skinColors[s])
                    .roundFillRect(0, 0, 15, 15, 15)
                canvas.strokeStyle("rgba(0,0,0,0.5)")
                hairStyles[h](canvas)
                canvas.strokeStyle("rgba(0,0,0,0.4)").lineWidth(0.5)
                tattoos[i](canvas)
                canvas.pop()
            }
            canvas.pop()
        }
        canvas.pop()
    }
}

export const drawBodies = (canvas: CanvasEngine) => {
    canvas.context.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight)
    for (let S = 0; S < skinColors.length; S++) {
        canvas.push()
        canvas.translate(0, S * 40)
        for (let c = 0; c < shirtColors.length; c++) {
            canvas.push().translate(c * shirts.length * 25, 0)
            for (let s = 0; s < shirts.length; s++) {
                canvas.push().translate(s * 25, 0)
                canvas.fillStyle(shirtColors[c])
                shirts[s](canvas)
                canvas.fillStyle(skinColors[S])
                canvas.roundFillRect(7.5, 5, 10, 10, 25)
                canvas.pop()
            }
            canvas.pop()
        }
        canvas.pop()
    }
}

assortedHeadsCanvas.width = 15 * hairStyles.length * tattoos.length
assortedHeadsCanvas.height = 15 * skinColors.length
assortedBodiesCanvas.width = 25 * shirts.length * shirtColors.length
assortedBodiesCanvas.height = 40 * skinColors.length

export const headsCanvas = new CanvasEngine(assortedHeadsCanvas, { willReadFrequently: true })
export const bodiesCanvas = new CanvasEngine(assortedBodiesCanvas, { willReadFrequently: true })
