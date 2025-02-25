let bau;
let moeda;
let bomba;
let diamante;
let pontuacao = 0;
let velocidadeMoeda = 3;
let velocidadedoDiamante = 2;
let velocidadeBomba = 4;
let bauImg, moedaImg, bombaImg, fundoImg, diamanteImg, menuImg; 
let moveEsquerda = false;
let moveDireita = false;
let fonteJacquard;
let tela = "menu";

function preload() {
  bauImg = loadImage('assets/bau.png');   
  moedaImg = loadImage('assets/moeda.png'); 
  bombaImg = loadImage('assets/bomba.png'); 
  fundoImg = loadImage('assets/fundo.jpg');  
  diamanteImg = loadImage('assets/diamante.png');
  menuImg = loadImage('assets/menu.jpg');
  fonteJacquard = loadFont('assets/Jacquard12-Regular.ttf');
}

function setup() {
  createCanvas(400, 700);
  bau = new Bau();
  moeda = new Moeda();
  bomba = new Bomba();
  diamante = new Diamante();
}

function draw() {
  if(tela == "menu"){
    image(menuImg, 0, 0, width, height);
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    textFont(fonteJacquard);
    text("Treasure Drop", width / 2, height / 2 - 250);

    fill(255);
    textSize(50);
    text("Treasure Drop", width / 2 + 3, height / 2 - 247);

    fill(255);
    textSize(24);
    text("Click em Enter para começar", width / 2, height / 2 + 240);
  }
  else if (tela == "jogo") {
    image(fundoImg, 0, 0, width, height); 

    bau.atualizar();
    bau.mostrar();

    moeda.atualizar();
    moeda.mostrar();

    bomba.atualizar();
    bomba.mostrar();

    diamante.atualizar();
    diamante.mostrar();

    if (bau.colide(moeda)) {
      pontuacao++;
      moeda = new Moeda(); 
    }
    if (bau.colide(bomba)) {
      tela = "gameover"; 
    }
    if(bau.colide(diamante)){
      pontuacao++;
      diamante = new Diamante();  
    }

    fill(0);
    textSize(30);
    text("Pontuação: " + pontuacao, 70, 10);

  } else if (tela == "gameover") {
    background(255, 0, 0);
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 40);

    fill(255);
    textSize(50);
    text("Game Over", width / 2, height / 2 - 37);

    fill(255);
    textSize(24);
    text("Pontuação Final: " + pontuacao, width / 2, height / 2);
    text("Pressione Enter para reiniciar");

  } 
}

function keyPressed() {
  if(key === 'a') {
    moveEsquerda = true; 
  }
  if(key === 'd') {
    moveDireita = true; 
  }
  if(tela == "menu"){
    if(keyCode === 13){
      tela = "jogo"
    }
  } 
  if(tela === "gameover"){
    if (keyCode === 13) {
      reiniciarJogo();
      tela = "menu";
    } 
  }
}

function keyReleased() {
  if(key === 'a') {
    moveEsquerda = false; 
  }
  if(key === 'd') {
    moveDireita = false; 
  }
}

class Bau {
  constructor() {
    this.x = width / 2;
    this.y = height - 150;
    this.largura = 100;  
    this.altura = 100;  
    this.velocidade = 5;
  }

  atualizar() {
    if (moveEsquerda && this.x > 0) {
      this.x -= this.velocidade;
    }
    if (moveDireita && this.x < width - this.largura) {
      this.x += this.velocidade;
    }
  }

  colide(objeto) {
    if (this.x < objeto.x + objeto.largura &&
        this.x + this.largura > objeto.x &&
        this.y < objeto.y + objeto.altura &&
        this.y + this.altura > objeto.y) {
      return true;
    }
    return false;
  }

  mostrar() {
    image(bauImg, this.x, this.y, this.largura, this.altura); 
  }
}

class Moeda {
  constructor() {
    this.x = random(0, width - 60);
    this.y = 0;
    this.largura = 60; 
    this.altura = 60;  
  }

  atualizar() {
    this.y += velocidadeMoeda;

    if (this.y > height) {
      this.y = 0;
      this.x = random(0, width - this.largura);
    }
  }

  mostrar() {
    image(moedaImg, this.x, this.y, this.largura, this.altura); 
  }
}

class Bomba {
  constructor() {
    this.x = random(0, width - 50);
    this.y = 0;
    this.largura = 50; 
    this.altura = 50;   
  }

  atualizar() {
    this.y += velocidadeBomba;

    if (this.y > height) {
      this.y = 0;
      this.x = random(0, width - this.largura);
    }
  }

  mostrar() {
    image(bombaImg, this.x, this.y, this.largura, this.altura); 
  }
}

class Diamante {
  constructor() {
    this.x = random(0, width - 50);
    this.y = 0;
    this.largura = 50;  
    this.altura = 50;   
  }

  atualizar() {
    this.y += velocidadedoDiamante;

    if (this.y > height) {
      this.y = 0;
      this.x = random(0, width - this.largura);
    }
  }

  mostrar() {
    image(diamanteImg, this.x, this.y, this.largura, this.altura); 
  }
}

function reiniciarJogo() {
  pontuacao = 0;
  bau = new Bau(); 
  moeda = new Moeda(); 
  bomba = new Bomba(); 
  diamante = new Diamante();
}