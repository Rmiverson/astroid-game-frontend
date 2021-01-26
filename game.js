const FPS = 30
const S_SIZE = 30
const R_SPEED = 420

const runGame = () => {
   shipListeners()
   setInterval(renderGame, 1000 / FPS)
}

let c = document.getElementById("gameScreen")
let ctx = c.getContext("2d")

let ship = {
   x: c.width / 2,
   y: c.height / 2,
   r: S_SIZE / 2,
   a: 0 / 180 * Math.PI,
   rotation: 0,
   thrusting: false,
   thrust: {
      x: 0,
      y: 0
   }
}

c.width = window.innerWidth
c.height = window.innerHeight

const renderGame = () => {
   ctx.fillStyle = "#2d2d2d"
   ctx.fillRect(0, 0, c.width, c.height)
   
   renderShip()
}

const renderShip = () => {
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

   ship.a += ship.rotation
   console.log(ship.a)
}

const shipListeners = () => {
   // console.log("hit")
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

         break
      case 65: //a
         ship.rotation = 0
         break
      case 68: //d
         ship.rotation = 0
         break
   }
}
