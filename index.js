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


//OLD CODE

// const createUser = (e) => {
//     fetch(USERS_URL, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             'name': e.target.name.value,
//         }),
//     })
//     .then(resp => resp.json())
//     .then(user => createLevel(user))
// }

// const createLevel = (user) => {
//     fetch(LEVELS_URL, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({'id': user.id}),  
//     })
//     .then(resp => resp.json())
//     .then(level => createGame(level, user))
// }

// const createGame = (level, user) => {
//     fetch(GAMES_URL, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             'score': 0,
//             'user_id': user.id,
//             'level_id': level.id
//         }),      
//     })
//     .then(resp => resp.json())
//     .then(game => startGame(game))
// }

//NEW Code
const fetchUser = (id) => {
    fetch(USERS_URL + `/${id}`)
    .then(resp => resp.json())
    .then(user => loadProfile(user))
}

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

const deleteGame = (id) => {
    fetch(GAMES_URL+`/${id}`, {
        method: 'DELETE'
    })
    
}

const deleteUser = (id) => {
    fetch(USERS_URL + `/${id}`, {
        method: 'DELETE'
    })
    .then(mainMenu())
}

const updateUser = (e, user) => {
    e.preventDefault()
    // debugger
    fetch(USERS_URL + `/${user.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': e.target.newValue.value
        })
    })
    .then(resp => resp.json())
    .then(newUser => loadProfile(newUser))
}

const startGame = (game) => {
    document.querySelector('div').innerHTML = ""
    runGame(game)
}

const mainMenu = () => {
    let container = document.querySelector('div')
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
    let hr = document.createElement('hr')

    h2.textContent = "Asteroids!"
    h2.className = "title"
    p.textContent = "Shoot the asteroids! Don't let the asteroid hit you or else it's GAME OVER"
    p.className = "instructions"
    leaderBtn.textContent = "Leaderboard"
    leaderBtn.className = "leaderboard"
    h4.textContent = "New Game"
    form.id = "start_game"
    nameInput.type = "text"
    nameInput.name = "name"
    nameInput.placeholder="Enter name"
    playInput.type = "submit"
    playInput.value = "START"
    playInput.className = "start"

    form.append(nameInput, br, br2, playInput)
    container.append(h2, p, leaderBtn, hr, h4, form)

    form.addEventListener('submit', handleSubmit)
    leaderBtn.addEventListener('click', getBoard)
}

const loadBoard = (games) => {
    let container = document.querySelector('div')
    container.innerHTML = ""
    
    let exit = document.createElement('button')
    
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
    let container = document.querySelector('div')
    container.innerHTML = ""

    let gameover = document.createElement('h1')
    let ul = document.createElement('ul')
    let usrLi = document.createElement('li')
    let scoreLi = document.createElement('li')
    let lvlLi = document.createElement('li')
    let btnLi = document.createElement('li')
    let profileBtn = document.createElement('button')
    let hr = document.createElement('hr')
    let playBtn = document.createElement('button')

    let menuBtn = document.createElement('button')
    let leaderBtn = document.createElement('button')

    // container.className = 'modal'
    gameover.textContent = 'GAME OVER'
    menuBtn.textContent = 'Main Menu'
    leaderBtn.textContent = 'Leaderboards'

    usrLi.textContent = game.user.name
    scoreLi.textContent = game.score
    lvlLi.textContent = game.level.level
    profileBtn.textContent = 'Profile'

    playBtn.textContent = 'Play Again?'

    playBtn.addEventListener('click', () => startGame(game))
    profileBtn.addEventListener('click', () => fetchUser(game.user.id))
    menuBtn.addEventListener('click', mainMenu)
    leaderBtn.addEventListener('click', getBoard)

    btnLi.appendChild(profileBtn)
    ul.append(usrLi, scoreLi, lvlLi, btnLi)
    container.append(gameover, ul, menuBtn, leaderBtn, hr, playBtn)
}

const loadProfile = (user) => {

    let container = document.querySelector('div')
    container.innerHTML = ""

    let h1 = document.createElement('h1')
    let form = document.createElement('form')
    let newName = document.createElement('input')
    let submit = document.createElement('input')
    let dltUsrBtn = document.createElement('button')
    let ul = document.createElement('ul')

    h1.textContent = user.name
    newName.setAttribute('type', 'text')
    newName.name = 'newValue'
    submit.setAttribute('type', 'submit')
    form.append(newName, submit)
    dltUsrBtn.textContent = 'Delete User'

    form.addEventListener('submit', (e) => updateUser(e, user))

    dltUsrBtn.addEventListener('click', () => deleteUser(user.id))

    user.games.forEach (game => {
        let li = document.createElement('li')
        let score = document.createElement('p')
        let dlt = document.createElement('button')

        li.id = game.id
        score.textContent = 'Score: ' + game.score
        dlt.textContent = 'Delete'

        dlt.addEventListener('click', () => {
            deleteGame(game.id)
            document.getElementById(li.id).remove()
        })

        li.append(score, dlt)
        ul.appendChild(li)
    })

    container.append(h1, form, dltUsrBtn, ul)

}