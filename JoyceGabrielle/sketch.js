let elfa;
let coracoes = [];
let setas = [];
let pontuacao = 0;
let fimJogo = false;

function setup() {
  createCanvas(600, 400);
  elfa = new Personagem();
  iniciarJogo();
}

function draw() {
  background(255);

  if (fimJogo) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("FIM", width / 2, height / 2);
    return;
  }

  elfa.mover();
  elfa.exibir();

  for (let i = coracoes.length - 1; i >= 0; i--) {
    coracoes[i].caindo();
    coracoes[i].exibir();
    if (coracoes[i].y > height) {
      coracoes[i].reiniciar();
    }
  }

  for (let i = setas.length - 1; i >= 0; i--) {
    setas[i].voando();
    setas[i].exibir();
    if (setas[i].y < 0) {
      setas.splice(i, 1);
    }
  }

  for (let i = coracoes.length - 1; i >= 0; i--) {
    let colisaoDetectada = false;
    for (let j = setas.length - 1; j >= 0; j--) {
      if (setas[j].colidir(coracoes[i]) && !colisaoDetectada) {
        coracoes[i].reiniciar();
        setas.splice(j, 1);
        pontuacao++;
        colisaoDetectada = true;
      }
    }
  }

  verificarPontuacao();
  mostrarPontuacao();
}

function mousePressed() {
  if (!fimJogo) {
    elfa.atirar();
  }
}

function iniciarJogo() {
  pontuacao = 0;
  coracoes = [];
  setas = [];
  fimJogo = false;

  for (let i = 0; i < 12; i++) {
    coracoes.push(new Coracao());
  }
}

function verificarPontuacao() {
  if (pontuacao >= 12) {
    fimJogo = true;
  }
}

function mostrarPontuacao() {
  textSize(20);
  fill(0);
  textAlign(LEFT, TOP);
  text("Pontuação: " + pontuacao, 10, 10);
}

class Personagem {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.img = "🧝‍♀️";
  }

  exibir() {
    textSize(50);
    text(this.img, this.x, this.y);
  }

  mover() {
    this.x = mouseX;
  }

  atirar() {
    let seta = new Seta(this.x, this.y);
    setas.push(seta);
  }
}

class Coracao {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.img = "❤️";
    this.velocidade = random(1, 3);
  }

  exibir() {
    textSize(50);
    text(this.img, this.x, this.y);
  }

  caindo() {
    this.y += this.velocidade;
  }

  reiniciar() {
    this.x = random(width);
    this.y = 0;
  }
}

class Seta {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.img = "🏹";
  }

  exibir() {
    textSize(30);
    text(this.img, this.x, this.y); //
  }

  voando() {
    this.y -= 5;
  }

  colidir(coracao) {
    let distancia = dist(this.x, this.y, coracao.x, coracao.y);
    return distancia < 30;
  }
}
