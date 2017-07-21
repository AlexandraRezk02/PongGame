//canvas variables
var canvas;
var canvasContext;
//ball variables
var ballX= 50;
var ballSpeedX = 10;
var ballY = 10;
var ballSpeedY = 4;
//paddle variables
var paddle1Y = 250;
var paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;
//Player Scores
var player1Score = 0;
var player2Score = 0;
//Winning score
const winningScore = 3;
//Win Screen
var showingWinScreen = false;

//calculating mouse position function
function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

//mouse function to start game again
function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function () {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
	
	canvas.addEventListener("mousedown", handleMouseClick);
	
	//mouse paddle function
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y-(paddleHeight/2);
	});
}

function ballReset(){
	if(player1Score >= winningScore || player2Score >= winningScore){
		showingWinScreen = true;
	}
	
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

//makes computer paddle move
	function computerMovement(){
		var paddle2YCenter = paddle2Y + (paddleHeight/2);
		if(paddle2YCenter < ballY-35) {
			paddle2Y += 6;
		} else if(paddle2YCenter > ballY+35){
			paddle2Y -= 6;
		}
	}

//The way the ball moves around on the screen
function moveEverything() {
	if (showingWinScreen) {
		return;
	}
	computerMovement();
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	//This is all the ball control and how it hits the paddle
	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y + paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else{
			player2Score++; //must be before ballReset()
			ballReset();
			
			}
	}
	if(ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y + paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else{
			player1Score++; //must be before ballReset()
			ballReset();
			
			}
	}
	if(ballY < 0){
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height){
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet(){
	for(var i=0; i < canvas.height; i += 40){
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}

function drawEverything(){
	//fills the background of the canvas black
	colorRect(0,0,canvas.width,canvas.height,'black');
	
	//SHow the win screen
	if (showingWinScreen) {
		canvasContext.fillStyle = "white";
		if(player1Score >= winningScore){
			canvasContext.fillText("Left Player Won!", 350, 200);
		} else if(player2Score >= winningScore){
			canvasContext.fillText("Right Player Won!", 350, 200);
		}
		canvasContext.fillText("Click to Continue", 350, 500);
		return;
	}
	
	drawNet();
	//draws the left Player1 paddle
	colorRect(0,paddle1Y,paddleThickness,paddleHeight,'white');
	
	//draws the right Player2 paddle
	colorRect(canvas.width-paddleThickness,paddle2Y,paddleThickness,paddleHeight,'white');
	
	//draws the ball
	colorCircle(ballX,ballY,10,'white');
	
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

//Created function instead of having to repeat fillStyle and fill Rect functions
function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width, height);
}

//Created function for drawing a circle
function colorCircle(centerX,centerY,radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2, true);
	canvasContext.fill();
}