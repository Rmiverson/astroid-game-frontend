document.addEventListener("DOMContentLoaded", () => {
    mainMenu()
 })

//VARIABLES
const BASE_URL = "http://localhost:3000"
const GAMES_URL = `${BASE_URL}/games`
const USERS_URL = `${BASE_URL}/users`
const LEVELS_URL = `${BASE_URL}/levels`

const FPS = 30
const S_SIZE = 30

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



//DATA
const createGame = (e) => {
    fetch(GAMES_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'score': 0
        }),
    })
    .then(resp => resp.json())
    .then(game => createUser(e, game))
}

const createUser = (e, game) => {
    fetch(USERS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': e.target.name.value,
            'game_id': game.id
        }),
    })
    .then(resp => resp.json())
    .then(user => createLevel(game, user))
}

const createLevel = (game, user) => {
    fetch(LEVELS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'level': "beginner",
            'game_id': game.id
        }),  
    })
    .then(resp => resp.json())
    .then(startGame(game))
}

const getBoard = () => {
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(users => loadBoard(users))
}


//DOM
const mainMenu = () => {
    let container = document.querySelector('main')
    container.innerHTML = ""

    let h2 = document.createElement('h2')
    let p = document.createElement('p')
    let leaderBtn = document.createElement('button')
    let h4 = document.createElement('h4')
    let form = document.createElement('form')
    let nameInput = document.createElement('input')
    let playInput = document.createElement('input')
    let br = document.createElement('br')
    let br2 = document.createElement('br')

    h2.textContent = "Asteroids!"
    p.textContent = "Shoot the asteroids! Don't let the asteroid hit you or else it's GAME OVER"
    leaderBtn.textContent = "Leaderboard"
    h4.textContent = "New Game"
    form.id = "start_game"
    nameInput.type = "text"
    nameInput.name = "name"
    nameInput.placeholder="Enter name"
    playInput.type = "submit"
    playInput.value = "Play"

    form.append(nameInput, br, br2, playInput)
    container.append(h2, p, leaderBtn, h4, form)

    form.addEventListener('submit', handleSubmit)
    leaderBtn.addEventListener('click', getBoard)
}

const loadBoard = (users) => {
    let container = document.querySelector('main')
    let exit = document.createElement('button')

    container.innerHTML = ""
    exit.textContent = 'X'

    container.appendChild(exit)
    exit.addEventListener('click', mainMenu)

    users.forEach(user => {
        let container = document.querySelector('main')
        let stat = document.createElement('h4')
        stat.textContent = `${user.name} ${user.game.score}`
        container.appendChild(stat)
    })
}


//EVENT HANDLERS
const handleSubmit = (e) => {
    e.preventDefault()

    if (e.target.name.value === "") {
        alert("Please enter your name")
    } else {
        createGame(e)
    }
}

//GAME START
const startGame = (game) => {
    document.querySelector('main').style.display = 'none'
    setInterval(renderGame, 1000 / FPS)
}

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





