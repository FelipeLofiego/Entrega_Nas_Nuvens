/* obs: estava dando erro ao colocar as imagens no codigo,
então eu substitui por formas.*/


let helicopterY, houses, boxes, backgroundX, score;
let gameStarted = false;
let tutorialShown = false;
let gameOver = false;
let startButton;
let lastBoxDropTime = 0;
const boxDropInterval = 1000;

function setup() {
  createCanvas(1600, 800);
  backgroundX = 0;
  score = 0;
  helicopterY = height / 2;
  houses = [];
  boxes = [];

  startButton = createButton("Começar");
  startButton.position(width / 2 - 50, height / 2 + 30);
  startButton.mousePressed(startGame);
}

function startGame() {
  gameStarted = true;
  tutorialShown = true;
  startButton.remove();
}

function draw() {
  if (!gameStarted) {
    showMenu();
    return;
  }

  if (gameOver) {
    showGameOver();
    return;
  }

  clear();
  drawBackground();

  if (keyIsDown(32)) { // Tecla de espaço
    if (millis() - lastBoxDropTime > boxDropInterval) {
      dropBox();
      lastBoxDropTime = millis();
    }
  }

  if (frameCount % 120 === 0) {
    spawnHouse();
  }

  moveBackground();
  drawHelicopter();
  drawHouses();
  drawBoxes();
  checkCollisions();
  drawScore();
}

function showMenu() {
  background(173, 216, 230);
  textSize(60);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Entrega Nas Nuvens", width / 2, height / 2 - 150);

textSize(20);
fill(255);
text("Entregue 5 caixas para vencer o jogo", width / 2, height / 2 + 110);

  if (!tutorialShown) {
    textSize(20);
    text("Pressione a tecla ESPAÇO para soltar as caixas", width / 2, height / 2 + 320);
  }
}

function showGameOver() {
  background(255, 255, 0);
  textSize(32);
  fill(0, 0, 0);
  textAlign(CENTER, CENTER);
  text("Você Venceu!!", width / 2, height / 2 - 50);

  textSize(28);
  fill(0, 0, 0);
  text("Parabéns, você conseguiu entregar todas as caixas para todas as casas!!", width / 2, height / 2 + 320);
  
  textSize(16);
  fill(0, 0, 0);
  text("Pontuação: " + score, width / 2, height / 2);
  text("Pressione E para reiniciar", width / 2, height / 2 + 30);
}

function keyPressed() {
  if (!gameStarted) {
    return;
  } else if (gameStarted && gameOver) {
    if (keyCode === 69) { // Tecla E
      resetGame();
    }
  }
}

function resetGame() {
  gameStarted = false;
  tutorialShown = false;
  gameOver = false;
  score = 0;
  helicopterY = height / 2;
  houses = [];
  boxes = [];
}

function drawBackground() {
  background(173, 216, 230);

  let bgX = backgroundX;
  while (bgX < width) {
    rect(bgX, 0, width, height);
    bgX += width;
  }
}

function moveBackground() {
  backgroundX -= 2;
  if (backgroundX <= -width) {
    backgroundX = 0;
  }
}

function drawHelicopter() {
  fill(139, 0, 0);
  rect(50, helicopterY, 40, 30);
}

function drawHouses() {
  fill(0, 100, 0);
  for (let i = 0; i < houses.length; i++) {
    let house = houses[i];
    rect(house.x, height - 40, 40, 40);
    house.x -= 2;
    if (house.x + 40 < 0) {
      houses.splice(i, 1);
      i--;
    }
  }
}

function drawBoxes() {
  fill(101, 67, 33);
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    rect(box.x, box.y, 20, 20);
    box.y += 4;
    if (box.y > height) {
      boxes.splice(i, 1);
      i--;
    }
  }
}

function dropBox() {
  let box = {
    x: 50,
    y: helicopterY + 30
  };
  boxes.push(box);
}

function spawnHouse() {
  let house = {
    x: width,
    y: random(height - 40)
  };
  houses.push(house);
}

function checkCollisions() {
  for (let i = 0; i < houses.length; i++) {
    let house = houses[i];

    if (boxes.length > 0) {
      for (let j = 0; j < boxes.length; j++) {
        let box = boxes[j];

        if (
          box.x + 20 >= house.x && box.x <= house.x + 40 &&
          box.y + 20 >= height - 40 && box.y <= height
        ) {
          houses.splice(i, 1);
          boxes.splice(j, 1);
          score++;
          if (score >= 5) {
            gameOver = true;
          }
          break;
        }
      }
    }

    if (house.x <= 50 && height - 40 <= helicopterY + 30 && height <= helicopterY + 30) {
      gameOver = true;
      break;
    }
  }
}

function drawScore() {
  textSize(16);
  fill(173, 216, 230);
  textAlign(LEFT);
  text("Pontuação: " + score, 10, 20);
}
