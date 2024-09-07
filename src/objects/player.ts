import Game from "@/lib/game"
import { canvas } from "@/lib/canvas/index"
import { dist, pointAt } from "@/lib/utils"
import { sfx } from "@/lib/sfx"
import { zzfx } from "@/lib/zzfx"
import { Entity } from "./entity"
import {
    GunWeapon,
    LongWeaponKey,
    MeeleeWeapon,
    MeeleeWeaponKey,
    ShortWeaponKey,
    WeaponKey,
    weapons,
} from "@/lib/weapons"
import { Enemy } from "./enemy"
import { levels } from "@/lib/levels"

export class Player extends Entity {
    hasFired = false
    health = [15, 30, 15] as [number, number, number]
    maxHealth = [15, 30, 15] as [number, number, number]
    arsenal: [[type: LongWeaponKey, ammo: number], [type: ShortWeaponKey, ammo: number], [type: MeeleeWeaponKey]] = [
        [0, levels[Game.level].mainWeaponAmmo],
        [5, levels[Game.level].sideWeaponAmmo],
        [9],
    ]
    currentWeapon = 0
    weapon: WeaponKey = this.arsenal[this.currentWeapon][0]
    dashDelay = 50
    dashTime = 50
    footstep = [false, false] as [boolean, boolean]

    // UI Vars
    weaponNumberTo = 0
    hoveringEnemy: Enemy | undefined = undefined
    hoverFrame = 0
    timeSinceDamaged = 0
    tutorialEnemy: Enemy | undefined = undefined

    constructor(x: number, y: number) {
        super(x, y)

        this.speed = 7
    }

    run() {
        const isTutorial = Game.level == 0 && Game.tutorialStep <= 7

        // Dead & Dying states
        if (this.health.some(h => h <= 0)) {
            if (isTutorial) Game.tutorialStep = 0
            Game.scene = 4
            this.dead = true
        }

        // Movement
        if (Game.keysDown("ArrowRight", "d")) {
            this.movingDir = 1
        } else if (Game.keysDown("ArrowLeft", "a")) {
            this.movingDir = -1
        } else {
            this.movingDir = 0
        }
        if (Game.keysDown("ArrowUp", "w", " ") && this.canJump) {
            zzfx(...sfx[7])
            this.jump()
        }

        if (this.dashTime > 0) this.dashTime--

        if (
            this.dashTime === 0 &&
            Game.keysDown("Shift") &&
            this.movingDir != 0 &&
            this.canJump &&
            !this.isAgainstWall
        ) {
            if (isTutorial && Game.tutorialStep == 1) {
                this.arsenal[0][1] = 5
                Game.tutorialStep = 2
            }
            this.knockback -= 20 * this.movingDir
            this.dashTime = this.dashDelay
        }

        if (Game.keysDown("1")) this.currentWeapon = 0
        if (Game.keysDown("2")) this.currentWeapon = 1
        if (Game.keysDown("3")) this.currentWeapon = 2

        if (isTutorial) {
            if (
                Game.keysDown("w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight") &&
                Game.tutorialStep == 0
            ) {
                Game.tutorialStep = 1
            }

            if (Game.keysDown("1", "2", "3") && Game.tutorialStep == 3) {
                this.x = 75
                Game.bullets = []
                this.tutorialEnemy = new Enemy("t", 375, 50)
                Game.entities.push(this.tutorialEnemy)
                Game.tutorialStep = 4
            }

            if (Game.tutorialStep == 4 && this.tutorialEnemy?.isHovered) {
                this.arsenal[0][1] = 25
                this.currentWeapon = 0
                Game.tutorialStep = 5
            }

            if (Game.tutorialStep == 5) {
                if (this.tutorialEnemy?.hasSurrendered || this.tutorialEnemy?.dying) {
                    Game.tutorialStep = 6
                }
            }

            if (Game.tutorialStep == 6 && this.tutorialEnemy?.weaponTaken) {
                Game.tutorialStep = 7
            }

            if (Game.tutorialStep == 7 && Game.keysPressedDown("e")) {
                Game.scene = 3
            }
        }

        this.weapon = this.arsenal[this.currentWeapon][0]

        // Mouse
        const mouseX = Game.mouseX - Game.cameraX
        const mouseY = Game.mouseY - Game.cameraY

        if (mouseX > this.centerX) this.dir = 1
        else if (mouseX < this.centerX) this.dir = -1

        this.weaponRotation = Math.atan2(mouseY - this.centerY, mouseX - this.centerX)

        if (this.wp.type == 0) {
            const [x, y] = pointAt(
                this.centerX,
                this.centerY,
                Math.atan2(mouseY - this.centerY, mouseX - this.centerX) + (Math.PI / 2) * this.dir,
                this.wp.barrelY,
            )

            this.weaponRotation = Math.atan2(mouseY - y, mouseX - x)
        }

        this.animateVars()
        this.handleBulletCollisions(() => {
            this.timeSinceDamaged = 0
            zzfx(...sfx[10])
        })

        if (this.timeSinceDamaged < 250) this.timeSinceDamaged++
        if (this.fireCooldown > 0) this.fireCooldown--
        if (this.timeSinceDamaged >= 250) {
            if (this.health[0] < this.maxHealth[0]) this.health[0] += (1 - this.health[0] / this.maxHealth[0]) * 0.1
            if (this.health[1] < this.maxHealth[1]) this.health[1] += (1 - this.health[1] / this.maxHealth[1]) * 0.1
            if (this.health[2] < this.maxHealth[2]) this.health[2] += (1 - this.health[2] / this.maxHealth[2]) * 0.1
        }

        // Attacks
        if (Game.pressed && this.fireCooldown == 0 && (this.wp.type == 1 || this.wp.isSemi ? !this.hasFired : true)) {
            if (isTutorial && Game.tutorialStep == 2 && this.arsenal[0][1] == 0) {
                Game.tutorialStep = 3
            }
            // Meelee weapons
            if (this.wp.type == 1) {
                this.fireFrame = 1
                zzfx(...sfx[4])
                const [x, y] = pointAt(this.centerX, this.centerY, this.weaponRotationTo, this.wp.length)
                for (const enemy of Game.entities) {
                    if (!(enemy instanceof Enemy) || enemy.dying) continue
                    const strikeX = Math.min(Math.max(x, enemy.x), enemy.x + enemy.w)
                    const strikeY = Math.min(Math.max(y, enemy.y), enemy.y + enemy.h)
                    const strikeDist = dist(x, y, strikeX, strikeY)

                    if (strikeDist < this.wp.range) {
                        const dirFromPlayer = enemy.x < this.x ? 1 : -1
                        zzfx(...sfx[9])
                        enemy.health[1] -= this.wp.damage
                        enemy.knockback = enemy.hasSurrendered
                            ? this.wp.knockback / 4
                            : this.wp.knockback * dirFromPlayer
                        enemy.rotateTo += this.wp.knockback * 2 * (Math.PI / 180) * -dirFromPlayer
                        if (!enemy.hasSurrendered && !enemy.dying) {
                            setTimeout(() => {
                                if (this.dead || enemy.dead) return
                                enemy.dir = this.x < enemy.x ? -1 : 1
                            }, 500)
                        }
                    }
                }
            } else {
                const current = this.arsenal[this.currentWeapon as 0 | 1]
                if (current[1] > 0) {
                    this.fireFrame = 1
                    zzfx(...sfx[this.wp.sound ?? 0])
                    this.shoot(this.weaponRotationTo)
                    this.notifyClosest(this.x)
                    current[1]--
                } else if (!this.hasFired) {
                    zzfx(...sfx[3])
                }
            }

            this.hasFired = true
        }

        if (Game.released && this.hasFired) {
            this.hasFired = false
        }
    }

    render() {
        const speedWeightRatio = this.wp.type || (this.speed - this.wp.weight) / this.speed

        if (Math.floor(Math.cos((Game.frameCount / 2.5) * speedWeightRatio)) == 0 && this.movingDir != 0) {
            this.footstep[1] = true
        } else {
            this.footstep[1] = false
        }

        if (this.footstep[1] && !this.footstep[0] && this.canJump) {
            zzfx(...sfx[Math.random() > 0.5 ? 5 : 6])
            this.footstep[0] = true
            setTimeout(() => (this.footstep[0] = false), 200)
        }

        canvas
            .push()
            .translate(this.centerX, this.y + this.h)
            .rotate(this.baseRotation)
            // Legs
            .lineWidth(7.5)
            .lineCap("round")
            .strokeStyle("rgb(15,50,5)")
            .push()
            .translate(
                -2.5 * this.baseScaleTo + Math.cos((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 5,
                -25,
            )
            .scale(this.dirTo, 1 - Math.sin((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 0.15)
            .rotate(
                this.movingDirTo * ((Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) + Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .strokeStyle("rgb(35,70,15)")
            .push()
            .translate(
                -2.5 * this.baseScaleTo - Math.cos((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 5,
                -25,
            )
            .scale(this.dirTo, 1 + Math.sin((Game.frameCount / 5) * speedWeightRatio) * this.movingDirTo * 0.15)
            .rotate(
                this.movingDirTo * ((1 - Math.sin((Game.frameCount / 5) * speedWeightRatio) * Math.PI) / 4) +
                    Math.PI / 4,
            )
            .path()
            .arc(0, 15, 15, -Math.PI / 2, 0)
            .stroke()
            .close()
            .pop()
            .push()
            .translate(-this.w / 2, -this.h)
            // Body
            .fillStyle("rgb(45,100,15)")
            .roundFillRect(10 - 2.5 * this.baseScaleTo, 20, 20, 40, 25)
            .fillStyle("rgb(35,80,10)")
            .roundFillRect(7.5 - 2.5 * this.baseScaleTo, 20, 25, 30, [25, 25, 5, 5])
            // Head
            .fillStyle("#F4DEB3")
            .roundFillRect(12.5, 2.5, 15, 15, 15)
            // Helmet
            .fillStyle("rgb(35,80,10)")
            .roundFillRect(10, 0, 20, 10, [20, 20, 2.5 + this.baseScaleTo * 2.5, 2.5 - this.baseScaleTo * 2.5])
            .roundFillRect(15 - 5 * this.baseScaleTo, 10, 10, 5, [
                0,
                0,
                7.5 - this.baseScaleTo * 2.5,
                7.5 + this.baseScaleTo * 2.5,
            ])
            .pop()
            .pop()

        if (this.wp.type == 0) {
            const [x, y] = this.gunTip()
            const [x2, y2] = pointAt(x, y, this.weaponRotationTo, this.wp.lifetime * this.wp.bulletSpeed)
            const distToMouse = dist(x, y, Game.mouseX - Game.cameraX, Game.mouseY - Game.cameraY)
            const [mx, my] = pointAt(x, y, this.weaponRotationTo, distToMouse)
            const gunTipToCenter = dist(x, y, this.centerX, this.centerY)
            const distToCenter = dist(Game.mouseX, Game.mouseY, canvas.canvasWidth / 2, canvas.canvasHeight / 2)

            canvas
                .strokeStyle(
                    this.hoveringEnemy
                        ? `rgba(0,200,150,${0.6 * this.hoverFrame})`
                        : `rgba(255,255,255,${Math.min(Math.max(Math.PI / 180 / this.recoilRotation / this.wp.recoilY, 0), 1) * 0.2})`,
                )
                .fillStyle(this.hoveringEnemy ? `rgba(0,200,150,${0.2 * this.hoverFrame})` : "#0000")
                .lineWidth(2)
                .path()
                .moveTo(x, y)
                .arc(
                    mx,
                    my,
                    distToCenter < gunTipToCenter ? 0 : 10 + this.hoverFrame * 10,
                    this.weaponRotationTo + Math.PI,
                    this.weaponRotationTo,
                )
                .lineTo(x2, y2)
                .arc(
                    mx,
                    my,
                    distToCenter < gunTipToCenter ? 0 : 10 + this.hoverFrame * 10,
                    this.weaponRotationTo,
                    this.weaponRotationTo + Math.PI,
                )
                .stroke()
                .fill()
                .close()
        } else {
            const [x, y] = pointAt(this.centerX, this.centerY, this.weaponRotationTo, this.wp.length)

            canvas
                .strokeStyle(`rgba(255,255,255,0.2)`)
                .lineWidth(2)
                .path()
                .arc(x, y, this.wp.range, this.weaponRotationTo - Math.PI, this.weaponRotationTo + Math.PI)
                .stroke()
                .close()
        }

        canvas
            .push()
            .translate(this.centerX - 2.5 * this.baseScaleTo, this.y + 30 - 2.5)
            .rotate(this.weaponRotationTo)
            .scale(1, this.dirTo)
            .rotate(0)
        this.wp.render(this.fireFrame, "rgb(25,60,5)", "#000")
        canvas.pop()
    }

    renderUI() {
        this.weaponNumberTo += this.weaponNumberTo.tween(this.currentWeapon, 5)

        canvas
            .fillStyle(`rgba(0,200,150,${this.currentWeapon == 0 ? 0.4 : 0.2})`)
            .roundFillRect(10, 10, 100, 70, 10)
            .fillStyle(`rgba(0,200,150,${this.currentWeapon == 1 ? 0.4 : 0.2})`)
            .roundFillRect(120, 10, 100, 70, 10)
            .fillStyle(`rgba(0,200,150,${this.currentWeapon == 2 ? 0.4 : 0.2})`)
            .roundFillRect(230, 10, 100, 70, 10)

        canvas
            .push()
            .strokeStyle("rgba(0,200,150,0.8)")
            .fillStyle("red")
            .lineWidth(3)
            .lineCap("round")
            .translate(this.weaponNumberTo * 110, 0)
            .path()
            .arc(20, 20, 15, Math.PI, Math.PI * 1.5)
            .stroke()
            .close()
            .path()
            .arc(100, 20, 15, Math.PI * 1.5, Math.PI * 2)
            .stroke()
            .close()
            .path()
            .arc(100, 70, 15, 0, Math.PI / 2)
            .stroke()
            .close()
            .path()
            .arc(20, 70, 15, Math.PI / 2, Math.PI)
            .stroke()
            .close()
            .pop()

        const longWeapon = weapons[this.arsenal[0][0]] as GunWeapon

        canvas
            .push()
            .translate(20, 60)
            .rotate(-Math.PI / 6)
            .translate(...longWeapon.offset)
        longWeapon.render(0, "#0000", "#000")
        canvas
            .pop()
            .fillStyle(this.currentWeapon == 0 ? "#fff" : "rgba(0,200,150,0.4)")
            .text(longWeapon.name, 60, 50)
            .font("12px monospace")
            .text("[1]", 25, 25)
            .text("" + this.arsenal[0][1], 95, 70)
            .roundFillRect(80, 63, 4, 12, [5, 5, 1, 1])

        const sideWeapon = weapons[this.arsenal[1][0]] as GunWeapon

        canvas
            .push()
            .translate(120, 60)
            .rotate(-Math.PI / 6)
            .translate(...sideWeapon.offset)
        sideWeapon.render(0, "#0000", "#000")
        canvas
            .pop()
            .fillStyle(this.currentWeapon == 1 ? "#fff" : "rgba(0,200,150,0.4)")
            .text(sideWeapon.name, 170, 50)
            .font("12px monospace")
            .text("[2]", 135, 25)
            .text("" + this.arsenal[1][1], 205, 70)
            .roundFillRect(190, 63, 4, 12, [5, 5, 1, 1])

        const meeleeWeapon = weapons[this.arsenal[2][0]] as MeeleeWeapon

        canvas
            .push()
            .translate(240, 60)
            .rotate(-Math.PI / 6 + Math.PI / 2)
            .translate(...meeleeWeapon.offset)
        meeleeWeapon.render(0, "#0000", "#000")
        canvas
            .pop()
            .fillStyle(this.currentWeapon == 2 ? "#fff" : "rgba(0,200,150,0.4)")
            .text(meeleeWeapon.name, 280, 50)
            .text("[3]", 245, 25)

        // Health indicator
        canvas
            .fillStyle(
                `rgba(${(1 - this.health[0] / this.maxHealth[0]) * 200},${(this.health[0] / this.maxHealth[0]) * 200},${(this.health[0] / this.maxHealth[0]) * 100 + 50},0.4)`,
            )
            .roundFillRect(10, canvas.canvasHeight - 130, 100, 25, [10, 10, 0, 0])
            .roundFillRect(35, canvas.canvasHeight - 125, 20, 20, 20)
            .fillStyle(
                `rgba(${(1 - this.health[1] / this.maxHealth[1]) * 200},${(this.health[1] / this.maxHealth[1]) * 200},${(this.health[1] / this.maxHealth[1]) * 100 + 50},0.4)`,
            )
            .roundFillRect(10, canvas.canvasHeight - 105, 100, 45, 0)
            .path()
            .roundRect(20, canvas.canvasHeight - 100, 50, 20, [10, 10, 0, 0])
            .roundRect(20, canvas.canvasHeight - 80, 7.5, 20, [0, 0, 10, 10])
            .roundRect(62.5, canvas.canvasHeight - 80, 7.5, 20, [0, 0, 10, 10])
            .roundRect(32.5, canvas.canvasHeight - 80, 25, 20, 0)
            .fill()
            .close()
            .fillStyle(
                `rgba(${(1 - this.health[2] / this.maxHealth[2]) * 200},${(this.health[2] / this.maxHealth[2]) * 200},${(this.health[2] / this.maxHealth[2]) * 100 + 50},0.4)`,
            )
            .roundFillRect(10, canvas.canvasHeight - 60, 100, 50, [0, 0, 10, 10])
            .path()
            .roundRect(32.5, canvas.canvasHeight - 60, 25, 10, 0)
            .roundRect(32.5, canvas.canvasHeight - 50, 10, 35, [0, 0, 10, 10])
            .roundRect(47.5, canvas.canvasHeight - 50, 10, 35, [0, 0, 10, 10])
            .fill()
            .close()
            .fillStyle("#fff")
            .align("right")
            .baseLine("middle")
            .text("- " + ((this.health[0] / this.maxHealth[0]) * 100).toFixed(0) + "%", 105, canvas.canvasHeight - 115)
            .text(((this.health[1] / this.maxHealth[1]) * 100).toFixed(0) + "%", 105, canvas.canvasHeight - 75)
            .text("- " + ((this.health[2] / this.maxHealth[2]) * 100).toFixed(0) + "%", 105, canvas.canvasHeight - 35)

        const hoveredEnemy = Game.entities.find(e => e instanceof Enemy && e.isHovered) as Enemy | undefined

        if (hoveredEnemy) {
            this.hoveringEnemy = hoveredEnemy
            this.hoverFrame += this.hoverFrame.tween(1, 10)
            canvas
                .fillStyle(`rgba(0,200,150,${0.3 * this.hoverFrame})`)
                .roundFillRect(canvas.canvasWidth - 160, 10, 150, 140, 10)
                .fillStyle("#fff")
                .align("left")
                .baseLine("top")
                .font("12px monospace")
                .text(hoveredEnemy.name, canvas.canvasWidth - 150, 20)
                .fillStyle("#fff7")
                .roundFillRect(canvas.canvasWidth - 150, 32, canvas.context.measureText(hoveredEnemy.name).width, 2, 10)
                .fillStyle("#fff")
                .font("10px monospace")
                .text("Bounty:", canvas.canvasWidth - 150, 40)
                .text("Rank: " + hoveredEnemy.stats.name, canvas.canvasWidth - 150, 80)
                .text(
                    "Weapon: " + (hoveredEnemy.weaponTaken ? "--" : weapons[hoveredEnemy.weapon].name),
                    canvas.canvasWidth - 150,
                    135,
                )
                .font("8px monospace")
                .fillStyle("#fffa")
                .text("Alive: $" + hoveredEnemy.stats.bountyAlive, canvas.canvasWidth - 145, 55)
                .text("Dead: $" + hoveredEnemy.stats.bountyDead, canvas.canvasWidth - 145, 65)
                .text(hoveredEnemy.stats.description, canvas.canvasWidth - 145, 95, 135)
        } else {
            this.hoverFrame += this.hoverFrame.tween(0, 10)
            this.hoveringEnemy = undefined
        }

        if (Game.level == 0) {
            let tutorialMessage =
                "Gang members taken alive have a higher bounty than enemies who are killed. Press [E] to complete tutorial"

            if (Game.tutorialStep == 0) {
                tutorialMessage = "WASD / Arrow Keys to move"
            } else if (Game.tutorialStep == 1) {
                tutorialMessage = "While moving, [Shift] to dash. No dashing in the air"
            } else if (Game.tutorialStep == 2) {
                tutorialMessage = "Mouse to aim, Click / Hold mouse to attack"
            } else if (Game.tutorialStep == 3) {
                tutorialMessage = "[1][2][3] to switch weapons"
            } else if (Game.tutorialStep == 4) {
                tutorialMessage = "Hover over enemies to see their stats, rank, weapon, and bounty"
            } else if (Game.tutorialStep == 5) {
                tutorialMessage =
                    "Attack gang members until they surrender or are killed. Headshots are ideal for quickly taking down dangerous enemies"
            } else if (Game.tutorialStep == 6) {
                tutorialMessage = "Walk to the defeated gangster and press [E] to take his weapon and/or ammo"
            }

            canvas
                .fillStyle("rgba(0,200,150,0.4)")
                .roundFillRect(canvas.canvasWidth - 310, canvas.canvasHeight - 90, 300, 80, 10)
                .fillStyle("#fff")
                .font("12px monospace")
                .align("left")
                .baseLine("top")
                .text(
                    "Tutorial (" + (Game.tutorialStep + 1) + "/8)",
                    canvas.canvasWidth - 300,
                    canvas.canvasHeight - 80,
                )
                .font("10px monospace")
                .fillStyle("#fffa")
                .text(tutorialMessage, canvas.canvasWidth - 300, canvas.canvasHeight - 65, 280)
        } else {
            const threatCount = Game.entities.filter(
                e => e instanceof Enemy && !e.dying && !e.hasSurrendered && !e.dead,
            ).length
            canvas
                .fillStyle("#fff")
                .align("right")
                .baseLine("top")
                .font("bold 15px monospace")
                .text(levels[Game.level].name, canvas.canvasWidth - 10, canvas.canvasHeight - 50)
                .font("12px monospace")
                .text(
                    threatCount + " Active Threat" + (threatCount == 1 ? "" : "s"),
                    canvas.canvasWidth - 10,
                    canvas.canvasHeight - 25,
                )

            if (threatCount == 0 && !Game.pressed) {
                if (Game.level == levels.length - 1) {
                    Game.scene = 5
                } else {
                    Game.scene = 3
                }
            }
        }

        // Cursor
        canvas
            .strokeStyle(this.hoveringEnemy ? "rgba(0,200,150,0.6)" : "rgba(255,255,255,0.5)")
            .lineWidth(2)
            .lineCap("round")
            .push()
            .translate(Game.mouseX, Game.mouseY)
            .path()
            .arc(0, 0, 1, 0, Math.PI * 2)
            .moveTo(10, 0)
            .lineTo(20, 0)
            .moveTo(0, 10)
            .lineTo(0, 20)
            .moveTo(-10, 0)
            .lineTo(-20, 0)
            .moveTo(0, -10)
            .lineTo(0, -20)
            .stroke()
            .close()
            .pop()
    }
}
