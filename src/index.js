import Phaser from "phaser";

//Scenes
import Start from './scenes/menus/Start'
import GameScene from './scenes/GameScene'

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  autoRound: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      // debug: false
    }
  },
  scene: [Start, GameScene]
};

export default new Phaser.Game(config)