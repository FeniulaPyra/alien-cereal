
//DO. NOT. TOUCH. ANY MORE OF THE NUMBERS. THEY WORK FINE NOW.
let BUBBLE_SCALE = .5;
let BUBBLE_RADIUS = 27 * BUBBLE_SCALE;
let BUBBLE_DIAMETER = BUBBLE_RADIUS * 2;

class Bubble extends PIXI.Sprite {
	constructor(x = 0, y = 0, texture, tint) {
		super(PIXI.loader.resources[texture].texture);
		//pixi stuff
		this.anchor.set(.5, .5);
		this.scale.set(BUBBLE_SCALE);
		this.x = x;
		this.y = y;
		this.tint = tint;
		this.body;
		
		this.visible = true;
		this.isAlive = true;
	}
	
	connectTo(otherBubble) {
		
	}
	disconnectFrom(otherBubble) {
		
	}
	
	syncPosition() {
		this.x = this.body.position.x;
		this.y = this.body.position.y;
		this.rotation = this.body.angle;
	}
}

class OBubble extends Bubble { 
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/o-bubble.gif", tint);
				
		this.body = Matter.Bodies.circle(x, y, BUBBLE_RADIUS, { friction: 0, angle: rotation, restitution: 0});
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}
//physics are weird as heck with this one for some reason :/
class LBubble extends Bubble {
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/l-bubble.gif", tint, rotation);
		
		//let topCircle = Matter.Bodies.circle(x - BUBBLE_DIAMETER, y - BUBBLE_DIAMETER, BUBBLE_RADIUS);
		//let cornerCircle = Matter.Bodies.circle(x - BUBBLE_DIAMETER, y + BUBBLE_DIAMETER, BUBBLE_RADIUS);
		//let bottomCircle = Matter.Bodies.circle(x + BUBBLE_DIAMETER, y + BUBBLE_DIAMETER, BUBBLE_RADIUS);
		
		//let vertical = Matter.Bodies.rectangle(x - BUBBLE_RADIUS, y, BUBBLE_DIAMETER, BUBBLE_DIAMETER * 2, {chamfer: 10});
		//let horizontal = Matter.Bodies.rectangle(x, y + BUBBLE_RADIUS, BUBBLE_DIAMETER * 2, BUBBLE_DIAMETER, {chamfer: 10});
		
		let vert = Matter.Bodies.rectangle(x - BUBBLE_DIAMETER, y, BUBBLE_DIAMETER, BUBBLE_DIAMETER * 2);
		let hori = Matter.Bodies.rectangle(x, y + BUBBLE_DIAMETER, BUBBLE_DIAMETER * 2, BUBBLE_DIAMETER);
		
		this.body = Matter.Body.create({
			//parts: [topCircle, cornerCircle, bottomCircle, vertical, horizontal],
			parts: [vert, hori],
			friction: 0,
			//angle: rotation,
			restitution: 0
		});
		
		Matter.Body.rotate(this.body, rotation);
		//.circle(x, y, BUBBLE_RADIUS, { friction: 0, angle: rotation});		
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}
class XBubble extends Bubble {
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/x-bubble.gif", tint, rotation);
		
		let vertical = Matter.Bodies.rectangle(x, y, BUBBLE_DIAMETER, BUBBLE_DIAMETER * 3);
		let horizontal = Matter.Bodies.rectangle(x, y, BUBBLE_DIAMETER * 3, BUBBLE_DIAMETER);
		
		this.body = Matter.Body.create({
			parts: [vertical, horizontal],
			friction: 0,
			//angle: rotation,
			restitution: 0
		});
		Matter.Body.rotate(this.body, rotation);
		//.circle(x, y, BUBBLE_RADIUS, { friction: 0, angle: rotation});
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}
class IBubble extends Bubble {
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/i-bubble.gif", tint, rotation);
		
		this.body = Matter.Bodies.rectangle(x, y, BUBBLE_DIAMETER * 2, BUBBLE_DIAMETER, {friction: 0, angle: rotation, restitution: 0})		
		//adds bounds to the world
		Matter.World.add(world, this.body);
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
		//left slope
		//bounds.push(Matter.Bodies.rectangle());
		//left wall
		//bounds.push(Matter.Bodies.rectangle());
		//flat
		//bounds.push(Matter.Bodies.rectangle());
		//right slope
		//bounds.push(Matter.Bodies.rectangle());
		//right wall
		//bounds.push(Matter.Bodies.rectangle());
	}
}

class BubblePreview extends PIXI.Sprite {
	constructor(x = 0, y = 0, bubbleCharType, tint) {
		super(PIXI.loader.resources["./media/" + bubbleCharType + "-bubble.gif"].texture);
		this.bubbleType = bubbleCharType;
		this.rotation = 0;
		this.anchor.set(.5, .5);
		this.scale.set(BUBBLE_SCALE);
		this.tint = tint;
		this.x = x;
		this.y = y;
		this.visible = true;

	}
	
	moveTo(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
	rotateClockwise() {
		this.rotation -= Math.PI/30;
	}
	rotateCounterClockwise() {
		this.rotation += Math.PI/30;
	}
	
	dropBubble(world) {
		
		console.log("outgoing rot: " + this.rotation);
		
		switch(this.bubbleType) {
			case 'o':
				return new OBubble(this.x, this.y, this.tint, this.rotation, world);
				break;
			case 'l':
				return new LBubble(this.x, this.y, this.tint, this.rotation, world);
				break;
			case 'i':
				return new IBubble(this.x, this.y, this.tint, this.rotation, world);
				break;
			case 'x':
				return new XBubble(this.x, this.y, this.tint, this.rotation, world);
				break;
			default:
				return new OBubble(this.x, this.y, this.tint, this.rotation, world);
				break;
		}
	}
}