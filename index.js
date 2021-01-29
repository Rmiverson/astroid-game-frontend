document.addEventListener("DOMContentLoaded", () => {
   mainMenu()
})

BASE_URL = 'http://localhost:3000'
// const BASE_URL = "https://project-phase-3-asteroids.herokuapp.com"
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
    .then(user => startGame(user))
}

const createLevel = (level, score, user) => {
    fetch(LEVELS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'level': level,
        }),
    })
    .then(resp => resp.json())
    .then(level => createGame(level, score, user))
}

const createGame = (level, score, user) => {
    fetch(GAMES_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'score': score,
            'user_id': user.id,
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

const startGame = (user) => {
    document.querySelector('div').innerHTML = ""
    runGame(user)
}

const mainMenu = () => {
    let container = document.querySelector('div')
    container.innerHTML = ""

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
    let container = document.querySelector('div')
    container.innerHTML = ""
    
    let div = document.createElement('div')
    let table = document.createElement('div')
    let exit = document.createElement('button')
    let title = document.createElement('h1')
    let headRow = document.createElement('div')
    let nameHeader = document.createElement('h3')
    let scoreHeader = document.createElement('h3')
    let levelHeader = document.createElement('h3')
    
    table.className = "divTable"
    exit.textContent = 'Main Menu'
    title.textContent = "Leaderboard"
    headRow.className = 'headRow'
    nameHeader.className = 'divHeader'
    scoreHeader.className = 'divHeader'
    levelHeader.className = 'divHeader'
    nameHeader.textContent = 'Player'
    scoreHeader.textContent = 'Score'
    levelHeader.textContent = 'Level'
    exit.className = 'menu'

    headRow.append(nameHeader, scoreHeader, levelHeader)
    table.append(headRow)
    div.append(title, table, exit)
    container.appendChild(div)
    exit.addEventListener('click', mainMenu)

    games.sort((a, b) => b.score - a.score)

    games.slice(0, 10).forEach(game => {
        let table = document.querySelector('.divTable')
        let row = document.createElement('div')
        let name = document.createElement('h4')
        let score = document.createElement('h4')
        let level = document.createElement('h4')

        row.className = 'divRow'
        name.className = 'divCell'
        score.className = 'divCell'
        level.className = 'divCell'

        name.textContent = `${game.user.name}`
        score.textContent = `${game.score}`
        level.textContent = `${game.level.level}`
        row.append(name, score, level)
        table.appendChild(row)
    })
}

const loadGameOver = (game) => {
    console.log(game)
    let container = document.querySelector('div')
    container.innerHTML = ""

    let gameover = document.createElement('h1')
    let stats = document.createElement('div')
    let player = document.createElement('h2')
    let score = document.createElement('h4')
    let level = document.createElement('h4')
    let profileBtn = document.createElement('button')
    let hr = document.createElement('hr')
    let playBtn = document.createElement('button')

    let menuBtn = document.createElement('button')
    let leaderBtn = document.createElement('button')

    // container.className = 'modal'
    stats.className = 'stats'
    gameover.textContent = 'GAME OVER'
    menuBtn.textContent = 'Main Menu'
    leaderBtn.textContent = 'Leaderboard'
    leaderBtn.className = 'leaderboard'
    playBtn.className = 'start'
    menuBtn.className = 'menu'
    profileBtn.className = 'profile'

    player.textContent = game.user.name
    score.textContent = `Score: ${game.score}`
    level.textContent = `Level: ${game.level.level}`
    profileBtn.textContent = 'Profile'

    playBtn.textContent = 'Try Again'

    playBtn.addEventListener('click', () => startGame(game.user))
    profileBtn.addEventListener('click', () => fetchUser(game.user.id))
    menuBtn.addEventListener('click', mainMenu)
    leaderBtn.addEventListener('click', getBoard)

    stats.append(player, score, level, profileBtn)
    container.append(gameover, stats, menuBtn, leaderBtn, hr, playBtn)
}

const loadProfile = (user) => {
    let container = document.querySelector('div')
    container.innerHTML = ""

    let h1 = document.createElement('h1')
    let form = document.createElement('form')
    let newName = document.createElement('input')
    let submit = document.createElement('input')
    let dltUsrBtn = document.createElement('button')
    let ol = document.createElement('ol')
    let options = document.createElement('h2')
    let optionsDiv = document.createElement('div')
    let formDiv = document.createElement('div')
    let edit = document.createElement('h4')
    let br = document.createElement('br')
    let menuBtn = document.createElement('button')
    let vl = document.createElement('vl')
    let deleteSection = document.createElement('div')

    h1.textContent = user.name
    newName.setAttribute('type', 'text')
    newName.name = 'newValue'
    submit.setAttribute('type', 'submit')
    submit.value = 'Edit'
    dltUsrBtn.textContent = 'Delete User'
    options.textContent = 'User Options'
    ol.id = 'gameList'
    edit.textContent = 'Edit Player Name'
    optionsDiv.className = 'options'
    deleteSection.className = 'deleteSection'
    menuBtn.textContent = 'Main Menu'
    formDiv.className = 'editSection'
    dltUsrBtn.id = 'dltUsr'
    menuBtn.className = 'menu'
    submit.id = 'editBtn'
    // dltUsrBtn.id = 'deleteBtn'


    menuBtn.addEventListener('click', mainMenu)
    form.addEventListener('submit', (e) => updateUser(e, user))
    dltUsrBtn.addEventListener('click', () => deleteUser(user.id))

    user.games.sort((a, b) => b.score - a.score)

    user.games.slice(0, 10).forEach (game => {
        let li = document.createElement('li')
        let score = document.createElement('p')
        let dlt = document.createElement('button')

        li.className = 'userGame'
        li.id = game.id
        score.textContent = 'Score: ' + game.score
        dlt.textContent = '🗑️'
        dlt.id = 'deleteGame'

        dlt.addEventListener('click', () => {
            deleteGame(game.id)
            document.getElementById(li.id).remove()
        })

        li.append(dlt, score)
        ol.appendChild(li)
    })

    form.append(newName, br, submit)
    formDiv.append(edit, form)
    deleteSection.appendChild(dltUsrBtn)
    optionsDiv.append(formDiv, vl, deleteSection)
    container.append(h1, ol, menuBtn, options, optionsDiv)

}


// var language = 'javascript';
// function whichLanguage() {
        
//     var language = 'java';
//     console.log(language)
       
      
// }

// whichLanguage()