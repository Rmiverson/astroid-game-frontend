const FPS = 30
const S_SIZE = 30

document.addEventListener("DOMContentLoaded", () => {
   setInterval(renderGame, 1000 / FPS)
})

let c = document.getElementById("gameScreen")
let ctx = c.getContext("2d")

let ship = {
   x: c.width / 2,
   y: c.height / 2,
   r: S_SIZE / 2,
   a: 0 / 180 * Math.PI
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
}