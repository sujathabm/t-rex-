//Declaring sprites, their images, sounds and cacti group.
var trex, trexImage;
var cactiGroup, cactus1, cactus2, cactus3;
var sun, sunImage;
var ground, groundImage;
var restart, restartImage;
var jumpSound, checkPointSound1,checkPointSound2, dieSound;

//Declaring game states.
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Declaring score and initializing it to 0.
var score = 0;

function preload(){
  
    //Loading trex image.
    trexImage = loadImage("trex.png");
  
    //Loading cacti images.
    cactus1 = loadImage("cactus1.png");
    cactus2 = loadImage("cactus2.png");
    cactus3 = loadImage("cactus3.png");
  
    //Loading sun image.
    sunImage = loadImage("sun.png");
  
    //Loading ground image.
    groundImage = loadImage("ground.jpg");
  
    //Loading restart image.
    restartImage = loadImage("restart.png")
  
    //Loading sounds.
    jumpSound = loadSound("smb_jump-small.wav");
    checkPointSound1 = loadSound("smb_1-up.wav");
    checkPointSound2 = loadSound("smb_powerup.wav")
    dieSound = loadSound("smb_mariodie.wav");
  
}

function setup(){

    //Creating canvas as big as the screen.
    createCanvas(windowWidth, windowHeight);
  
    //Creating trex, adding its image and making it small.
    trex = createSprite(50, height - 25, 20, 20);
    trex.addImage(trexImage);
    trex.scale = 0.03;
  
    //Creating sun, adding its image and making it small.
    sun = createSprite(width - 50, 50, 20, 20);
    sun.addImage(sunImage);
    sun.scale = 0.1;
  
    //Creating ground, adding its image and  enlarging it.
    ground = createSprite(width/2, height + 150, width, 5);
    ground.addImage(groundImage);
    ground.scale = 10.5;
  
    //Creating restart, adding its image, making it small and hiding it.
    restart = createSprite(width/2, 180, 20, 20);
    restart.addImage(restartImage);
    restart.scale = 0.05;
    restart.visible = false;
  
    //Creating cacti group.
    cactiGroup = new Group();

}


function draw(){
  
    //Hiding multiple sprites.
    background("lightblue");
  
    //Preventing trex to fall down.
    trex.collide(ground);
  
    //Showing the score.
    textSize(20);
    fill("green");
    text("Score : " + score, 200, 50);
  
    if(gameState === PLAY){
      //Making trex jump when pressing space or touching the screen.
      if(keyDown("space") && trex.y >= height - 55 || touches.length > 0){
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
      }
      //Adding gravity.
      trex.velocityY = trex.velocityY + 0.8;
      
      //Increasing the speed of the ground.
      ground.velocityX = -(5 + score/100);
      //Resetting the ground.
      if(ground.x < 0){
        ground.x = width/2;
      }
      
      //Increasing the score.
      score = score + Math.round(getFrameRate()/60);
      
      //Playing check point sounds.
      if(score % 100 === 0 && score % 500 > 0 && score > 0){
        checkPointSound1.play();
      }
      
      if(score % 500 === 0 && score > 0){
        checkPointSound2.play();
      }
      
      //Spawning cacti.
      spawnCacti();
      
      //Ending the game.
      if(trex.isTouching(cactiGroup)){
        dieSound.play();
        gameState = END;
      }
    } else if(gameState === END){
      //Stopping the ground from moving.
      ground.velocityX = 0;
      
      //Stopping the cacti group from moving and making it visible continuously.
      cactiGroup.setVelocityXEach(0);
      cactiGroup.setLifetimeEach(-1);
      
      //Making restart visible.
      restart.visible = true;
      
      //Showing game over and instructions to restart.
      textSize(20);
      fill("red");
      text("GAME OVER", 200, 100);
      text("Click on the restart button", 150, 130);
      
      //Resetting the game.
      if(mousePressedOver(restart) || touches.length > 0){
        reset();
        touches = [];
      }
    }
  
    drawSprites();
  
}

function reset(){

    //Resetting the game state.
    gameState = PLAY;
    
    //Hiding restart.
    restart.visible = false;
  
    //Resetting the score.
    score = 0;
  
    //Destroying the remaining cacti.
    cactiGroup.destroyEach();
  
}

function spawnCacti(){

    //Spawning one cactus every 60th frame.
    if(World.frameCount % 60 === 0){
      //Creating cactus, giving its speed and increasing the speed.
      var cactus = createSprite(width, height - 40, 20, 10);
      cactus.velocityX = -(5 + score/100);
      
      //giving choice for the number of cacti.
      var rand = Math.round(random(1, 3));
      
      //Spawning random number number of cacti.
      switch(rand){
        case 1 :
          cactus.addImage(cactus1);
          cactus.scale = 0.005;
          break;
          
        case 2 :
          cactus.addImage(cactus2);
          cactus.scale = 0.005;
          break;
          
        case 3 :
          cactus.addImage(cactus3);
          cactus.scale = 0.05;
          break;
          
        default :
          break;
      }
      //Giving lifetime to the cactus and adding it to the cacti group.
      cactus.lifetime = width/cactus.velocityX;
      cactiGroup.add(cactus);
    }

}