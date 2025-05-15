'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const POWER_FOOD = '🧁'
const CHERRY = '🍒'

var gCherryInterval
var gBoard

var gGame

function onInit() {
  gGame = {
    score: 0,
    isOn: true,
    foodCount: 0,
    isVictory: false
  }

  gBoard = buildBoard()
  createPacman(gBoard)
  createGhosts(gBoard)

  renderBoard(gBoard)
  gCherryInterval = setInterval(createCherry, 5000)

  document.querySelector('.modal').classList.add('hide')
  document.querySelector('header h3 span').innerText = gGame.score
}

function buildBoard() {
  const size = 10
  var board = []

  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      if (isCorner(i, j, size)) {
        board[i][j] = POWER_FOOD
      } else {
        board[i][j] = FOOD
        gGame.foodCount++
      }
      if (i === 0 || i === size - 1 || j === 0 || j === size - 1 || (j === 3 && i > 4 && i < size - 2)) {
        board[i][j] = WALL
        gGame.foodCount--
      }
    }
  }

  // createPoweFood(board)
  return board
}

function isCorner(i, j, matSize) {
  return (i === 1 && j === 1) || (i === matSize - 2 && j === matSize - 2) || (i === matSize - 2 && j === 1) || (i === 1 && j === matSize - 2)
}
// Another option
// function createPoweFood(board) {
//   board[1][1] = POWER_FOOD
//   board[1][board[0].length - 2] = POWER_FOOD
//   board[board.length - 2][1] = POWER_FOOD
//   board[board.length - 2][board[0].length - 2] = POWER_FOOD
//   gGame.foodCount -= 4
// }

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {

      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  const elContainer = document.querySelector('.board-container tbody')
  elContainer.innerHTML = strHTML
}

function updateScore(diff) {
  // Update both the model and the dom for the score
  gGame.score += diff
  const elScore = document.querySelector('header h3 span')
  elScore.innerText = gGame.score
}

function checkVicory() {
  if (!gGame.foodCount) {
    gGame.isVictory = true
    gameOver()
  }
}

function gameOver() {
  gGame.isOn = false

  clearInterval(gIntervalGhosts)
  clearInterval(gCherryInterval)

  const msg = gGame.isVictory ? 'You Won!' : 'Game Over'

  document.querySelector('.modal h2').innerText = msg
  document.querySelector('.modal').classList.remove('hide')
}


function getEmptyCells() {
  var emptyCells = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === EMPTY) {
        emptyCells.push({ i, j })
      }
    }
  }

  return emptyCells
}

function createCherry() {
  const emptyCells = getEmptyCells()
  if (!emptyCells.length) return

  const idx = getRandomIntInclusive(0, emptyCells.length - 1)

  const randCherryLocation = emptyCells[idx]
  if (!randCherryLocation) return

  gBoard[randCherryLocation.i][randCherryLocation.j] = CHERRY
  renderCell(randCherryLocation, CHERRY)
}
