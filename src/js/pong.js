// Our variables we're using for setup
const DEBUG_FRAMERATE = false;
const DEBUG_PARENT_OBJECT = true;
const AUTO_CONTINUE_ON_FOCUS = false;
const UPDATE_INTERVAL = 1000 / 60; // go for 60 fps

const STATE_COUNTDOWN = 0;
const STATE_PLAYING = 1;
const STATE_ENDED = 2;
const BALL_SIZE = 8;
const SPEED_HUMAN = 3;
const SPEED_CPU = 3.5;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const PADDLE_MARGIN = 10;

const KEY_ARROW_UP = 'ArrowUp';
const KEY_ARROW_DOWN = 'ArrowDown';
const KEY_W = 'w';
const KEY_S = 's';
const KEY_ENTER = 'Enter';
const KEY_SPACEBAR = ' ';

class Rectangle {
  constructor(x = 10, y = 10, width = 10, height = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Ball extends Rectangle {
  constructor(x = 10, y = 10, width = 20, height = 20, vx = 0, vy = 0) {
    super(x, y, width, height);
    this.vx = vx;
    this.vy = vy;
    this.prevX = this.x;
    this.prevY = this.y;
  }

  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;
  }

  checkWalls(width, height) {
    //Vertical
    if (this.y < 0) {
      this.y = 0;
      this.vy = -this.vy;
    } else if (this.y > height - this.height) {
      this.y = height - this.height;
      this.vy = - this.vy;
    }
  }
}

class Paddle extends Rectangle {
  constructor(x, y, width = 20, height = 20) {
    super(x, y, width, height);
    this.vy = 0;
  }

  move() {
    this.y += this.vy;
  }

  checkWalls(width, height) {
    //Vertical
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    } else if (this.y > height - this.height) {
      this.y = height - this.height;
      this.vy = 0;
    }
  }
}

class PingPong {
  intervalId = 0;
  running = false;

  gameState = STATE_COUNTDOWN;
  scoreCpu = 0;
  scoreHuman = 0;

  constructor(divId, width, height, zoom) {
    if (DEBUG_PARENT_OBJECT) window.game = this;
    this.createCanvas(divId, "2d", width, height, zoom);
    this.canvasEl.title = "Playing: Ping pong";
    this.ctx.textAlign = "center";

    if (DEBUG_FRAMERATE) {
      // add framecounter and fps variables and html
      this.frameCounter = 0;
      this.initTime = performance.now();
      const el = document.createElement('p');
      el.appendChild(document.createTextNode('frame: '));
      this.frameLabel = document.createElement('span');
      el.appendChild(game.frameLabel);
      el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode('fps: '));
      this.fpsLabel = document.createElement('span');
      el.appendChild(game.fpsLabel);
      this.divEl.appendChild(el);
    }

    // start
    this.newGame();
    this.canvasEl.addEventListener("keydown", (e) => this.onKeyDown(e));
    this.canvasEl.addEventListener("keyup", (e) => this.onKeyUp(e));
    this.canvasEl.addEventListener("blur", (e) => this.onBlur(e));
    this.canvasEl.addEventListener("focus", (e) => this.onFocus(e));
    this.ctx.textAlign = "center";

    this.canvasEl.focus();
    // this.isFocused = true;
    this.startRunning(() => this.updateCanvas());
    if (typeof terminalAddCommand === "function") terminalAddCommand("restartgame", () => this.terminalRestartGame());
  }

  newGame() {
    this.countDown = 3000; // miliseconds;
    this.gameState = STATE_COUNTDOWN;

    // randomize ball speed
    let vx = 3 + Math.random() * 2;
    let vy = -0.1;// + Math.random() * 2;
    if (Math.random() > 0.5) {
      vx = - vx;
    }
    if (Math.random() > 0.5) {
      vy = - vy;
    }

    // generate objects
    this.ball = new Ball(this.width / 2 - BALL_SIZE / 2, this.height / 2 - BALL_SIZE / 2,
      BALL_SIZE, BALL_SIZE, vx, vy);
    this.human = new Paddle(PADDLE_MARGIN, this.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH, PADDLE_HEIGHT);
    this.cpu = new Paddle(this.width - PADDLE_MARGIN - PADDLE_WIDTH, this.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH, PADDLE_HEIGHT);
  }

  restartGame() {
    this.scoreCpu = 0;
    this.scoreHuman = 0;
    this.newGame();
  }

  terminalRestartGame() {
    terminalClose();
    this.restartGame();
    // this.canvasEl.focus();
    setTimeout(() => { this.canvasEl.focus(); this.pausePlayGame(); }, 200);
  }

  createCanvas(divId, contextType, width = 0, height = 0, zoom = 1) {
    this.divEl = document.getElementById(divId);
    while (this.divEl.firstChild) {
      this.divEl.removeChild(this.divEl.lastChild);
    }
    this.canvasEl = this.divEl.appendChild(document.createElement("canvas"));
    const c = this.canvasEl;
    this.width = width;
    this.height = height;
    if (width > 0 && height > 0) {
      c.style.width = width * zoom + 'px';
      c.style.height = height * zoom + 'px';
      c.width = width;
      c.height = height;
    }
    c.tabIndex = 0; // improtant for keyboard focus!
    // c.style.imageRendering = 'pixelated';
    this.ctx = c.getContext(contextType);
  }

  drawCanvas() {
    if (DEBUG_FRAMERATE) {
      // update labels
      this.frameCounter++;
      if (this.frameLabel) this.frameLabel.innerHTML = this.frameCounter;
      if (this.fpsLabel) {
        const now = performance.now();
        const diff = now - this.initTime;
        this.initTime = now;
        const seconds = diff / 1000;
        const fps = 1 / seconds;
        this.fpsLabel.innerHTML = Math.round((fps + Number.EPSILON) * 100) / 100;
      }
    }

    // draw game
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    //# print score
    const FONT_SIZE = this.width > 440 ? 24 : 16;
    ctx.font = FONT_SIZE + "px serif";
    ctx.fillStyle = 'red';
    ctx.fillText(this.scoreHuman + " - " + this.scoreCpu, this.width / 2, FONT_SIZE * 2);
    //# print count down
    if (this.gameState == STATE_COUNTDOWN) {
      ctx.font = 2 * FONT_SIZE + "px serif";
      ctx.fillText(Math.ceil(this.countDown / 1000), this.width / 2, this.height / 2);
    }
    //# shadow
    ctx.save();
    ctx.shadowColor = '#000000bf';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    //# draw ball
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'orange';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(this.ball.prevX + BALL_SIZE / 2, this.ball.prevY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.ball.x + BALL_SIZE / 2, this.ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    //# draw players
    ctx.fillStyle = 'green';
    ctx.fillRect(this.human.x, this.human.y, this.human.width, this.human.height);
    ctx.strokeRect(this.human.x, this.human.y, this.human.width, this.human.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);
    ctx.strokeRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);

    ctx.restore();

    if (!this.running) {
      const x = this.width / 2;
      const y = this.height / 2;
      const y2 = y - FONT_SIZE / 2;
      ctx.strokeStyle = 'black';
      // ctx.fillStyle = '#404040a0';
      const g = ctx.createLinearGradient(0, 0, this.width, 0);
      g.addColorStop(0, '#404040a0');
      g.addColorStop(0.2, '#404040df');
      g.addColorStop(0.8, '#404040df');
      g.addColorStop(1, '#404040a0');
      ctx.fillStyle = g;
      ctx.fillRect(0, y2 - 2, this.width + 1, FONT_SIZE + 5 * 2);
      ctx.strokeRect(0, y2 - 2, this.width + 1, FONT_SIZE + 5 * 2);
      ctx.fillStyle = (this.gameState === STATE_ENDED) ? 'red' : 'gray';
      ctx.font = 4 * FONT_SIZE + "px serif";
      let text = (this.gameState === STATE_ENDED) ? "Score!" : "Paused";
      ctx.fillText(text, x, y - 2 * FONT_SIZE);
      ctx.strokeText(text, x, y - 2 * FONT_SIZE);
      ctx.fillStyle = this.isFocused ? 'goldenrod' : 'lightgray';
      ctx.font = FONT_SIZE + "px serif";
      text = this.isFocused ? `Press space or enter to ${(this.gameState === STATE_ENDED) ? "start next round" : "continue"}.` : "Click here to continue. (unfocused)";
      ctx.strokeText(text, x, y2 + FONT_SIZE);
      ctx.fillText(text, x, y2 + FONT_SIZE);
    }
  }

  updateCanvas() {
    //#state switch
    if (this.gameState == STATE_COUNTDOWN) {
      this.human.move();
      this.human.checkWalls(this.width, this.height);

      this.cpu.move();
      this.cpu.checkWalls(this.width, this.height);

      this.countDown -= UPDATE_INTERVAL;
      if (this.countDown < 0) {
        this.gameState = STATE_PLAYING;
      }
    } else if (this.gameState == STATE_PLAYING) {
      //cpu
      if (this.ball.y + this.ball.height / 2 < this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = -SPEED_CPU;
      } else if (this.ball.y > this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = SPEED_CPU;
      } else {
        this.cpu.vy = 0;
      }

      //move
      this.ball.move();
      this.ball.checkWalls(this.width, this.height);
      //Horizontal
      if (this.ball.x < 0) {
        this.win(0);
      } else if (this.ball.x > this.width - this.ball.width) {
        this.win(1);
      }

      this.human.move();
      this.human.checkWalls(this.width, this.height);

      this.cpu.move();
      this.cpu.checkWalls(this.width, this.height);

      // collide ball vs paddles
      if (this.human.x + this.human.width < this.ball.prevX && this.human.x + this.human.width > this.ball.x) {
        // console.log("pass 1.1");
        if (this.human.y < this.ball.y + this.ball.height && this.human.y + this.human.height > this.ball.y) {
          // console.log("pass 1.2");
          this.ball.vx = this.ball.vx * -1.05;
          this.ball.x = this.human.x + this.human.width;
          this.ball.vy += ((this.ball.height / 2 + this.ball.y) - (this.human.height / 2 + this.human.y)) / 6;
        }
      }

      if (this.cpu.x < this.ball.x + this.ball.width && this.cpu.x > this.ball.prevX + this.ball.width) {
        // console.log("pass 2.1");
        if (this.cpu.y < this.ball.y + this.ball.height && this.cpu.y + this.cpu.height > this.ball.y) {
          // console.log("pass 2.2");
          this.ball.vx = this.ball.vx * -1.05;
          this.ball.x = this.cpu.x - this.ball.width;
          let temp = ((this.ball.height / 2 + this.ball.y) - (this.cpu.height / 2 + this.cpu.y)) / 6;
          this.ball.vy += temp;
        }
      }
    }
    this.drawCanvas();
  }

  startRunning(fn) {
    if (this.intervalId != 0) clearInterval(this.intervalId);
    this.intervalId = setInterval(fn, UPDATE_INTERVAL);
    this.running = true;
  }

  stopRunning() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
    this.running = false;
  }

  win(winner) {
    this.stopRunning();
    this.gameState = STATE_ENDED;
    if (winner == 0) {
      this.scoreCpu++;
      if (typeof terminalPrintLn === "function") terminalPrintLn("CPU scored?!");
    } else {
      this.scoreHuman++;
      if (typeof terminalPrintLn === "function") terminalPrintLn("Human scored!");
    }
    if (typeof terminalPrintLn === "function") terminalPrintLn("Scores: Human " + this.scoreHuman + " - " + this.scoreCpu + " CPU");
  }

  pausePlayGame() {
    if (this.gameState == STATE_ENDED) return;
    this.running = !this.running;
    if (this.running) {
      this.startRunning(() => this.updateCanvas());
    } else {
      this.stopRunning()
      this.drawCanvas();
    }
  }

  onKeyDown(e) {
    if (e.key == KEY_ARROW_UP || e.key == KEY_W) {
      this.human.vy = -SPEED_HUMAN;
      e.preventDefault();
      return false;
    } else if (e.key == KEY_ARROW_DOWN || e.key == KEY_S) {
      this.human.vy = SPEED_HUMAN;
      e.preventDefault();
      return false;
    } else if (e.key == KEY_ENTER || e.key == KEY_SPACEBAR) {
      //# next round/pause/play
      if (this.gameState == STATE_ENDED) {
        this.newGame();
        this.startRunning(() => this.updateCanvas());
      } else {
        this.pausePlayGame();
      }
      return true;
    }
  }

  onKeyUp(e) {
    if (e.key == KEY_ARROW_UP || e.key == KEY_W) {
      this.human.vy = 0;
      e.preventDefault();
      return false;
    } else if (e.key == KEY_ARROW_DOWN || e.key == KEY_S) {
      this.human.vy = 0;
      e.preventDefault();
      return false;
    }
    return true;
  }

  onBlur() {
    this.isFocused = false;
    this.canvasEl.style.borderColor = null;
    if (this.running) {
      this.pausePlayGame();
    } else {
      this.drawCanvas();
    }
  }

  onFocus() {
    this.isFocused = true;
    this.canvasEl.style.borderColor = "red";
    if (!this.running && AUTO_CONTINUE_ON_FOCUS) {
      this.pausePlayGame();
    } else {
      this.drawCanvas();
    }
  }
}

function startPingPong(divId, width, height, zoom) {
  return new PingPong(divId, width, height, zoom);
}
