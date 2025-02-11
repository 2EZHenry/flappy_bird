var GamePlay = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function GamePlay(scene) {
		this.scene = game_data["scene"];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.currentStageAdsWatched = 0;
		this.level_fail = false;
		this.level_started = false;
		this.flap_count = 0;
		this.star_created = 0;
		this.diffs = {
			x: 200,
		};
		this.isActive = false;
	},

	init(params) {
		this.mode = "easy";
		game_data["game_play"] = this;
		// let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "back");
		// bg.setInteractive();
		// bg.on("pointerdown", this.flap, this);
		// bg.setOrigin(0, 0);
		// this.add(bg);

		// Add the bg_holder to the gameplay scene

		if (game_data.bg_holder) {
			this.scene.add.existing(game_data.bg_holder); // Add bg_holder to the scene

			// Set the size of the bg_holder container
			game_data.bg_holder.setSize(
				this.scene.scale.width,
				this.scene.scale.height
			); // Set to the size of the game

			// Add the bg_holder to the gameplay scene
			if (game_data.bg_holder) {
				this.scene.add.existing(game_data.bg_holder); // Add bg_holder to the scene

				// Access the first sprite within bg_holder
				const sprites = game_data.bg_holder.getAll(); // Get all children of bg_holder
				if (sprites.length > 0) {
					const firstSprite = sprites[0]; // Access the first sprite
					firstSprite.setInteractive(); // Make the first sprite interactive

					// Add event listener for pointer down on the first sprite
					firstSprite.on("pointerdown", this.flap, this); // Call flap on click
				}

				// Disable interactivity initially
				this.disableInteractivity();

				// Other initialization code...
			}
		}

		this.level_active = false;

		this.pipeGroup = this.scene.physics.add.group();
		this.starGroup = this.scene.physics.add.group();

		this.pipePool = [];
		let pipe;
		let star;
		for (let i = 0; i < 4; i++) {
			pipe = this.pipeGroup.create(0, 0, "test", "pipe1");
			pipe.body.immovable = true;
			pipe.scaleX = 2;
			pipe.x += this.diffs["x"];
			this.pipePool.push(pipe);
			this.add(pipe);
			pipe = this.pipeGroup.create(0, 0, "test", "pipe1");
			pipe.body.immovable = true;
			pipe.scaleX = 2;
			pipe.x += this.diffs["x"];
			this.pipePool.push(pipe);
			this.add(pipe);
			// star = this.starGroup.create(0, 0, "common1", "star").setScale(0.5);
			// star.alpha = 0;
			// star.setActive(false);

			this.starFrames = ["coin_01", "coin_02", "coin_03"]; // Replace with your actual frame names

			// When creating the star
			star = this.starGroup
				.create(
					0,
					0,
					"test",
					this.starFrames[Math.floor(Math.random() * this.starFrames.length)]
				)
				.setScale(0.5);
			star.alpha = 0;
			star.setActive(false);

			this.add(star);
			this.placePipes(false);
		}

		this.pipeGroup.setVelocityX(0);
		this.starGroup.setVelocityX(0);
		let bird_name = game_data.user_data.current_resourse + "_small";
		// this.bird = this.scene.physics.add.sprite(
		// 	loading_vars["W"] / 2 - 130,
		// 	loading_vars["H"] / 2,
		// 	"common1",
		// 	bird_name
		// );

		this.bird = this.scene.physics.add.sprite(
			loading_vars["W"] / 2 - 130,
			loading_vars["H"] / 2,
			"test",
			"pck"
		);
		this.bird.setScale(0.5);
		this.add(this.bird); // Add the bird sprite to the scene

		// Define the animation for the bird
		// this.scene.anims.create({
		// 	key: "jump", // Animation key
		// 	frames: this.scene.anims.generateFrameNames("spritesheet_anim", {
		// 		prefix: "tile", // Prefix for frame names
		// 		start: 4, // Starting frame number
		// 		end: 6, // Ending frame number
		// 		zeroPad: 0, // Zero padding for frame numbers (e.g., bird_frame01)
		// 	}),
		// 	frameRate: 10, // Frames per second
		// 	repeat: 0, // Repeat the animation indefinitely
		// });

		// this.scene.anims.create({
		// 	key: "idle", // Animation key
		// 	frames: this.scene.anims.generateFrameNames("spritesheet_anim", {
		// 		prefix: "tile", // Prefix for frame names
		// 		start: 1, // Starting frame number
		// 		end: 3, // Ending frame number
		// 		zeroPad: 0, // Zero padding for frame numbers (e.g., bird_frame01)
		// 	}),
		// 	frameRate: 10, // Frames per second
		// 	repeat: -1, // Repeat the animation indefinitely
		// });

		// this.bird.anims.play("idle"); // Start the fly animation

		this.resetBirdOptions();

		this.score = 0;
		this.topScore =
			localStorage.getItem(gameOptions.localStorageName) == null
				? 0
				: localStorage.getItem(gameOptions.localStorageName);
		this.scoreText = this.scene.add.text(loading_vars.W / 2, 120, "", {
			...game_data["styles"]["title"],
			fontFamily: "font2",
			fontSize: 55,
		});
		this.scoreText.setOrigin(0.5);
		this.add(this.scoreText);
		this.updateScore(this.score);
		this.addInfo();
		this.infoGroup.setVisible(false);

		this.scene.physics.add.overlap(
			this.bird,
			this.starGroup,
			function (player, coin) {
				if (coin.active) {
					coin.setActive(false);
					game_request.request({ collect_money: true, amount: 1 }, (res) => {
						if (res["success"]) {
							game_data["audio_manager"].sound_event({
								play: true,
								sound_name: "add_star",
							});
							this.emitter.emit("EVENT", { event: "update_money" });

							this.scene.tweens.add({
								targets: coin,
								y: coin.y - 100,
								alpha: 0,
								duration: 800,
								ease: "Cubic.easeOut",
								callbackScope: this,
								onComplete: function () {},
							});
						}
					});
				}
			},
			null,
			this
		);
	},

	resetStars() {
		this.star_created = 0;
		let stars = [...this.starGroup.getChildren()];
		let star;

		for (let i = 0; i < stars.length; i++) {
			star = stars[i];
			star.alpha = 0;
			star.setActive(false);
		}
	},

	resetPipes() {
		let children = [...this.pipeGroup.getChildren()];
		this.pipeGroup.clear();

		this.pipePool = [];
		let pipe;
		for (let i = 0; i < 8; i++) {
			if (i % 2 === 0) {
				pipe = children[i];

				pipe.x = this.diffs["x"];
				pipe.y = 0;
				this.pipePool.push(pipe);
				this.pipeGroup.add(pipe);
				pipe.body.immovable = true;
				pipe = children[i + 1];
				pipe.x = this.diffs["x"];
				pipe.y = 0;
				this.pipePool.push(pipe);
				this.pipeGroup.add(pipe);
				pipe.body.immovable = true;
				this.placePipes(false, true);
			}
		}
	},

	resetBirdOptions() {
		this.bird.setAngularVelocity(0);
		this.bird.setRotation(0);
		this.bird.body.gravity.y = 0;
		this.bird.body.velocity.y = 0;
		this.bird.body.velocity.x = 0;
		this.bird.x = loading_vars["W"] / 2 - 130;
		this.bird.y = loading_vars["H"] / 2;
		this.bird_anim = this.scene.tweens.add({
			targets: this.bird,
			angle: 5,
			duration: 700,
			yoyo: true,
			repeat: -1,
			onComplete: () => {},
		});
		// this.bird.anims.play("idle"); // Start the fly animation
	},

	addInfo() {
		this.infoGroup = this.scene.add.group();

		// LETS go text and Show game mode difficulties

		// let res = game_data["utils"].generate_string({
		// 	scene_id: "game_windows",
		// 	item_id: "level_finished",
		// 	phrase_id: this.mode,
		// 	values: [],
		// 	base_size: 80,
		// });
		// let temp = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars["W"] / 2,
		// 	450 - 20 - 250,
		// 	res["text"],
		// 	{ fontFamily: "font1", fontSize: res["size"] }
		// );
		// temp.setOrigin(0.5);
		// this.add(temp);
		// this.mode_txt = temp;
		// this.infoGroup.add(this.mode_txt);

		// res = game_data["utils"].generate_string({
		// 	scene_id: "game_play",
		// 	item_id: "game_play",
		// 	phrase_id: "1",
		// 	values: [],
		// 	base_size: 80,
		// });
		// temp = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars["W"] / 2,
		// 	450 - 20 - 150,
		// 	res["text"],
		// 	{ fontFamily: "font1", fontSize: res["size"] }
		// );
		// temp.setOrigin(0.5);
		// this.add(temp);
		// this.start_txt = temp;
		// this.infoGroup.add(this.start_txt);

		res = game_data["utils"].generate_string({
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "snitch",
			values: [],
			base_size: 45,
		});
		temp = new Phaser.GameObjects.Text(
			this.scene,
			loading_vars["W"] / 2,
			830,
			res["text"],
			{
				fontFamily: "font3",
				fontSize: res["size"],
				color: "#ffc94a",
				stroke: "#fc2e2e",
				strokeThickness: 3,
				align: "center",
				wordWrap: { width: 620 },
			}
		);
		temp.setOrigin(0.5);
		this.add(temp);
		this.snitch_txt = temp;
		this.infoGroup.add(this.snitch_txt);

		// the harder you
		// res = game_data["utils"].generate_string({
		// 	scene_id: "game_tip",
		// 	item_id: "tip",
		// 	phrase_id: "snitch2",
		// 	values: [],
		// 	base_size: 20,
		// });
		// temp = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars["W"] / 2,
		// 	830 + 80,
		// 	res["text"],
		// 	{
		// 		fontFamily: "font1",
		// 		fontSize: res["size"],
		// 		color: "#fff",
		// 		stroke: "#000",
		// 		strokeThickness: 3,
		// 		align: "center",
		// 		wordWrap: { width: 620 },
		// 	}
		// );
		// temp.setOrigin(0.5);
		// this.add(temp);
		// this.snitch_txt2 = temp;
		// this.infoGroup.add(this.snitch_txt2);

		this.tap = this.scene.add.sprite(
			loading_vars["W"] / 2 - 130,
			450 - 20 + 250,
			"test",
			"finger"
		);
		this.add(this.tap);
		this.tap.setScale(0.5);
		this.infoGroup.add(this.tap);
		this.tapTween = this.scene.tweens.add({
			targets: this.tap,
			alpha: 0,
			duration: 150,
			yoyo: true,
			ease: "Cubic.easeInOut",
			repeat: -1,
		});

		if (this.button_mode) {
			this.infoGroup.setVisible(false);
		}
	},

	start_level({ mode }) {
		this.mode = mode;
		this.infoGroup.setVisible(true);
		this.restartLevel({ reset_score: true });
		this.bird.setFrame("pck");
		this.currentStageAdsWatched = 0;
		let res = game_data["utils"].generate_string({
			scene_id: "game_windows",
			item_id: "level_finished",
			phrase_id: this.mode,
			values: [],
			base_size: 80,
		});
		this.mode_txt.setText(res["text"]);

		res = game_data["utils"].generate_string({
			scene_id: "game_play",
			item_id: "game_play",
			phrase_id: "1",
			values: [],
			base_size: 80,
		});
		this.start_txt.setText(res["text"]);

		res = game_data["utils"].generate_string({
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "snitch",
			values: [],
			base_size: 80,
		});
		this.snitch_txt.setText(res["text"]);

		res = game_data["utils"].generate_string({
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "snitch2",
			values: [],
			base_size: 80,
		});
		this.snitch_txt2.setText(res["text"]);

		if (this.mode === "easy") {
			this.mode_txt.setColor(game_data["styles"]["easy_text"]["color"]);
			this.mode_txt.setStroke(
				game_data["styles"]["easy_text"]["stroke"],
				game_data["styles"]["easy_text"]["strokeThickness"]
			);

			this.start_txt.setColor(game_data["styles"]["easy_text"]["color"]);
			this.start_txt.setStroke(
				game_data["styles"]["easy_text"]["stroke"],
				game_data["styles"]["easy_text"]["strokeThickness"]
			);
		} else if (this.mode === "normal") {
			this.mode_txt.setColor(game_data["styles"]["normal_text"]["color"]);
			this.mode_txt.setStroke(
				game_data["styles"]["normal_text"]["stroke"],
				game_data["styles"]["normal_text"]["strokeThickness"]
			);

			this.start_txt.setColor(game_data["styles"]["normal_text"]["color"]);
			this.start_txt.setStroke(
				game_data["styles"]["normal_text"]["stroke"],
				game_data["styles"]["normal_text"]["strokeThickness"]
			);
		} else if (this.mode === "hard") {
			this.mode_txt.setColor(game_data["styles"]["hard_text"]["color"]);
			this.mode_txt.setStroke(
				game_data["styles"]["hard_text"]["stroke"],
				game_data["styles"]["hard_text"]["strokeThickness"]
			);

			this.start_txt.setColor(game_data["styles"]["hard_text"]["color"]);
			this.start_txt.setStroke(
				game_data["styles"]["hard_text"]["stroke"],
				game_data["styles"]["hard_text"]["strokeThickness"]
			);
		} else if (this.mode === "crazy") {
			this.mode_txt.setColor(game_data["styles"]["crazy_text"]["color"]);
			this.mode_txt.setStroke(
				game_data["styles"]["crazy_text"]["stroke"],
				game_data["styles"]["crazy_text"]["strokeThickness"]
			);

			this.start_txt.setColor(game_data["styles"]["crazy_text"]["color"]);
			this.start_txt.setStroke(
				game_data["styles"]["crazy_text"]["stroke"],
				game_data["styles"]["crazy_text"]["strokeThickness"]
			);
		}
	},

	gameOver() {
		this.level_failed();
	},

	level_failed() {
		this.disableInteractivity();
		if (
			allow_rewarded_ads &&
			this.currentStageAdsWatched < game_data["allowed_trials"]
		) {
			this.level_finished();
			// this.level_fail = true;
			// this.level_active = false;
			// this.emitter.emit("EVENT", {
			// 	event: "show_window",
			// 	window_id: "level_failed",
			// 	score: this.score,
			// 	currentStage: this.currentStage,
			// 	currentStageAdsWatched: this.currentStageAdsWatched,
			// 	mode: this.mode,
			// });
		} else {
			game_request.request(
				{ level_failed: true, global_score: this.score, mode: this.mode },
				(params) => {
					this.level_finished();
				}
			);
		}
	},

	level_finished() {
		this.emitter.emit("EVENT", {
			event: "show_window",
			window_id: "level_finished",
			score: this.score,
			mode: this.mode,
		});
		this.disableInteractivity();
		this.updateScore(0);
		// Show the form after emitting the level failed event
		// this.showGameOverForm();
	},

	showGameOverForm() {
		// Show the form
		document.getElementById("form-container").style.display = "block";

		// Optional: Pause the game logic if necessary
		// this.disableGameInteraction();
	},

	continue_game() {
		this.restartLevel({ reset_score: false });
		this.infoGroup.toggleVisible();
	},

	restartLevel({ reset_score = false }) {
		this.resetBirdOptions();
		this.resetStars();
		this.resetPipes();
		this.level_active = true;
		this.level_fail = false;
		this.flap_count = 0;
		if (reset_score) this.score = 0;
		this.updateScore(0);
		this.enableInteractivity();
	},

	updateScore(inc) {
		if (inc)
			game_data["audio_manager"].sound_event({
				play: true,
				sound_name: "level_complete4",
			});
		this.score += inc;

		this.scoreText.setVisible(this.score > 0);
		this.scoreText.text = this.score;
		this.scoreAnim();
	},
	scoreAnim() {
		game_data["scene"].tweens.add({
			targets: this.scoreText,
			scale: 1.3,
			yoyo: true,
			duration: 90,
			onComplete: () => {},
		});
	},
	placePipes(addScore, allowStar = false) {
		let rightmost = this.getRightmostPipe();
		let pipeHoleHeight = Phaser.Math.Between(
			gameOptions.pipeHole[0],
			gameOptions.pipeHole[1]
		);
		let pipeHolePosition = Phaser.Math.Between(
			gameOptions.minPipeHeight + pipeHoleHeight / 2,
			loading_vars["H"] - gameOptions.minPipeHeight - pipeHoleHeight / 2
		);
		this.pipePool[0].x =
			rightmost +
			this.pipePool[0].getBounds().width +
			Phaser.Math.Between(
				gameOptions.pipeDistance[0],
				gameOptions.pipeDistance[1]
			);
		this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
		this.pipePool[1].x = this.pipePool[0].x;
		this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;

		let texture = Phaser.Utils.Array.GetRandom(["pipe1"]);
		this.pipePool[0].setFrame(texture);
		this.pipePool[1].setFrame(texture);

		let star = this.starGroup.getFirstDead();
		if (allowStar && star) {
			let prob = gameOptions.moneyProb[this.mode];
			let rand = Math.random() * 100;
			// console.log(rand, prob)
			if (this.star_created === 0 || rand < prob) {
				this.placeStar(this.pipePool[0], this.pipePool[1], star);
				this.star_created++;
			}
		}

		this.pipePool = [];
		if (addScore) {
			this.updateScore(1);
		}
	},
	placeStar(pool1, pool2, star) {
		let bounds1 = pool1.getBounds();
		let bounds2 = pool2.getBounds();
		let start_point = bounds1.top + bounds1.height;
		let end_point = bounds2.top;
		if (start_point > end_point)
			[start_point, end_point] = [end_point, start_point];

		let rand_y = (start_point + end_point) / 2;
		star.x = pool1.x;
		star.y = rand_y;
		star.alpha = 1;
		star.setActive(true);
		if (this.star_created !== 0) {
			if (Math.random() < 0.4) star.x += 150;
		}
	},

	enableInteractivity() {
		this.isActive = true; // Set the game as active
		// Enable interactivity for game objects
		// Add the bg_holder to the gameplay scene
		if (game_data.bg_holder) {
			// Access the first sprite within bg_holder
			const sprites = game_data.bg_holder.getAll(); // Get all children of bg_holder
			if (sprites.length > 0) {
				const firstSprite = sprites[0]; // Access the first sprite
				firstSprite.setInteractive(); // Make the first sprite interactive

				// Add event listener for pointer down on the first sprite
				firstSprite.on("pointerdown", this.flap, this); // Call flap on click
			}
		}
	},

	disableInteractivity() {
		this.isActive = false; // Set the game as inactive
		// Disable interactivity for game objects
		const sprites = game_data.bg_holder.getAll();
		sprites.forEach((sprite) => {
			sprite.disableInteractive();
		});
	},

	flap() {
		if (!this.isActive) return; //

		// Play the fly animation
		// this.bird.anims.play("jump"); // Play the fly animation when flapping

		if (this.flap_count === 0) {
			// this.bird.anims.play("idle"); // Start the fly animation
			this.level_active = true;
			this.bird.body.gravity.y = gameOptions.birdGravity;
			let coef = 1;
			if (this.mode in gameOptions.birdSpeedCoef)
				coef = gameOptions.birdSpeedCoef[this.mode];
			let speed = -gameOptions.birdSpeed * coef;
			this.pipeGroup.setVelocityX(speed);
			this.starGroup.setVelocityX(speed);
			this.infoGroup.toggleVisible();
		}
		game_data["audio_manager"].sound_event({ play: true, sound_name: "jump" });
		this.flap_count++;

		this.bird.body.velocity.y = -gameOptions.birdFlapPower;

		// Listen for the animation completion to switch back to idle
		// this.bird.on("animationcomplete", (animation) => {
		// 	if (animation.key === "jump") {
		// 		this.bird.anims.play("idle"); // Return to idle animation after flapping
		// 	}
		// });
	},
	getRightmostPipe() {
		let rightmostPipe = 0;
		this.pipeGroup.getChildren().forEach((pipe) => {
			rightmostPipe = Math.max(rightmostPipe, pipe.x);
		});
		return rightmostPipe;
	},
	update() {
		if (this.level_active) {
			this.scene.physics.world.collide(
				this.bird,
				this.pipeGroup,
				() => {
					game_data["audio_manager"].sound_event({
						play: true,
						sound_name: "pipe_hit",
					});
					this.die();
				},
				null,
				this
			);
			if (this.bird.y > loading_vars["H"] || this.bird.y < 0) {
				this.die();
			}
			this.pipeGroup.getChildren().forEach((pipe) => {
				if (pipe.getBounds().right < 0) {
					this.pipePool.push(pipe);
					if (this.pipePool.length == 2) {
						this.placePipes(true, true);
					}
				}
			}, this);
		}
	},
	die() {
		localStorage.setItem(
			gameOptions.localStorageName,
			Math.max(this.score, this.topScore)
		);
		this.level_active = false;

		if (this.bird_anim) this.bird_anim.pause();
		if (this.bird_anim) this.bird_anim.destroy();
		this.bird.setAngularVelocity(360);
		this.pipeGroup.setVelocityX(0);
		this.starGroup.setVelocityX(0);

		this.gameOver();
	},

	show_gameplay() {},

	pause_timer() {
		if (this.level_active) {
			if (this.timerEvent) this.timerEvent.paused = true;
		}
	},

	resume_timer() {
		if (this.level_active) {
			if (this.timerEvent) this.timerEvent.paused = false;
		}
	},

	update_language() {},

	rewarded_ad_watched() {
		this.currentStageAdsWatched++;
	},
});
