
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
		this.connections = [];
		
		this.visible = true;
		this.isAlive = true;
	}
	
	connectTo(otherBubble) {
		//will only connect to bubble if it is the same type of bubble
		if(otherBubble.tint == this.tint && otherBubble != this) {
			//if the bubble isn't already connected
			if(!this.connections.includes(otherBubble)) {
				//connect to the bubble
				this.connections.push(otherBubble);
				//there'll be an extra recursion thing back here because of this but it snhould be fine
				otherBubble.connectTo(this);
				//if the bubbble is connected to 2 or more of the same type, delete them.
				if(this.connections.length >= 2) {
					this.deleteThisChain(this);
				}
			}
		}
	}
	disconnectFrom(otherBubble) {
		let index = this.connections.indexOf(otherBubble);
		if(index != -1) {

			//yeets le bubble
			this.connections.splice(index, 1);
			otherBubble.disconnectFrom(this);
		}
	}
	
	//deletes the chain of bubbles this bubble is connected to
	deleteThisChain(parentBubble) {
		for(let i = 0; i < this.connections.length; i++) {
			//deletes first item
			let connection = this.connections.pop();
			
			//so we don't go in circles bouncing between the same bubbles (yay recursion!)
			//if(connection != parentBubble) {
				connection.deleteThisChain(this);
			//}
		}
		//deletes self 
		this.isAlive = false;
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
				
		this.body = Matter.Bodies.circle(x, y, BUBBLE_RADIUS, { friction: 0, angle: rotation, restitution: 0, frictionStatic: 0});
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}
//physics are weird as heck with this one for some reason :/
class LBubble extends Bubble {
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/l-bubble.gif", tint, rotation);
		
		//this.anchor.set(.25, .75);
		
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
			restitution: 0,
			frictionStatic: 0
		});
		
//well i got poly decomp working but it would work worse than what I've got,
//so this isnt gonna be used anymore
//		let points = 
//			" " + (x) + " " + (y) +
//			" " + (x + BUBBLE_DIAMETER) + " " + (y) +
//			" " + (x + BUBBLE_DIAMETER) + " " + (y + BUBBLE_DIAMETER) +
//			" " + (x - BUBBLE_DIAMETER) + " " + (y + BUBBLE_DIAMETER) +
//			" " + (x - BUBBLE_DIAMETER) + " " + (y - BUBBLE_DIAMETER) +
//			" " + (x) + " " + (y - BUBBLE_DIAMETER);
//		
//		let vertices = Matter.Vertices.fromPath(points);
//		
//		this.body = Matter.Bodies.fromVertices(x, y, vertices, {friction: 0, restitution: 0});
			
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
			restitution: 0,
			frictionStatic: 0
		});
//		let vertexSets = [];
//
//		$.get('./media/cross.svg').done(function(data) {	
//			$(data).find('path').each(function(i, path) {
//				vertexSets.push(Matter.Svg.pathToVertices(path));
//			});
//		});
//		
//		this.body = Matter.Bodies.fromVertices(x, y, vertexSets, {restitution: 0, friction: 0});
//		
//		console.log(this.body.position);
//		
		Matter.Body.rotate(this.body, rotation);

		Matter.World.add(world, this.body);
	}
}
class IBubble extends Bubble {
	constructor(x = 0, y = 0, tint, rotation, world) {
		super(x, y, "./media/i-bubble.gif", tint, rotation);
		
		this.body = Matter.Bodies.rectangle(x, y, BUBBLE_DIAMETER * 2, BUBBLE_DIAMETER, {friction: 0, angle: rotation, restitution: 0, frictionStatic: 0})		
		//adds bounds to the world
		Matter.World.add(world, this.body);
	}
}

class Bowl extends PIXI.Sprite {
	constructor(world, worldWidth, worldHeight) {
		super(PIXI.loader.resources["./media/bowl.gif"].texture);
		
		this.anchor.set(.5, .5);
		this.scale.set(2.3, 2.3);
		this.tint = 0x123456;
		this.x = worldWidth/2;
		this.y = worldHeight/2;
		
		//flat
//		this.leftWall = Matter.Bodies.rectangle(180, 200, 80, 200, {isStatic: true, friction: 0});
//		this.leftSlope = Matter.Bodies.rectangle(200, 400, 80, 200, {isStatic: true, friction: 0, angle: Math.PI * -0.25});
//		this.flatPart = Matter.Bodies.rectangle(worldWidth/2, worldHeight - 120, 250, 20, {isStatic: true, friction: 0});
//		this.rightSlope = Matter.Bodies.rectangle(worldWidth - 200, 400, 80, 200, {isStatic: true, friction: 0, angle: Math.PI * 0.25});
//		this.rightWall = Matter.Bodies.rectangle(worldWidth - 180, 200, 80, 200, {isStatic: true, friction: 0});
		
//		Matter.World.add(world, this.leftWall);
//		Matter.World.add(world, this.leftSlope);
//		Matter.World.add(world, this.flatPart);
//		Matter.World.add(world, this.rightSlope);
//		Matter.World.add(world, this.rightWall);
		this.visible = true;
		
		
		//bowl
		$.get('./media/bowl3.svg').done(function(data) {
			let vertexSets = [];
			
			$(data).find('path').each(function(i, path) {
				vertexSets.push(Matter.Svg.pathToVertices(path));
			});
			this.body = Matter.Bodies.fromVertices(worldWidth/2, worldHeight * 3/4, vertexSets, {isStatic: true, friction: 0, frictionStatic: 0})
			console.log(this.body.position);

			Matter.World.add(world, this.body);
		});
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