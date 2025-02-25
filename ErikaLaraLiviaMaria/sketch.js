let c,imgBackground,itens, f, o, imgFloor,imgCoin, imgCloud, imgObstacle,imgYouDied, imgArvore,jumpSound,loseSound, distanciaMinima, 
xInicial, distanciaMinimaO,imgSky, imgYouWin,coinSound,gameWinSound,botaoRestart,pontuacaoVitoria,font, imgFront,imgRight,imgLeft;
let pontuacao = 0;
let nuvens = []; // Array para armazenar as nuvens
let arvores = []; // Array para armazenar as árvores
let obstaculos = [];
let somVitoriaTocado = false;
let gameOver = false;
let restartButton;
let jogoVencido = false;
let menuAtivo = true;
let jogoPerdido = false;


class Personagem {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.tam = 40;
    this.estaPulando = false;
    this.g = 1;
    this.forcaDePulo = -20;
    this.vy = 0;
    this.vx = 0;
    this.aceleracao = 5;   
    this.estaVivo = true;
    this.jumpSound = jumpSound;
    this.loseSound = loseSound;
    this.somTocado = false;
  }

  mostrar() {
    if (this.estaVivo) {
      image(this.img, this.x, this.y, this.tam, this.tam);
    } else {
      image(imgYouDied, width / 2 - 200, height / 2 - 200, 400, 400);
      textAlign(CENTER);
      text("Pressione 'R' para reiniciar", width / 2, height / 2 + 100);
  
      if (!this.somTocado) {
        this.loseSound.setVolume(0.3);
        this.loseSound.play();
        this.somTocado = true;
      }
    }
  }
  

  update() {
    if (!this.estaVivo) return;

    this.vy += this.g;  
    this.y += this.vy;  
    this.x += this.vx;

    let emCimaDeObstaculo = this.verificarTopoDeObstaculo(); 
    let tocandoChao = this.y >= f - this.tam;
    this.verificarColisaoPorBaixo(); //chama o metodo, nao precisa fazer condicional ja q td é relaizado dentro dela
    let bateuLateralmente = this.verificarColisaoLateral();

    // Colisão com o topo dos obstáculos
    if (emCimaDeObstaculo !== false) {
      this.y = emCimaDeObstaculo - this.tam;
      this.vy = 0;
      this.estaPulando = false;
    } else if (tocandoChao) {
      this.y = f - this.tam;
      this.vy = 0;
      this.estaPulando = false;
    }
    // Se bater lateralmente, impede o avanço e para o movimento horizontal
    if (bateuLateralmente !== false) {
      this.x = bateuLateralmente;
      this.vx = 0;
    }

    // Se sair da tela pela esquerda, morre
    if (this.x + this.tam < 0) { 
      this.estaVivo = false;
    }

    // Limita apenas no lado direito da tela
    this.x = Math.min(this.x, width);
  }
  verificarColisaoPorBaixo() {
    for (let obstaculo of obstaculos) {
      let dentroHorizontalmente =
        this.x + this.tam > obstaculo.x &&
        this.x < obstaculo.x + obstaculo.l;
  
      let bateuPorBaixo =
        this.y <= obstaculo.y + obstaculo.h && // Certifica que está abaixo do obstáculo
        this.y > obstaculo.y + obstaculo.h - Math.abs(this.vy) &&
        this.vy < 0 && 
        dentroHorizontalmente;
  
      if (bateuPorBaixo) {
        this.y = obstaculo.y + obstaculo.h + 1; // Pequena margem para evitar "grudar"
        this.vy = 3; // Pequeno impulso para baixo para evitar colisão contínua
        this.estaPulando = true; // Mantém status de pulo ativo por mais um frame
        return true;
      }
    }
    return false;
  }
  

  verificarTopoDeObstaculo() {
    for (let obstaculo of obstaculos) {
      let dentroHorizontalmente =
        this.x + this.tam > obstaculo.x &&
        this.x < obstaculo.x + obstaculo.l;
  
      let tocandoTopo =
        this.y + this.vy >= obstaculo.y - this.tam &&
        this.y < obstaculo.y &&
        dentroHorizontalmente;
  
      if (tocandoTopo) {
        this.y = obstaculo.y - this.tam - 1; // Pequena margem para não grudar
        this.vy = 0; // Evita continuar caindo
        this.estaPulando = false;
        return obstaculo.y;
      }
    }
    return false;
  }

  verificarColisaoLateral() {
    for (let obstaculo of obstaculos) {
      let dentroVerticalmente =
        this.y + this.tam > obstaculo.y &&
        this.y < obstaculo.y + obstaculo.h;
  
      let colidiuEsquerda =
        this.x + this.tam >= obstaculo.x && // Alterado de > para >=
        this.x < obstaculo.x &&
        dentroVerticalmente;
  
      let colidiuDireita =
        this.x <= obstaculo.x + obstaculo.l && // Alterado de < para <=
        this.x + this.tam > obstaculo.x + obstaculo.l &&
        dentroVerticalmente;
  
      if (colidiuEsquerda) {
        this.x = obstaculo.x - this.tam - 1; // Pequena margem para evitar grudar
        return this.x;
      }
  
      if (colidiuDireita) {
        this.x = obstaculo.x + obstaculo.l + 1; // Pequena margem para evitar grudar
        return this.x;
      }
    }
    return false;
  }
  
  
  

  pular() {
    if (!this.estaPulando && this.estaVivo) {
      this.vy = this.forcaDePulo;
      this.estaPulando = true;
      this.jumpSound.play();
    }
  }

  mover(direcao) {
    if (this.estaVivo) {
      this.vx = direcao * this.aceleracao;
    }
  }

  serEmpurrado() {
    this.vx = -obstaculos[0].vel; 
    if (this.x + this.tam / 2 < 0) { 
      this.estaVivo = false;
    }
  }
}


class Obstacle {
  constructor(img, x, y, l, h, vel) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.l = l;
    this.h = h;
    this.vel = vel;
  }

  mostrar() {
    image(this.img, this.x, this.y, this.l, this.h);
  }

  mover() {
    this.x -= this.vel;

    // Se sair da tela, reposiciona
    if (this.x < -this.l) {
      let novaX;
      let distanciaValida = false;

      // Garante que a nova posição respeite a distância mínima
      while (!distanciaValida) {
        novaX = width + random(100, 300);
        distanciaValida = true;

        for (let outro of obstaculos) {
          if (outro !== this && abs(novaX - outro.x) < distanciaMinimaO) {
            distanciaValida = false;
            break;
          }
        }
      }

      this.x = novaX;

      // Evita mudanças bruscas de altura
      let manterAltura = random() > 0.5;
      if (!manterAltura) {
        let novaAltura = random(100, 300);
        this.y = lerp(this.y, novaAltura, 0.5);
      }
    }
  }
}

class Nuvem {  
  constructor(img, x, y, tam, vel) {
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.img = img;
    this.vel = vel;
  }

  mover() {
    this.x -= this.vel;
    if (this.x < -this.tam) {
      this.x = width + random(50, 200); 
      this.y = random(50, 150); 
    }
  }

  mostrar() {
    image(this.img, this.x, this.y, this.tam, this.tam * 0.6);
  }
}

class Arvore {
  constructor(img, x, tam, vel) {
    this.x = x;
    this.y = f-tam;
    this.tam = tam;
    this.img = img;
    this.vel = vel;
  }

  mover() {
    this.x -= this.vel; 
    if (this.x < -this.tam) {
      this.x = width + random(100, 300); 
      this.y = f - this.tam; // Garante que fique atrás do chão
    }
  }

  mostrar() {
    image(this.img, this.x, this.y, this.tam, this.tam * 1.2);
  }
}

class Item {
  constructor(img, x, y, tam, vel,snd) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.vel = vel;
    this.coletado = false;
    this.snd =snd
  }

  mover() {
    this.x -= this.vel;
    if (this.x < -this.tam) {
      this.resetar();
    }
  }

  mostrar() {
    if (!this.coletado) {
      image(this.img, this.x, this.y, this.tam, this.tam);
    }
  }

  coletar(personagem) {
    if (!this.coletado &&  // Garante que a pontuação aumente apenas uma vez
        this.x < personagem.x + personagem.tam / 2 &&
        this.x + this.tam > personagem.x - personagem.tam / 2 &&
        this.y < personagem.y + personagem.tam / 2 &&
        this.y + this.tam > personagem.y - personagem.tam / 2) {
        
      this.snd.setVolume(0.2);
      this.snd.play();
      this.coletado = true;
      pontuacao += 10;  // Agora a pontuação só aumenta uma vez por item coletado
      setTimeout(() => this.resetar(), 1000);
    }
  }
  


  resetar() {
    this.coletado = false;
    this.x = width + random(100, 300);
    let segura = false;
    while (!segura) {
      let posicoes = [
        { y: f - 30 }, 
        { y: f - 80 }, 
        { y: random(100, 200) }, 
        { y: random(100, 250) }
      ];
      let escolha = random(posicoes);
      this.y = escolha.y;
      segura = true;

      for (let obstaculo of obstaculos) {
        if (
          this.x < obstaculo.x + obstaculo.l &&
          this.x + this.tam > obstaculo.x &&
          this.y < obstaculo.y + obstaculo.h &&
          this.y + this.tam > obstaculo.y
        ) {
          segura = false;
          this.x += 50;
          break;
        }
      }
    }
  }
}  


function preload() {
  imgFloor = loadImage('/assets/floor.png');
  imgCloud = loadImage('/assets/cloud.png');
  imgObstacle = loadImage('/assets/obstacle.png');
  imgArvore = loadImage('/assets/tree.png');
  imgYouDied = loadImage('/assets/gameover.png');
  jumpSound = loadSound('/assets/jump.wav');
  loseSound = loadSound('/assets/lose.flac');
  imgCoin = loadImage('/assets/coin.png');
  imgSky = loadImage('/assets/sky.jpg');
  imgYouWin = loadImage('/assets/youWin.png');
  coinSound = loadSound('/assets/coinSound.wav');
  gameWinSound = loadSound('/assets/gameWin.wav');
  imgBackground = loadImage('/assets/backGround.jpg');
  font = loadFont('/assets/VCR_OSD_MONO_1.001.ttf');
  imgFront= loadImage('/assets/front.png');
  imgRight= loadImage('/assets/right.png');
  imgLeft= loadImage('/assets/left.png');
}

function setupMenu() {
  let largura = 400;
  let altura = 400;
  createCanvas(largura, altura);
  let canvasElement = select('canvas');
  let posX = (windowWidth - largura) / 2;
  let posY = (windowHeight - altura) / 2;
  canvasElement.position(posX, posY);
}

function iniciarJogo() {
  menuAtivo = false;
  setupJogo();
}

function setup() {
  setupMenu();
  menuAtivo = true; // Garante que o menu aparece ao iniciar
}

function draw() {
  if (menuAtivo) {
    background(imgBackground);

    textSize(35);
    textFont(font);
    textAlign(CENTER);
    fill(0);
    text("SUPER ROMARIO", width / 2 - 2, 50); // Esquerda
    text("SUPER ROMARIO", width / 2 + 2, 50); // Direita
    text("SUPER ROMARIO", width / 2, 50 - 2); // Acima
    text("SUPER ROMARIO", width / 2, 50 + 2); // Abaixo

    fill(255, 0, 0); // Vermelho (texto principal)
    text("SUPER ROMARIO", width / 2, 50);

    
    textSize(25);
    textFont(font);
    textAlign(CENTER, CENTER);
    fill(0);
    text("Pressione S para começar!", width / 2-2, height / 2);
    text("Pressione S para começar!", width / 2+2, height / 2);
    text("Pressione S para começar!", width / 2, height / 2-2);
    text("Pressione S para começar!", width / 2, height / 2+2);

    fill(255, 215, 0);
    text("Pressione S para começar!", width / 2, height / 2);

    fill(255)
    textSize(15);
    text("Game by: Alice, Erika Lívia e Lara", width / 2, height - 20);
    return;
  }
  drawJogo();
}

function setupJogo() {
  f = height - 50;
  c = new Personagem(width / 2, f - 30, imgFront);
  arvores = [];
  distanciaMinima = 70; 
  xInicial = width;
  for (let i = 0; i < 15; i++) {
    let x = xInicial + i * distanciaMinima;
    let tam = random(100,150);
    let velocidade = 1;
    let img = imgArvore;
    arvores.push(new Arvore(img, x, tam, velocidade));
  }
  nuvens = [];
  for (let i = 0; i < 5; i++) {
    let x = random(width, width * 2);
    let y = random(10, 150);
    let tam = random(100, 150);
    let velocidade = random(0.5, 2);
    nuvens.push(new Nuvem(imgCloud, x, y, tam, velocidade));  
  }
  distanciaMinimaO = 150;
  obstaculos = [];
  for (let i = 0; i < 3; i++) {
    let x = width + i * distanciaMinimaO;
    let y = random() > 0.5 ? f - 50 : random(160, 175);
    let velocidade = 1;
    let img = imgObstacle;
    obstaculos.push(new Obstacle(img, x, y, 50, 50, velocidade));
  }
  itens = [];
  let distanciaMinimaMoeda = 50;
  for (let i = 0; i < 10; i++) {
    let x = width + i * distanciaMinimaMoeda;
    let y;
    let escolha = random([0, 1, 2, 3]);
    if (escolha === 0) {
      y = f - 30;
    } else if (escolha === 1) {
      y = f - 80;
    } else if (escolha === 2) {
      y = random(100, 200);
    } else {
      y = random(100, 250);
    }
    let tam = 25;
    let velocidade = 1;
    let snd =  coinSound;
    itens.push(new Item(imgCoin, x, y, tam, velocidade,snd));
  }
}

function drawJogo() {
  background(imgSky);
  pontuacaoVitoria = 500;

  // Verifica se o jogador venceu
  if (pontuacao >= pontuacaoVitoria) {
    image(imgYouWin, width / 2 - 100, height / 2 - 100, 200, 200);
    if (!somVitoriaTocado) {
      gameWinSound.setVolume(0.3);
      gameWinSound.play();
      somVitoriaTocado = true;
    }
    jogoVencido = true;
    textSize(20);
    textAlign(CENTER);
    text("Pressione 'R' para reiniciar", width / 2, height / 2 + 100);
    text("M para retornar ao Menu", width/2, height/2+130);
    return;
  }

  // Renderiza o jogo normalmente
  for (let arvore of arvores) {
    arvore.mover();
    arvore.mostrar();
  }
  for (let nuvem of nuvens) {
    nuvem.mover();
    nuvem.mostrar();
  }
  for (let item of itens) {
    item.mover();
    item.mostrar();
    item.coletar(c);
  }
  for (let obstaculo of obstaculos) {
    obstaculo.mover();
    obstaculo.mostrar();
  }
  if (typeof c !== 'undefined') {
    c.update();
    c.mostrar();
  }  
  image(imgFloor, 0, f, width, height - f);
  
  
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text("Pontuação: " + pontuacao, width - 20, 20);
}

function keyPressed() {
  if (menuAtivo && (key === 's' || key === 'S')) { 
    iniciarJogo();
  }
  if ((jogoVencido || !c.estaVivo) && key === 'r' || key === 'R') { 
    reiniciarJogo();
  }
  if (!menuAtivo && (key === 'm' || key === 'M')) { 
    voltarMenu();
  }
  if (keyCode === UP_ARROW) {
    c.pular();
  } else if (keyCode === RIGHT_ARROW) {
    c.img = imgRight;
    c.mover(1);
  } else if (keyCode === LEFT_ARROW) {
    c.img = imgLeft;
    c.mover(-1);
  }
}


function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    c.img = imgFront;
    c.mover(0);
  }
}

function voltarMenu() {
  if (gameWinSound.isPlaying()) {
    gameWinSound.stop();
  }
  menuAtivo = true;
  jogoVencido = false;
  somVitoriaTocado = false;
  pontuacao = 0;
  loop(); // Garante que o jogo continue rodando corretamente
}

function reiniciarJogo() {
  if (gameWinSound.isPlaying()) {
    gameWinSound.stop();
  }
  jogoPerdido = false;  // Resetar estado de derrota
  pontuacao = 0;
  jogoVencido = false;
  somVitoriaTocado = false;
  somDerrotaTocado = false; // Resetar som de derrota
  setupJogo();
  loop();
}


