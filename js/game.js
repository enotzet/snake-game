document.addEventListener('DOMContentLoaded', () => {
	let scoreCount = 0;
	let diff = 'Easy';
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	const scoreBlock = document.getElementById('score');
	const bestScoreBlock = document.getElementById('best-score');
	const diffBlock = document.getElementById('difficulty');
	const btnChange = document.getElementById('changeDif');
  
	const config = {
	  sizeCell: 24,
	  sizeFood: 24,
	  step: 0,
	  stepMax: 7,
	};
  
	const snake = {
	  x: config.sizeCell,
	  y: config.sizeCell,
	  dirX: 0,
	  dirY: 0,
	  body: [],
	  maxBodySize: 1,
	};
  
	const snakeSkins = ['./img/snake/head.svg'];
	const snakeImages = [new Image()];
  
	snakeImages[0].src = snakeSkins[0];

	const randomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	};
  
	const food = {
	  x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell,
	  y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell,
	};
  
	const images = [
	  './img/food/apple.svg',
	  './img/food/carrot.svg',
	  './img/food/eggplant.svg',
	  './img/food/banana.svg',
	];
  
	const img = new Image();
	img.src = images[0];
  
	const bomb = {
	  x: -config.sizeCell,
	  y: -config.sizeCell,
	};
  
	const bombImg = new Image();
	bombImg.src = './img/food/bomb.svg';
  
	const audio = [
	  './audio/eat.mp3',
	  './audio/turn.mp3',
	  './audio/dead.mp3',
	  './audio/hit.mp3',
	];

	const turnUp = () => {
		if (dir != 'down') {
		  audioPlay('turn');
		  dir = 'up';
		  snake.dirY = -config.sizeCell;
		  snake.dirX = 0;
		}
	  };
	
	  const turnLeft = () => {
		if (dir != 'right') {
		  audioPlay('turn');
		  dir = 'left';
		  snake.dirX = -config.sizeCell;
		  snake.dirY = 0;
		}
	  };
	
	  const turnDown = () => {
		if (dir != 'up') {
		  audioPlay('turn');
		  dir = 'down';
		  snake.dirY = config.sizeCell;
		  snake.dirX = 0;
		}
	  };
	
	  const turnRight = () => {
		if (dir != 'left') {
		  audioPlay('turn');
		  dir = 'right';
		  snake.dirX = config.sizeCell;
		  snake.dirY = 0;
		}
	  };
  
	const audioNames = [new Audio(), new Audio(), new Audio(), new Audio()];
  
	audioNames.forEach((audioName, index) => {
	  audioName.src = audio[index];
	});
  
	const initializeCanvas = () => {
	  canvas.width = window.innerWidth <= 650 ? 300 : 600;
	  canvas.height = window.innerWidth <= 650 ? 300 : 480;
	  ctx.fillStyle = '#000000';
	  ctx.fillRect(0, 0, canvas.width, canvas.height);
	  config.sizeCell = window.innerWidth <= 650 ? 15 : 24;
	  config.sizeFood = window.innerWidth <= 650 ? 15 : 24;
	  canvas.style.backgroundImage = window.innerWidth <= 650
		? 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSI3LjUiIGN5PSI3LjUiIHI9IjIuNSIgZmlsbD0iIzUxNDk0OSIvPgo8L3N2Zz4K");'
		: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjNTE0OTQ5Ii8+Cjwvc3ZnPgo=";';
	};
  
	const restart = () => {
	  config.stepMax = 6;
	  scoreCount = 0;
	  drawScore();
  
	  snake.x = config.sizeCell;
	  snake.y = config.sizeCell;
	  snake.body = [];
	  snake.maxBodySize = 1;
	  snake.dirX = 0;
	  snake.dirY = 0;
	  dir = '';
  
	  randomPosFood();
	  if (diff === 'Hard') randomPosBomb();
	};
  
	const drawScore = () => {
	  scoreBlock.innerHTML = scoreCount;
	};
  
	const bestScore = () => {
	  if (!localStorage.getItem('best score')) {
		localStorage.setItem('best score', 0);
	  }
	  if (scoreCount > localStorage.getItem('best score')) {
		localStorage.setItem('best score', scoreCount);
	  }
	  bestScoreBlock.innerHTML = localStorage.getItem('best score');
	};
  
	const gameLoop = () => {
	  requestAnimationFrame(gameLoop);
  
	  if (++config.step < config.stepMax) return;
	  config.step = 0;
  
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  drawFood();
	  drawSnake();
	  if (diff === 'Hard') {
		ctx.strokeStyle = '#f00';
		ctx.lineWidth = 5;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		drawBomb();
	  }
	};
  
	const checkBorder = () => {
	  if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	  } else if (snake.x >= canvas.width) {
		snake.x = 0;
	  }
	  if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	  } else if (snake.y >= canvas.height) {
		snake.y = 0;
	  }
	};
  
	const withoutBorder = () => {
	  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
		audioPlay('dead');
		restart();
	  }
	};
	
	const score = () => {
		scoreCount++;
		bestScore();
		if (scoreCount > 15) config.stepMax = 5;
		else if (scoreCount <= 15) config.stepMax = 6;
		drawScore();
	  };
  
	const drawSnake = () => {
	  snake.x += snake.dirX;
	  snake.y += snake.dirY;
  
	  if (diff === 'Easy') checkBorder();
	  if (diff === 'Hard') withoutBorder();

	  snake.body.unshift({ x: snake.x, y: snake.y });
	  if (snake.body.length > snake.maxBodySize) {
		snake.body.pop();
	  }
  
	  snake.body.forEach((e, index) => {
		snakeStyles(e, index);
  
		if (e.x === food.x && e.y === food.y) {
		  audioPlay('eat');
		  score();
		  randomPosFood();
		  snake.maxBodySize++;
  
		  if (diff === 'Hard') {
			randomPosBomb();
		  }
		}
  
		if (diff === 'Hard') {
		  if (e.x === bomb.x && e.y === bomb.y) {
			if (scoreCount >= 2) {
			  audioPlay('hit');
			  scoreCount = Math.ceil(scoreCount / 2);
			  snake.maxBodySize = scoreCount + 1;
			  for (let i = 0; i < snake.maxBodySize; i++) {
				snake.body.pop();
			  }
			  drawScore();
			  randomPosFood();
			  randomPosBomb();
			} else {
			  audioPlay('dead');
			  restart();
			}
		  }
		}
  
		for (let i = index + 1; i < snake.body.length; i++) {
		  if (e.x === snake.body[i].x && e.y === snake.body[i].y) {
			audioPlay('dead');
			restart();
		  }
		}
	  });
	};
  
	const snakeStyles = (e, index) => {
	  if (index === 0) {
		ctx.drawImage(snakeImages[0], e.x, e.y, config.sizeCell, config.sizeCell);
	  } else {
		ctx.fillStyle = '#093D14';
		ctx.strokeStyle = '#071510';
		ctx.lineWidth = 1;
		ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);
		ctx.strokeRect(e.x, e.y, config.sizeCell - 1, config.sizeCell - 1);
	  }
	};
  
	const drawFood = () => {
	  ctx.drawImage(img, food.x, food.y, config.sizeFood, config.sizeFood);
	};
  
	const drawBomb = () => {
	  ctx.drawImage(bombImg, bomb.x, bomb.y, config.sizeFood, config.sizeFood);
	};
  
	document.addEventListener('keydown', (e) => {
	  if (e.keyCode == 87 || e.keyCode == 38) {
		turnUp();
	  } else if (e.keyCode == 65 || e.keyCode == 37) {
		turnLeft();
	  } else if (e.keyCode == 83 || e.keyCode == 40) {
		turnDown();
	  } else if (e.keyCode == 68 || e.keyCode == 39) {
		turnRight();
	  }
	});
  
	btnChange.addEventListener('click', (e) => {
	  if (diff === 'Easy') {
		diff = 'Hard';
		diffBlock.innerHTML = 'Hard';
		restart();
	  } else {
		diff = 'Easy';
		diffBlock.innerHTML = 'Easy';
		restart();
	  }
	});
  
	const randomImg = () => {
	  let imgCount = randomInt(0, images.length);
	  let imgPath = images[imgCount];
	  img.src = imgPath;
	  return img;
	};
  
	const randomPosFood = () => {
	  ctx.drawImage(randomImg(), food.x, food.y, config.sizeFood, config.sizeFood);
	  food.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	  food.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
	  drawFood();
	};
  
	const randomPosBomb = () => {
	  let chance = randomInt(1, 5);
	  if (chance === 3) {
		bomb.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
		bomb.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
		drawBomb();
	  } else {
		bomb.x = -config.sizeCell;
		bomb.y = -config.sizeCell;
		drawBomb();
	  }
	};
  
	const audioPlay = (name) => {
	  switch (name) {
		case 'eat':
		  audioNames[0].play();
		  break;
		case 'turn':
		  audioNames[1].play();
		  break;
		case 'dead':
		  audioNames[2].play();
		  break;
		case 'hit':
		  audioNames[3].play();
		  break;
		default:
		  break;
	  }
	};
  
	window.addEventListener('load', (e) => {
	  initializeCanvas();
	  restart();
	  gameLoop();
	});
  
	window.addEventListener('resize', (e) => {
	  initializeCanvas();
	});
  
	document.addEventListener('load', bestScore());
  });
  
  