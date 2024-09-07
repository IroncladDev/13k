export const pointRect = (px: number, py: number, x: number, y: number, w: number, h: number) =>
    px > x && px < x + w && py > y && py < y + h

const lineLineCollision = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
): { colliding: true; x: number; y: number } | { colliding: false } => {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        const intersectionX = x1 + uA * (x2 - x1)
        const intersectionY = y1 + uA * (y2 - y1)
        return { colliding: true, x: intersectionX, y: intersectionY }
    }

    return { colliding: false }
}

export const lineRectCollision = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number,
    w: number,
    h: number,
): { colliding: true; points: Array<[number, number]> } | { colliding: false } => {
    const checks = [
        lineLineCollision(x1, y1, x2, y2, x, y, x + w, y),
        lineLineCollision(x1, y1, x2, y2, x, y + h, x + w, y + h),
        lineLineCollision(x1, y1, x2, y2, x, y, x, y + h),
        lineLineCollision(x1, y1, x2, y2, x + w, y, x + w, y + h),
    ]

    if (checks.some(c => c.colliding)) {
        return {
            colliding: true,
            points: (
                checks.filter(c => c.colliding) as {
                    colliding: true
                    x: number
                    y: number
                }[]
            ).map(c => [c.x, c.y]),
        }
    }

    return { colliding: false }
}

export const pointAt = (x: number, y: number, angle: number, distance: number): [number, number] => [
    x + distance * Math.cos(angle),
    y + distance * Math.sin(angle),
]

export const dist = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

export const normalizeToRange = (angle: number) => {
    angle = angle % (Math.PI * 2)
    if (angle > Math.PI) angle -= Math.PI * 2
    if (angle < -Math.PI) angle += Math.PI * 2
    return angle
}
