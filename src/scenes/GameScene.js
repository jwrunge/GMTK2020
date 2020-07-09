import Phaser from 'phaser'

import Player from '../actors/Player'
import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from '../systems/BombSpawner'

const GROUND_KEY = 'ground'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene')
        
        this.player = new Player('dude', this, 150, 400)
        this.scoreLable = undefined
        this.bombSpawner = undefined
        this.stars = undefined
    }

    preload() {
        this.load.image('sky', 'src/assets/sky.png')
        this.load.image(GROUND_KEY, 'src/assets/platform.png')
        this.load.image(STAR_KEY, 'src/assets/star.png')
        this.load.image(BOMB_KEY, 'src/assets/bomb.png')

        this.player.loadSprites()

        this.load.audio('l1', 'src/assets/music/l1.mp3')
        this.load.audio('collect',"src/assets/sfx/collect.ogg")
        this.load.audio('bonk',"src/assets/sfx/bonk.ogg")
        this.load.audio('die',"src/assets/sfx/die.ogg")
    }

    create() {
        this.add.image(400, 300, 'sky')
        const platforms = this.createPlatforms()
        this.player.createPlayer()
        this.stars = this.createStars()

        this.scoreLabel = this.createScoreLabel(0, 0, 0)
        
        this.bombSpawner = new BombSpawner(this, BOMB_KEY)
        this.bombsGroup = this.bombSpawner.group

        this.physics.add.collider(this.player.actor, platforms)
        this.physics.add.collider(this.bombsGroup, platforms)

        this.physics.add.overlap(this.bombsGroup, this.bombsGroup, this.bounceAway, null, this)
        this.physics.add.overlap(this.player.actor, this.bombsGroup, this.die, null, this)

        this.physics.add.collider(this.stars, platforms, this.playBonk, null, this)

        this.physics.add.overlap(this.stars, this.bombsGroup, this.bounceAway, null, this)
        this.physics.add.overlap(this.stars, this.stars, this.bounceAway, null, this)
        this.physics.add.overlap(this.player.actor, this.stars, this.collectStar, null, this)

        this.sound.play('l1', {loop: true})
    }

    update() {
        this.player.handleInput()
    }

    playBonk(obj) {
        if(!obj.settled) {
            this.sound.play('bonk')
            obj.settled = true

            obj.coltimeout = setTimeout(()=> {
                obj.settled = false
            }, 100)
        }
        else {
            clearTimeout(obj.coltimeout)

            obj.coltimeout = setTimeout(()=> {
                obj.settled = false
            }, 1000)
        }
    }

    bounceAway(obj1, obj2) {
        if(!obj2.overlapped && !obj1.overlapped) {
            this.sound.play('bonk')

            obj1.overlapped = true
            obj2.overlapped = true

            obj1.setVelocityX(obj2.body.velocity.x)
            obj2.setVelocityX(obj2.body.velocity.x * -1)

            obj1.setVelocityY(obj2.body.velocity.y * -1)
            obj2.setVelocityY(obj2.body.velocity.y)

            obj1.timeout = setTimeout(()=> {
                obj1.overlapped = false
            }, 100)

            obj2.timeout = setTimeout(()=> {
                obj2.overlapped = false
            }, 100)
        }
        else {
            clearTimeout(obj1.timeout)
            clearTimeout(obj2.timeout)

            obj1.timeout = setTimeout(()=> {
                obj1.overlapped = false
            }, 100)

            obj2.timeout = setTimeout(()=> {
                obj2.overlapped = false
            }, 100)
        }
    }

    die(player) {
        this.sound.stopByKey('l1')
        this.sound.play('die')
        this.physics.pause()
        player.anims.play('turn')
        player.setTint(0xff0000);
        this.scoreLabel.setScore(0)
        this.stars.children.iterate(child=> {
            child.disableBody(true, true)
        })
        this.bombsGroup.children.iterate(child=> {
            child.disableBody(true, true)
        })

        setTimeout(()=> {
            this.sound.play('l1', {loop: true})
            this.physics.resume()
            this.stars.children.iterate(child=> {
                console.log(child.originalX)
                child.enableBody(true, child.originalX, 0, true, true)
            })

            player.clearTint()
        }, 2000)
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()

        platforms.create(400, 440, GROUND_KEY).setScale(2).refreshBody()
        platforms.create(600, 400, GROUND_KEY)
        platforms.create(50, 250, GROUND_KEY)
        platforms.create(750, 220, GROUND_KEY)

        return platforms
    }

    createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 70
            }
        })

        stars.children.iterate(child=> {
            child.originalX = child.x
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
            child.setCollideWorldBounds(true)
        })

        return stars
    }

    collectStar(player, star) {
        star.disableBody(true, true)
        this.scoreLabel.add(10)
        this.sound.play('collect')

        if(this.stars.countActive(true) === 0) {
            this.sound.play('startSound')
            this.stars.children.iterate(child=> {
                child.enableBody(true, child.originalX, 0, true, true)
            })

            this.bombSpawner.spawn(player.x)
        }
    }

    createScoreLabel(x, y, score) {
        const style = { fontSize: '32px', fill: '#000', backgroundColor: '#fff' }
        const label = new ScoreLabel(this, x, y, score, style)

        this.add.existing(label)
        return label
    }
}