var mainState = {
	preload: function() {
		game.load.image('witch', 'assets/images/witchy.png');
		game.load.image('pipe', 'assets/images/pipe.png');
		game.load.image('forest-back', 'assets/images/forest-back.png');
		game.load.image('forest-mid', 'assets/images/forest-mid.png');
		game.load.image('forest-front', 'assets/images/forest-front.png');
		game.load.image('forest-lights', 'assets/images/forest-lights.png');
		game.load.audio('jump', 'assets/sounds/jump.wav');
		game.load.audio('halloweenies', 'assets/sounds/halloweenies.mp3');
	},
	create: function() {
		game.stage.backgroundColor = '#71c5cf';
		game.stage.smoothed = false;

		this.forestBack = this.game.add.tileSprite(0, 
      this.game.height - this.game.cache.getImage('forest-back').height*2, 
      this.game.width, 
      this.game.cache.getImage('forest-back').height, 
      'forest-back'
    );
    this.forestBack.scale.setTo(2, 2);
    this.forestMid = this.game.add.tileSprite(0, 
      this.game.height - this.game.cache.getImage('forest-mid').height*2, 
      this.game.width, 
      this.game.cache.getImage('forest-mid').height, 
      'forest-mid'
    );
    this.forestMid.scale.setTo(2, 2);
  	this.forestLights = this.game.add.tileSprite(0, 
      this.game.height - this.game.cache.getImage('forest-lights').height*2, 
      this.game.width, 
      this.game.cache.getImage('forest-lights').height, 
      'forest-lights'
    );
    this.forestLights.scale.setTo(2, 2);
    this.forestFront = this.game.add.tileSprite(0, 
      this.game.height - this.game.cache.getImage('forest-front').height*2, 
      this.game.width, 
      this.game.cache.getImage('forest-front').height, 
      'forest-front'
    );
    this.forestFront.scale.setTo(2, 2);

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.witch = game.add.sprite(100, 245, 'witch');

		game.physics.arcade.enable(this.witch);

		this.witch.body.gravity.y = 1000;
		this.witch.anchor.setTo(-0.2, 0.5);

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		// this.pipes = game.add.group();

		// this.time = game.time.events.loop(1500, this.addRowOfPipes, this);

		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0",
			{ font: "30px Arial", fill: "#ffffff" });

		this.jumpSound = game.add.audio('jump');
		this.music = game.add.audio('halloweenies');
		this.music.play();
	},
	update: function() {
		if(this.witch.y < 0 || this.witch.y > 400) {
			this.restartGame();
		}

		if(this.witch.angle < 10) {
			this.witch.angle += 1;
		}

		game.physics.arcade.overlap(this.witch, this.pipes, this.hitPipe, null, this);

		this.forestBack.tilePosition.x -= 0.05;
    this.forestMid.tilePosition.x -= 0.3;
    this.forestFront.tilePosition.x -= 0.75; 
	},
	jump: function() {
		if(this.witch.alive == false){
			return;
		}
		this.witch.body.velocity.y = -350;
		
		var animation = game.add.tween(this.witch);
		animation.to({angle: -10}, 100);
		animation.start();

		this.jumpSound.play();
	},
	restartGame: function() {
		game.state.start('main');
	},
	addOnePipe: function(x, y) {
		var pipe = game.add.sprite(x, y, 'pipe');
		this.pipes.add(pipe);
		game.physics.arcade.enable(pipe);
		pipe.body.velocity.x = -200;

		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	addRowOfPipes: function() {
		var hole = Math.floor(Math.random() * 5) + 1;
		this.score += 1;
		this.labelScore.text = this.score;

		for(var i = 0; i < 8; i++) {
			if(i != hole && i != hole + 1) {
				this.addOnePipe(400, i * 60 + 10);
			}
		}
	},
	hitPipe: function () {
		if(this.witch.alive == false) {
			return;
		}
		this.witch.alive = false;
		game.time.events.remove(this.timer);

		this.pipes.forEach(function(p){
			p.body.velocity.x = 0;
		}, this);
	}
}

var game = new Phaser.Game(600, 320);

game.state.add('main', mainState);

game.state.start('main');