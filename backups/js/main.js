let BUBBLE_TYPES = [
	0xFFFFFF,
	0xFF0000,
	0x0000FF,
	0x00FF00,
	0xFF00FF
]


//matterjs stuff
//so I don't have to keep typing Matter.[something]
let Engine = Matter.Engine;
//let Render = Matter.Render;
let Runner = Matter.Runner;
let Composites = Matter.Composites;
let Constraint = Matter.Constraint;
let MouseConstraint = Matter.MouseConstraint;
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


/* this uses canvas so nope
let render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: WORLD_WIDTH,
		height: WORLD_HEIGHT,
		showAngleIndicator: true,
		showCollisions: true,
		showVelocity: true
	}
});

Render.run(render);
*/

let runner = Runner.create();
Runner.run(runner, engine);

//TODO collision/connecting bubbles stuff
//Events.on(engine, "collisionStart", connectBubbles);
//Events.on(engine, "collisionEnd", disconnectBubbles);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~pixijs stuff
const app = new PIXI.Application(WORLD_WIDTH, WORLD_HEIGHT);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let gameScene; 

let bubbles = [];
let bubbleBodies = [];
let bowl;
let previewBubble;

PIXI.loader.
add("./media/o-bubble.gif", "./media/o-bubble.gif").
add("./media/l-bubble.gif", "./media/l-bubble.gif").
add("./media/i-bubble.gif", "./media/i-bubble.gif").
add("./media/x-bubble.gif", "./media/x-bubble.gif").
add("./media/bowl.gif", "./media/bowl.gif").
on("progress", e=>{console.log(`progress=${e.progress}`)}).
load(setup);

app.view.onclick = createBubble;

document.onkeydown = rotatePreview;

//add all the bodies n stuff

function setup() {
	resources = PIXI.loader.resources;
	bowl = new Bowl(world, WORLD_WIDTH, WORLD_HEIGHT);
	
	stage = app.stage;
	
	gameScene = new PIXI.Container();
	stage.addChild(gameScene);
	gameScene.visible = true;
	
	gameScene.addChild(bowl);
	
	app.ticker.add(gameLoop);
	
	for(let i = 0; i < 15; i++) {
		//let tempBub = 
	}
	
	//generates first bubble
	let mousePos = app.renderer.plugins.interaction.mouse.global;
	generateNewBubble(mousePos.x, mousePos.y);
}

function createBubble() {
	let mousePos = app.renderer.plugins.interaction.mouse.global;

	let bubble = previewBubble.dropBubble(world);//new OBubble(mousePos.x, mousePos.y, );//new Bubble(mousePos.x, mousePos.y, "./media/o-bubble.gif", world);//PIXI.renderer.plugins.interaction.mouse.global));
	gameScene.addChild(bubble);
	bubbles.push(bubble);
	bubbleBodies.push(bubble.body);
	generateNewBubble(mousePos);
}

function gameLoop() {
	let mousePos = app.renderer.plugins.interaction.mouse.global;

	previewBubble.moveTo(mousePos.x, mousePos.y);
	
	for(let i = 0; i < bubbles.length; i++) {
		bubbles[i].syncPosition();
	}
	
	//deyeets the bubbles
	for(let i = 0; i < bubbles.length; i++) {
		let bubble = bubbles[i];
		if(bubble.y > WORLD_HEIGHT) {
			gameScene.removeChild(bubble);
			Matter.Composite.remove(world, bubble);
			bubble.isAlive = false;
			bubbles.splice(i, 1);
			bubbleBodies.splice(i, 1);
			console.log("deleting bub");
		}
	}
	//bubbles = bubbles.filter(b => (b.isAlive));

}

function rotatePreview(e) {
	if(e.keyCode == 65)
		previewBubble.rotateCounterClockwise();
	else if(e.keyCode == 68)
		previewBubble.rotateClockwise();
}

function generateNewBubble(mousePos) {
	let newTint = BUBBLE_TYPES[Math.floor(Math.random() * BUBBLE_TYPES.length)];
	let newShape = ("olix").charAt(Math.floor(Math.random() * 4));
	
	gameScene.removeChild(previewBubble);
	
	previewBubble = new BubblePreview(mousePos.x, mousePos.y, "" + newShape, newTint);
	gameScene.addChild(previewBubble);
}

function connectBubbles(e) {
	let bubs = e.pairs;
	
	for(let i = 0; i < bubs.length; i++) {
		//bubs[i][0].connectTo()
	}
}

function disconnectBubbles(e) {
	
}