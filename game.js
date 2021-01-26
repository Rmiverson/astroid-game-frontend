const FPS = 60 //frames per second
const S_SIZE = 30 //ship size
const SHIP_ACC = 5 //acceleration
const R_SPEED = 420 //rotation speed
const FR = 0.5 //friction

// gets canvas elements for js use
let c = document.getElementById("gameScreen")
let ctx = c.getContext("2d")

// sets ship attributes
let ship = {
   x: c.width / 2, //ship x position
   y: c.height / 2, //ship y position
   r: S_SIZE / 2, //ship radius or size
   a: 0 / 180 * Math.PI, //angle of the ship
   rotation: 0, //rotation speed
   thrusting: false, //whether this ship is thrusting
   thrust: { //thrust values in x and y
      x: 0,
      y: 0
   }
}

//sets our canvas size to the current screen size
c.width = window.innerWidth
c.height = window.innerHeight

//use for menue elements to run the game
const runGame = () => {
   shipListeners()
   setInterval(renderGame, 1000 / FPS)
}

//sets the screen color and renders elements for the game
const renderGame = () => {
   ctx.fillStyle = "#2d2d2d"
   ctx.fillRect(0, 0, c.width, c.height)
   
   renderShip()
}

//draws the ship and calls function to handle movement
const renderShip = () => {
   moveShip()

   ctx.fillStyle = "white"
   let path = new Path2D()
   path.moveTo(
      ship.x + ship.r * Math.cos(ship.a),
      ship.y - ship.r * Math.sin(ship.a)
   )
   
   path.lineTo(
      ship.x - ship.r * (Math.cos(ship.a) + Math.sin(ship.a)),
      ship.y + ship.r * (Math.sin(ship.a) - Math.cos(ship.a))
   )

   path.lineTo(
      ship.x - ship.r * (Math.cos(ship.a) - Math.sin(ship.a)),
      ship.y + ship.r * (Math.sin(ship.a) + Math.cos(ship.a))
   )
   ctx.fill(path)
}

//handles movement based on ship thrust and angle values
const moveShip = () => {
   if (ship.thrusting) {
      ship.thrust.x += SHIP_ACC * Math.cos(ship.a) / FPS
      ship.thrust.y -= SHIP_ACC * Math.sin(ship.a) / FPS
   } else {
      ship.thrust.x -= FR * ship.thrust.x / FPS
      ship.thrust.y -= FR * ship.thrust.y / FPS
   }

   ship.a += ship.rotation
   ship.x += ship.thrust.x
   ship.y += ship.thrust.y

   // handles edge position for ship
   if (ship.x < 0 - ship.r) {
      ship.x = c.width + ship.r
   } else if (ship.x > c.width + ship.r) {
      ship.x = 0 - ship.r
   }

   if (ship.y < 0 - ship.r) {
      ship.y = c.height + ship.r
   } else if (ship.y > c.height + ship.r) {
      ship.y = 0 - ship.r
   }

}

// listens for key presses
const shipListeners = () => {
   document.addEventListener("keydown", keyDown)
   document.addEventListener("keyup", keyUp)
}

const keyDown = (e) => {
   switch(e.keyCode) {
      case 87: //w
         ship.thrusting = true
         break
      case 65: //a
         ship.rotation = R_SPEED / 180 * Math.PI / FPS
         break
      case 68: //d
         ship.rotation = -R_SPEED / 180 * Math.PI / FPS
         break
   }
}

const keyUp = (e) => {
   switch(e.keyCode) {
      case 87: //w
         ship.thrusting = false
         break
      case 65: //a
         ship.rotation = 0
         break
      case 68: //d
         ship.rotation = 0
         break
   }
}
