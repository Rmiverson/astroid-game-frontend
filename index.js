document.addEventListener("DOMContentLoaded", () => {
   mainMenu()
})

const BASE_URL = "http://localhost:3000"
const GAMES_URL = `${BASE_URL}/games`
const USERS_URL = `${BASE_URL}/users`
const LEVELS_URL = `${BASE_URL}/levels`


const handleSubmit = (e) => {
    e.preventDefault()

    if (e.target.name.value === "") {
        alert("Please enter your name")
    } else {
        createGame(e)
    }
}

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

const startGame = (game) => {
    document.querySelector( 'main' ).style.display = 'none'
    runGame()
}

const mainMenu = () => {
    let container = document.querySelector('main')
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

    form.addEventListener("submit", handleSubmit)
}

