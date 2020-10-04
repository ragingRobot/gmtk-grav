import Phaser from 'phaser'
const MAX_LIFE = 3;
const WALK_SPEED = 250;
const DIRECTION_SWAP_TIME = 1000;
const directions = ['left', 'right', 'up', 'down'];

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 300, 600, 'player');
    this.scene = scene;
    this.life = MAX_LIFE;
    this.isAlive = true;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.scale = 3; //scaled up from low-res sprite, we can just make larger sprites if needed 
    this.currentDirection = 0;
    this.swapDirections();

    this.setTint(0xff0000, 0x00ff00, 0x0000ff, 0xff0000);

  }

  hitPlayer (playerY) {
    if(playerY > this.y){
      this.anims.play('hitup', true);
    } else {
      this.anims.play('hitdown', true);
    }

    //disable walk animations
    this.currentDirection = -1;
    setTimeout(()=>{
      //reenable
      this.currentDirection = 0;
    }, 500 * Math.random());

  }

  swapDirections(){
    if(this.currentDirection < directions.length - 1){
      this.currentDirection += 1;
    } else {
      this.currentDirection = 0;
    }
    setTimeout(this.swapDirections.bind(this), DIRECTION_SWAP_TIME);
  }

  updateLife(amount = -1) {
    if (this.life > 0 && !this.invincible) {
      this.invincible = true;
      setTimeout(() => {
        this.invincible = false;
      }, 1000);
    }
    if (this.life <= 0) {
      this.die();
    }
    return this.life;
  }

  die() {
    if (this.isAlive) {
      this.visible = false;
      this.isAlive = false;
      this.scene.sound.play('death');
      setTimeout(() => {
        this.scene.scene.restart();
      }, 2100);
    }
  }


  update() {
    if (!this.body) {
      return;
    }

    if(this.currentDirection > -1) {
      if (directions[this.currentDirection] == 'left')
      {
        this.body.setVelocityX(-WALK_SPEED); // move left
        this.anims.play('left', true);
      }
      else if (directions[this.currentDirection] == 'right')
      {
        this.body.setVelocityX(WALK_SPEED); // move right
        this.anims.play('right', true);
      } else {
        this.body.setVelocityX(this.body.velocity.x / 1.2);
      }


      if (directions[this.currentDirection] == 'up')
      {
        this.body.setVelocityY(-WALK_SPEED); // move up
        this.anims.play('up', true);
      }
      else if (directions[this.currentDirection] == 'down')
      {
        this.body.setVelocityY(WALK_SPEED); // move down
        this.anims.play('down', true);
      } else {
        this.body.setVelocityY(this.body.velocity.y / 1.2);
      }
    }

  }
}

Enemy.MAX_LIFE = MAX_LIFE;

export default Enemy;