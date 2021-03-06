var canvas = document.getElementById("mycanv");
		var ctx = canvas.getContext("2d");
		var width = 1900;
		var height = 320;
		var gameOver = false;

		var jumpSound = new Audio("assets/smb_jump-small.wav");
		var gameOverSound = new Audio("assets/smb_mariodie.wav");
		var checkpointSound = new Audio("assets/smb_pipe.wav");

		function playJumpSound(){
			jumpSound.play();
		}

		function playGameOverSound(){
			gameOverSound.play();
		}

		function playChechpointSound(){
			checkpointSound.play();
		}

		function drawObject(object){
			var currentImageIndex = counter%object.images.length;
			var currentImage = object.images[currentImageIndex];
			ctx.drawImage(currentImage, object.x - (object.width/2), object.y - (object.height/2), object.width, object.height);

			if (object.repeat === 1){
				ctx.drawImage(currentImage, object.width + object.x - (object.width/2), object.y - (object.height/2), object.width, object.height);
				ctx.drawImage(currentImage, object.width*2 + object.x - (object.width/2), object.y - (object.height/2), object.width, object.height);
			}
		}

		var dinoImages = [];
		var dinoImagesURL = [	"assets/1.png",
								"assets/2.png",
								"assets/3.png"];
								// "assets/4.png",
								// "assets/5.png" ];


		for (var i=0; i<dinoImagesURL.length; i++){
			var dinoImage = new Image();
			dinoImage.src = dinoImagesURL[i]
			dinoImages.push(dinoImage);
		}

		var dino = {};
		dino.images = dinoImages;
		dino.width = 50;
		dino.height = 50;
		dino.x = 100;
		dino.y = 20;
		dino.speedY = 0;
		dino.speedX = 0;

		var gravity = 3.5;

		dino.move = function(){
			this.speedY = this.speedY + gravity;
			this.y += this.speedY;
			if (this.y > 280){
				this.y = 280;
				this.speedY = 0;
			}
		}

		var clouds = [];
		var cloudImage = new Image();
		cloudImage.src = "assets/cloud.png";

		function getCloud(){
			var cloud = {};
			cloud.images = [cloudImage];
			cloud.width = 60;
			cloud.height = 25;
			cloud.x = width;
			cloud.y = 30 + Math.random()*75;
			cloud.isActive = true;
			cloud.speedX = -4 - (Math.random()*4);
			cloud.speedY = 0;

			cloud.move = function(){
				this.x = this.x + this.speedX;
				if (this.x < -100){
					this.isActive = false;
				}
			}
			return cloud;
		}

		var obstacles = [];
		var obstacleImage = new Image();
		obstacleImage.src = "assets/obstacle.png";

		var score = 0;
		function getobstacle(){
			var obstacle = {};
			obstacle.images = [obstacleImage];
			obstacle.width = 30;
			obstacle.height = 60;
			obstacle.x = width;
			obstacle.y = height - obstacle.height/2 - 10;
			obstacle.isActive = true;
			obstacle.speedX = -15;
			obstacle.speedY = 0;

			obstacle.move = function(){
				this.x = this.x + this.speedX;
				if (this.x == dino.x && dino.y >= 220){
					console.log("Game Over");
					ctx.font = "80px 'Press Start 2P'";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillStyle = "#ff634d"; //"White";
					ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);
					gameOver = true;
					playGameOverSound();
				}
				if (this.x < -100){
					this.isActive = false;
				}
			}
			return obstacle;
		}

		var landImage = new Image();
		landImage.src = "assets/land.png";
		var land = {};
		land.width = 1200;
		land.height = 12;
		land.images = [landImage];
		land.x = land.width/2;
		land.y = height - 13;
		land.speedX = -15;
		land.speedY = 0;
		land.repeat = 1;

		land.move = function(){
			this.x = this.x + this.speedX;
			if (this.x < -this.width/2){
				this.x += this.width;
			}
		}


		var counter = 0;
		var checkpoint = 0;
		function update(){
			if (!gameOver){
				counter++;
				score++;
				checkpoint++;
				if (checkpoint/2 == 100){
					playChechpointSound();
					checkpoint = 0;
				}
				ctx.fillStyle = "#121212";
				ctx.fillRect(0, 0, width, height);

				if (counter%40 == 0){
					var cloud = getCloud();
					clouds.push(cloud);
				}

				num = Math.floor(Math.random()*21) + 50;
				console.log(num);
				if(counter%num == 0){
					var obstacle = getobstacle();
					obstacles.push(obstacle);
				}

				ctx.font = "12px 'Press Start 2P'"
				ctx.fillStyle = "#acacac"
				ctx.fillText("Score: " + parseInt(score/2), width-180, 50)

				dino.move();
				drawObject(dino);

				var cloudsFinal = [];
				for (var i=0; i<clouds.length; i++){
					var cloud = clouds[i];
					cloud.move();
					drawObject(cloud);

					if (cloud.isActive == true){
						cloudsFinal.push(cloud);
					}
				}

				clouds = cloudsFinal;

				var obstaclesFinal = [];
				for (var i=0; i<obstacles.length; i++){
					var obstacle = obstacles[i];
					obstacle.move();
					drawObject(obstacle);

					if (obstacle.isActive == true){
						obstaclesFinal.push(obstacle);
					}
				}
				obstacles = obstaclesFinal;

				land.move();
				drawObject(land);
			}
		}

		document.addEventListener("keydown", function(event) {
			if (event.keyCode == 32 || event.keyCode == 38) {
				// console.log(event.keyCode);
				console.log("Jump")
				if (dino.y >= 200){
					playJumpSound();
					dino.speedY = -25;
				}
			}

		});
		document.addEventListener("touchstart", function(event) {
				console.log("Jump")
				if (dino.y >= 200){
					playJumpSound();
					dino.speedY = -25;
				}

		}, false);

		callUpdate();

		function callUpdate(){
			setInterval(update, 50)
		}
