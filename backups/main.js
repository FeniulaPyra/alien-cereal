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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~pixijs stuff
const app = new PIXI.Application(WORLD_WIDTH, WORLD_HEIGHT);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let gameScene; 

let bubbles = [];
let bowl;

PIXI.loader.
add("./media/o-bubble.gif", "./media/o-bubble.gif").
add("./media/l-bubble.gif", "./media/l-bubble.gif").
add("./media/i-bubble.gif", "./media/i-bubble.gif").
add("./media/x-bubble.gif", "./media/x-bubble.gif").
add("./media/bowl.gif", "./media/bowl.gif").
on("progress", e=>{console.log(`progress=${e.progress}`)}).
load(setup);

app.view.onclick = createBubble;

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
}

function createBubble() {
	let mousePos = app.renderer.plugins.interaction.mouse.global;

	let bubble = new OBubble(mousePos.x, mousePos.y);//new Bubble(mousePos.x, mousePos.y, "./media/o-bubble.gif", world);//PIXI.renderer.plugins.interaction.mouse.global));
	gameScene.addChild(bubble);
	bubbles.push(bubble);
}

function gameLoop() {
	let mousePos = app.renderer.plugins.interaction.mouse.global;

	//bowl.x = mousePos.x;
	//bowl.y = mousePos.y;
	
	for(let i = 0; i < bubbles.length; i++) {
		bubbles[i].syncPosition();
	}
	
	//deyeets the bubbles
	for(let bubble of bubbles) {
		if(bubble.y > WORLD_HEIGHT) {
			gameScene.removeChild(bubble);
			Matter.Composite.remove(world, bubble);
			bubble.isAlive = false;
			console.log("deleting bub");
		}
	}
	bubbles = bubbles.filter(b => (b.isAlive));

}