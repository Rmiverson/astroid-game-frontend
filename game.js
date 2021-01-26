const FPS = 60 //frames per second
const S_SIZE = 30 //ship size
const SHIP_ACC = 5 //acceleration
const R_SPEED = 420 //rotation speed
const FR = 0.5 //friction
const ASTEROID_NUM = 5 // starting number of asteroids
const ASTEROID_SPEED = 50 // max starting asteroid speed in pixels per second
const ASTEROID_SIZE = 100 // starting size in pixels
const ASTEROIDS_VERT = 10 // avg num of vertices on each asteroid
const ASTEROIDS_JAG = 0.5 // adds jaggedness to polygons

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
   let asteroids = []
   createAsteroids()
   setInterval(renderGame, 1000 / FPS)
}

//sets the screen color and renders elements for the game
const renderGame = () => {
   ctx.fillStyle = "#2d2d2d"
   ctx.fillRect(0, 0, c.width, c.height)
   
   renderShip()
   renderAsteroids()
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

//asteroids function
const createAsteroids = () => {
   asteroids = []
   let x, y
   for (let i = 0; i < ASTEROID_NUM; i++) {
      do {
      x = Math.floor(Math.random() * c.width)
      y = Math.floor(Math.random() * c.height)
      } while (distBetweenPoints(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + ship.r)
      asteroids.push(newAsteroid(x, y))
   }
}

const distBetweenPoints = (x1, y1, x2, y2) => {
   return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 -y1, 2))
}

const newAsteroid = (x, y) => {
   let asteroid = {
      x: x,
      y: y,
      xv: Math.random() * ASTEROID_SPEED / FPS * (Math.random () < 0.5 ? 1 : -1),
      yv: Math.random() * ASTEROID_SPEED / FPS * (Math.random () < 0.5 ? 1 : -1),
      r: ASTEROID_SIZE / 2,
      a: Math.random() * Math.PI * 2, // in radians
      vert: Math.floor(Math.random() * (ASTEROIDS_VERT + 1) + ASTEROIDS_VERT / 2),
      offs: []
   }
   for (let i = 0; i < asteroid.vert; i++) {
      asteroid.offs.push(Math.random() * ASTEROIDS_JAG * 2 + 1 - ASTEROIDS_JAG)
   }

   return asteroid
}

//draws the asteroids
const renderAsteroids = () => {
   ctx.strokeStyle = "grey"
   ctx.lineWidth = S_SIZE / 20
   let x, y, r, a, vert, offs
   for (let i = 0; i < asteroids.length; i++) {
      //get the asteroid properties
      x = asteroids[i].x
      y = asteroids[i].y
      r = asteroids[i].r
      a = asteroids[i].a
      vert = asteroids[i].vert
      offs = asteroids[i].offs

      //draw path
      ctx.beginPath()
      ctx.moveTo(
         x + r * offs[0] * Math.cos(a),
         y + r * offs[0] * Math.sin(a)
      )
      // draw polygon
      for (let j = 0; j < vert; j++) {
         ctx.lineTo(
            x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
            y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
         )
      }
      ctx.closePath()
      ctx.stroke()
   
   
      //move asteroid
      asteroids[i].x += asteroids[i].xv
      asteroids[i].y += asteroids[i].yv

      //handle edge of screen
      if (asteroids[i].x < 0 - asteroids[i].r) {
         asteroids[i].x = c.width + asteroids[i].r
      } else if (asteroids[i].x > c.width + asteroids[i].r) {
         asteroids[i].x = 0 - asteroids[i].r
      }

      if (asteroids[i].y < 0 - asteroids[i].r) {
         asteroids[i].y = c.height + asteroids[i].r
      } else if (asteroids[i].y > c.height + asteroids[i].r) {
         asteroids[i].y = 0 - asteroids[i].r
      }
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
