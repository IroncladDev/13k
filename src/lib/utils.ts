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

export const lineLineCollision = (
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

export function circleRect(
    cx: number,
    cy: number,
    radius: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
): { colliding: true; points: [number, number][] } | { colliding: false } {
    // Temporary variables to set edges for testing
    let testX = cx
    let testY = cy

    // Which edge is closest?
    if (cx < rx)
        testX = rx // Test left edge
    else if (cx > rx + rw) testX = rx + rw // Right edge
    if (cy < ry)
        testY = ry // Top edge
    else if (cy > ry + rh) testY = ry + rh // Bottom edge

    // Get distance from closest edges
    const distX = cx - testX
    const distY = cy - testY
    const distance = Math.sqrt(distX * distX + distY * distY)

    // If the distance is less than the radius, collision!
    if (distance <= radius) {
        // Calculate collision points
        const points: [number, number][] = []

        // Check if circle intersects with each edge
        if (cx - radius <= rx && cx + radius >= rx) {
            // Left edge intersection
            const y = cy + Math.sqrt(radius * radius - (cx - rx) * (cx - rx))
            points.push([rx, y])
            points.push([rx, cy - Math.sqrt(radius * radius - (cx - rx) * (cx - rx))])
        }

        if (cx - radius <= rx + rw && cx + radius >= rx + rw) {
            // Right edge intersection
            const y = cy + Math.sqrt(radius * radius - (cx - (rx + rw)) * (cx - (rx + rw)))
            points.push([rx + rw, y])
            points.push([rx + rw, cy - Math.sqrt(radius * radius - (cx - (rx + rw)) * (cx - (rx + rw)))])
        }

        if (cy - radius <= ry && cy + radius >= ry) {
            // Top edge intersection
            const x = cx + Math.sqrt(radius * radius - (cy - ry) * (cy - ry))
            points.push([x, ry])
            points.push([cx - Math.sqrt(radius * radius - (cy - ry) * (cy - ry)), ry])
        }

        if (cy - radius <= ry + rh && cy + radius >= ry + rh) {
            // Bottom edge intersection
            const x = cx + Math.sqrt(radius * radius - (cy - (ry + rh)) * (cy - (ry + rh)))
            points.push([x, ry + rh])
            points.push([cx - Math.sqrt(radius * radius - (cy - (ry + rh)) * (cy - (ry + rh))), ry + rh])
        }

        return { colliding: true, points }
    }

    return { colliding: false }
}
