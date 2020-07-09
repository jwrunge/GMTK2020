import Phaser from 'phaser'
import menuControls from './menuControls.js'

export default class StartMenu extends Phaser.Scene {
    constructor() {
        super('start_menu')
    }

    preload() {
        this.load.audio('music', 'src/assets/music/title.mp3')
        this.load.audio('startSound', 'src/assets/sfx/startgame.ogg')
    }

    create() {
        this.controls = new menuControls(this, ['Enter'])

        let title = this.add.text(400,190, "My Game", {fontSize: '64px'})
        title.setOrigin(.5)

        this.sound.play('music', {loop: true})

        this.arc = this.add.arc(400, 225, 135, 0, 180, false, "0xFFFFFF")

        let instruction = this.add.text(400, 250, "Press Space", { color: "black" })
        instruction.setOrigin(.5)
    }

    update() {
        let press = this.controls.keyPress()
        if(press === 'enter') {
            this.sound.play('startSound')
            this.sound.stopByKey('music')
            this.scene.start('game-scene')
        }
    }
}