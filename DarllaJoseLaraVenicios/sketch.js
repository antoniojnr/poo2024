// Rescue Life(Rl):

// Desenvolvedores: José Alan, Venícios Vasconcelos, Lara Cecília e Darlla Mota.

// Executar o jogo com o zoom: 67%.


class Ambulancia {
    constructor(x, y, tam1, tam2) {
      this.x = x;
      this.y = y;
      this.img = loadImage('/assets/ambulancia.png');
      this.img2 = loadImage('/assets/gameover.png');
      this.snd = loadSound('/assets/batida.mp3');
      this.tam1 = tam1;
      this.tam2 = tam2;
      this.vx = 5;
      this.vy = 5;
    }
  
    mostrar() {
      image(this.img, this.x, this.y, this.tam1, this.tam2);
    }
  
    mover() {
      if(keyIsDown(39)) { // Move para a esquerda.
          this.x += 5;
            if(this.x > 540) {
              this.x = 540;
            }
          }
      if(keyIsDown(37)) { // Move para a direita.
          this.x -= 5;
            if(this.x < 47) {
              this.x = 47;
        }
      }
    }
    
    verificarColisao(carros) {
      for (let carro of carros) { // Percorre a lista de carros na tela.
          // Aumentando a margem de colisão para garantir que a ambulância detecte o veículo.
          let margemColisao = 10;  // Define uma margem extra para tornar a colisão mais precisa.
      if (
          this.x + margemColisao < carro.x + carro.tam1 - margemColisao && // Lado esquerdo da ambulância está antes do lado direito do carro.
          this.x + this.tam1 - margemColisao > carro.x + margemColisao && // Lado direito da ambulância está depois do lado esquerdo do carro.
          this.y + margemColisao < carro.y + carro.tam2 - margemColisao && // Parte superior da ambulância está antes da parte inferior do carro.
          this.y + this.tam2 - margemColisao > carro.y + margemColisao // Parte inferior da ambulância está depois da parte superior do carro.
      ) {
          musica.stop();
          sirene.stop();
          this.snd.play();
          image(this.img2, 0, 0, 700, 700);  
          textSize(25);
          textStyle(BOLD);
          textFont('Courier New');
          text('CLIQUE EM "TENTAR NOVAMENTE"', 150, 625);
          noLoop(); // Para o jogo
        }
      }
    }
  }


  class Estrada {
    constructor(x, y, tam1, tam2) {
      this.x = x;
      this.y = y;
      this.img = loadImage('/assets/estrada.jpeg');
      this.tam1 = tam1;
      this.tam2 = tam2;
      this.tam3 = 10;
      this.vy = 8;
    }
  
    exibir() {
      image(this.img, this.x, this.y, this.tam1, this.tam2);
      }
    }
  

  class Ponto {
    constructor(texto, x, y) {
      this.x = x;
      this.y = y;
      this.texto = texto;
      this.ponto = second();
      this.pontoV = 0;
      this.img = loadImage('/assets/imagemfinal.jpeg');
      this.snd = loadSound('/assets/somfinal.mp3');
    }

    exibirPonto() {
      push();
      fill(255);
      textSize(15);
      textFont('Courier New');
      text(this.texto + this.ponto, this.x, this.y);
      pop();
    }

    calcularPonto() {
      this.ponto = this.ponto -= this.pontoV;
      this.ponto++;
    }

    imagemFinal() {
      if(this.ponto == 5000) {
        noLoop();
        musica.stop();
        sirene.stop();
        image(this.img, -100, 0, 900, 750);
        rect(25, 665, 650, 50, 20)
        fill('black');
        textSize(32);
        textStyle(BOLD);
        textFont('Courier New');
        text('PARABÉNS! VOCÊ SALVOU O PACIENTE.', 40, 700);
        this.snd.play();
      }
    }
  }


  class Carro {
    constructor(x, y, img,  tam1, tam2) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.tam1 = tam1;
      this.tam2 = tam2;
      this.vx = 5;
      this.vy = 11;
      this.tam3 = 10;
    }
  
    exibirCarro() {
      image(this.img, this.x, this.y, this.tam1, this.tam2);
    }
  
    moverCarro() {
      // Atualiza a posição vertical do objeto somando sua velocidade vertical (vy).
      this.y = this.y + this.vy;
      
      // Verifica se o objeto tocou nos limites superior ou inferior da tela.
      if(this.y >= height - this.tam3 || this.y <= this.tam3) {
        this.vy = +this.vy; // Isso deveria inverter a direção, mas o "+" aqui não faz nada.
      }
    }
  }
  

  let a;
  let e;
  let p;
  let c = [];
  let posY = [-300, -230, -720, -500];
  // Posições Y das faixas = [-300, -230, -720];
  // Posições X das faixas = [205, 410, 615];
  let imgCarro = ['/assets/carro1.png', '/assets/carro2.png', '/assets/carro3.png', '/assets/pickup.png'];
  let imgCaminhoes = ['/assets/caminhao1.png', '/assets/caminhao2.png'];
  let faixas = [];
  let velFaixa = 7; // Altera a velocidade das faixas.
  let framesPorSegundo = 60;
  let taxa;
  let musica;
  let sirene;

  // Carrega o som da música e da sirene ao iniciar o sketch.

  function preload() {
    musica = loadSound('/assets/musica.mp3');
    sirene = loadSound('/assets/sirene.mp3');
  }

  function setup() {
    let canvas = createCanvas(700, 750);
    canvas.parent(document.body);
    musica.loop();
    sirene.loop();
    a = new Ambulancia(height / 2, 525, 120, 220);
    e = new Estrada(1, 1, 700, 950);
    p = new Ponto('Pontos: ', 500, 30);
    frameRate(framesPorSegundo);
    // Define o intervalo de frames em que as faixas devem surgir
    taxa = 30; // 1 faixa a cada 60 frames, ou seja, 
    // 1 faixa a cada 2 segundos.
  }

  let posX = [88, 230, 510, 380];
  let tempoAtual = 0; // Tempo decorrido desde o inicio do sketch.

  // Em cada segundo surge um carro ou caminhão em posições aleatórias nas faixas.

  let fase = [
    { id: 1, tempo: 2, veiculo: "carro", x: posX},
    { id: 2, tempo: 2, veiculo: "caminhao", x: posX},
    { id: 3, tempo: 3, veiculo: "caminhao", x: posX},
    { id: 4, tempo: 4, veiculo: "carro", x: posX},
    { id: 5, tempo: 5, veiculo: "caminhao", x: posX},
    { id: 6, tempo: 6, veiculo: "carro", x: posX},
    { id: 7, tempo: 7, veiculo: "carro", x: posX},
    { id: 8, tempo: 8, veiculo: "caminhao", x: posX},
    { id: 9, tempo: 9, veiculo: "carro", x: posX},
    { id: 10, tempo:10, veiculo: "carro", x: posX},
    { id: 11, tempo:11, veiculo: "carro", x: posX},
    { id: 12, tempo:12, veiculo: "carro", x: posX},
    { id: 13, tempo:13, veiculo: "carro", x: posX},
    { id: 15, tempo:14, veiculo: "caminhao", x: posX},
    { id: 16, tempo:15, veiculo: "carro", x: posX},
    { id: 17, tempo:16, veiculo: "carro", x: posX},
    { id: 18, tempo:17, veiculo: "carro", x: posX},
    { id: 19, tempo:18, veiculo: "carro", x: posX},
    { id: 21, tempo:19, veiculo: "caminhao", x: posX},
    { id: 22, tempo:20, veiculo: "carro", x: posX},
    { id: 23, tempo:21, veiculo: "caminhao", x: posX},
    { id: 24, tempo:22, veiculo: "carro", x: posX},
    { id: 25, tempo:23, veiculo: "carro", x: posX},
    { id: 26, tempo:24, veiculo: "carro", x: posX},
    { id: 27, tempo:25, veiculo: "caminhao", x: posX},
    { id: 28, tempo:26, veiculo: "caminhao", x: posX},
    { id: 29, tempo:27, veiculo: "carro", x: posX},
    { id: 31, tempo:28, veiculo: "caminhao", x: posX},
    { id: 32, tempo:29, veiculo: "carro", x: posX},
    { id: 33, tempo:30, veiculo: "carro", x: posX},
    { id: 34, tempo:31, veiculo: "caminhao", x: posX},
    { id: 35, tempo:32, veiculo: "carro", x: posX},
    { id: 36, tempo:33, veiculo: "carro", x: posX},
    { id: 37, tempo:34, veiculo: "carro", x: posX},
    { id: 38, tempo:35, veiculo: "carro", x: posX},
    { id: 39, tempo:36, veiculo: "carro", x: posX},
    { id: 40, tempo:37, veiculo: "caminhao", x: posX},
    { id: 41, tempo:38, veiculo: "carro", x: posX},
    { id: 42, tempo:39, veiculo: "carro", x: posX},
    { id: 43, tempo:40, veiculo: "carro", x: posX},
    { id: 44, tempo:41, veiculo: "carro", x: posX},
    { id: 45, tempo:42, veiculo: "caminhao", x: posX},
    { id: 46, tempo:43, veiculo: "carro", x: posX},
    { id: 47, tempo:44, veiculo: "caminhao", x: posX},
    { id: 48, tempo:45, veiculo: "carro", x: posX},
    { id: 49, tempo:46, veiculo: "carro", x: posX},
    { id: 50, tempo:47, veiculo: "carro", x: posX},
    { id: 51, tempo: 48, veiculo: "carro", x: posX},
    { id: 52, tempo: 49, veiculo: "carro", x: posX},
    { id: 53, tempo: 50, veiculo: "caminhao", x: posX},
    { id: 54, tempo: 51, veiculo: "carro", x: posX},
    { id: 55, tempo: 52, veiculo: "carro", x: posX},
    { id: 56, tempo: 53, veiculo: "carro", x: posX},
    { id: 57, tempo: 54, veiculo: "carro", x: posX},
    { id: 58, tempo: 55, veiculo: "carro", x: posX},
    { id: 59, tempo: 56, veiculo: "caminhao", x: posX},
    { id: 60, tempo: 57, veiculo: "carro", x: posX},
    { id: 61, tempo: 58, veiculo: "carro", x: posX},
    { id: 62, tempo: 59, veiculo: "carro", x: posX},
    { id: 63, tempo: 60, veiculo: "carro", x: posX},
    { id: 64, tempo: 61, veiculo: "carro", x: posX},
    { id: 65, tempo: 62, veiculo: "caminhao", x: posX},
    { id: 66, tempo: 63, veiculo: "carro", x: posX},
    { id: 67, tempo: 64, veiculo: "carro", x: posX},
    { id: 68, tempo: 65, veiculo: "carro", x: posX},
    { id: 69, tempo: 66, veiculo: "carro", x: posX},
    { id: 70, tempo: 67, veiculo: "carro", x: posX},
    { id: 71, tempo: 68, veiculo: "caminhao", x: posX},
    { id: 72, tempo: 69, veiculo: "carro", x: posX},
    { id: 73, tempo: 70, veiculo: "carro", x: posX},
    { id: 74, tempo: 71, veiculo: "carro", x: posX},
    { id: 75, tempo: 72, veiculo: "carro", x: posX},
    { id: 76, tempo: 73, veiculo: "carro", x: posX},
    { id: 77, tempo: 74, veiculo: "caminhao", x: posX},
    { id: 78, tempo: 75, veiculo: "carro", x: posX},
    { id: 79, tempo: 76, veiculo: "carro", x: posX},
    { id: 80, tempo: 77, veiculo: "carro", x: posX},
    { id: 81, tempo: 78, veiculo: "carro", x: posX},
    { id: 82, tempo: 79, veiculo: "carro", x: posX},
    { id: 83, tempo: 80, veiculo: "caminhao", x: posX},
    { id: 84, tempo: 81, veiculo: "carro", x: posX},
    { id: 85, tempo: 82, veiculo: "carro", x: posX},
    { id: 86, tempo: 83, veiculo: "carro", x: posX},
    { id: 87, tempo: 84, veiculo: "carro", x: posX},
    { id: 88, tempo: 85, veiculo: "carro", x: posX},
    { id: 89, tempo: 86, veiculo: "caminhao", x: posX},
    { id: 90, tempo: 87, veiculo: "carro", x: posX},
    { id: 91, tempo: 88, veiculo: "carro", x: posX},
    { id: 92, tempo: 89, veiculo: "carro", x: posX},
    { id: 93, tempo: 90, veiculo: "carro", x: posX}
  ];

  let gerados = [];

  function draw() {

    // Filtra os elementos da fase que possuem o mesmo tempo que o tempo atual.
    let v = fase.filter(item => item.tempo == tempoAtual);
    
    if (v.length > 0) { // Se houver itens correspondentes ao tempo atual.
      for (let item of v) { // Percorre os itens filtrados.
        // Verifica se o item ainda não foi gerado (para evitar duplicação).
        if (gerados.indexOf(item.id) < 0) {
          if (item.veiculo == "carro") { // Se o veículo for um carro.
            c.push(                                               // Largura do carro.  // Altura do carro.
              new Carro(random(item.x), random(posY), loadImage(random(imgCarro)), 100, 175)
            );
          } else { // Se o veículo for um caminhão.
            c.push(
              new Carro(random(item.x), random(posY), loadImage(random(imgCaminhoes)), 110, 220)
            );
          }
          // Marca o item como gerado para evitar duplicação.
          gerados.push(item.id);
        } 
      }
    }
    
    // Limpa a variável v.
    v = [];

    background(100);

    e.exibir();
    criarFaixas();
  
    for (let faixa of faixas) {
      if (faixa.y < height) {
        rect(faixa.x, faixa.y, 10, 100);
        faixa.y += velFaixa;  
      }
    }
    
    // remove do array as faixas que já saíram da tela
    for (let i = faixas.length - 1; i >= 0; i--) {
      if (faixas[i].y > height) {
        faixas.splice(i, 1);
      }
    }
    // faixas = faixas.filter(f => false);

    a.mostrar(); // Mostra a ambulância.
    p.calcularPonto();
    a.mover(); // Move a ambulância.
    for(let x of c) {
      x.exibirCarro();
      x.moverCarro();
    }
    a.verificarColisao(c);
    p.exibirPonto();

    // Contador de Frames (FPS).

    push();
    fill(255);
    textSize(15);
    textFont('Courier New');
    tempoAtual = Math.round(frameCount / frameRate());
    text("Tempo: " + tempoAtual, 95, 30);
    pop()

    p.imagemFinal(); // Carrega a imagem final do jogo.
  }

  function criarFaixas() {  
    if (frameCount % taxa == 0) {
      faixas.push({x: 210, y: -100}, {x: width / 2, y: -100}, {x: 490, y: -100});
    }
  }


  // Caso a música ou a sirene não toque, o usuário pode clicar na tela para acionar os áudios.

  function mousePressed() {
    if (!musica.isPlaying()) {
      musica.loop();
    }
    if (!sirene.isPlaying()) {
      sirene.loop();
    }
  }