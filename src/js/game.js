/* Author: Ward Truyen
* Version: 1.0.0
* About:   gameSample: Ping pong
*/

{// this code block hides the variables below from other scripts.
  // #Data
  const AUTO_CONTINUE_ON_FOCUS = false;
  const SCREEN_WIDTH = 640;
  const SCREEN_HEIGHT = 480;
  const UPDATE_INTERVAL = 20;
  let intID = 0;
  let isFocused = false;
  let running = false;
  let canvas = null;
  let ctx = null;

  const STATE_COUNTDOWN = 0;
  const STATE_PLAYING = 1;
  const STATE_ENDED = 2;
  let gameState = STATE_COUNTDOWN

  const BALL_SIZE = 8;
  const SPEED_HUMAN = 3;
  const SPEED_CPU = 3.5;

  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 60;
  const PADDLE_MARGIN = 10;
  let ball = null;
  let human = null;
  let cpu = null;
  let scoreCpu = 0;
  let scoreHuman = 0;
  let countDown = 0;

  // #Fun
  window.addEventListener("load", function () {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    canvas.tabIndex = 0;
    canvas.title = "Playing: Ping pong";

    // #classes
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

      checkWalls() {
        //Vertical
        if (this.y < 0) {
          this.y = 0;
          this.vy = -this.vy;
        } else if (this.y > canvas.height - this.height) {
          this.y = canvas.height - this.height;
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

      checkWalls() {
        //Vertical
        if (this.y < 0) {
          this.y = 0;
          this.vy = 0;
        } else if (this.y > canvas.height - this.height) {
          this.y = canvas.height - this.height;
          this.vy = 0;
        }
      }
    }

    //funcion hiding
    function win(winner) {
      clearInterval(intID);
      intID = 0;
      running = false;
      gameState = STATE_ENDED;
      if (winner == 0) {
        scoreCpu++;
        if(typeof terminalPrintLn === "function") terminalPrintLn("CPU scored?!");
      } else {
        scoreHuman++;
        if(typeof terminalPrintLn === "function") terminalPrintLn("Human scored!");
      }
      if(typeof terminalPrintLn === "function") terminalPrintLn("Scores: Human " + scoreHuman + " - " + scoreCpu + " CPU");
    }

    function updateGame() {
      //#state switch
      if(gameState == STATE_COUNTDOWN){
        countDown -= UPDATE_INTERVAL;
        if(countDown < 0){
          gameState = STATE_PLAYING;
        }
      }else if(gameState == STATE_PLAYING){
        //cpu
        if (ball.y + ball.height/2 < cpu.y + cpu.height/2) {
          cpu.vy = -SPEED_CPU;
        } else if (ball.y > cpu.y + cpu.height/2) {
          cpu.vy = SPEED_CPU;
        } else {
          cpu.vy = 0;
        }

        //move
        ball.move();
        ball.checkWalls();
        //Horizontal
        if (ball.x < 0) {
          win(0);
        } else if (ball.x > canvas.width - ball.width) {
          win(1);
        }

        human.move();
        human.checkWalls();

        cpu.move();
        cpu.checkWalls();

        // collide ball vs paddles
        if (human.x + human.width < ball.prevX && human.x + human.width > ball.x) {
          //console.log("pass 1.1");
          if (human.y < ball.y + ball.height && human.y + human.height > ball.y) {
            //console.log("pass 1.2");
            ball.vx = -ball.vx;
            ball.x = human.x + human.width;
            ball.vy += ((ball.height / 2 + ball.y) - (human.height / 2 + human.y)) / 6;
          }
        }

        if (cpu.x < ball.x + ball.width && cpu.x > ball.prevX + ball.width) {
          //console.log("pass 2.1");
          if (cpu.y < ball.y + ball.height && cpu.y + cpu.height > ball.y) {
            //console.log("pass 2.2");
            ball.vx = -ball.vx;
            ball.x = cpu.x - ball.width;
            let temp = ((ball.height / 2 + ball.y) - (cpu.height / 2 + cpu.y)) / 6;
            ball.vy += temp;
          }
        }
      }
      drawGame();
    }

    function drawGame(){
      //# draw screen
      //# clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //# print score
      const FONT_SIZE = 30;
      ctx.font = FONT_SIZE + "px serif";
      ctx.fillStyle = 'red';
      ctx.fillText(scoreHuman + " - " + scoreCpu, SCREEN_WIDTH / 2, FONT_SIZE * 2);
      //# print count down
      if(gameState == STATE_COUNTDOWN){
        ctx.font = 2*FONT_SIZE + "px serif";
        ctx.fillText(Math.ceil(countDown / 1000), SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      }
      //# draw ball
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE/2, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      //# draw players
      ctx.fillStyle = 'green';
      ctx.fillRect(human.x, human.y, human.width, human.height);
      ctx.strokeRect(human.x, human.y, human.width, human.height);
      ctx.fillStyle = 'blue';
      ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
      ctx.strokeRect(cpu.x, cpu.y, cpu.width, cpu.height);

      if(!running){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = (gameState === STATE_ENDED) ? 'red' : 'gray';
        ctx.font = 4*FONT_SIZE + "px serif";
        const x = SCREEN_WIDTH / 2;
        const y = SCREEN_HEIGHT / 2;
        let text = (gameState === STATE_ENDED) ? "Score!" : "Paused";
        ctx.fillText(text, x, y - 2*FONT_SIZE);
        ctx.strokeText(text, x, y - 2*FONT_SIZE);
        ctx.fillStyle = isFocused ? 'green' : 'gray';
        ctx.font = FONT_SIZE + "px serif";
        text = (running || isFocused) ? `Press space or enter to ${(gameState === STATE_ENDED) ? "start next round" : "continue"}.` : "Click here to continue. (unfocused)";
        ctx.strokeText(text, x, y + FONT_SIZE);
        ctx.fillText(text, x, y + FONT_SIZE);
      }
    }

    function newGame(){
      clearInterval(intID);

      // set countdown
      countDown = 3000; // miliseconds;
      gameState = STATE_COUNTDOWN;

      // randomize ball speed
      let vx = 3 + Math.random() * 2;
      let vy = -0.1 ;// + Math.random() * 2;
      if (Math.random() > 0.5) {
        vx = - vx;
      }
      if (Math.random() > 0.5) {
        vy = - vy;
      }

      // generate objects
      ball = new Ball(canvas.width / 2 - BALL_SIZE / 2, canvas.height / 2 - BALL_SIZE / 2,
        BALL_SIZE, BALL_SIZE, vx, vy);
      human = new Paddle(PADDLE_MARGIN, canvas.height / 2 - PADDLE_HEIGHT / 2,
        PADDLE_WIDTH, PADDLE_HEIGHT);
      cpu = new Paddle(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, canvas.height / 2 - PADDLE_HEIGHT / 2,
        PADDLE_WIDTH, PADDLE_HEIGHT);

      // start updating
      intID = setInterval(updateGame, UPDATE_INTERVAL);
      running = true;
    }

    function pausePlayGame() {
      if (gameState == STATE_ENDED) return;
      running = !running;
      if(running){
        intID = setInterval(updateGame, UPDATE_INTERVAL);
      } else {
        clearInterval(intID);
        intID = 0;
        drawGame();
      }
    }

    function restartGame(){
      terminalClose();
      scoreCpu = 0;
      scoreHuman = 0;
      newGame();
      canvas.focus();
    }
    if(typeof terminalAddCommand === "function") terminalAddCommand("restartgame", restartGame);

    const KEY_ARROW_UP = 'ArrowUp';
    const KEY_ARROW_DOWN = 'ArrowDown';
    const KEY_W = 'w';
    const KEY_S = 's';
    const KEY_ENTER = 'Enter';
    const KEY_SPACEBAR = ' ';

    canvas.addEventListener("keydown", function (e) {
      //terminalPrintLn("keydown key = '" + e.key + "'");
      if (e.key== KEY_ARROW_UP || e.key== KEY_W ) {
        human.vy = -SPEED_HUMAN;
      } else if (e.key== KEY_ARROW_DOWN || e.key== KEY_S ) {
        human.vy = SPEED_HUMAN;
      } else if( e.key== KEY_ENTER || e.key== KEY_SPACEBAR ) {
        //# next round/pause/play
        if(gameState == STATE_ENDED){
          newGame();
        } else {
          pausePlayGame();
        }
      }
      // e.stopPropagation();
      // e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    });

    canvas.addEventListener("keyup", function (e) {
      if (e.key== KEY_ARROW_UP || e.key== KEY_W ) {
        human.vy = 0;
      } else if (e.key== KEY_ARROW_DOWN || e.key== KEY_S ) {
        human.vy = 0;
      }
      // e.stopImmediatePropagation();
      // e.stopPropagation();
      e.preventDefault();
      return false;
    });

    canvas.addEventListener("blur", function (){
      //terminalPrintLn("blur");
      isFocused = false;
      if(running)
      pausePlayGame();
      else
      drawGame();
    });

    canvas.addEventListener("focus", function(){
      //terminalPrintLn("focus");
      isFocused = true;
      if(!running && AUTO_CONTINUE_ON_FOCUS)
      pausePlayGame();
      else
      drawGame();
    });

    ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    newGame();
    canvas.focus();
  } );
}
