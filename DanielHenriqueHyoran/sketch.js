let imgFundo;
let imgBoneco;
let bonecoDireita;
let vida;
let vida1;
let nave1;
let nave2;
let tiro;
let a1, a2, a3, a4, a5, a6, a7, a8, a9, a10;
let et1, et2, et3, et4, et5, et6, et7, et8, et9;
let barradevida1;
let barradevida2;
let somdetiro;
let somdetirovazio;
let gameOver = false;
let a;
let buraco;
let musica;
let direcao = 0;

if(Math.random() < 0.5 ){
  direcao =  5
}else{
  direcao = -5
}

function mostrarTelaDeMorte(a) {
  if(a ===1){
    push();
    fill(255);
    textSize(60);
    textFont('Verdana')
    textAlign(CENTER, CENTER);
    text("Astronauta Venceu", width / 2, height / 2);
    pop();
  }else{
    push();
    fill(255);
    textSize(60);
    textFont('Verdana')
    textAlign(CENTER, CENTER);
    text("ET Venceu", width / 2, height / 2);
    pop();
  }
}


function preload() {
  imgFundo = loadImage("img/Background.png");
  imgBoneco = loadImage("img/Alienigena.png");
  bonecoDireita = loadImage("img/Astronauta.png");
  soundFormats("mp3", "ogg");
  somdetirovazio = loadSound("img/tirovazio1.mp3");
  somdetiro = loadSound("img/tirosom2.mp3");
  musica = loadSound("img/tema.mp3")
  a1 = loadImage("img/vida/Alienigena1.png");
  a2 = loadImage("img/vida/Alienigena2.png");
  a3 = loadImage("img/vida/Alienigena3.png");
  a4 = loadImage("img/vida/Alienigena4.png");
  a5 = loadImage("img/vida/Alienigena5.png");
  a6 = loadImage("img/vida/Alienigena6.png");
  a7 = loadImage("img/vida/Alienigena7.png");
  a8 = loadImage("img/vida/Alienigena8.png");
  a9 = loadImage("img/vida/Alienigena9.png");
  a10 = loadImage("img/vida/Alienigena10.png");
  et1 = loadImage("img/vida/Astronauta1.png");
  et2 = loadImage("img/vida/Astronauta2.png");
  et3 = loadImage("img/vida/Astronauta3.png");
  et4 = loadImage("img/vida/Astronauta4.png");
  et5 = loadImage("img/vida/Astronauta5.png");
  et6 = loadImage("img/vida/Astronauta6.png");
  et7 = loadImage("img/vida/Astronauta7.png");
  et8 = loadImage("img/vida/Astronauta8.png");
  et9 = loadImage("img/vida/Astronauta9.png");
  et10 = loadImage("img/vida/Astronauta10.png");
  buraco = loadImage("img/buraco.png");

  barradevida1 = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10];
  barradevida2 = [et1, et2, et3, et4, et5, et6, et7, et8, et9, et10];
}

class Nave {
  constructor(x, y, tam, img, balaDirecao) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.vida = 10;
    this.img = img;
    this.quant = 0;
    this.balas = [];
    this.balaDirecao = balaDirecao;
  }
  getVida() {
    return this.vida;
  }
  gety() {
    return this.y;
  }
  getx() {
    return this.x;
  }
  setquant(x) {
    this.quant = x;
  }

  getquant() {
    return this.quant;
  }

  mostrar() {
    image(
      this.img,
      this.x - this.tam / 2,
      this.y - this.tam / 2,
      this.tam,
      this.tam
    );
    this.mostrarBalas();
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
      if (this.x < width / 2) {
        this.x = width / 2;
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
      if (this.x > width) {
        this.x = width;
      }
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= 5;
      if (this.y < 0) {
        this.y = 0;
      }
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += 5;
      if (this.y > height - this.tam) {
        this.y = height - this.tam;
      }
    }
  }

  mover2() {
    if (keyIsDown(65)) {
      // A
      this.x -= 5;
      if (this.x < 0) {
        this.x = 0;
      }
    }
    if (keyIsDown(68)) {
      // D
      this.x += 5;
      if (this.x > width / 2) {
        this.x = width / 2;
      }
    }
    if (keyIsDown(87)) {
      // W
      this.y -= 5;
      if (this.y < 0) {
        this.y = 0;
      }
    }
    if (keyIsDown(83)) {
      // S
      this.y += 5;
      if (this.y > height - this.tam) {
        this.y = height - this.tam;
      }
    }
  }


  atirar() {
    if (this.quant < 10) {
      let novaBala = new Bala(this.x, this.y, 8, this.balaDirecao);
      this.balas.push(novaBala);
      this.quant++;
    }
  }

  mostrarBalas() {
    for (let i = this.balas.length - 1; i >= 0; i--) {
      this.balas[i].mostrar();
      this.balas[i].mover();

      if (this.balas[i].offScreen()) {
        this.balas.splice(i, 1);
      }
    }
  }

  colisao(nave) {
    for (let i = this.balas.length - 1; i >= 0; i--) {
      if (
        dist(
          this.balas[i].getx(),
          this.balas[i].gety(),
          nave.getx(),
          nave.gety()
        ) <
        this.tam / 2
      ) {
        this.balas.splice(i, 1);
        nave.perderVida();
      }
    }
  }

  mostrarVidaast() {
    image(barradevida2[Math.max(0, this.vida - 1)], width - 333, height - 130, 333, 187);
  }

  mostrarVidaet() {
    image(barradevida1[Math.max(0, this.vida - 1)], 0, height - 130, 333, 187);
  }

  perderVida() {
    this.vida -= 1;
    if (this.vida < 0) {
      this.vida = 0;
    }
  }

  
}

class Bala {
  constructor(x, y, tam, direcao) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.vel = 25;
    this.direcao = direcao;
  }
  getx() {
    return this.x;
  }
  gety() {
    return this.y;
  }
  mostrar() {
    fill("yellow");
    rect(this.x, this.y, 20, this.tam);
  }

  mover() {
    this.x += this.vel * this.direcao;
  }

  offScreen() {
    return this.x < 0 || this.x > width;
  }
}
class Estrela{
  constructor(x, y, tam, img){
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.img = img;
    this.estrelabol = false;
    this.especial = 0
  }

  offScreen() {
    return this.x < 0 || this.x > width;
  } 

  cair(){
    this.y = this.y + 3
    this.x = this.x + direcao
  
  }
  mostrarestrela(){
    image(
      this.img,
      this.x - this.tam / 2,
      this.y - this.tam / 2,
      92 ,
      63
    );
  }
  colidir(a){
    if(dist( this.x, this.y, a.getx(), a.gety()) < this.tam){
      this.estrelabol = false

      if(a.vida <= 7){
      a.vida += 3
    }else if(a.vida > 7){
         a.vida = 10
        }  
      

      this.x = random(0, width);
      this.y = 0;
    }
 
  }

    saiuDaTela(){
      return (this.x > width || this.x < 0 || this.y < 0 || this.y > height);
    }

}
 



let iniciou;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  nave1 = new Nave(width - 100, height / 2, 150, bonecoDireita, -1);
  nave2 = new Nave(100, height / 2, 150, imgBoneco, 1);
  estrela = new Estrela(random(0, width), 0 , 50, buraco)
  frameRate(30);
  iniciou = false;
}

function draw() {
  if (!iniciou) {
    musica.loop();
  }

  iniciou = true;

  if (nave1.getVida() === 0) {
    gameOver = true;
    a =2
  }else if(nave2.getVida() === 0){
    gameOver = true
    a = 1
  }

  if (gameOver === true) {
    mostrarTelaDeMorte(a);
    return;
  }

  image(imgFundo, 0, 0, width, height);
  nave1.mostrar();
  nave2.mostrar();
  nave1.mover();
  nave2.mover2();
  nave2.colisao(nave1);
  nave1.colisao(nave2);
  nave1.mostrarVidaast();
  nave2.mostrarVidaet();
  
  


  push();
  fill(255);
  textSize(16);
  text("Tempo: " + Math.round(frameCount / 30), 40, 40);

  if (Math.round(frameCount / 30) % 5 === 0) {
    if (nave1.quant === 10) {
      nave1.setquant(0);
    }
    if (nave2.quant === 10) {
      nave2.setquant(0);
    }
  }
  if(Math.round(frameCount / 30) % 5 === 0){
   estrela.estrelabol = true;
  }

if(estrela.estrelabol){
  estrela.mostrarestrela()
  estrela.cair()
 }
 estrela.colidir(nave1)
 estrela.colidir(nave2)
 
if(estrela.saiuDaTela()){
  estrela.estrelabol = false;
  estrela.x = random(0, width);
  estrela.y = 0;
}

  fill(255);
  textSize(16);
  text(nave1.getquant() + " / 10", width - 333, height - 50);
  fill(255);
  textSize(16);
  text(nave2.getquant() + " / 10", 300, height - 50);
  pop();

}

function keyPressed() {
  if (key === "0") {
    nave1.atirar();
    if (nave1.quant !== 10) {
      somdetiro.play();
    } else {
      somdetirovazio.play();
    }
  } else if (key === " ") {
    nave2.atirar();
    if (nave2.quant !== 10) {
      somdetiro.play();
    } else {
      somdetirovazio.play();
    }
  }
}



