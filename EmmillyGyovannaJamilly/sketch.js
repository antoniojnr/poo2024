let jogo;
let img;
let bolas = [];
let obstaculos = [];
let numBolasBrancas = 0;

// variaveis som
let somEstourar;
let somAtirar;
let somPerdeu;

// variavel de tocar o som qnd game over
let perdeuTocarSom = true;

function preload() {
  // pega os sons antes de tudo iniciar
  somEstourar = loadSound("./sons/estourou.mp3"); 
  somAtirar = loadSound("./sons/atirar.mp3");
  somPerdeu = loadSound("./sons/perdeu.mp3");
  // aumenta o som pro dobro
  somPerdeu.setVolume(3); 
}

function setup() {
  createCanvas(500, 500);
  jogo = new Jogo();
  jogo.iniciarJogo();
  img = loadImage("./imagens/fundo2.png");

  obstaculos.push(new Obstaculo(100, 250, 50, 40, 4));
  obstaculos.push(new Obstaculo(300, 150, 50, 40, 1));
  obstaculos.push(new Obstaculo(200, 350, 50, 40, 1));
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 23; j++) {
      bolas.push(
        new Bola(
          (j + 2) * 20,
          (i + 1) * 20,
          random(["red", "green", "blue", "yellow", "purple"]),
          0
        )
      );
    }
  }
}

function draw() {
  background(0);
  image(img, 0, 0, 500, 500);

  // Mover e desenhar obstáculos
  for (let obstaculo of obstaculos) {
    obstaculo.mover();
    obstaculo.desenhar();
  }

  // Contar bolas brancas
  numBolasBrancas = bolas.filter(bola => bola.cor === "white").length;

  // Verificar Game Over
  if (numBolasBrancas >= 5) {
    if (perdeuTocarSom === true) {
      somPerdeu.play();
      perdeuTocarSom = false;
    }
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    return;
  }

  jogo.atualizar();

  for (let bola of bolas) {
    if (jogo.canhao.bola.houveColisao(bola)) {
      if (jogo.canhao.bola.cor === bola.cor && !bola.atingida) {
        // Acertou a bola da cor certa
        jogo.canhao.atirar();
        estourarGrupoDeBolas(bola);
      } else if (jogo.canhao.bola.cor !== bola.cor && !bola.atingida) {
        // Acertou a bola da cor errada
        bola.passar();
        jogo.canhao.bola.quicar();
      }
    }
    bola.desenhar();
  }

  // Verificar colisão com obstáculos
  for (let bola of bolas) {
    for (let obstaculo of obstaculos) {
      if (obstaculo.houveColisao(bola)) {
        bola.cor = "white";  // Bola se torna branca ao colidir com obstáculos
        bola.raio = 0;
      }
    }
  }
}

function mousePressed() {
  jogo.capturarClique();
}

function mouseMoved() {
  jogo.capturarMovimento();
}

class Obstaculo {
  constructor(x, y, largura, altura, velocidade) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.velocidade = velocidade;
    this.sentido = 1;
    this.cor = color(255, 0, 0);
  }

  mover() {
    this.x += this.velocidade * this.sentido;

    if (this.x + this.largura > width || this.x < 0) {
      this.sentido *= -1;
    }
  }

  desenhar() {
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura);
  }

  houveColisao(bola) {
    if (
      bola.x > this.x && bola.x < this.x + this.largura &&
      bola.y + bola.raio > this.y && bola.y - bola.raio < this.y + this.altura
    ) {
      return true;
    }
    return false;
  }
}

class Jogo {
  constructor() {
    this.canhao = new Canhao(width / 2, height - 40);
    this.bolas = [];
  }

  iniciarJogo() {
    this.bolas = [];
  }

  atualizar() {
    this.canhao.desenhar();
    this.bolas.forEach((bola, index) => {
      bola.mover();
      bola.desenhar();
      if (bola.y < 0) {
        this.bolas.splice(index, 1);
      }
    });
  }

  capturarClique() {
    this.bolas.push(this.canhao.atirar());
  }

  capturarMovimento() {
    this.canhao.girar(mouseX, mouseY);
  }
}

class Canhao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angulo = 0;
    this.raio = 20;
    this.corBola = random(["red", "green", "blue", "yellow", "purple"]);
    this.bola = new Bola(this.x, this.y - 15, this.corBola, this.angulo);
  }

  desenhar() {
    fill(100);
    rectMode(CENTER);
    rect(this.x, this.y, 50, 20);
    fill(this.corBola);
    ellipse(this.x, this.y - 15, 20, 20);
  }

  girar(mx, my) {
    this.angulo = atan2(my - this.y, mx - this.x);
  }

  atirar() {
    this.bola = new Bola(this.x, this.y - 15, this.corBola, this.angulo);
    this.corBola = random(["red", "green", "blue", "yellow", "purple"]);
    somAtirar.play();
    return this.bola;
  }
}

class Bola {
  constructor(x, y, cor, angulo) {
    this.x = x;
    this.y = y;
    this.raio = 10;
    this.cor = cor;
    this.velocidade = 10;
    this.dx = cos(angulo) * this.velocidade;
    this.dy = sin(angulo) * this.velocidade;
    this.atingida = false;
  }

  estourar() {
    if (!this.atingida) {
      this.atingida = true;
      this.removerBola();
      somEstourar.play();
    }
  }

  removerBola() {
   this.raio = 0;
  }

  passar() {
    if (!this.atingida) {
      this.cor = "white";  // A bola se torna branca ao errar
      this.atingida = true;
    }
  }

  quicar() {
    if (!this.atingida) {
      jogo.canhao.bola.dy = -jogo.canhao.bola.dy;
      this.atingida = true;
    }
  }

  desenhar() {
    push();
    fill(this.cor);
    ellipse(this.x, this.y, this.raio * 2);
    pop();
  }

  mover() {
    this.x += this.dx;
    this.y += this.dy;
  }

  houveColisao(bola) {
    if (dist(bola.x, bola.y, this.x, this.y) <= bola.raio + this.raio) {
      return true;
    } else {
      return false;
    }
  }
}

function estourarGrupoDeBolas(bolaInicial) {
  let bolasConectadas = [];
  let visitadas = new Set();

  function dfs(bola) {
    if (visitadas.has(bola)) return;
    visitadas.add(bola);
    bolasConectadas.push(bola);

    for (let vizinha of bolas) {
      if (!visitadas.has(vizinha) && vizinha.cor === bola.cor && bola.houveColisao(vizinha)) {
        dfs(vizinha);
      }
    }
  }

  dfs(bolaInicial);

  for (let bola of bolasConectadas) {
    bola.estourar();
  }
}