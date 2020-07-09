export default class Player {
    constructor(name, scene, location) {
        this.scene = scene
        switch(name) {
            case 'dude': this.name = 'dude'
        }

        this.location = location
    }

    loadSprites() {
        let spritesheet, frameWidth, frameHeight
        if(this.name === 'dude') {
            spritesheet = 'src/assets/dude.png',
            frameWidth = 32,
            frameHeight = 48
        }

        this.scene.load.spritesheet(
            this.name, 
            spritesheet, 
            {frameWidth, frameHeight}
        )

        this.scene.load.audio('jump',"src/assets/sfx/jump.ogg")
    }

    createPlayer() {
        let bounce
        if(this.name = 'dude') bounce = 0.2

        /***
         * PHYSICS
         */
        this.actor = this.scene.physics.add.sprite(this.location.x, this.location.y, this.name)
        this.actor.setBounce(bounce)
        this.actor.setCollideWorldBounds(true)
        
        /***
         * ANIMATION
         */
        //Left walking animation
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers(this.name, {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })

        //Turn animation
        this.scene.anims.create({
            key: 'turn',
            frames: [ {key: this.name, frame: 4}],
            frameRate: 20
        })

        //Right walking animation
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers(this.name, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        })

        /***
         * CONTROLS
         */
        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }

    handleInput() {
        if(this.cursors.left.isDown) {
            this.actor.setVelocityX(-160)
            this.actor.anims.play('left', true)
        }
        else if(this.cursors.right.isDown) {
            this.actor.setVelocityX(160)
            this.actor.anims.play('right', true)
        }
        else {
            this.actor.setVelocityX(0)
            this.actor.anims.play('turn')
        }
    
        if(this.cursors.up.isDown) {
            if(this.actor.body.touching.down) {
                if(this.jumpTimeout) clearTimeout(this.jumpTimeout)
                this.canJump = true
                this.jumpV = -250
                this.actor.setVelocityY(this.jumpV)
                this.scene.sound.play('jump')
            }
            else if(this.canJump) {
                this.jumpTimeout = setTimeout(()=> { this.canJump = false }, 500)
                this.jumpV -= 0.25
                this.actor.setVelocityY(this.jumpV)
            }            
        }

        return this.actor
    }
}