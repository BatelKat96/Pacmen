'use strict'

var gPacman
const PACMAN = '😀'

const COLLECT_SOUND = new Audio('audio/ball.mp3')


function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5,
    },
    isSuper: false,
    deg: 0
  }
  board[gPacman.location.i][gPacman.location.j] = PACMAN
  gGame.foodCount--
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return

  var nextLocation = getNextLocation(eventKeyboard)
  if (!nextLocation) return  // User pressed none-relevant key in the keyboard

  var nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell === WALL) return  // Hitting a WALL, not moving anywhere

  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      removeGhost(nextLocation)
    } else {
      gameOver()
      renderCell(gPacman.location, EMPTY)
      return
    }
  } else if (nextCell === FOOD) {
    handleFood()
  } else if (nextCell === POWER_FOOD) {
    if (gPacman.isSuper) return
    handlePowerFood()
    COLLECT_SOUND.play()
  } else if (nextCell === CHERRY) {
    updateScore(10)
  }
  updateMove(nextLocation)
}

function handleFood() {
  gGame.foodCount--
  updateScore(1)
  checkVicory()
}

function handlePowerFood() {
  gPacman.isSuper = true
  renderGhosts()
  setTimeout(() => {
    gPacman.isSuper = false
    resetGhosts()
    renderGhosts()
  }, 5000)
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  }

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      gPacman.deg = 0
      nextLocation.i--
      break
    case 'ArrowDown':
      gPacman.deg = 180
      nextLocation.i++
      break
    case 'ArrowLeft':
      gPacman.deg = 270
      nextLocation.j--
      break
    case 'ArrowRight':
      gPacman.deg = 90
      nextLocation.j++
      break
    default:
      return null
  }

  return nextLocation
}

function getPacmanHTML() {
  return `<div style="transform: rotate(${gPacman.deg}deg) ">${PACMAN}</div>`
}

function updateMove(nextLocation) {

  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY  // Update the model to reflect movement

  renderCell(gPacman.location, EMPTY)  // Update the DOM

  gPacman.location = nextLocation  // Update the pacman MODEL to new location

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
  // renderCell(gPacman.location, PACMAN)  // Render updated model to the DOM
  renderCell(gPacman.location, getPacmanHTML())  // Render updated model to the DOM
}

