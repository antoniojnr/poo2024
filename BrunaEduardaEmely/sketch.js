let jogo;
let bola;
let barra;
let tijolos = [];
const numColunas = 12;
const numLinhas = 12;

let soundColisao, soundGameOver, soundVitoria, soundJogo;
let gameStarted = false;
let audioFinalizado = false;
let bolaImg;

function preload() {
  soundFormats('mp3');
  soundColisao = loadSound('pop-94319.mp3'); 
  soundGameOver = loadSound('fiasco-154915.mp3'); 
  soundVitoria = loadSound('Ayrton-Senna-Tema-da-vitoria.mp3');
  soundJogo = loadSound('game-8-bit-on-278083.mp3');
  bolaImg = loadImage('ef6c8b24-23a0-4827-83cf-831feb3a461f.jpg');
}

function setup() {
  createCanvas(800, 600);
  soundJogo.loop();
  soundJogo.setVolume(0.2);
}

function draw() {
  if (!gameStarted) {
    background("black");
    fill("#9369d6");
    textFont("Verdana");
    textSize(60);
    textAlign(CENTER, CENTER);
    text("QUEBRA-TIJOLOS", width / 2, 200);
    
    fill(220);
    rect(300, 370, 200, 50, 10);
    
    fill("#694EA5");
    textSize(26);
    text("Iniciar", 400, 400);
  } else {
    background("black");
    
    if (keyIsDown(LEFT_ARROW)) barra.mover("esquerda");
    if (keyIsDown(RIGHT_ARROW)) barra.mover("direita");
    
    bola.mover();
    bola.verificarColisaoComBarra(barra);
    bola.mostrar();
    barra.mostrar();
    
    for (let tijolo of tijolos) {
      if (!tijolo.isDestroyed) {
        tijolo.mostrar();
        bola.verificarColisaoComTijolo(tijolo);
      }
    }
    
    fill(255);
    textFont("Verdana");
    textSize(18);
    text(`Pontuação: ${jogo.score}`, 90, 560);
    text(`Vidas: ${jogo.lives}`, 70, 520);
    
    if (bola.y > height) {
      jogo.perderVidas();
      bola.reiniciar();
      barra.reiniciar();

      if (jogo.lives <= 0 && !soundGameOver.isPlaying()) {
        soundJogo.stop();
        soundGameOver.play();
        audioFinalizado = true;
        soundGameOver.onended(() => resetarJogo());
      }
    }
    
    if (jogo.jogoAcabou() || tijolos.every(t => t.isDestroyed)) {
      fill("#fafcf7");
      textSize(24);
      if (tijolos.every(t => t.isDestroyed)) {
        text("Parabéns. Você ganhou!", width / 2 , height / 2);
       if (!audioFinalizado) {
          soundJogo.stop();
          soundVitoria.play();
          audioFinalizado = true;
          soundVitoria.onended(() => resetarJogo());
        }
      } else {
        text("Fim de Jogo!", width / 2 , height / 2);
      }

      noLoop();
    }
  }
}

function mousePressed() {
  if (!gameStarted && mouseX >= 300 && mouseX <= 500 && mouseY >= 370 && mouseY <= 420) {
    gameStarted = true;
    iniciarJogo();
  } else if (bola && bola.emEspera) {
    bola.iniciarMovimento();
  }
}

function iniciarJogo() {
  jogo = new Jogo();
  bola = new Bola(width / 2, height - 30, 5, -5, 15, "#E91E63");
  barra = new Barra(width / 2 - 40, height - 20, 90, 10, "#9027A2");
  criarTijolos();
}

function resetarJogo() {
  jogo = new Jogo(); 
  bola.reiniciar();   
  barra.reiniciar(); 
  criarTijolos();    
  gameStarted = false;
  audioFinalizado = false;
  soundColisao.stop();
  soundGameOver.stop();
  soundVitoria.stop();
  soundJogo.loop();
  loop();
}

function criarTijolos() {
  tijolos = [];
  let tijoloLargura = Math.floor(width / numColunas + 1);
  let tijoloAltura = 20;
  let cores = ["#E3ADEC", "#9222A5", "#8456D5", "#E65183", "#BB2759", "#edeef2", "#D86D91"];
  
  for (let linha = 0; linha < numLinhas; linha++) {
    for (let coluna = 0; coluna < numColunas; coluna++) {
      let x = coluna * tijoloLargura;
      let y = linha * tijoloAltura;
      let cor = cores[linha % cores.length];
      tijolos.push(new Tijolo(x, y, tijoloLargura, tijoloAltura, cor));
    }
  }
}

class Jogo {
  constructor() {
    this.score = 0;
    this.lives = 3;
  }
  adicionarPontuacao(p) {
    this.score += p;
  }
  perderVidas() {
    if (this.lives > 0) 
    this.lives--; {
    barra.reduzirTamanho();
      if (this.lives === 1) {
        barra.reduzirTamanhoExtra();
      }
    }
  }
  jogoAcabou() {
    return this.lives <= 0;
  }
}

class Bola {
  constructor(x, y, dx, dy, radius, color) {
    this.xInicial = x;
    this.yInicial = y;
    this.dxInicial = dx;
    this.dyInicial = dy;
    this.radius = radius;
    this.deslocamento = this.radius * 3;
    this.color = color;
    bolaImg.resize(this.deslocamento, this.deslocamento);
    this.reiniciar();
  }

  reiniciar() {
    this.x = this.xInicial;
    this.y = this.yInicial;
    this.dx = 0;
    this.dy = 0;
    this.emEspera = true;
  }

  mover() {
    if (!this.emEspera) {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x - this.radius < 5 || this.x + this.radius > width) this.dx *= -1;
      if (this.y - this.radius < -5) this.dy *= -1;
    }
  }

  verificarColisaoComBarra(barra) {
    if (this.y + this.radius >= barra.y && this.x >= barra.x && this.x <= barra.x + barra.width) {
      this.dy *= -1;
      this.y = barra.y - this.radius;
    }
  }

  verificarColisaoComTijolo(tijolo) {
    if (!tijolo.isDestroyed && this.x >= tijolo.x && this.x <= tijolo.x + tijolo.width && this.y - this.radius <= tijolo.y + tijolo.height) {
      this.dy *= -1;
      tijolo.isDestroyed = true;
      jogo.adicionarPontuacao(10);
      if (!soundColisao.isPlaying()) {
        soundColisao.play();
      }
    }
  }

  iniciarMovimento() {
    if (this.emEspera) {
      this.dx = this.dxInicial;
      this.dy = this.dyInicial;
      this.emEspera = false;
    }
  }

  mostrar() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
    image(bolaImg, this.x - (this.deslocamento / 2), this.y - (this.deslocamento / 2));
  }
}

class Barra {
  constructor(x, y, width, height, color) {
    this.xInicial = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.reiniciar();
  }
  mover(direcao) {
    if (direcao === "esquerda") this.x = max(0, this.x - 7);
    else if (direcao === "direita") this.x = min(width - this.width, this.x + 7);
  }
  mostrar() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }
  reiniciar() {
    this.x = this.xInicial;
  }
  reduzirTamanho() {
    this.width = max(40, this.width * 0.8);
  }
  reduzirTamanhoExtra() {
    this.width = max(30, this.width * 0.7);
  }
}

class Tijolo {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isDestroyed = false;
  }
  mostrar() {
    if (!this.isDestroyed) {
      fill(this.color);
      rect(this.x, this.y, this.width, this.height);
    }
  }
}
