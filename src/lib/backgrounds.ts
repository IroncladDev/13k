import { canvas as mainCanvas, CanvasEngine } from "./canvas/index"
import { colors } from "./constants"

export const backgrounds = [
    document.createElement("canvas"),
    document.createElement("canvas"),
    document.createElement("canvas"),
]

backgrounds.forEach(canvas => {
    canvas.width = mainCanvas.width
    canvas.height = mainCanvas.height
})

const divider = (canvas: CanvasEngine) => {
    const g4 = canvas.context.createLinearGradient(0, canvas.height / 2 + 40, 0, canvas.height / 2 + 50)
    g4.addColorStop(0, colors.transparent)
    g4.addColorStop(1, colors.black)

    canvas.fillStyle(g4).fillRect(0, canvas.height / 2 + 40, canvas.width, 10)
    canvas.fillStyle(colors.black).fillRect(0, canvas.height / 2 + 50, canvas.width, canvas.height / 2)
}

const drawNightSky = (canvas: CanvasEngine) => {
    canvas.fillStyle("rgb(0,55,105)").fillRect(0, 0, canvas.width, canvas.height)

    const star = (x: number, y: number, size: number) => {
        canvas
            .fillStyle(colors.white)
            .path()
            .arc(x, y, size / 2, 0, Math.PI * 2)
            .close(1)
            .fillStyle(colors.dwhite(0.2))

        for (let i = 0; i < size; i++) {
            canvas
                .path()
                .arc(x, y, i * 2, 0, Math.PI * 2)
                .close(1)
        }
    }

    star(canvas.width - 100, 100, 30)
    canvas
        .fillStyle("rgb(0,55,105)")
        .path()
        .arc(canvas.width - 130, 100, 50, 0, Math.PI * 2)
        .close(1)

    for (let i = 0; i < 100; i++) {
        star(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.floor(Math.random() * 5))
    }

    divider(canvas)

    const gradient = canvas.context.createLinearGradient(0, 0, 0, canvas.height)

    gradient.addColorStop(0, "#0000")
    gradient.addColorStop(1, "rgba(0,100,200,0.2)")

    canvas.fillStyle(gradient).fillRect(0, 0, canvas.width, canvas.height)
}

const drawSunset = (canvas: CanvasEngine) => {
    canvas.fillStyle(colors.black).fillRect(0, 0, canvas.width, canvas.height)

    const g1 = canvas.context.createLinearGradient(0, canvas.height / 2, 0, 0)

    g1.addColorStop(0, "rgba(75,15,0)")
    g1.addColorStop(1, "rgba(0,15,50)")

    canvas.fillStyle(g1).fillRect(0, 0, canvas.width, canvas.height)

    const g2 = canvas.context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height,
    )
    g2.addColorStop(0, "rgba(255,200,0,0.15)")
    g2.addColorStop(1, "rgba(255,0,255,0)")

    canvas.fillStyle(g2).fillRect(0, 0, canvas.width, canvas.height)

    const g3 = canvas.context.createRadialGradient(
        canvas.width / 4,
        canvas.height / 2 + 75,
        0,
        canvas.width / 4,
        canvas.height / 2 + 75,
        100,
    )

    g3.addColorStop(0, colors.white)
    g3.addColorStop(0.8, "rgba(255,175,0.8)")
    g3.addColorStop(1, "rgba(255,175,0,0)")

    canvas.fillStyle(g3).fillRect(0, 0, canvas.width, canvas.height)

    divider(canvas)

    const gradient = canvas.context.createLinearGradient(0, 0, 0, canvas.height)

    gradient.addColorStop(0, "#0000")
    gradient.addColorStop(1, "rgba(255,100,0,0.2)")

    canvas.fillStyle(gradient).fillRect(0, 0, canvas.width, canvas.height)
}

const drawCloudySky = (canvas: CanvasEngine) => {
    canvas.fillStyle(colors.black).fillRect(0, 0, canvas.width, canvas.height)

    const g1 = canvas.context.createLinearGradient(0, canvas.height / 2, 0, 0)

    g1.addColorStop(0, "rgba(25,45,75)")
    g1.addColorStop(1, "rgba(0,15,50)")

    canvas.fillStyle(g1).fillRect(0, 0, canvas.width, canvas.height)

    divider(canvas)

    const createLayer = (y: number, color1: string, color2: string) => {
        const radii: number[] = []

        while (radii.reduce((a, b) => a + b, 0) < canvas.width) {
            radii.push(Math.floor(10 + Math.random() * 50))
        }

        const gradient = canvas.context.createLinearGradient(0, 0, 0, y + [...radii].sort((a, b) => b - a)[0])

        gradient.addColorStop(0, color1)
        gradient.addColorStop(1, color2)

        const path = canvas.fillStyle(gradient).path()

        for (let i = 0; i < radii.length; i++) {
            const prevSum = [...radii].slice(0, i).reduce((a, b) => a + b, 0)

            path.roundRect(prevSum, 0, radii[i] * 2, y, 0).arc(prevSum + radii[i], y, radii[i], 0, Math.PI)
        }

        path.close(1)
    }

    createLayer(100, colors.dwhite(0.4), colors.dwhite(0.2))
    createLayer(50, colors.dwhite(0.4), colors.dwhite(0.2))
    createLayer(0, colors.dwhite(0.4), colors.dwhite(0.2))

    const gradient = canvas.context.createLinearGradient(0, 0, 0, canvas.height)

    gradient.addColorStop(0, "#0000")
    gradient.addColorStop(1, "rgba(0,100,200,0.2)")

    canvas.fillStyle(gradient).fillRect(0, 0, canvas.width, canvas.height)
}

drawNightSky(new CanvasEngine(backgrounds[0], { willReadFrequently: true }))
drawSunset(new CanvasEngine(backgrounds[1], { willReadFrequently: true }))
drawCloudySky(new CanvasEngine(backgrounds[2], { willReadFrequently: true }))

// Foregrounds
export const foregrounds = [document.createElement("canvas"), document.createElement("canvas")]

foregrounds.forEach(canvas => {
    canvas.width = mainCanvas.width
    canvas.height = mainCanvas.height
})

const drawCityscape = (canvas: CanvasEngine) => {
    canvas.fillStyle(colors.black)

    // [width, height, separation]
    const rects: Array<[number, number, number]> = []

    while (rects.reduce((a, b) => a + b[0] + b[2], 0) < canvas.width) {
        rects.push([
            Math.floor(10 + Math.random() * 30),
            Math.floor(Math.random() * 50),
            Math.floor(-5 + Math.random() * 20),
        ])
    }

    for (let i = 0; i < rects.length; i++) {
        const prevX = rects.slice(0, i).reduce((a, b) => a + b[0] + b[2], 0)

        const [w, height] = rects[i]

        canvas.roundRect(prevX, canvas.height / 2 - height + 50, w, height, 5)
    }
}

const drawMountains = (canvas: CanvasEngine) => {
    canvas.fillStyle(colors.black)

    // [width, height, separation]
    const rects: Array<[number, number, number]> = []

    while (rects.reduce((a, b) => a + b[0] + b[2], 0) < canvas.width) {
        rects.push([
            Math.floor(50 + Math.random() * 100),
            Math.floor(25 + Math.random() * 100),
            Math.floor(-50 + Math.random() * 100),
        ])
    }

    const gr = canvas.context.createLinearGradient(
        0,
        canvas.height / 2 - rects.sort((a, b) => b[1] - a[1])[0][1] + 50,
        0,
        canvas.height / 2 + 50,
    )

    gr.addColorStop(0, colors.transparent)
    gr.addColorStop(1, "#000a")

    const path = canvas.fillStyle(gr).path()

    for (let i = 0; i < rects.length; i++) {
        const prevX = rects.slice(0, i).reduce((a, b) => a + b[0] + b[2], 0)

        const [w, height] = rects[i]

        path.moveTo(prevX, canvas.height / 2 + 50)
            .lineTo(prevX + w / 2, canvas.height / 2 + 50 - height)
            .lineTo(prevX + w, canvas.height / 2 + 50)
    }

    path.close(1)
}

drawCityscape(new CanvasEngine(foregrounds[0], { willReadFrequently: true }))
drawMountains(new CanvasEngine(foregrounds[1], { willReadFrequently: true }))
