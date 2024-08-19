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

export const constrain = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

