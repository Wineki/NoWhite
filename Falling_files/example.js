
var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    //按钮面板
    thrusterCanvas = document.querySelector('#thrusterCanvas'),
    thrusterContext = thrusterCanvas.getContext('2d'),

    RIGHT = 1,
    LEFT = 2,
    ARROW_MARGIN = 10,//箭头的空白
    BALL_RADIUS   = 23,//球的半径
    LEDGE_LEFT   = 280,//放球架子的位置
    LEDGE_TOP    = 55,
    LEDGE_WIDTH  = 50,
    LEDGE_HEIGHT = 12,

    GRAVITY_FORCE = 9.81,  // 9.81 m/s / s

    lastTime = 0,
    fps = 60,
    arrow = LEFT,

    //平台高设置为10米
    PLATFORM_HEIGHT_IN_METERS = 10, // 10 meters
    //每米的像素数
    pixelsPerMeter = (canvas.height - LEDGE_TOP) /PLATFORM_HEIGHT_IN_METERS,

    moveBall = {
      lastFrameTime: undefined,
      
      execute: function (sprite, context, time) {
         var now = +new Date();
         if (this.lastFrameTime == undefined) {
            this.lastFrameTime = now;
            return;
         }

         if (pushAnimationTimer.isRunning()) {
            if (arrow === LEFT) sprite.left -= sprite.velocityX / fps;
            else                sprite.left += sprite.velocityX / fps;

            if (isBallOnLedge()) {
               if (pushAnimationTimer.getElapsedTime() > 200) {
                  pushAnimationTimer.stop();
               }
            }
            else if ( ! fallingAnimationTimer.isRunning()) {
               startFalling();
               this.lastFrameTime = now;
            }
         }

         if (fallingAnimationTimer.isRunning()) {
            sprite.top += sprite.velocityY / fps;
            sprite.velocityY = GRAVITY_FORCE *
               (fallingAnimationTimer.getElapsedTime()/1000) * pixelsPerMeter;

            if (sprite.top > canvas.height) {
               stopFalling();
            }
         }
      }
    },
   
    pushAnimationTimer    = new AnimationTimer(),
    fallingAnimationTimer = new AnimationTimer(),

    ball = new Sprite('ball',
       {
          paint: function (sprite, context) {
             context.save();
             context.beginPath();
             context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
                           BALL_RADIUS, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgba(0,0,255,0.7)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;

             context.lineWidth = 2;
             context.strokeStyle = 'rgba(100,100,195,0.8)';
             context.stroke();

             context.beginPath();
             context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
                           BALL_RADIUS/2, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgba(255,255,0,1.0)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;
             context.stroke();

             context.restore();
          }
       },

       [ moveBall ]
    ),

    ledge = new Sprite('ledge',
       {
          paint: function (sprite, context) {
             context.save();
             context.shadowColor = 'rgba(0,0,0,0.5)';
             context.shadowBlur = 8;
             context.shadowOffsetX = 2;
             context.shadowOffsetY = 2;

             context.fillStyle = 'rgba(255,255,0,0.6)';
             context.strokeStyle = 'rgba(0,0,0,0.6)';
             context.beginPath();
             context.rect(sprite.left,sprite.top,sprite.width,sprite.height);
             context.fill();
             context.stroke();
             context.restore();
          }
       }
    );

// Behavior functions............................................

function pushBallLeft() {
   if (pushAnimationTimer.isRunning()) {
      pushAnimationTimer.stop();
   }
   arrow = LEFT;
   pushAnimationTimer.start();
}

function pushBallRight() {
   if (pushAnimationTimer.isRunning()) {
      pushAnimationTimer.stop();
   }
   arrow = RIGHT;
   pushAnimationTimer.start();
}

function startFalling() {
   fallingAnimationTimer.start();
   ball.velocityY = 0;
}

function stopFalling() {
   fallingAnimationTimer.stop();
   pushAnimationTimer.stop();

   ball.left = LEDGE_LEFT + LEDGE_WIDTH/2 - BALL_RADIUS;
   ball.top = LEDGE_TOP - BALL_RADIUS*2;

   ball.velocityY = 0;
}

function isBallOnLedge() {
   return ball.left + BALL_RADIUS > LEDGE_LEFT &&
          ball.left < LEDGE_LEFT + LEDGE_WIDTH;
}

// Paint functions...............................................

function paintThruster() {
   thrusterContext.clearRect(0,0,
                              thrusterCanvas.width,thrusterCanvas.height);
   if (pushAnimationTimer.isRunning())
      thrusterContext.fillStyle = 'rgba(255,255,0,0.5)';
   else
     thrusterContext.fillStyle = 'rgba(100,140,255,0.5)';

   paintArrow(thrusterContext);
}

function paintLeftArrow(context) {
   paintArrow(context);
}
   
function paintArrow(context) {
   context.save();
   context.beginPath();

   context.moveTo( thrusterCanvas.width - ARROW_MARGIN/2,
                   ARROW_MARGIN/2);

   context.lineTo( thrusterCanvas.width - ARROW_MARGIN/2,
                   thrusterCanvas.height - ARROW_MARGIN);

   context.quadraticCurveTo(thrusterCanvas.width - ARROW_MARGIN/2,
                            thrusterCanvas.height - ARROW_MARGIN/2,
                            thrusterCanvas.width - ARROW_MARGIN,
                            thrusterCanvas.height - ARROW_MARGIN/2);

   context.lineTo( ARROW_MARGIN/2,
                   thrusterCanvas.height/2 + ARROW_MARGIN/2);

   context.quadraticCurveTo(ARROW_MARGIN/2 - 6,
                            thrusterCanvas.height/2,
                            ARROW_MARGIN, thrusterCanvas.height/2 - ARROW_MARGIN/2);

   context.lineTo( thrusterCanvas.width - ARROW_MARGIN,
                   ARROW_MARGIN/2);

   context.quadraticCurveTo(thrusterCanvas.width - ARROW_MARGIN,
                            ARROW_MARGIN/2, thrusterCanvas.width - ARROW_MARGIN/2,
                            ARROW_MARGIN/2);
   context.fill();

   context.shadowColor = 'rgba(0,0,0,1.0)';
   context.shadowBlur = 8;
   context.shadowOffsetX = 4;
   context.shadowOffsetY = 4;

   context.stroke();
   context.restore();
}

// Animation functions...........................................

function calculateFps(time) {
   var fps = 1000 / (time - lastTime);
   lastTime = time;
   return fps; 
}

function animate(time) {
   fps = calculateFps(time);

   context.clearRect(0,0,canvas.width,canvas.height);
   drawGrid('lightgray', 10, 10);
   
   ball.update(context, time);
   ledge.update(context, time);

   ledge.paint(context);
   ball.paint(context);

   paintThruster();

   window.requestNextAnimationFrame(animate);
}

// 事件处理................

thrusterCanvas.onmousedown = function canvasMouseDown(e) {
   var rect = thrusterCanvas.getBoundingClientRect(),
   x = e.x || e.clientX,
   y = e.y || e.clientY;

   e.preventDefault();
   e.stopPropagation();

   pushBallLeft();
};

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.beginPath();
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
     context.stroke();
   }

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
   }

   context.restore();
}


// Initialization................................................

thrusterContext.strokeStyle = 'rgba(100,140,230,0.6)';
thrusterContext.shadowColor = 'rgba(0,0,0,0.3)';
thrusterContext.shadowBlur = 6;
thrusterContext.shadowX = 4;
thrusterContext.shadowY = 4;

ball.left = LEDGE_LEFT + LEDGE_WIDTH/2 - BALL_RADIUS;
ball.top = LEDGE_TOP - BALL_RADIUS*2;
ball.width = BALL_RADIUS*2;
ball.height = BALL_RADIUS*2;

ball.velocityX = 110;
ball.velocityY = 0;

ledge.left = LEDGE_LEFT;
ledge.top = LEDGE_TOP;
ledge.width = LEDGE_WIDTH;

window.requestNextAnimationFrame(animate);