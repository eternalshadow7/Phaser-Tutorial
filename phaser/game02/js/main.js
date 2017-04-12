var game = new Phaser.Game(420, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// preload assets
	game.load.image('sky', 'assets/img/sky.png');
	game.load.image('ground', 'assets/img/platform.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
	game.load.spritesheet('baddie', 'assets/img/baddie.png',32,32);
	
}
//////
var player;
var cursors;
var platforms;
var score = 0;
var scoreText;
var diamond;

function create() {
	// place your assets
	game.add.sprite(0,0,'star');

	
	// Since we are going to use physics in the game, we enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	

	
	// This is a simple background for the game.
	game.add.sprite(0, 0, 'sky');
	
	
	// The platforms group contains the ground and the 2 ledges we can jump on 
	platforms=game.add.group();
	
	// We will enable physics for any object that is created in this group
	platforms.enableBody=true;
	
	// This is where we create the ground
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	
	// Scale it to fit the width of the game (the original sprite is 400x32 in size)
	ground.scale.setTo(2, 2);
	
	// This stops it from falling away when you jump on it
	ground.body.immovable = true;
	
	
	// Now let's create five ledges
	
	
    // Ledge 1 (2nd bottom)
    var ledge = platforms.create(210, 340, 'ground');
	ledge.body.immovable = true;
	
	// Ledge 2 (third to the bottom)
	ledge = platforms.create(-240, 263, 'ground');
    ledge.body.immovable=true;
	
	// Ledge 3 (fourth to the bottom)
    ledge = platforms.create(340, 178, 'ground');
	ledge.body.immovable=true;
	
	// Ledge 4 (bottom most)
	ledge = platforms.create(-39, 430, 'ground');
	ledge.body.immovable=true;
	
	// Ledge 5 (most top)
	ledge = platforms.create(-230, 120, 'ground');
	ledge.body.immovable=true;
	
	// The player and its settings
	player = game.add.sprite(32, game.world.height - 150, 'baddie');
	
	// We need to enable physics on the player
	game.physics.arcade.enable(player);
	
	// Player physics properties. Give the little guy a slight bounce.
	player.body.bounce.y=0.2;
	player.body.gravity.y=300;
	player.body.collideWorldBounds = true;
	
	// Our two animations, walking left and right.
	player.animations.add('left', [0, 1], 10, true);
	player.animations.add('right',[2, 3], 10, true);
	
	
    diamond = game.add.sprite(game.world.randomX, game.world.randomY-64, 'diamond');
	
    game.physics.arcade.enable(diamond);
	diamond.body.gravity.y=300;
	diamond.body.collideWorldBounds = true;
	diamond.enableBody=true;
	

	

    stars = game.add.group();
	stars.enableBody = true;
	
	
	
	// Here we'll create 12 of them evenly spaced apart
	for (var i = 0; i < 12; i++){
		// Create a star inside of the 'stars' group
		var star = stars.create(i*70, 0, 'star');
		
		// Let gravity do its thing
		star.body.gravity.y = 6;
		
		// This justs gives each star a slightly random bounce value
		star.body.bounce.y=0.7+Math.random()*0.2;
	}

	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    cursors = game.input.keyboard.createCursorKeys();
	
	
	
	
}

function update() {
	// run game loop
	
	// Collide the player and the stars and diamond with the platforms
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.collide(diamond, platforms);
	game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);
	
	
	
	
	// Reset the player's velocity (movement)
	player.body.velocity.x = 0;
	
	if (cursors.left.isDown){
		// Move to the left
		player.body.velocity.x=-150;
		player.animations.play('left');
	}else if (cursors.right.isDown){
		// Move to the right
		player.body.velocity.x=150;
		player.animations.play('right');
	}else{
		// Stand still
		player.animations.stop();
		player.frame=2;
	}

	
	// Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown && player.body.touching.down && hitPlatform){
		player.body.velocity.y=-350;
	}
	
	

}
function collectStar(player, star){
		
	// Removes the star from the screen
	star.kill();
		
	// Add and update the score
	score += 10;
	scoreText.setText ('Score: ' + score);
	
}
function collectDiamond(player, diamond){
		
	// Removes the diamond from the screen
	diamond.kill();
		
	// Add and update the score
	score += 25;
	scoreText.setText ('Score: ' + score);
}
  
