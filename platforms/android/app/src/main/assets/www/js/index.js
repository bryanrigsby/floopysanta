

var canvasToHide = document.getElementById("myCanvas");
var splashScreen = document.getElementById("attachSplash");
var endScreen = document.getElementById("playAgain");
var gameButton = document.getElementById("gameButton");

function hideCanvas(){
    canvasToHide.style.display = "none";
}

function showCanvas(){
    // gameButton.style.display = "initial";
    canvasToHide.style.display = "initial";
    endScreen.style.display = "none";
}

function hideSplash(){
    console.log("here");
    splashScreen.style.display = "none";
}

function hideLose(){
    endScreen.style.display = "none";
}

function showLose(){
    endScreen.style.display = "initial";
    // gameButton.style.display = "none";
    hideSplash();
    hideCanvas();
}



// function showGameButton(){
//     gameButton.style.display = "initial";
// }

var myGamePiece;
var myObstacles = [];
var myScore;






window.addEventListener('load', hideLose(), hideCanvas());


function startGame() {
    myGamePiece = new component(80, 30, 'img/santa_sleigh-crop.png', 10, 0, 'image');
    myGamePiece.gravity = 0.05;
    myScore = new component("20px", "Monospace", "black", 120, 20, "text");
    myGameArea.start();
}


var myGameArea = {
    canvas : document.getElementById("myCanvas"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;   
    this.speedX = 0;
    this.speedY = 0; 
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }


    
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            showLose();
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    if (myGameArea.frameNo == 1 || everyinterval(225)) {
        minHeight = 0;
        maxHeight = 140;
        x = myGameArea.canvas.width;
        y = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        //minGap = 25;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(70, 10, 'img/airplane.png', x, y, 'image'));
        //myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}


