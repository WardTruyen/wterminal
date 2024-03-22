/* Author:  Ward Truyen
 * Version:  1.0.0
 * Optional requirements: terminal.js (wterminal)
 * About Pong: Pingpong for HTML, you can insert it in anny Div tagged with an id
 *     This is a simple elegant sample for how to work with a Canvas
 */
// Our variables we're using for setup
const DEBUG_PONG_FRAMERATE = false;
const PONG_AUTO_CONTINUE_ON_FOCUS = false;
// const PONG_UPDATE_INTERVAL = 1000 / 60; // go for 60 fps

const STATE_COUNTDOWN = 0;
const STATE_PLAYING = 1;
const STATE_ENDED = 2;
const BALL_SIZE = 8;
const SPEED_HUMAN = 180;
const SPEED_CPU = 210;

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

class PingPong {
  animationRequestId = 0;
  running = false;

  constructor(divId, width, height, zoom) {
    this.createCanvas(divId, width, height, zoom);

    if (typeof terminalAddCommand === "function") {
      terminalAddCommand("restartpong", (t) => this.terminalRestartGame(t));
      terminalAddCommand("printpong", (t) => t.printVar(this, "pong"));
    }
    if (DEBUG_PONG_FRAMERATE) {
      // this.debugLifeLine = new DebugLifeLine(divId, width, 80, 0, 0.02, "Lifeline for timeDelta in drawCanvas()");
      // add framecounter and fps variables and html
      this.frameCounter = 0;
      this.initTime = performance.now();
      const el = document.createElement('p');
      el.style.margin = 0;
      el.appendChild(document.createTextNode('frame: '));
      this.frameLabel = document.createElement('span');
      el.appendChild(this.frameLabel);
      el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode('fps: '));
      this.fpsLabel = document.createElement('span');
      el.appendChild(this.fpsLabel);
      this.divEl.appendChild(el);
    }

    // start
    this.restartGame();
    this.canvasEl.focus(); // this.isFocused = true;
    this.startRunning(() => this.updateCanvas());
  }

  restartGame() {
    this.scoreCpu = 0;
    this.scoreHuman = 0;
    this.newRound();
  }

  newRound() {
    this.countDown = 3; // seconds;
    this.gameState = STATE_COUNTDOWN;
    // randomize ball speed
    let vx = 200 + Math.random() * 100;
    let vy = -20 + Math.random() * 20;
    if (Math.random() > 0.5) vx = - vx;
    if (Math.random() > 0.5) vy = - vy;
    // generate objects
    this.ball = new Ball(this.width / 2 - BALL_SIZE / 2, this.height / 2 - BALL_SIZE / 2,
      BALL_SIZE, BALL_SIZE, vx, vy);
    this.human = new Paddle(PADDLE_MARGIN, this.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH, PADDLE_HEIGHT);
    this.cpu = new Paddle(this.width - PADDLE_MARGIN - PADDLE_WIDTH, this.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH, PADDLE_HEIGHT);

    this.prevNow = performance.now();
  }

  createCanvas(divId, width = 0, height = 0, zoom = 1) {
    //get parent, remove children, add our canvas, set canvas properties
    this.divEl = document.getElementById(divId);
    while (this.divEl.firstChild) {
      this.divEl.removeChild(this.divEl.lastChild);
    }
    this.canvasEl = this.divEl.appendChild(document.createElement("canvas"));
    const c = this.canvasEl;
    c.title = "Playing: Ping pong";
    this.width = width;
    this.height = height;
    if (width > 0 && height > 0) {
      c.style.width = width * zoom + 'px';
      c.style.height = height * zoom + 'px';
      c.width = width;
      c.height = height;
    }
    // canvas input
    c.tabIndex = 0; // improtant for keyboard focus!
    this.canvasEl.addEventListener("keydown", (e) => this.onKeyDown(e));
    this.canvasEl.addEventListener("keyup", (e) => this.onKeyUp(e));
    this.canvasEl.addEventListener("blur", (e) => this.onBlur(e));
    this.canvasEl.addEventListener("focus", (e) => this.onFocus(e));
    // canvas output
    // c.style.imageRendering = 'pixelated';
    this.ctx = c.getContext("2d");
    this.ctx.textAlign = "center";
  }

  drawCanvas() {
    if (DEBUG_PONG_FRAMERATE) {
      if (this.frameLabel) this.frameLabel.innerHTML = this.frameCounter++;
      if (this.fpsLabel) {
        const now = performance.now();
        const diff = now - this.initTime;
        this.initTime = now;
        const seconds = diff / 1000;
        const fps = 1 / seconds;
        // this.debugLifeLine.insertValue(seconds);
        this.fpsLabel.innerHTML = Math.round((fps + Number.EPSILON) * 100) / 100;
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
    if (this.gameState == STATE_COUNTDOWN) {
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
    ctx.arc(this.ball.prevX + BALL_SIZE / 2, this.ball.prevY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.ball.x + BALL_SIZE / 2, this.ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2, true);
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
    const now = performance.now();
    const timeDelta = (now - this.prevNow) / 1000; //timeDelta = (milli - milli) / toSeconds
    this.prevNow = now;
    //#state switch
    if (this.gameState == STATE_COUNTDOWN) {
      this.human.move(timeDelta);
      this.human.borderTopAndBottom(this.height);

      this.cpu.move(timeDelta);
      this.cpu.borderTopAndBottom(this.height);

      this.countDown -= timeDelta;//PONG_UPDATE_INTERVAL;
      if (this.countDown < 0) {
        this.gameState = STATE_PLAYING;
      }
    } else if (this.gameState == STATE_PLAYING) {
      //cpu actions
      if (this.ball.y + this.ball.height / 2 < this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = -SPEED_CPU;
      } else if (this.ball.y > this.cpu.y + this.cpu.height / 2) {
        this.cpu.vy = SPEED_CPU;
      } else {
        this.cpu.vy = 0;
      }

      //move ball and paddles
      this.ball.move(timeDelta);
      this.ball.borderTopAndBottom(this.height);
      //Horizontal
      if (this.ball.x < 0) {
        this.win(0);
      } else if (this.ball.x > this.width - this.ball.width) {
        this.win(1);
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
    if (DEBUG_PONG_FRAMERATE) {
      this.initTime = performance.now();
    }
    this.animationRequestId = requestAnimationFrame(fn);
  }

  stopRunning() {
    if (this.animationRequestId != 0) {
      cancelAnimationFrame(this.animationRequestId);
      this.animationRequestId = 0;
    }
    this.running = false;
  }

  pausePlayGame() {
    if (this.gameState == STATE_ENDED) return;
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
    if (!this.running && PONG_AUTO_CONTINUE_ON_FOCUS) {
      this.pausePlayGame();
    } else {
      this.drawCanvas();
    }
  }
}

function startPingPong(divId, width = 480,  height = 320, zoom = 1) {
  return new PingPong(divId, width, height, zoom);
}
