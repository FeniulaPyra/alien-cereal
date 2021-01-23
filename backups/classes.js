class Bubble extends PIXI.Sprite {
	constructor(x = 0, y = 0, texture) {
		super(PIXI.loader.resources[texture].texture);
		//pixi stuff
		this.anchor.set(.5, .5);
		//this.scale.set(.1);
		this.x = x;
		this.y = y;
		this.visible = true;
		this.isAlive = true;
		
		this.body;
		
	}
	getConnections() {
		//loop through connections
		//check for connections' connections
		//if connections' connections aren't alread in array, add them
		//oh boy RECURSION :D D:
	}
	getCollision(otherBubble) {
		
	}
	deleteConnections() {
		//oh boy MORE RECURSION :D D:
	}
	
	syncPosition() {
		this.x = this.body.position.x;
		this.y = this.body.position.y;
		this.rotation = this.body.angle;
	}
}

class OBubble extends Bubble { 
	constructor(x = 0, y = 0) {
		super(x, y, "./media/o-bubble.gif", world);
		
		this.body = Matter.Bodies.circle(x, y, 30, { friction: 0});
		
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}
class LBubble extends Bubble {
	constructor(x = 0, y = 0) {
		super(x, y, "./media/l-bubble.gif");
		//this.body = Matter.
	}
}
class XBubble extends Bubble {
	constructor(x = 0, y = 0) {
		super(x, y, "./media/x-bubble.gif");

	}
}
class IBubble extends Bubble {
	constructor(x = 0, y = 0) {
		super(x, y, "./media/i-bubble.gif");

	}
}

class Bowl extends PIXI.Sprite {
	constructor(world, worldWidth, worldHeight) {
		super(PIXI.loader.resources["./media/bowl.gif"].texture);
		
		this.anchor.set(.5, .5);
		this.scale.set(2, 1.5);
		this.tint = 0x123456;
		this.x = worldWidth/2;
		this.y = worldHeight/2;
		
		//flat
		this.leftWall = Matter.Bodies.rectangle(180, 200, 80, 200, {isStatic: true, friction: 0});
		this.leftSlope = Matter.Bodies.rectangle(200, 400, 80, 200, {isStatic: true, friction: 0, angle: Math.PI * -0.25});
		this.flatPart = Matter.Bodies.rectangle(worldWidth/2, worldHeight - 120, 250, 20, {isStatic: true, friction: 0});
		this.rightSlope = Matter.Bodies.rectangle(worldWidth - 200, 400, 80, 200, {isStatic: true, friction: 0, angle: Math.PI * 0.25});
		this.rightWall = Matter.Bodies.rectangle(worldWidth - 180, 200, 80, 200, {isStatic: true, friction: 0});
		
		//gotta figure this part out
		//this.body = Matter.Body.create({
		//	parts: [leftWall, flatPart]
		//});
		
		Matter.World.add(world, this.leftWall);
		Matter.World.add(world, this.leftSlope);
		Matter.World.add(world, this.flatPart);
		Matter.World.add(world, this.rightSlope);
		Matter.World.add(world, this.rightWall);
		this.visible = true;
		//left wall
		//bounds.push(Matter.Bodies.rectangle());
		//left slope
		//bounds.push(Matter.Bodies.rectangle());
		//flat
		//bounds.push(Matter.Bodies.rectangle());
		//right slope
		//bounds.push(Matter.Bodies.rectangle());
		//right wall
		//bounds.push(Matter.Bodies.rectangle());
	}
}