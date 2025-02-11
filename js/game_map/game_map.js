var GameMap = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function GameMap(scene) {
		this.scene = game_data["scene"];
		Phaser.GameObjects.Container.call(this, scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.game_started = 0;
		this.guide_showed = false;
		// Get the current URL
		const url = new URL(window.location.href);

		// Access the search parameters
		const params = url.searchParams;
		// Get specific parameter values
		const name = params.get("name"); // "JohnDoe"
		this.username = name;
	},

	init(params) {
		game_data["game_map"] = this;
		this.create_assets();

		this.cont_current_knife = new Phaser.GameObjects.Container(
			this.scene,
			loading_vars.W / 2,
			435
		);
		this.add(this.cont_current_knife);

		this.logo = new Phaser.GameObjects.Image(
			this.scene,
			loading_vars.W / 2,
			loading_vars["H"] / 2 - 300,
			"test",
			"logo"
		);
		this.add(this.logo); // Add the image to the scene
		this.logo.setScale(1.2);

		this.logo = game_data.scene.tweens.add({
			targets: this.logo,
			repeat: -1,
			yoyo: true,
			y: { from: this.logo.y - 3, to: this.logo.y + 3 },
			ease: "Sine.easeInOut",
			duration: 1000,
			onUpdate: () => {},
			onComplete: () => {},
		});

		this.harryImg = new Phaser.GameObjects.Image(
			this.scene,
			loading_vars.W / 2,
			loading_vars["H"] / 2 - 50,
			"test",
			"title_2"
		);
		this.add(this.harryImg); // Add the image to the scene

		let luchi = new Phaser.GameObjects.Image(
			this.scene,
			0,
			0,
			"common1",
			"luchi"
		);

		luchi.scale = 1.6;

		game_data.scene.tweens.add({
			targets: luchi,
			angle: 360,
			repeat: -1,
			duration: 10000,
			onComplete: () => {},
		});

		this.cont_current_knife.add(luchi);

		// // Remove the harryImg and replace it with the bird sprite
		// this.bird = this.scene.physics.add.sprite(
		// 	loading_vars.W / 2,
		// 	loading_vars.H / 2 - 100,
		// 	"spritesheet_anim", // Use the atlas you loaded
		// 	"tile1" // Use the first frame of the bird animation
		// );
		// this.add(this.bird); // Add the bird sprite to the scene

		// // Define the animation for the bird
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

		// // Play the animation
		// this.bird.anims.play("idle"); // Start the fly animation

		// Add text below the bird
		// this.harryText = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars.W / 2, // Centered horizontally
		// 	loading_vars.H / 2 + 100, // Position it below the bird (50 pixels below)
		// 	`WELCOME, ${this.username ?? "XXX"}`, // Replace with your desired text
		// 	{
		// 		fontFamily: "font3", // Specify your font
		// 		fontSize: "32px", // Specify font size
		// 		color: "#ffffff", // Specify text color
		// 		align: "center", // Center the text
		// 		stroke: "#000",
		// 		strokeThickness: 3,
		// 	}
		// );
		// this.harryText.setOrigin(0.5); // Center the text origin
		// this.add(this.harryText); // Add the text to the scene

		// this.btn_tween = game_data.scene.tweens.add({
		// 	targets: this.harryImg,
		// 	repeat: -1,
		// 	yoyo: true,
		// 	angle: { from: -3, to: 3 }, // Adjust the angle values for swing effect
		// 	ease: "Sine.easeInOut",
		// 	duration: 1000,
		// 	onUpdate: () => {},
		// 	onComplete: () => {},
		// });

		// Add text below the harryImg
		this.harryText = new Phaser.GameObjects.Text(
			this.scene,
			loading_vars.W / 2, // Centered horizontally
			loading_vars["H"] / 2 + 160, // Position it below the harryImg (50 pixels below)
			`WELCOME,`, // Replace with your desired text
			{
				fontFamily: "font3", // Specify your font
				fontSize: "40px", // Specify font size
				color: "#ffffff", // Specify text color
				align: "center", // Center the text
				stroke: "#623300",
				strokeThickness: 4,
			}
		);
		this.harryText.setOrigin(0.5); // Center the text origin
		this.add(this.harryText); // Add the text to the scene

		this.harryText = new Phaser.GameObjects.Text(
			this.scene,
			loading_vars.W / 2, // Centered horizontally
			loading_vars["H"] / 2 + 200, // Position it below the harryImg (50 pixels below)
			`${this.username !== "" ? this.username : "Username"}`, // Replace with your desired text
			{
				fontFamily: "font3", // Specify your font
				fontSize: "65px", // Specify font size
				color: "#ffc94a", // Specify text color
				align: "center", // Center the text
				stroke: "#fc2e2e",
				strokeThickness: 3,
			}
		);
		this.harryText.setOrigin(0.5); // Center the text origin
		this.add(this.harryText); // Add the text to the scene

		// this.harryText = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars.W / 2, // Centered horizontally
		// 	loading_vars["H"] / 2 + 140, // Position it below the harryImg (50 pixels below)
		// 	`SCORE AT LEAST 100`, // Replace with your desired text
		// 	{
		// 		fontFamily: "font3", // Specify your font
		// 		fontSize: "40px", // Specify font size
		// 		color: "#ffc94a", // Specify text color
		// 		align: "center", // Center the text
		// 		stroke: "#000",
		// 		strokeThickness: 3,
		// 	}
		// );
		// this.harryText.setOrigin(0.5); // Center the text origin
		// this.add(this.harryText); // Add the text to the scene

		// this.harryText = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	loading_vars.W / 2, // Centered horizontally
		// 	loading_vars["H"] / 2 + 180, // Position it below the harryImg (50 pixels below)
		// 	`to stand a chance to win prizes`, // Replace with your desired text
		// 	{
		// 		fontFamily: "font3", // Specify your font
		// 		fontSize: "32px", // Specify font size
		// 		color: "#ffffff", // Specify text color
		// 		align: "center", // Center the text
		// 		stroke: "#000",
		// 		strokeThickness: 3,
		// 	}
		// );
		// this.harryText.setOrigin(0.5); // Center the text origin
		// this.add(this.harryText); // Add the text to the scene

		this.button_play = new CustomButton(
			this.scene,
			loading_vars.W / 2,
			loading_vars["H"] * 0.8 + 30,
			() => {
				this.handler_play();
			},
			"test",
			"play",
			"play",
			"play",
			this,
			null,
			null,
			0.9
		);
		this.add(this.button_play);

		this.btn_tween = game_data.scene.tweens.add({
			targets: this.button_play,
			repeat: -1,
			yoyo: true,
			scale: { from: 0.8, to: 0.9 },
			ease: "Sine.easeInOut",
			duration: 1000,
			onUpdate: () => {},
			onComplete: () => {},
		});

		// this.create_lang_button();
		// this.create_remove_ad_button();
		// this.create_sound_buttons();
		// this.create_shop_panel();
	},

	randomizeDifficulty() {
		const difficulties = ["easy"];
		// const difficulties = ["easy", "normal", "hard", "crazy"];
		const randomDifficulty =
			difficulties[Math.floor(Math.random() * difficulties.length)];
		this.emitter.emit("EVENT", {
			event: "start_level",
			mode: randomDifficulty,
		});
	},

	create_score_panel() {
		this.score = 0;
		this.score_panel = new Phaser.GameObjects.Container(this.scene, 570, 70);
		game_data.score_panel = this.score_panel;
		this.add(this.score_panel);
		let back = new Phaser.GameObjects.Image(
			this.scene,
			0,
			0,
			"common1",
			"panel8"
		);
		back.setScale(0.5);
		this.score_panel.add(back);
		back.setInteractive({ useHandCursor: true });
		back.on(
			"pointerdown",
			() => {
				let pt = game_data["utils"].toGlobal(
					this.score_panel,
					new Phaser.Geom.Point(0, 0)
				);
				game_data["utils"].show_tip({
					pt: pt,
					scene_id: "game_tip",
					item_id: "tip",
					phrase_id: "record",
					values: [],
				});
			},
			this
		);
		this.score_txt = new Phaser.GameObjects.Text(
			this.scene,
			0,
			-10,
			game_data["user_data"]["global_score"],
			{
				fontFamily: "font3",
				fontSize: 35,
				color: "#a86233",
				stroke: "#ffe1a1",
				strokeThickness: 3,
			}
		);
		this.score_txt.setOrigin(0.5, 1);
		this.score_panel.add(this.score_txt);
		this.score_txt.setText(this.score);

		let score_icon = new Phaser.GameObjects.Image(
			this.scene,
			0,
			this.score_txt.y + 30,
			"common1",
			"rating_ico"
		);
		score_icon.setScale(0.9);
		this.score_panel.add(score_icon);
	},

	new_score() {
		let pt = game_data["utils"].toGlobal(
			this.score_panel,
			new Phaser.Geom.Point(0, 0)
		);
		game_data["utils"].show_tip({
			pt: pt,
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "new_record",
			values: [],
		});
	},

	create_shop_panel() {
		this.container_shop = new Phaser.GameObjects.Container(this.scene, 280, 50);
		this.add(this.container_shop);

		this.shop_panel = new CustomButton(
			this.scene,
			0,
			0,
			this.handler_shop,
			"test",
			"btn_lang_01",
			"btn_lang_01",
			"btn_lang_01",
			this
		);
		this.container_shop.add(this.shop_panel);
	},

	handler_shop() {
		this.emitter.emit("EVENT", { event: "show_scene", scene_id: "SHOP" });
	},

	create_lang_button() {
		this.button_lang = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.button_lang);

		this.button_lang2 = new CustomButton(
			this.scene,
			580,
			50,
			this.handler_lang,
			"common1",
			"btn_lang",
			"btn_lang",
			"btn_lang",
			this
		);
		this.button_lang.add(this.button_lang2);
	},

	create_remove_ad_button() {
		this.button_ad = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.button_ad);

		this.button_ad2 = new CustomButton(
			this.scene,
			180,
			50,
			this.handler_remove_ad,
			"common1",
			"btn_rem_ad",
			"btn_rem_ad",
			"btn_rem_ad",
			this
		);
		this.button_ad.add(this.button_ad2);
		this.update_ad_btn();
	},

	update_ad_btn() {
		this.button_ad.setVisible(
			game_data["user_data"]["payments"]["total"] === 0
		);
	},

	handler_lang() {
		this.emitter.emit("EVENT", {
			event: "show_window",
			window_id: "select_language",
		});
	},

	handler_remove_ad() {
		this.emitter.emit("EVENT", {
			event: "show_window",
			window_id: "remove_ads",
		});
	},

	create_sound_buttons() {
		this.buttonsGroup = this.scene.add.group();

		this.button_music = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.button_music);
		this.button_music_on = new CustomButton(
			this.scene,
			580,
			50,
			this.handler_music,
			"test",
			"btn_lang_01",
			"btn_lang_01",
			"btn_lang_01",
			this
		);
		this.button_music.add(this.button_music_on);
		this.button_music_off = new CustomButton(
			this.scene,
			580,
			50,
			this.handler_music,
			"test",
			"btn_lang_01",
			"btn_lang_01",
			"btn_lang_01",
			this
		);
		this.button_music.add(this.button_music_off);
		this.buttonsGroup.add(this.button_music);

		this.button_sound = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.button_sound);
		this.button_sound_on = new CustomButton(
			this.scene,
			480,
			50,
			this.handler_sound,
			"test",
			"btn_lang_02",
			"btn_lang_02",
			"btn_lang_02",
			this
		);
		this.button_sound.add(this.button_sound_on);
		this.button_sound_off = new CustomButton(
			this.scene,
			480,
			50,
			this.handler_sound,
			"test",
			"btn_lang_02",
			"btn_lang_02",
			"btn_lang_02",
			this
		);
		this.button_sound.add(this.button_sound_off);
		this.buttonsGroup.add(this.button_sound);

		this.update_buttons();
	},

	handler_music(params) {
		game_data["user_data"]["music"] = 1 - game_data["user_data"]["music"];
		this.update_buttons();
		game_request.request(
			{
				set_options: true,
				sound: game_data["user_data"]["sound"],
				music: game_data["user_data"]["music"],
			},
			function () {}
		);
		game_data["audio_manager"].update_volume();
	},

	handler_sound(params) {
		game_data["user_data"]["sound"] = 1 - game_data["user_data"]["sound"];
		this.update_buttons();
		game_request.request(
			{
				set_options: true,
				sound: game_data["user_data"]["sound"],
				music: game_data["user_data"]["music"],
			},
			function () {}
		);
		game_data["audio_manager"].update_volume();
	},

	update_buttons() {
		this.button_music_on.visible = game_data["user_data"]["music"] == 1;
		this.button_music_off.visible = game_data["user_data"]["music"] == 0;

		this.button_sound_on.visible = game_data["user_data"]["sound"] == 1;
		this.button_sound_off.visible = game_data["user_data"]["sound"] == 0;
	},

	reset_music() {
		game_data["audio_manager"].sound_event({ stop_all: true });
		game_data["audio_manager"].sound_event({
			play: true,
			loop: true,
			sound_type: "music",
			sound_name: "music_map",
			audio_kind: "music",
			map: true,
		});
	},

	show_map(obj = {}) {
		if (obj["complete"]) {
			if (!game_data["user_data"]["tutorial"]["map_snitch"]) {
				console.log("HERE ISIT?");
				this.snitch_tip(true);
				game_data["user_data"]["tutorial"]["map_snitch"] = true;
				game_request.request(
					{ update_tutorial: true, tutorial_id: "map_snitch" },
					() => {}
				);
			}
		}

		if (!this.guide_showed) {
			this.snitch_tip();
			this.guide_showed = true;
		}

		this.update_money();
	},

	handler_event(params) {
		switch (params["event"]) {
			case "start_level":
				this.auto_start_obj = null;
				this.start_level(params);
				break;
			default:
				this.emitter.emit("EVENT", params);
				break;
		}
	},

	get_money_pt() {
		return game_data["utils"].toGlobal(
			game_data["game_map"],
			new Phaser.Geom.Point(this.money_icon.x, this.money_icon.y)
		);
	},

	update_language() {},

	create_assets() {
		// let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "background");
		// bg.setOrigin(0, 0);
		// this.add(bg);

		// top left score
		this.money_icon = new Phaser.GameObjects.Image(
			this.scene,
			55,
			57,
			"test",
			"coin_01"
		).setScale(0.8);
		game_data["money_holder"].add(this.money_icon);

		this.money_txt = new Phaser.GameObjects.Text(
			this.scene,
			55,
			53,
			game_data["user_data"]["money"],
			{
				fontFamily: "font3",
				fontSize: 50,
				color: "#a86233",
				stroke: "#ffe1a1",
				strokeThickness: 3,
			}
		);
		this.money_txt.setOrigin(0.5);
		this.add(this.money_txt);
		game_data["money_holder"].add(this.money_txt);
		this.game_icon_anim();

		this.money_txt.setInteractive({ useHandCursor: true });
		this.money_txt.on(
			"pointerup",
			() => {
				this.snitch_tip();
			},
			this
		);
	},

	snitch_tip(tutorial_tip = false) {
		let panel = this.money_icon;
		if (tutorial_tip) panel = this.shop_panel;
		let pt = game_data["utils"].toGlobal(panel, new Phaser.Geom.Point(0, 0));
		game_data["utils"].show_tip({
			pt: pt,
			scene_id: "game_tip",
			item_id: "guide",
			phrase_id: "guide",
			values: [],
		});
	},

	game_icon_anim() {
		if (this.scene) {
			if (!game_data["money_holder"].lights) {
				game_data["money_holder"].lights = [];
				while (game_data["money_holder"].lights.length < 5) {
					img = new Phaser.GameObjects.Image(
						this.scene,
						0,
						0,
						"common1",
						"light_star"
					);
					img.scale = 0;
					game_data["money_holder"].add(img);
					game_data["money_holder"].lights.push(img);
				}
			}
			game_data["money_holder"].tween = this.scene.tweens.add({
				targets: game_data["money_holder"],
				repeat: 0,
				yoyo: true,
				scale: { from: 1, to: 1.0 },
				ease: "Sine.easeInOut",
				duration: 3200,
				onUpdate: () => {},
				onComplete: () => {
					this.game_icon_anim();
				},
			});
			for (let i = 0; i < game_data["money_holder"].lights.length; i++) {
				img = game_data["money_holder"].lights[i];
				img.scale = 0;
				img.angle = 0;
				img.x = (5 + Math.random() * 100) * (Math.random() < 0.5 ? 1 : -1);
				img.y = (5 + Math.random() * 100) * (Math.random() < 0.5 ? 1 : -1);
				game_data["scene"].tweens.add({
					targets: img,
					scale: 1.8,
					duration: 500,
					yoyo: true,
					repeat: 0,
					delay: 500 + i * 900,
					ease: "Sine.easeOut",
				});
				game_data["scene"].tweens.add({
					targets: img,
					angle: 360 * (Math.random() < 0.5 ? 1 : -1),
					duration: 800,
					delay: 500 + i * 900,
					ease: "Sine.easeInOut",
				});
			}
		}
	},

	new_score() {
		let pt = game_data["utils"].toGlobal(
			this.score_panel,
			new Phaser.Geom.Point(0, 0)
		);
		game_data["utils"].show_tip({
			pt: pt,
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "new_record",
			values: [],
		});
	},

	handler_buy_money() {
		let pt = game_data["utils"].toGlobal(
			this.user_money,
			new Phaser.Geom.Point(0, 0)
		);
		game_data["utils"].show_tip({
			pt: pt,
			scene_id: "game_tip",
			item_id: "tip",
			phrase_id: "money",
			values: [],
		});
	},

	update_money() {
		this.money_txt.setText(game_data["user_data"]["money"]);
	},

	handler_play() {
		// this.emitter.emit("EVENT", {
		// 	event: "show_window",
		// 	window_id: "level_start",
		// });
		this.randomizeDifficulty();
	},

	update() {},

	start_level(_obj) {
		this.game_started++;
	},
});
