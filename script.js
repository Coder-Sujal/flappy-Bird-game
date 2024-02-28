let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight,
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.25;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
 
    birdImg = new Image();
    birdImg.src = "./flappy-bird/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./flappy-bird/toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./flappy-bird/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipe,1500);
    document.addEventListener("keydown",movebird);
}

function update(){
    if(gameOver){
        return;
    }
    if(bird.y > board.height){
        gameOver = true;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,boardWidth,boardHeight);
    
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY , 0);

    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    for(let i = 0;i<pipeArray.length;i++){
        pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipeWidth){
            pipe.passed = true
            score += 0.5;
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x + pipeWidth < 0){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver){
        context.fillText("GAME OVER",5,90);
    }
}

function placePipe(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - (Math.random()*(pipeHeight/2));
    let openingSpace = boardHeight/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function movebird(e){
    if(e.code == 'Space' || e.code == 'ArrowUp'){
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false; 
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}