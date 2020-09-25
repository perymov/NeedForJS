window.addEventListener('load', function () {

	const maxEnemy = 7,
		heightElement = 100,
		maxTree = 5;

	const score = document.querySelector('.score'),
		start = document.querySelector('.start'),
		btns = document.querySelector('.btns'),
		gameArea = document.querySelector('.gameArea'),
		car = document.createElement('div'),
		topScore = document.querySelector('#topScore'),
		audio = document.createElement('audio'),
		crash = document.createElement('audio'),
		trees = document.querySelector('.trees'),
		rightTrees = document.querySelector('.right_trees');

	audio.src = 'sounds/audio.mp3';
	crash.src = 'sounds/crash.mp3';
	car.classList.add('car');

	const countSection = Math.floor(document.documentElement.clientHeight / heightElement);

	gameArea.style.height = countSection * heightElement;

	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	};

	const setting = {
		start: false,
		score: 0,
		speed: 0,
		traffic: 0,
		level: 0,
	};

	let level = setting.level;

	const getLocalStorage = () => parseInt(localStorage.getItem('nfjs_score', setting.score));
	topScore.textContent = getLocalStorage() ? 'РЕКОРД:' + ' ' + getLocalStorage() : 0;

	const addLocalStorage = () => {
		const record = getLocalStorage();
		if (!record || record < setting.score) {
			localStorage.setItem('nfjs_score', setting.score);
			topScore.textContent = `НОВЫЙ РЕКОРД: ${setting.score}`;
		}
	};

	function getQuantityElements(heightElement) {
		return (gameArea.offsetHeight / heightElement) + 1;
	}

	function startGame(event) {
		const target = event.target;
		if (target === start || target === btns) { return; }
		switch (target.id) {
			case 'easy':
				setting.speed = 5;
				setting.traffic = 4;
				break;
			case 'medium':
				setting.speed = 6;
				setting.traffic = 3;
				break;
			case 'hard':
				setting.speed = 7;
				setting.traffic = 2;
				break;
		}

		audio.play();
		start.classList.add('hide');
		gameArea.innerHTML = '';
		rightTrees.innerHTML = '';
		trees.innerHTML = '';

		for (let i = 0; i < getQuantityElements(heightElement); i++) {
			const line = document.createElement('div');
			line.classList.add('line');
			line.style.height = heightElement / 2 + 'px';
			line.style.top = `${i * heightElement} px`;
			line.y = i * heightElement;
			gameArea.append(line);
		}

		for (let i = 0; i < getQuantityElements(heightElement * 2); i++) {
			const tree = document.createElement('div');
			const randomTree = Math.floor(Math.random() * maxTree) + 1;
			tree.classList.add('tree');
			trees.append(tree);
			tree.y = -heightElement * 2 * (i + 1);
			tree.style.left = (rightTrees.offsetWidth - tree.offsetWidth) / 2 + 'px';
			tree.style.top = tree.y + 'px';
			tree.style.background = `transparent url(image/tree${randomTree}.png) center / cover no-repeat`;
		}
		for (let i = 0; i < getQuantityElements(heightElement * 2); i++) {
			const treeRight = document.createElement('div');
			const randomTree = Math.floor(Math.random() * maxTree) + 1;
			treeRight.classList.add('tree');
			rightTrees.append(treeRight);
			treeRight.y = -heightElement * 2 * (i + 1);
			treeRight.style.left = (rightTrees.offsetWidth - treeRight.offsetWidth) / 2 + 'px';
			treeRight.style.top = treeRight.y + 'px';
			treeRight.style.background = `transparent  url(image/tree${randomTree}.png) center / cover no-repeat`;
		}

		for (let i = 0; i < getQuantityElements(heightElement * setting.traffic); i++) {
			const enemy = document.createElement('div');
			const randomEnemy = Math.floor(Math.random() * maxEnemy) + 1;
			enemy.classList.add('enemy');
			gameArea.append(enemy);
			enemy.y = -heightElement * setting.traffic * (i + 1);
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
			enemy.style.top = enemy.y + 'px';
			enemy.style.background = `url(image/enemy${randomEnemy}.png) center / cover no-repeat`;
		}

		setting.score = 0;
		gameArea.append(car);
		setting.start = true;
		car.style.left = (gameArea.offsetWidth - car.offsetWidth) / 2 + 'px';
		car.style.bottom = `50px`;
		car.style.top = `auto`;
		setting.x = car.offsetLeft;
		setting.y = car.offsetTop;
		requestAnimationFrame(playGame);
	}

	function playGame() {

		setting.level = Math.floor(setting.score / 1000);
		if (setting.level !== level) {
			level = setting.level;
			if (setting.speed < 5) {
				setting.speed += 1;
			} else {
				setting.speed += 0.5;
			}
		}

		if (setting.start) {
			setting.score += Math.floor(setting.speed / 2);
			score.innerHTML = 'SCORE: ' + setting.score;
			moveRoad();
			moveEnemy();
			moveTrees();

			if (window.matchMedia("(any-pointer: coarse)").matches) {
				gameArea.addEventListener('click', touchControl, { once: true });
			} else {
				if (keys.ArrowLeft && setting.x > 0) {
					setting.x -= (setting.speed - 2);
					if (keys.ArrowLeft && setting.x < 0) {
						setting.x = 0;
					}
				}
				if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
					setting.x += (setting.speed - 2);
					if (keys.ArrowRight && setting.x > (gameArea.offsetWidth - car.offsetWidth)) {
						setting.x = (gameArea.offsetWidth - car.offsetWidth);
					}
				}
				if (keys.ArrowUp && setting.y > 0) {
					setting.y -= (setting.speed - 2);
				}
				if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
					setting.y += (setting.speed - 2);
				}
				car.style.left = setting.x + 'px';
				car.style.top = setting.y + 'px';
			}
			requestAnimationFrame(playGame);
		}
	}

	function startRun(event) {
		if (keys.hasOwnProperty(event.key)) {
			event.preventDefault();
			keys[event.key] = true;
		}
	}

	function stopRun(event) {
		if (keys.hasOwnProperty(event.key)) {
			event.preventDefault();
			keys[event.key] = false;
		}
	}

	function moveRoad() {
		let lines = document.querySelectorAll('.line');
		lines.forEach(function (line) {
			line.y += setting.speed;
			line.style.top = line.y + 'px';

			if (line.y >= gameArea.offsetHeight) {
				line.y = -heightElement;
			}
		});
	}

	function moveEnemy() {
		let enemys = document.querySelectorAll('.enemy');
		enemys.forEach(function (item) {

			let carRect = car.getBoundingClientRect();
			let enemyRect = item.getBoundingClientRect();

			if (carRect.top <= enemyRect.bottom + 3 &&
				carRect.bottom >= enemyRect.top + 3 &&
				carRect.left <= enemyRect.right + 3 &&
				carRect.right >= enemyRect.left + 3) {
				setting.start = false;
				audio.pause();
				audio.currentTime = 0;
				crash.play();
				start.classList.remove('hide');
				start.style.top = score.offsetHeight;
				addLocalStorage();
			}

			item.y += setting.speed / 2;
			item.style.top = item.y + 'px';
			if (item.y >= gameArea.offsetHeight) {
				item.y = -heightElement * setting.traffic;
				item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
				item.style.background = `url(image/enemy${Math.floor(Math.random() * maxEnemy) + 1}.png) center / cover no-repeat`;
			}
		});
	}
	function moveTrees() {
		let trees = document.querySelectorAll('.tree');
		trees.forEach(function (item) {
			item.y += setting.speed;
			item.style.top = item.y + 'px';

			if (item.y >= gameArea.offsetHeight) {
				item.y = -heightElement * 2;
				item.style.background = `transparent url(image/tree${Math.floor(Math.random() * maxTree) + 1}.png) center / cover no-repeat`;
			}

		});
	}

	let touchControl = function (event) {
		let gameAreaCoords = this.getBoundingClientRect();
		car.style.transition = 'all 0.3s';
		let carCoord = {
			left: event.clientX - gameAreaCoords.left - gameArea.clientLeft - car.clientWidth / 2
		};
		if (carCoord.left + car.clientWidth > gameArea.clientWidth) {
			carCoord.left = gameArea.clientWidth - car.clientWidth;
		}
		if (carCoord.left < 0) {
			carCoord.left = 0;
		}
		car.style.left = carCoord.left + 'px';
	};

	// function isTouchDevice() {
	// 	return true == ("ontouchstart" in window || window.DocumentTouch);
	// }

	start.addEventListener('click', startGame);
	document.addEventListener('keydown', startRun);
	document.addEventListener('keyup', stopRun);
});


