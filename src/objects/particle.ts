type ParticleType = never

type ParticleAttributes<T extends ParticleType> = never

export class Particle {
    x: number
    y: number
    type: ParticleType
    attributes: ParticleAttributes<ParticleType>
    dead: boolean = false

    constructor(
        type: ParticleType,
        x: number,
        y: number,
        attributes: ParticleAttributes<ParticleType>,
    ) {
        this.x = x
        this.y = y
        this.type = type
        this.attributes = attributes
    }

    run() {
    }
}
