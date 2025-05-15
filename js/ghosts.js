'use strict'

const GHOST = '&#9781 '

var gIntervalGhosts
var gGhosts
var gDeletedGhosts = []


function createGhosts(board) {
  gGhosts = []
  for (var i = 0; i < 3; i++) {
    createGhost(board)
  }
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
  var ghost = {
    location: { i: 3, j: 3, },
    currCellContent: FOOD,
    color: getRandomColor(),
  }
  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = GHOST
}

function moveGhosts() {

  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    // Create the moveDiff
    var moveDiff = getMoveDiff()

    var nextLocation = {
      i: ghost.location.i + moveDiff.i,
      j: ghost.location.j + moveDiff.j,
    }

    var nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === GHOST) return
    if (nextCell === WALL) return
    if (nextCell === POWER_FOOD) return

    // DETECT gameOver
    if (nextCell === PACMAN) {
      if (gPacman.isSuper) return
      gameOver()
      return
    }

    // Set back what we stepped on
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost MODEL
    ghost.currCellContent = nextCell
    ghost.location = nextLocation
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    // Updade the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
  }
}

// There are 4 options where to go
function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)
  switch (randNum) {
    case 1: return { i: 0, j: 1 }
    case 2: return { i: 1, j: 0 }
    case 3: return { i: 0, j: -1 }
    case 4: return { i: -1, j: 0 }
  }
}

function getGhostHTML(ghost) {
  var color = gPacman.isSuper ? 'blue' : ghost.color
  return `<span style="color:${color}">${GHOST}</span>`
}

function renderGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    console.log('ghost.location:', ghost.location)

    renderCell(ghost.location, getGhostHTML(ghost))
  }
}

function removeGhost(pacmenNextLoc) {
  var ghostIdx = getGhostIdxByLoc(pacmenNextLoc)
  var deletedGhost = gGhosts.splice(ghostIdx, 1)[0]
  // console.log('deletedGhost:', deletedGhost)

  if (deletedGhost.currCellContent === FOOD) {
    handleFood()
    deletedGhost.currCellContent = EMPTY
  }

  gDeletedGhosts.push(deletedGhost)
}

function resetGhosts() {
  for (var i = 0; i < gDeletedGhosts.length; i++) {
    const currGhost = gDeletedGhosts[i]
    gGhosts.push(currGhost)

  }
  gDeletedGhosts = []
}

function getGhostIdxByLoc(location) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (
      gGhosts[i].location.i === location.i &&
      gGhosts[i].location.j === location.j
    ) {
      return i
    }
  }
  return -1
}
