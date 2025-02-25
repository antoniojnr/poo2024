class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.playButton = document.getElementById("playButton");
    this.snake = [{ x: 200, y: 200 }];
    this.apple = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20,
    };
    this.direction = "RIGHT";
    this.level = 1;
    this.timer = 60;
    this.speed = 200;
    this.applesCollected = 0;
    this.gameInterval = null;
    this.timerInterval = null;
    this.gameRunning = false;
    this.maxLevels = 10;

    this.backgroundMusic = new Audio("/sounds/gameStart.mp3");
    this.backgroundMusic.loop = true;

    this.eatApple = new Audio("/sounds/eatApple.mp3");
    this.loseGame = new Audio("/sounds/loseGame.mp3");
    this.winLevel = new Audio("/sounds/winLevel.mp3");
    this.winGame = new Audio("/sounds/winGame.mp3");

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener("keydown" /*teclado*/, this.changeDirection.bind(this));
    this.playButton.addEventListener("click", this.startGame.bind(this));
  }

  changeDirection(event) {
    const { key } = event;
    if (key === "ArrowUp" && this.direction !== "DOWN") this.direction = "UP";
    if (key === "ArrowDown" && this.direction !== "UP") this.direction = "DOWN";
    if (key === "ArrowLeft" && this.direction !== "RIGHT")
      this.direction = "LEFT";
    if (key === "ArrowRight" && this.direction !== "LEFT")
      this.direction = "RIGHT";
  }

  startGame() {
    if (!this.gameRunning) {
      this.gameRunning = true;
      this.playButton.disabled = true;
      this.timer = 60;
      this.applesCollected = 0;
      this.backgroundMusic.play();
      this.updateUi();
      this.gameInterval = setInterval(this.gameLoop.bind(this), this.speed);
      this.timerInterval = setInterval(() => {
        this.timer--;
        this.updateUi();
        if (this.timer <= 0) {
          this.endGame(false);
        }
      }, 1000);
    }
  }

  pauseGame() {
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);
    this.gameRunning = false;
    this.playButton.disabled = false;
  }

  endGame(won) {
    this.pauseGame();
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0; // Reinicia a música para o começo
    if (won) {
      this.winGame.play();
      alert(`Parabéns! Você completou o jogo!`);
    } else {
      this.loseGame.play();
      alert("Fim de Jogo! Você perdeu e voltou ao início.");
      this.resetGame();
    }
  }

  resetGame() {
    this.snake = [{ x: 200, y: 200 }];
    this.apple = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20,
    };
    this.direction = "RIGHT";
    this.level = 1;
    this.speed = 200;
    this.applesCollected = 0;
    this.updateUi();
  }

  nextLevel() {
    this.pauseGame();
    if (this.level < this.maxLevels) {
      this.winLevel.play();
      alert(
        `Nível ${this.level} completo! Pressione Jogar para começar o próximo nível.`
      );
      this.snake = [{ x: 200, y: 200 }];
      this.apple = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
      };
      this.direction = "RIGHT";
      this.applesCollected = 0;
      this.level++;
      this.speed = Math.max(50, this.speed - 20); // Velocidade mínima de 50ms
      this.updateUi();
    } else {
      this.endGame(true);
    }
  }

  update() {
    const head = { ...this.snake[0] };
    if (this.direction === "UP") head.y -= 20;
    if (this.direction === "DOWN") head.y += 20;
    if (this.direction === "LEFT") head.x -= 20;
    if (this.direction === "RIGHT") head.x += 20;
    this.snake.unshift(head);

    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.apple = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
      };
      this.applesCollected++;
      this.eatApple.play();
      this.updateUi();
      if (this.applesCollected === 7) {
        this.nextLevel();
      }
    } else {
      this.snake.pop();
    }

    if (
      head.x < 0 ||
      head.x >= this.canvas.width ||
      head.y < 0 ||
      head.y >= this.canvas.height ||
      this.snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      this.endGame(false);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Desenha a maçâ
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.apple.x, this.apple.y, 20, 20);
    // Desenha a cobra
    this.ctx.fillStyle = "lime";
    this.snake.forEach((segment) =>
      this.ctx.fillRect(segment.x, segment.y, 20, 20)
    );
  }

  gameLoop() {
    this.update();
    this.draw();
  }

  updateUi() {
    document.getElementById("timer").textContent = this.timer;
    document.getElementById("apples").textContent = this.applesCollected;
    document.getElementById("level").textContent = this.level;
  }
}

// Criei uma instância do jogo
const game = new SnakeGame();
