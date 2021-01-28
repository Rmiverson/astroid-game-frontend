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
        createUser(e)
    }
}

//NEW Code
const createUser = (e) => {
    fetch(USERS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': e.target.name.value,
        }),
    })
    .then(resp => resp.json())
    .then(startGame())
}

const createLevel = (level, score) => {
    fetch(LEVELS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'level': level,
        }),
    })
    .then(resp => resp.json())
    .then(level => createGame(level, score))
}

const createGame = (level, score) => {
    fetch(GAMES_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'score': score,
            'level_id': level.id
        }),      
    })
    .then(resp => resp.json())
    .then(game => loadGameOver(game))
}


const getBoard = () => {
    fetch(GAMES_URL)
    .then(resp => resp.json())
    .then(games => loadBoard(games))
}

const startGame = (game) => {
    document.querySelector( 'main' ).style.display = 'none'
    document.querySelector('canvas').style.display = ''
    runGame(game)
}

const mainMenu = () => {
    let container = document.querySelector('div')
    container.innerHTML = ""

    document.querySelector('canvas').style.display = "none"

    let h2 = document.createElement('h2')
    let div = document.createElement('div')
    let imgDiv = document.createElement('div')
    let instructDiv = document.createElement('div')
    let textDiv = document.createElement('div')
    let p = document.createElement('p')
    let keyText1 = document.createElement('p')
    let keyText2 = document.createElement('p')
    let keyText3 = document.createElement('p')
    let keyText4 = document.createElement('p')
    let leaderBtn = document.createElement('button')
    let subtitle = document.createElement('p')
    let form = document.createElement('form')
    let nameInput = document.createElement('input')
    let playInput = document.createElement('input')
    let br = document.createElement('br')
    let br2 = document.createElement('br')
    let hr = document.createElement('hr')
    let keyImg = document.createElement('img')
    let spaceImg = document.createElement('img')
    
    instructDiv.className = "instruct"
    imgDiv.className = 'imgBlock'
    keyImg.src = "images/keyboard.png"
    keyImg.id = "keyBtn"
    spaceImg.id = "spaceBtn"
    spaceImg.src = "images/space_key.jpg"
    h2.textContent = "Asteroids!"
    h2.className = "title"
    textDiv.id = "textDiv"
    div.className = "instructions"
    p.textContent = "Shoot the asteroids! Get hit and it's GAME OVER."
    keyText1.textContent = "Press W to move forward."  
    keyText2.textContent = "Press A to rotate left."
    keyText3.textContent = "Press D to rotate right."
    keyText4.textContent =  "Press Space to shoot."
    leaderBtn.textContent = "Leaderboard"
    leaderBtn.className = "leaderboard"
    subtitle.textContent = "New Game"
    subtitle.className = "newGame"
    form.id = "start_game"
    nameInput.type = "text"
    nameInput.name = "name"
    nameInput.placeholder="Enter name"
    nameInput.className = 'nameInput'
    playInput.type = "submit"
    playInput.value = "START"
    playInput.className = "start"


    textDiv.append(keyText1, keyText2, keyText3, keyText4)
    imgDiv.append(keyImg, spaceImg)
    instructDiv.append(imgDiv, textDiv)
    div.append(p, instructDiv)
    form.append(nameInput, br, br2, playInput)
    container.append(h2, div, leaderBtn, hr, subtitle, form)

    form.addEventListener('submit', handleSubmit)
    leaderBtn.addEventListener('click', getBoard)
}

const loadBoard = (games) => {
    document.querySelector('canvas').style.display = "none"

    let container = document.querySelector('div')
    let exit = document.createElement('button')

    container.innerHTML = ""
    exit.textContent = 'X'

    container.appendChild(exit)
    exit.addEventListener('click', mainMenu)

    games.sort((a, b) => b.score - a.score)

    games.slice(0, 10).forEach(game => {
        let container = document.querySelector('div')
        let stat = document.createElement('h4')
        stat.textContent = `${game.user.name} ${game.score} ${game.level.level}`
        container.appendChild(stat)
    })
}

const loadGameOver = (game) => {
    let main = document.querySelector('main')
    let container = document.querySelector('div')
    let div = document.createElement('div')
    let h1 = document.createElement('h1')

    let menuBtn = document.createElement('button')
    let leaderBtn = document.createElement('button')

    container.innerHTML = ""
    main.style.display = ""

    div.className = 'modal'
    h1.textContent = 'GAME OVER'
    menuBtn.textContent = 'Main Menu'
    leaderBtn.textContent = 'Leaderboards'

    menuBtn.addEventListener('click', mainMenu)
    leaderBtn.addEventListener('click', getBoard)

    div.append(h1, menuBtn, leaderBtn)
    container.appendChild(div)
}

