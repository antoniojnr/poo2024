let cenario = [
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 1, 0, 0],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [0, 1, 1, 0, 0, 0, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
];

let tam;
let musica;
let musicaTocando = true;

class Jogador {
  constructor(x, y, t) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.visao = 2;
    this.tamanho = 40;
    this.deslocamento = 20;
  }

  mostrar() {
    push();
    fill(0, 190, 255);
    circle(
      this.x * this.tamanho + this.deslocamento,
      this.y * this.tamanho + this.deslocamento,
      this.t
    );
    pop();
  }

  mover(cenario) {
    if (keyCode == RIGHT_ARROW) {
      if (this.x < cenario.length - 1 && cenario[this.y][this.x + 1] == 0) {
        this.x++;
      }
    } else if (keyCode == LEFT_ARROW) {
      if (this.x > 0 && cenario[this.y][this.x - 1] == 0) {
        this.x--;
      }
    } else if (keyCode == UP_ARROW) {
      if (this.y > 0 && cenario[this.y - 1][this.x] == 0) {
        this.y--;
      }
    } else if (keyCode == DOWN_ARROW) {
      if (this.y < cenario.length - 1 && cenario[this.y + 1][this.x] == 0) {
        this.y++;
      }
    }
  }
}

let gfx;

function preload() {
  musica = loadSound("suspense.mp3");
}

function setup() {
  createCanvas(400, 400);
  tam = width / 10;
  j = new Jogador(0, 0, 15);
  gfx = createGraphics(width, height);
  frameRate(30);

  musica.loop();
  musica.setVolume(3.0);

  restartButton = createButton("Jogar Novamente");
  restartButton.position(width / 2 - 60, height / 2 + 30);
  restartButton.size(120, 40);
  restartButton.mousePressed(reiniciarJogo);
  restartButton.hide();
}

function draw() {
  background(220);
  for (let linha = 0; linha < cenario.length; linha++) {
    for (let coluna = 0; coluna < cenario[linha].length; coluna++) {
      push();
      if (cenario[linha][coluna] == 1) {
        fill(0);
      } else {
        fill(255);
      }
      square(tam * coluna, tam * linha, tam);
      pop();
    }
  }

  desenharSombra(
    j.x * j.tamanho + j.deslocamento,
    j.y * j.tamanho + j.deslocamento,
    100
  );
  j.mostrar();

  push();
  fill(255);
  let decorrido = Math.round(frameCount / 30);
  let total = 10;
  text("Tempo: " + (total - decorrido), 30, height - 30);

  if (j.x === 9 && j.y === 9) {
    textSize(32);
    fill(0, 255, 0);
    textAlign(CENTER, CENTER);
    text("Vitória!", width / 2, height - 250);
    text("Você chegou ao final", width / 2, height / 2);
    restartButton.show();
    noLoop();
  }

  if (total - decorrido <= 0 && (j.x !== 9 || j.y !== 9)) {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Fim de jogo!", width / 2, height - 250);
    text("Mais sorte na próxima", width / 2, height / 2);
    restartButton.show();
    noLoop();
  }
  pop();
}

function desenharSombra(x, y, raioLuz) {
  let intervalo = 20;
  let maiorSombra = raioLuz - 9;
  let darkest = 0.7;
  let transpInterval = 0.2;

  push();
  gfx.background(0);

  noFill();
  strokeWeight(intervalo / 2);

  stroke(`rgba(0, 0, 0, ${darkest})`);
  circle(x, y, maiorSombra);
  stroke(`rgba(0, 0, 0, ${darkest - transpInterval})`);
  circle(x, y, maiorSombra - intervalo);
  stroke(`rgba(0, 0, 0, ${darkest - transpInterval * 2})`);
  circle(x, y, maiorSombra - intervalo * 2);

  gfx.erase();
  gfx.circle(x, y, raioLuz);
  gfx.noErase();

  image(gfx, 0, 0);
  pop();
}

function keyPressed() {
  j.mover(cenario);

  if (key === "m" || key === "M") {
    if (musicaTocando) {
      musica.pause();
    } else {
      musica.play();
    }
    musicaTocando = !musicaTocando;
  }
}

function reiniciarJogo() {
  j.x = 0;
  j.y = 0;
  frameCount = 0;
  restartButton.hide();
  loop();
}
