let BUBBLE_TYPES = [
	0xFFFFFF,
	0xFF0000,
	0x0000FF,
	0x00FF00,
	0xFF00FF
	//0x00FFFF,
	//0xFFFF00,
	//0xAAAAAA
]

//matterjs stuff
//so I don't have to keep typing Matter.[something]
let Composite = Matter.Composite;
let Engine = Matter.Engine;
let Events = Matter.Events;
//let Render = Matter.Render;
let Runner = Matter.Runner;
let Mouse = Matter.Mouse;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Vector = Matter.Vector;

//world stuff
let engine = Engine.create();
let world = engine.world;
engine.world.gravity.y = 1;
let WORLD_WIDTH = 800;
let WORLD_HEIGHT = 600;

//let runner = Runner.create();
//Runner.run(runner, engine);

//collision stuff
Events.on(engine, "collisionStart", connectBubbles);
Events.on(engine, "collisionEnd", disconnectBubbles);

//pixijs stuff
const app = new PIXI.Application(WORLD_WIDTH, WORLD_HEIGHT);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let state;
let startScene;
let helpScene;
let gameScene; 
let gameOverScene;

let bubbles = [];
let bubbleBodies = [];
let bowl;
let previewBubble;

let difficulty = 1;
let isTimed = true;
let startTime = 0;
let timeLimit = 60000;
let endTime = 0;
let currentTime = 0;
let startState = true;
let score = 0;

//prevents bubbles that matching at the start from counting towards score 
let hasPlayerInteracted = false;

let difficultyLabel;
let totalChainsLabel;
let totalBubblesLeftLabel;
let timerLabel;

PIXI.loader.
add("./media/o-bubble.gif", "./media/o-bubble.gif").
add("./media/l-bubble.gif", "./media/l-bubble.gif").
add("./media/i-bubble.gif", "./media/i-bubble.gif").
add("./media/x-bubble.gif", "./media/x-bubble.gif").
add("./media/bowl.gif", "./media/bowl.gif").
on("progress", e=>{console.log(`progress=${e.progress}`)}).
load(setup);

app.view.onmousedown = createBubble;

document.onkeydown = rotatePreview;

//add all the bodies n stuff

function setup() {
	resources = PIXI.loader.resources;
	stage = app.stage;
	
	//start scene
	startScene = new PIXI.Container();
	createStartLables();
	startScene.visible = true;
	stage.addChild(startScene);
	
	//help scene
	helpScene = new PIXI.Container();
	createHelpLabels();
	helpScene.visible = false;
	stage.addChild(helpScene);
	
	//game scene
	gameScene = new PIXI.Container();
	createGameLabels();
	stage.addChild(gameScene);
	bowl = new Bowl(world, WORLD_WIDTH, WORLD_HEIGHT);
	gameScene.addChild(bowl);
	gameScene.visible = false;	
	app.ticker.add(gameLoop);

	//gameOver Scene
	gameOverScene = new PIXI.Container();
	createGameOverLabels();
	gameOverScene.visible = false;
	stage.addChild(gameOverScene);
}

let buttonStyle = new PIXI.TextStyle({
	fill: 0x0000FF,
	fontSize: 48,
	fontFamily: "Futura"
});

let textStyle = new PIXI.TextStyle({
	fill: 0x0000FF,
	fontSize: 24,
	fontFamily: "Futura",
	stroke: 0x8888FF,
	strokeThickness: 6,
})

function createStartLables() {
	//buttons
	let startTimedButton = new PIXI.Text("[Start Timed]");
	designButton(startTimedButton, buttonStyle, startScene);
	startTimedButton.x = WORLD_WIDTH/4;
	startTimedButton.y = WORLD_HEIGHT * 7/8;
	startTimedButton.on("pointerup", startGameTimed);
	startScene.addChild(startTimedButton);
	
	let startUntimedButton = new PIXI.Text("[Start Untimed]");
	designButton(startUntimedButton, buttonStyle, startScene);
	startUntimedButton.x = WORLD_WIDTH * 3/4;
	startUntimedButton.y = WORLD_HEIGHT * 7/8;
	startUntimedButton.on("pointerup", startGameUntimed);
	startScene.addChild(startUntimedButton);
	
	let difficultyUpButton = new PIXI.Text("^");
	designButton(difficultyUpButton, buttonStyle, startScene);
	difficultyUpButton.x = WORLD_WIDTH/2;
	difficultyUpButton.y = WORLD_HEIGHT/2 - 100;
	difficultyUpButton.on("pointerup", increaseDifficulty);
	startScene.addChild(difficultyUpButton);
	difficultyUpButton.visible = false;
	
	let difficultyDownButton = new PIXI.Text("v");
	designButton(difficultyDownButton, buttonStyle, startScene);
	difficultyDownButton.x = WORLD_WIDTH/2;
	difficultyDownButton.y = WORLD_HEIGHT/2 + 100;
	difficultyDownButton.on("pointerup", decreaseDifficulty);
	startScene.addChild(difficultyDownButton);
	difficultyDownButton.visible = false;
	
	let helpButton = new PIXI.Text("[Help]");
	designButton(helpButton, buttonStyle, startScene);
	helpButton.x = 70;
	helpButton.y = 15;
	helpButton.on("pointerup", function(e){helpScene.visible = true; startScene.visible = false;});
	
	
	//labels
	let title = new PIXI.Text("Alien Cereal");
	title.style = textStyle;
	title.x = WORLD_WIDTH/2;
	title.y = WORLD_HEIGHT/8;
	title.anchor.x = .5
	startScene.addChild(title);
	
	difficultyLabel = new PIXI.Text("Difficulty: " + difficulty);
	difficultyLabel.style = textStyle;
	difficultyLabel.x = WORLD_WIDTH/2;
	difficultyLabel.y = WORLD_HEIGHT/2;
	difficultyLabel.anchor.x = .5;
	startScene.addChild(difficultyLabel);
	difficultyLabel.visible = false;
}
function createHelpLabels() {
	let title = new PIXI.Text("Help:");
	title.style = textStyle;
	title.x = WORLD_WIDTH/2;
	title.y = WORLD_HEIGHT/4;
	title.anchor.x = .5;
	helpScene.addChild(title);
	
	let info = new PIXI.Text("Try to clear all the bubbles. \nAim with mouse and Click to drop a bubble.\n'A' to rotate bubble counter-clockwise.\n'D' to rotate bubble clockwise.");
	info.style = textStyle;
	info.x = WORLD_WIDTH/2;
	info.y = WORLD_HEIGHT/2;
	info.anchor.x = .5;
	helpScene.addChild(info);
	
	let backButton = new PIXI.Text("[Back]");
	designButton(backButton, buttonStyle, helpScene);
	backButton.y = WORLD_WIDTH/2;
	backButton.x = WORLD_HEIGHT * 7/8;
	backButton.on("pointerup", function(e){startScene.visible = true; helpScene.visible = false;});
}
function createGameLabels() {
	timerLabel = new PIXI.Text("Time: ");
	timerLabel.style = textStyle;
	timerLabel.x = 32;
	timerLabel.y = WORLD_HEIGHT - 32;
	gameScene.addChild(timerLabel);
}
function createGameOverLabels() {
	let gameOverLabel = new PIXI.Text("Game Over!");
	gameOverLabel.style = textStyle;
	gameOverLabel.x = WORLD_WIDTH/2;
	gameOverLabel.y = WORLD_HEIGHT/8;
	gameOverLabel.anchor.x = .5;
	gameOverScene.addChild(gameOverLabel);
	
	totalChainsLabel = new PIXI.Text("");
	totalChainsLabel.style = textStyle;
	totalChainsLabel.x = WORLD_WIDTH/2;
	totalChainsLabel.y = WORLD_HEIGHT/2 - 100;
	totalChainsLabel.anchor.x = .5;
	gameOverScene.addChild(totalChainsLabel);
	
	totalBubblesLeftLabel = new PIXI.Text("");
	totalBubblesLeftLabel.style = textStyle;
	totalBubblesLeftLabel.x = WORLD_WIDTH/2;
	totalBubblesLeftLabel.y = WORLD_HEIGHT/2 + 50;
	totalBubblesLeftLabel.anchor.x = .5;
	gameOverScene.addChild(totalBubblesLeftLabel);
	
	let backButton = new PIXI.Text("[Back]");
	designButton(backButton, buttonStyle, gameOverScene);
	backButton.x = WORLD_WIDTH/2;
	backButton.y = WORLD_HEIGHT * 7/8;
	backButton.anchor.x = .5;
	backButton.on("pointerup", function(e){startScene.visible = true; gameOverScene.visible = false;});
}

function increaseDifficulty() {
	if(difficulty < 3) {
		difficulty++;
	}
	else {
		difficulty = 1;
	}
	difficultyLabel.text = "Difficulty: " + difficulty;
}
function decreaseDifficulty() {
	if(difficulty > 1) {
		difficulty--;
	}
	else {
		difficulty = 3;
	}
	difficultyLabel.text = "Difficulty: " + difficulty;

}

function designButton(button, buttonStyle, scene) {
	button.style = buttonStyle;
	button.interactive = true;
	button.buttonMode = true;
	button.on("pointerover", e=>e.target.alpha = .7);
	button.on("pointerout", e=>e.currentTarget.alpha = 1);
	button.anchor.x = .5;
	scene.addChild(button);
}

function startGameTimed() {
	isTimed = true;
	endTime = new Date().getTime() + timeLimit;
	startGame();
}
function startGameUntimed() {
	isTimed = false;
	startGame();
}
function startGame() {
	bubbles = [];
	bubbleBodies = [];
	startTime = new Date().getTime();
	hasPlayerInteracted = false;
	//generates starting bubbles
	createStartingBubbles();
	
	for(let i = 0; i < gameScene.children.length; i++) {
		//this is the stupidest way to do this, but we're making sure its a bubble here
		if(gameScene.children[i].__proto__.constructor.name.length == 7) {
			if(!bubbles.includes(gameScene.children[i])) {
				gameScene.removeChild(gameScene.children[i]);
				i--;
			}
		}
	}
	
	let mousePos = app.renderer.plugins.interaction.mouse.global;
	generateNewBubble(mousePos.x, mousePos.y);
	startScene.visible = false;
	gameScene.visible = true;
}
function createStartingBubbles() {
	for(let i = 0; i < 15; i++) {
		let newTint = BUBBLE_TYPES[Math.floor(Math.random() * BUBBLE_TYPES.length)];// - (3 + difficulty))];
		let bub;
		let x = Math.floor(Math.random() * WORLD_WIDTH/4 + WORLD_WIDTH/3);
		let y = Math.floor(Math.random() * -40 + 10);
		
		switch(Math.floor(Math.random() * 4)) {
			case 0:
				bub = new OBubble(x, y, newTint, 0, world);
				break;
			case 1:
				bub = new LBubble(x, y, newTint, 0, world);
				break;
			case 2:
				bub = new IBubble(x, y, newTint, 0, world);
				break;
			case 3:
				bub = new XBubble(x, y, newTint, 0, world);
				break;
			default:
				bub = new OBubble(x, y, newTint, 0, world);
				break;
		}
		bubbles.push(bub);
		bubbleBodies.push(bub.body);
		gameScene.addChild(bub);
		hasPlayerInteracted = false;
	}
	hasPlayerInteracted = false;
}
function createBubble() {
	if(gameScene.visible) {
		//allows scoring to start
		let mousePos = app.renderer.plugins.interaction.mouse.global;
		hasPlayerInteracted = true;
		console.log("boop" + gameScene.visible);

		let bubble = previewBubble.dropBubble(world);//new OBubble(mousePos.x, mousePos.y, );//new Bubble(mousePos.x, mousePos.y, "./media/o-bubble.gif", world);//PIXI.renderer.plugins.interaction.mouse.global));
		gameScene.addChild(bubble);
		bubbles.push(bubble);
		bubbleBodies.push(bubble.body);
		generateNewBubble(mousePos);
	}
}
function gameLoop() {
	if(gameScene.visible) {
		//timer stuff
		if(isTimed) {
			currentTime = new Date().getTime();
			timerLabel.text = Math.floor((endTime - currentTime)/1000) + " sec";
		}
		else {
			timerLabel.text = "Untimed";
		}
		
		//controls
		let mousePos = app.renderer.plugins.interaction.mouse.global;
		previewBubble.moveTo(mousePos.x, WORLD_HEIGHT/8);

		//sync with matterjs
		Engine.update(engine);

		for(let i = 0; i < bubbles.length; i++) {
			bubbles[i].syncPosition();
		}

		//deyeets the bubbles
		for(let i = 0; i < bubbles.length; i++) {
			let bubble = bubbles[i];
			if(bubble.y > WORLD_HEIGHT) {
				bubble.isAlive = false;
				if(hasPlayerInteracted)
					score--;
			}
			if(bubble.isAlive == false) {
				if(hasPlayerInteracted)
					score++;
				gameScene.removeChild(bubble);
				Composite.remove(world, bubbleBodies[i]);
				bubbles.splice(i, 1);
				bubbleBodies.splice(i, 1);
			}
		}
		
		//endgame conditions
		if(isTimed && endTime - currentTime < 0 || bubbles.length == 0) {
			endGame();
		}
	}
}
function rotatePreview(e) {
	if(e.keyCode == 65)
		previewBubble.rotateCounterClockwise();
	else if(e.keyCode == 68)
		previewBubble.rotateClockwise();
}
function generateNewBubble(mousePos) {
	let newTint = BUBBLE_TYPES[Math.floor(Math.random() * BUBBLE_TYPES.length)];// - (3 + difficulty))];
	let newShape = ("olix").charAt(Math.floor(Math.random() * 4));
	
	gameScene.removeChild(previewBubble);
	
	previewBubble = new BubblePreview(mousePos.x, mousePos.y, "" + newShape, newTint);
	gameScene.addChild(previewBubble);
}
function connectBubbles(e) {
	let bubs = e.pairs;
	
	for(let i = 0; i < bubs.length; i++) {
		let bub1Bod = bubs[i].bodyA.parent;
		let bub2Bod = bubs[i].bodyB.parent;
		
		//makes sure collisison is between 2 bubbles and not the bowl and a bubble or the bowl and itself
		if(bubbleBodies.includes(bub1Bod) && bubbleBodies.includes(bub2Bod)) {

			let bub1 = bubbles[bubbleBodies.indexOf(bub1Bod)];
			let bub2 = bubbles[bubbleBodies.indexOf(bub2Bod)];

			bub1.connectTo(bub2);
			bub2.connectTo(bub1);
		}
	}
}
function disconnectBubbles(e) {
	let bubs = e.pairs;
	
	for(let i = 0; i < bubs.length; i++) {
		let bub1Bod = bubs[i].bodyA.parent;
		let bub2Bod = bubs[i].bodyB.parent;
		
		//makes sure collisison is between 2 bubbles and not the bowl and a bubble or the bowl and itself
		if(bubbleBodies.includes(bub1Bod) && bubbleBodies.includes(bub2Bod)) {

			let bub1 = bubbles[bubbleBodies.indexOf(bub1Bod)];
			let bub2 = bubbles[bubbleBodies.indexOf(bub2Bod)];

			bub1.disconnectFrom(bub2);
			bub2.disconnectFrom(bub1);
		}
	}
}

function endGame() {
	gameScene.visible = false;
	gameOverScene.visible = true;
	totalBubblesLeftLabel.text = "Total Bubbles Left: " + bubbles.length;
	totalChainsLabel.text = "Score: " + score;
	
	for(let bubbleBody of bubbleBodies) {
		Composite.remove(world, bubbleBody);
	}
	for(let bubble of bubbles) {
		gameScene.removeChild(bubble);
	}
	
	bubbleBodies = [];
	bubbles = [];

	score = 0;
}
