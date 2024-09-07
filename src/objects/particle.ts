import { canvas } from "@/lib/canvas/index"
import { pointAt } from "@/lib/utils"

type CustomParticleAttributes =
    | {
          type: 0
          r: number
          color: [number, number, number]
          yVel: number
          dir: -1 | 1
          width: number
          height: number
      }
    | {
          type: 1
          r: number
          angle: number
          bulletSpeed: number
      }
    | {
          type: 2
          r: number
      }
    | {
          type: 3
          r: number
          bulletSpeed: number
          tail: number
      }

type ParticleAttributes = CustomParticleAttributes & { x: number; y: number; lifetime: number }

export class Particle {
    a: ParticleAttributes
    dead = false

    constructor(a: ParticleAttributes) {
        this.a = a
    }

    run() {
        if (this.a.type == 0) {
            this.a.x -= this.a.dir * 10
            this.a.yVel++
            this.a.y += this.a.yVel
            this.a.lifetime -= 0.5
            this.a.r += (Math.PI / 60) * this.a.dir

            canvas
                .push()
                .translate(this.a.x, this.a.y)
                .rotate(this.a.r)
                .fillStyle(`rgba(${this.a.color.join(",")},${this.a.lifetime / 25})`)
                .fillRect(0, 0, this.a.width, this.a.height)
                .pop()

            if (this.a.lifetime <= 0) {
                this.dead = true
            }
        }

        if (this.a.type == 1) {
            this.a.x += Math.cos(this.a.r) * this.a.lifetime
            this.a.y += Math.sin(this.a.r) * this.a.lifetime
            this.a.lifetime += this.a.lifetime.tween(0, 2)

            if (this.a.lifetime <= 0.01) this.dead = true

            canvas
                .fillStyle(`rgba(200,200,200,${this.a.lifetime / 5}`)
                .path()
                .moveTo(this.a.x, this.a.y)
                .arc(
                    this.a.x,
                    this.a.y,
                    (1 - this.a.lifetime) * this.a.bulletSpeed,
                    this.a.r - this.a.angle,
                    this.a.r + this.a.angle,
                )
                .fill()
                .close()
        }

        if (this.a.type == 2) {
            this.a.x += Math.cos(this.a.r) * this.a.lifetime
            this.a.y += Math.sin(this.a.r) * this.a.lifetime
            this.a.lifetime += this.a.lifetime.tween(0, 5)

            const [x2, y2] = pointAt(this.a.x, this.a.y, this.a.r, this.a.lifetime)

            canvas
                .strokeStyle(`rgba(255,230,160,${this.a.lifetime})`)
                .lineWidth(2)
                .path()
                .moveTo(this.a.x, this.a.y)
                .lineTo(x2, y2)
                .stroke()
                .close()

            if (this.a.lifetime <= 0.01) this.dead = true
        }

        if (this.a.type == 3) {
            this.a.lifetime += this.a.lifetime.tween(0, 2)
            this.a.x += (Math.cos(this.a.r) * this.a.bulletSpeed) / 4
            this.a.y += (Math.sin(this.a.r) * this.a.bulletSpeed) / 4
            this.a.tail += this.a.bulletSpeed / 8

            canvas
                .fillStyle(`rgba(156,25,20,${this.a.lifetime * 2})`)
                .strokeStyle(`rgba(200,0,0,${this.a.lifetime * 2})`)
                .push()
                .translate(this.a.x, this.a.y)
                .rotate(this.a.r)
                .path()
                .moveTo(-this.a.tail / 2, 0)
                .lineTo(0, -2)
                .lineTo(this.a.tail, 0)
                .lineTo(0, 2)
                .lineTo(-this.a.tail / 2, 0)
                .stroke()
                .fill()
                .close()
                .pop()

            if (this.a.lifetime <= 0.01) this.dead = true
        }
    }
}
