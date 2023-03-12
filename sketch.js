let stretchy, floor;
let count = 0;
let MARGIN = 10;
let screen = 0;
let initialize = true;
let sound;
let cnv;
let timeCounter = 0;
let levelSpeed = -1;
let playBtnCounter = true;
let replayBtnCounter = true;
let nextScreenBtn;
let nameInput;
let button;
let mydiv;
let items;

function preload() {
  soundFormats("mp3");
  quartzo = loadFont("assets/quartzo.ttf");

  // game_over_sound = loadSound("./assets/game_over.mp3");
  // bounce_sound = loadSound("bounce.wav");
}

function setup() {
  cnv = createCanvas(400, 400);
  cnv.parent("game-div");
  items = new Group();
  frameRate(60);
}

function draw() {
  if (screen == 0) {
    startScreen();
  } else if (screen == 1) {
    gameOn();
    // if the screen variable was changed to 2, show the game over screen
  } else if (screen == 2) {
    gameOver();
  }
}

function changeScreen() {
  if (screen == 0) {
    screen = 1;
    nextScreenBtn.remove();
    playBtnCounter = true;
  } else if (screen == 2) {
    initialize = true;
    screen = 0;
    enter(timeCounter, nameInput.value());
    nameInput.remove();
    button.remove();
    replayBtnCounter = true;
  }
}

function startScreen() {
  background("#e4f1f7");
  fill("black");
  textSize(32);
  timeCounter = 0;
  levelSpeed = -1;
  textAlign(CENTER);
  textLeading(45);
  textFont("Coiny");
  text("Levels Game!", width / 2, height / 2);
  textSize(18);
  if (playBtnCounter) {
    nextScreenBtn = createButton("Play");
    nextScreenBtn.parent("game-div");

    nextScreenBtn.position(-250, 300, "relative");
    nextScreenBtn.size(100, 40);
    nextScreenBtn.style(
      "background-color: #ff70a6; border: none; border-radius: 10px"
    );
    nextScreenBtn.mouseOver(() =>
      nextScreenBtn.style("background-color: #f694c1;")
    );
    nextScreenBtn.mouseOut(() =>
      nextScreenBtn.style("background-color: #ff70a6;")
    );
    nextScreenBtn.mouseClicked(changeScreen);
    playBtnCounter = false;
  }
}

function clearCanvas() {
  rect(0, 0, canvas.width, canvas.height);
  background("white");
}

function gameOn() {
  let x_pos = random(0, 400);
  let platform_width = random(40, 350);

  background("#e4f1f7");
  text("Score: " + timeCounter, width / 2, 20);
  noStroke();

  for (let s of allSprites) {
    if (s.x < -MARGIN) s.x = width + MARGIN;
    if (s.x > width + MARGIN) s.x = -MARGIN;
  }

  if (initialize) {
    world.gravity.y = 20;
    face = loadImage("./assets/face.png");
    stretchy = new Sprite();
    stretchy.draw = () => {
      fill(237, 205, 0);

      push();
      rotate(stretchy.direction);
      ellipse(0, 0, 70 + stretchy.speed, 70 - stretchy.speed);
      pop();

      image(face, stretchy.vel.x, stretchy.vel.y);

      if (kb.pressing("left")) {
        stretchy.vel.x = -5;
      } else if (kb.pressing("right")) {
        stretchy.vel.x = 5;
      } else {
        stretchy.vel.x = 0;
      }
    };
    floor = new items.Sprite(width / 2, 400, 200, 10);
    floor.collider = "static";
    floor.collider = "k";
    floor.velocity.y = -1;
    initialize = false;
  }

  // end game criteria
  if (stretchy.y > height || stretchy.y < 0) {
    screen = 2;
  }

  // spawn pipes every 120 frames (2 second)
  if (frameCount % 120 == 2) {
    print("timeCounter: " + timeCounter);
    if (levelSpeed > -2) {
      print("levelSpeed: " + levelSpeed);
    }
    timeCounter++;
    // Sprite ( [x]  [y]  [width]  [height]  [colliderType] )
    // Add a floor
    floor = new items.Sprite(x_pos, 400, platform_width, 10);
    floor.collider = "k";
    floor.velocity.y = levelSpeed;
  }

  // get rid of passed platforms
  for (let item of items) {
    if (item.y == 0) {
      item.remove();
    }
  }
}

function gameOver() {
  allSprites.remove();
  if (sound == true) {
    game_over_sound.play();
    sound = false;
  }
  background("#fce6e6");
  fill("black");
  textAlign(CENTER);
  textSize(32);
  textLeading(45);
  text("Game over :(", width / 2, 50);
  textSize(24);
  text("Score: " + timeCounter, width / 2, 100);

  textSize(12);
  text("Enter your name", 120, 130);

  textSize(18);

  if (replayBtnCounter) {
    nameInput = createInput();
    nameInput.position(-330, 160, "relative");
    nameInput.size(160, 30);
    nameInput.style("border: none; border-radius: 10px");
    nameInput.parent("game-div");
    button = createButton("submit");
    button.size(80, 30);

    button.style(
      "background-color: #D6B5DD; border: none; border-radius: 10px"
    );
    button.mouseOver(() => button.style("background-color: #D35DEB;"));
    button.mouseOut(() => button.style("background-color: #D6B5DD;"));
    button.position(-320, 160, "relative");
    button.parent("game-div");
    button.mouseClicked(changeScreen);
    replayBtnCounter = false;
  }
}

function enter(score, username) {
  console.log(nameInput.value());
  sendMessage(score, username);
}
