export const rectCollision = (
    x: number,
    y: number,
    w: number,
    h: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
) => x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2

export const pointRectCollision = (px: number, py: number, x: number, y: number, w: number, h: number) =>
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

// Only works if one or more line points are inside the rectangle. Good for bullet collisions
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
    const pointOneCollision = pointRectCollision(x1, y1, x, y, w, h)
    const pointTwoCollision = pointRectCollision(x2, y2, x, y, w, h)

    const checks = [
        lineLineCollision(x1, y1, x2, y2, x, y, x + w, y),
        lineLineCollision(x1, y1, x2, y2, x, y + h, x + w, y + h),
        lineLineCollision(x1, y1, x2, y2, x, y, x, y + h),
        lineLineCollision(x1, y1, x2, y2, x + w, y, x + w, y + h),
        pointOneCollision ? { colliding: true, x: x1, y: y1 } : { colliding: false },
        pointTwoCollision ? { colliding: true, x: x2, y: y2 } : { colliding: false },
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

export const pointFromAngle = (x: number, y: number, angle: number, distance: number): [number, number] => [
    x + distance * Math.cos(angle),
    y + distance * Math.sin(angle),
]

export const constrain = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const dist = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

export const angleTo = (x1: number, y1: number, x2: number, y2: number) => Math.atan2(y2 - y1, x2 - x1)

/* eslint-disable */
export const normalizeAngle = (angle: number, rotation: number) => {
    angle = angle % (Math.PI * 2)

    let delta = angle - (rotation % (Math.PI * 2))
    if (delta < -Math.PI) delta += Math.PI * 2
    if (delta > Math.PI) delta -= Math.PI * 2

    return rotation + delta
}

export const normalizeToRange = (angle: number) => {
    angle = angle % (Math.PI * 2)
    if (angle > Math.PI) angle -= Math.PI * 2
    if (angle < -Math.PI) angle += Math.PI * 2
    return angle
}
/* eslint-enable */

export function random(min: number, max: number) {
    return Math.random() * (max - min) + min
}
