export default class MenuControls {
    constructor(scene, menuOptions, twoD = true) {
        this.twoD = twoD
        this.menuKey = 0
        this.menuOptions = menuOptions
        this.keys = scene.input.keyboard.createCursorKeys()
    }

    keyPress() {
        if(this.keys.space.isDown) {
            return "enter"
        }
        else if(this.keys.up.isDown) {
            if(this.menuKey == 0) this.menuKey = this.menuOptions.length - 1
            else this.menuKey -= 1
        }
        else if(this.keys.down.isDown) {
            if(this.menuKey == this.menuOptions.length - 1) this.menuKey = 0
            else this.menuKey += 1
        }

        //If menuOptions is 1D, cycle up and down only
        else if(this.twoD) {
            if(this.keys.left.isDown) {
                if(this.menuKey == 0) this.menuKey = this.menuOptions.length - 1
                else this.menuKey -= 1
            }
            else if(this.keys.right.isDown) {
                if(this.menuKey == this.menuOptions.length - 1) this.menuKey = 0
                else this.menuKey += 1
            }
        }

        else {
            if(this.keys.left.isDown) {
                if(this.menuKey == 0) this.menuKey = this.menuOptions[0].length - 1
                else this.menuKey -= 1
            }
            else if(this.keys.right.isDown) {
                if(this.menuKey == this.menuOptions.length - 1) this.menuKey = 0
                else this.menuKey += 1
            }
        }
        
        return this.menuOptions[this.menuKey]
   }
}