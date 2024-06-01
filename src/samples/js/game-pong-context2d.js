/* About: Pingpong for HTML, you can insert it in anny Div tagged with an id
 *     This is a simple elegant sample for how to work with a Canvas
 */
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Ball extends Rectangle {
  constructor(x, y, width, height, vx, vy) {
    super(x, y, width, height);
    this.vx = vx;
    this.vy = vy;
    this.prevX = this.x;
    this.prevY = this.y;
  }

  move(timeDelta) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.vx * timeDelta;
    this.y += this.vy * timeDelta;
  }

  borderTopAndBottom(height) {
    if (this.y < 0) {
      this.y = 0;
      this.vy = -this.vy;
      return true;
    } else if (this.y > height - this.height) {
      this.y = height - this.height;
      this.vy = - this.vy;
      return true;
    }
    return false;
  }
}

class Paddle extends Rectangle {
  constructor(x, y, width = 20, height = 20) {
    super(x, y, width, height);
    this.vy = 0;
  }

  move(timeDelta) {
    this.y += this.vy * timeDelta;
  }

  borderTopAndBottom(height) {
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    } else if (this.y > height - this.height) {
      this.y = height - this.height;
      this.vy = 0;
    }
  }
}

class PingPong_CTX2D {
  static get DEBUG_PARENT_OBJECT() { return true; };
  static get AUTO_CONTINUE_ON_FOCUS() { return false; };
  static get SHOW_FPS_INTERVAL() { return 1000 / 4; }; // four times per second

  static get STATE_COUNTDOWN() { return 0; };
  static get STATE_PLAYING() { return 1; };
  static get STATE_ENDED() { return 2; };
  static get BALL_SIZE() { return 8; };
  static get SPEED_HUMAN() { return 180; };
  static get SPEED_CPU() { return 210; };

  static get PADDLE_WIDTH() { return 10; };
  static get PADDLE_HEIGHT() { return 60; };
  static get PADDLE_MARGIN() { return 10; };

  static get KEY_ARROW_UP() { return 'ArrowUp'; };
  static get KEY_ARROW_DOWN() { return 'ArrowDown'; };
  static get KEY_W() { return 'w'; };
  static get KEY_S() { return 's'; };
  static get KEY_ENTER() { return 'Enter'; };
  static get KEY_SPACEBAR() { return ' '; };
  static get KEY_ESCAPE() { return 'Escape'; };

  animationRequestId = 0;
  running = false;

  constructor(divId, width, height, zoom = 1, showFps = false) {
    this.createCanvas(divId, width, height, zoom);
    this.canvasEl.title = "Playing: PingPong";
    this.ctx = this.canvasEl.getContext("2d");
    this.ctx.textAlign = "center";

    this.audioCtx = new AudioContext();
    this.sounds = [];
    this.sounds[0] = new Audio('./snd/glass-knock.mp3');
    this.audioCtx.createMediaElementSource(this.sounds[0]).connect(this.audioCtx.destination);
    this.sounds[1] = new Audio('./snd/short-success.mp3');
    this.audioCtx.createMediaElementSource(this.sounds[1]).connect(this.audioCtx.destination);

    this.showFps = showFps;
    if (showFps) {
      // add framecounter and fps variables and html
      this.frameCounter = 0;
      this.initTime = performance.now();
      const el = document.createElement('p');
      this.frameLabel = document.createElement('span');
      const floatRight = document.createElement('span');
      floatRight.style = "float: right;";
      this.fpsCounter = 0;
      this.fpsLabel = document.createElement('span');
      el.appendChild(document.createTextNode('fps: '));
      el.appendChild(this.fpsLabel);
      floatRight.appendChild(document.createTextNode('frame: '));
      floatRight.appendChild(this.frameLabel);
      el.appendChild(floatRight);
      this.divEl.appendChild(el);
    }

    this.restartGame();
    this.canvasEl.addEventListener("keydown", (e) => this.onKeyDown(e));
    this.canvasEl.addEventListener("keyup", (e) => this.onKeyUp(e));
    this.canvasEl.addEventListener("blur", (e) => this.onBlur(e));
    this.canvasEl.addEventListener("focus", (e) => this.onFocus(e));

    if (PingPong_CTX2D.DEBUG_PARENT_OBJECT) window.game = this;
    if (typeof WTerminal === "function") {
      WTerminal.terminalAddCommand("restartgame", (t) => this.terminalRestartGame(t));
      WTerminal.terminalAddCommand("printgame", (t) => t.printVar(this, "pong"));
      WTerminal.printLn("new PingPong: @", divId, ' ', width, 'x', height, ':', zoom, ' showFps=', showFps);
    }

    this.drawCanvas();
  }

  playSound(index) {
    try {
      const snd = this.sounds[index];
      snd.currentTime = 0;
      snd.play();
    } catch (e) {
      console.log(`Failed to play sound '${index}': ${e}}`)
    }
  }

  restartGame() {
    this.scoreCpu = 0;
    this.scoreHuman = 0;
    this.newRound();
  }

  newRound() {
    this.countDown = 3; // seconds;
    this.gameState = PingPong_CTX2D.STATE_COUNTDOWN;
    // randomize ball speed
    let vx = 200 + Math.random() * 100;
    let vy = -20 + Math.random() * 20;
    if (Math.random() > 0.5) vx = - vx;
    if (Math.random() > 0.5) vy = - vy;
    // generate objects
    this.ball = new Ball(this.width / 2 - PingPong_CTX2D.BALL_SIZE / 2, this.height / 2 - PingPong_CTX2D.BALL_SIZE / 2,
      PingPong_CTX2D.BALL_SIZE, PingPong_CTX2D.BALL_SIZE, vx, vy);
    this.human = new Paddle(PingPong_CTX2D.PADDLE_MARGIN, this.height / 2 - PingPong_CTX2D.PADDLE_HEIGHT / 2,
      PingPong_CTX2D.PADDLE_WIDTH, PingPong_CTX2D.PADDLE_HEIGHT);
    this.cpu = new Paddle(this.width - PingPong_CTX2D.PADDLE_MARGIN - PingPong_CTX2D.PADDLE_WIDTH, this.height / 2 - PingPong_CTX2D.PADDLE_HEIGHT / 2,
      PingPong_CTX2D.PADDLE_WIDTH, PingPong_CTX2D.PADDLE_HEIGHT);

    this.prevNow = performance.now();
  }

  createCanvas(divId, width = 0, height = 0, zoom = 1) {
    this.divEl = document.getElementById(divId);
    if (this.divEl === null) throw new Error("elementId not found: " + divId);
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
  }

  drawCanvas() {
    if (this.showFps) {
      this.frameCounter++;
      this.fpsCounter++;

      const now = performance.now();
      const diff = now - this.initTime;
      if (PingPong_CTX2D.SHOW_FPS_INTERVAL < diff || !this.running) {
        this.initTime = now;
        const seconds = diff / 1000;
        const fps = this.fpsCounter / seconds;
        this.fpsCounter = 0;
        if (this.frameLabel) this.frameLabel.innerHTML = this.frameCounter;
        if (this.fpsLabel) {
          this.fpsLabel.innerHTML = Math.round((fps + Number.EPSILON) * 100) / 100;
          if (!this.running) this.fpsLabel.innerHTML += " (not running)";
        }
      }
    }
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    //# print score
    const FONT_SIZE = this.width > 440 ? 24 : 16;
    ctx.font = FONT_SIZE + "px serif";
    ctx.fillStyle = 'red';
    ctx.fillText(this.scoreHuman + " - " + this.scoreCpu, this.width / 2, FONT_SIZE * 2);
    //# print count down
    if (this.gameState == PingPong_CTX2D.STATE_COUNTDOWN) {
      ctx.font = 2 * FONT_SIZE + "px serif";
      ctx.fillText(Math.ceil(this.countDown), this.width / 2, this.height / 2);
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
    ctx.arc(this.ball.prevX + PingPong_CTX2D.BALL_SIZE / 2, this.ball.prevY + PingPong_CTX2D.BALL_SIZE / 2, PingPong_CTX2D.BALL_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.ball.x + PingPong_CTX2D.BALL_SIZE / 2, this.ball.y + PingPong_CTX2D.BALL_SIZE / 2, PingPong_CTX2D.BALL_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    //# draw players paddle
    ctx.fillStyle = 'green';
    ctx.fillRect(this.human.x, this.human.y, this.human.width, this.human.height);
    ctx.strokeRect(this.human.x, this.human.y, this.human.width, this.human.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);
    ctx.strokeRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);
    ctx.restore(); //end shadow
    // unfocused & paused banner
    if (!this.running) {
      const x = this.width / 2;
      const y = this.height / 2;
      const y2 = y - FONT_SIZE / 2;
      ctx.strokeStyle = 'black';
      const g = ctx.createLinearGradient(0, 0, this.width, 0);
      g.addColorStop(0, '#404040a0');
      g.addColorStop(0.2, '#404040df');
      g.addColorStop(0.8, '#404040df');
      g.addColorStop(1, '#404040a0');
      ctx.fillStyle = g;
      ctx.fillRect(0, y2 - 2, this.width + 1, FONT_SIZE + 5 * 2);
      ctx.strokeRect(0, y2 - 2, this.width + 1, FONT_SIZE + 5 * 2);
      ctx.fillStyle = (this.gameState === PingPong_CTX2D.STATE_ENDED) ? 'red' : 'gray';
      ctx.font = 4 * FONT_SIZE + "px serif";
      let text = (this.gameState === PingPong_CTX2D.STATE_ENDED) ? "Score!" : "Paused";
      ctx.fillText(text, x, y - 2 * FONT_SIZE);
      ctx.strokeText(text, x, y - 2 * FONT_SIZE);
      ctx.fillStyle = this.isFocused ? 'goldenrod' : 'lightgray';
      ctx.font = FONT_SIZE + "px serif";
      text = this.isFocused ? `Press space or enter to ${(this.gameState === PingPong_CTX2D.STATE_ENDED) ? "start next round" : "continue"}.` : "Click here to continue. (unfocused)";
      ctx.strokeText(text, x, y2 + FONT_SIZE);
      ctx.fillText(text, x, y2 + FONT_SIZE);
    }
  }

  updateCanvas() {
    const now = performance.now();
    const timeDelta = (now - this.prevNow) / 1000; //timeDelta = (milli - milli) / toSeconds
    this.prevNow = now;
    //#state switch
    if (this.gameState == PingPong_CTX2D.STATE_COUNTDOWN) {
      this.human.move(timeDelta);
      this.human.borderTopAndBottom(this.height);

      this.cpu.move(timeDelta);
      this.cpu.borderTopAndBottom(this.height);

      this.countDown -= timeDelta;//PONG_UPDATE_INTERVAL;
      if (this.countDown < 0) {
        this.gameState = PingPong_CTX2D.STATE_PLAYING;
      }
    } else if (this.gameState == PingPong_CTX2D.STATE_PLAYING) {
      //cpu actions
      if (this.ball.y + this.ball.height / 2 < this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = -PingPong_CTX2D.SPEED_CPU;
      } else if (this.ball.y > this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = PingPong_CTX2D.SPEED_CPU;
      } else {
        this.cpu.vy = 0;
      }

      //move ball and paddles
      this.ball.move(timeDelta);
      if (this.ball.borderTopAndBottom(this.height)) {
        this.playSound(0);
      }
      //Horizontal
      if (this.ball.x < 0) {
        this.win(0);
        this.playSound(1);
      } else if (this.ball.x > this.width - this.ball.width) {
        this.win(1);
        this.playSound(1);
      }

      this.human.move(timeDelta);
      this.human.borderTopAndBottom(this.height);

      this.cpu.move(timeDelta);
      this.cpu.borderTopAndBottom(this.height);

      // collide ball vs paddles
      if (this.human.x + this.human.width < this.ball.prevX && this.human.x + this.human.width > this.ball.x) {
        // console.log("pass 1.1");
        if (this.human.y < this.ball.y + this.ball.height && this.human.y + this.human.height > this.ball.y) {
          // console.log("pass 1.2");
          this.ball.vx = this.ball.vx * -1.05;
          this.ball.x = this.human.x + this.human.width;
          this.ball.vy += ((this.ball.height / 2 + this.ball.y) - (this.human.height / 2 + this.human.y)) * 10;
          this.playSound(0);
        }
      }

      if (this.cpu.x < this.ball.x + this.ball.width && this.cpu.x > this.ball.prevX + this.ball.width) {
        // console.log("pass 2.1");
        if (this.cpu.y < this.ball.y + this.ball.height && this.cpu.y + this.cpu.height > this.ball.y) {
          // console.log("pass 2.2");
          this.ball.vx = this.ball.vx * -1.05;
          this.ball.x = this.cpu.x - this.ball.width;
          let temp = ((this.ball.height / 2 + this.ball.y) - (this.cpu.height / 2 + this.cpu.y)) * 10;
          this.ball.vy += temp;
          this.playSound(0);
        }
      }
    }
    this.drawCanvas();
    if (this.running) { // loop
      this.animationRequestId = requestAnimationFrame(() => this.updateCanvas());
    } else { // not looping
      this.animationRequestId = 0;
    }
  }

  startRunning(fn) {
    if (this.animationRequestId != 0) cancelAnimationFrame(this.animationRequestId);
    this.running = true;
    this.prevNow = performance.now();
    if (this.showFps) {
      this.initTime = performance.now();
    }
    this.animationRequestId = requestAnimationFrame(fn);
  }

  close() {
    if (this.animationRequestId != 0) {
      cancelAnimationFrame(this.animationRequestId);
      this.animationRequestId = 0;
    }
    this.running = false;
  }

  pausePlayGame() {
    if (this.gameState == PingPong_CTX2D.STATE_ENDED) return;
    this.running = !this.running;
    if (this.running) {
      this.startRunning(() => this.updateCanvas());
    }
  }

  terminalPrintGame(term) {
    term.printVar(this, "pong");
  }

  terminalRestartGame(term) {
    term.terminalClose();
    this.restartGame();
    // this.canvasEl.focus();
    setTimeout(() => { this.canvasEl.focus(); this.pausePlayGame(); }, 200);
  }

  win(winner) {
    this.running = false; //this.stopRunning();
    this.gameState = PingPong_CTX2D.STATE_ENDED;
    if (winner == 0) {
      this.scoreCpu++;
      if (typeof WTerminal === "function") WTerminal.printLn("CPU scored?!");
    } else {
      this.scoreHuman++;
      if (typeof WTerminal === "function") WTerminal.printLn("Human scored!");
    }
    if (typeof WTerminal === "function") WTerminal.printLn("Scores: Human " + this.scoreHuman + " - " + this.scoreCpu + " CPU");
  }

  onKeyDown(e) {
    if (e.key == PingPong_CTX2D.KEY_ESCAPE) {
      if (this.running) this.pausePlayGame()
      e.preventDefault();
      return false;
    }
    if (e.key == PingPong_CTX2D.KEY_ARROW_UP || e.key == PingPong_CTX2D.KEY_W) {
      this.human.vy = -PingPong_CTX2D.SPEED_HUMAN;
      e.preventDefault();
      return false;
    } else if (e.key == PingPong_CTX2D.KEY_ARROW_DOWN || e.key == PingPong_CTX2D.KEY_S) {
      this.human.vy = PingPong_CTX2D.SPEED_HUMAN;
      e.preventDefault();
      return false;
    } else if (e.key == PingPong_CTX2D.KEY_ENTER || e.key == PingPong_CTX2D.KEY_SPACEBAR) {
      //# next round/pause/play
      if (this.gameState == PingPong_CTX2D.STATE_ENDED) {
        this.newRound();
        this.startRunning(() => this.updateCanvas());
      } else {
        this.pausePlayGame();
      }
      e.preventDefault();
      return false;
    }
    return true;
  }

  onKeyUp(e) {
    if (e.key == PingPong_CTX2D.KEY_ARROW_UP || e.key == PingPong_CTX2D.KEY_W) {
      this.human.vy = 0;
      e.preventDefault();
      return false;
    } else if (e.key == PingPong_CTX2D.KEY_ARROW_DOWN || e.key == PingPong_CTX2D.KEY_S) {
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
    if (!this.running && PingPong_CTX2D.AUTO_CONTINUE_ON_FOCUS) {
      this.pausePlayGame();
    } else {
      this.drawCanvas();
    }
  }
}

function startPingPong(divId, width = 480, height = 320, zoom = 1, showFps = true) {
  return new PingPong_CTX2D(divId, width, height, zoom, showFps);
}
