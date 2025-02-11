let LevelFinished = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function LevelFinished() {
		this.scene = game_data["scene"];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
	},

	init(params) {
		let add_y = -20;
		this.mode = params["mode"];
		// this.score = params["score"];
		this.score = game_data["user_data"]["money"];

		console.log(game_data["user_data"]);

		this.closed = false;
		let temp = {
			scene_id: "game_windows",
			item_id: "level_finished",
			phrase_id: "1",
			values: [],
			base_size: 50,
		};
		game_data["graphics_manager"].get_window(
			"info",
			this.handler_close,
			[
				{
					handler: this.handler_close,
					type: "big",
					scale: 0.5,
				},
			],
			this,
			null,
			true
		);

		// this.temp_button_play = new CustomButton(
		// 	this.scene,
		// 	loading_vars.W / 2,
		// 	loading_vars["H"] * 0.8 + 30,
		// 	() => {
		// 		this.handler_close();
		// 	},
		// 	"test",
		// 	"repeat",
		// 	"repeat",
		// 	"repeat",
		// 	this,
		// 	null,
		// 	null,
		// 	0.5
		// );
		// this.add(this.temp_button_play);
		// this.temp_button_play.setPosition(0, 145);

		// this.button_play = this.buttons[0].setScale(1.25);
		// this.button_play = this.buttons[0].setPosition(0, 145);
		this.button_close.setVisible(false);
		this.back.setTexture("test", "END_02");

		// let res = game_data["utils"].generate_string({
		// 	scene_id: "game_windows",
		// 	item_id: "level_finished",
		// 	phrase_id: this.mode,
		// 	values: [],
		// 	base_size: 35,
		// });

		// console.log({ res });

		// temp = new Phaser.GameObjects.Text(this.scene, 0, -170, res["text"], {
		// 	fontFamily: "font1",
		// 	fontSize: res["size"],
		// });
		// temp.setOrigin(0.5);
		// this.add(temp);
		// if (this.mode === "easy") {
		// 	temp.setColor(game_data["styles"]["easy_text"]["color"]);
		// 	temp.setStroke(
		// 		game_data["styles"]["easy_text"]["stroke"],
		// 		game_data["styles"]["easy_text"]["strokeThickness"]
		// 	);
		// } else if (this.mode === "normal") {
		// 	temp.setColor(game_data["styles"]["normal_text"]["color"]);
		// 	temp.setStroke(
		// 		game_data["styles"]["normal_text"]["stroke"],
		// 		game_data["styles"]["normal_text"]["strokeThickness"]
		// 	);
		// } else if (this.mode === "hard") {
		// 	temp.setColor(game_data["styles"]["hard_text"]["color"]);
		// 	temp.setStroke(
		// 		game_data["styles"]["hard_text"]["stroke"],
		// 		game_data["styles"]["hard_text"]["strokeThickness"]
		// 	);
		// } else if (this.mode === "crazy") {
		// 	temp.setColor(game_data["styles"]["crazy_text"]["color"]);
		// 	temp.setStroke(
		// 		game_data["styles"]["crazy_text"]["stroke"],
		// 		game_data["styles"]["crazy_text"]["strokeThickness"]
		// 	);
		// }

		temp = new Phaser.GameObjects.Text(
			this.scene,
			0,
			-140 + add_y,
			"Your best score\nwill be submitted!",
			{
				fontFamily: "font1",
				fontSize: 28,
				color: "#40190e",
				align: "center",
			}
		);
		temp.setOrigin(0.5);
		// @TODO
		// this.add(temp);

		res = game_data["utils"].generate_string({
			scene_id: "game_windows",
			item_id: "level_finished",
			phrase_id: "2",
			values: [],
			base_size: 35,
		});

		//Best score
		temp = new Phaser.GameObjects.Text(
			this.scene,
			0,
			-70 + add_y,
			res["text"], //text string
			{
				...game_data["styles"]["title"],
				fontFamily: "font1",
				fontSize: res["size"],
			}
		);
		temp.setOrigin(0.5);
		// text of best score
		// this.add(temp);

		let best_score =
			game_data["user_data"]["global_score_mode"][
				game_data["user_data"]["money"]
			];
		if (best_score < this.score) best_score = this.score;
		temp = new Phaser.GameObjects.Text(this.scene, 0, -20 + add_y, best_score, {
			fontFamily: "font1",
			fontSize: 65,
			color: "#40190e",
			stroke: "#fff5de",
			strokeThickness: 5,
		});
		temp.setOrigin(0.5);
		// @TODO best score
		// this.add(temp);

		//Current score

		res = game_data["utils"].generate_string({
			scene_id: "game_windows",
			item_id: "level_finished",
			phrase_id: "3",
			values: [],
			base_size: 35,
		});
		temp = new Phaser.GameObjects.Text(
			this.scene,
			0,
			40 + add_y,
			"Current Score",
			{
				...game_data["styles"]["title"],
				fontFamily: "font1",
				fontSize: res["size"],
			}
		);
		temp.setOrigin(0.5);
		// this.add(temp);

		temp = new Phaser.GameObjects.Text(this.scene, 0, 70 + add_y, this.score, {
			fontFamily: "font3",
			fontSize: 60,
			color: "#40190e",
			stroke: "#fff5de",
			strokeThickness: 5,
		});
		temp.setOrigin(0.5);
		this.add(temp);

		// Create an invisible interactive button over the image
		const button = this.scene.add
			.zone(460, 420, 50, 50)
			.setInteractive()
			.setOrigin(0.5); // Match image size and position

		// Add a pointerdown event
		button.on("pointerdown", () => {
			this.handler_close();
		});

		// this.add(button);

		// End screen green button
		// res = game_data["utils"].generate_string({
		// 	scene_id: "game_windows",
		// 	item_id: "level_finished",
		// 	phrase_id: "5",
		// 	values: [],
		// 	base_size: 35,
		// });
		// let button_txt = new Phaser.GameObjects.Text(
		// 	this.scene,
		// 	0,
		// 	-3,
		// 	res["text"],
		// 	{
		// 		...game_data["styles"]["easy_text"],
		// 		fontFamily: "font3",
		// 		fontSize: 23,
		// 	}
		// );
		// button_txt.setOrigin(0.5);
		// this.button_play.add(button_txt);
	},

	handler_close(params) {
		if (!this.closed) {
			this.closed = true;
			game_data["user_data"]["money"] = 0;
			console.log("SUBMIT SCORE", this.score);

			// Define the API endpoint
			// const apiUrl = "http://192.168.195.169:8500/"; // Replace with your actual API URL

			// @TODO
			// Make the POST request
			// fetch(apiUrl, {
			// 	method: "GET",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	// body: JSON.stringify(data), // Convert the data object to a JSON string
			// })
			// 	.then((response) => {
			// 		if (!response.ok) {
			// 			throw new Error("Network response was not ok");
			// 		}
			// 		return response.json(); // Parse the JSON response
			// 	})
			// 	.then((data) => {
			// 		console.log("Success:", data); // Handle the success response
			// 		// You can add any additional logic here based on the response
			// 	})
			// 	.catch((error) => {
			// 		console.error("Error:", error); // Handle any errors
			// 	});

			this.emitter.emit("EVENT", {
				event: "show_scene",
				scene_id: "MAP",
				complete: true,
			});
			this.close_window();
		}
	},

	close_window(event = {}) {
		game_data["utils"].hide_tip();
		game_data["utils"].check_ads("level_lost");
		this.emitter.emit("EVENT", { event: "window_close" });
	},
});
