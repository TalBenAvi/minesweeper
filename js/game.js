'use strict'
'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());
const MINE = '💣';
const EMPTY = ' ';
const FLAG = '🚩'
const LIVE = '❤';
var gFirstMove = true;
var gMinesLocation = [];
var gBoard;
var gMarked = 0;
var gLives = 3;
var gTime;
var gTimerInterval = 0;
var gHints = 3;
var gHintPreesed;
var gManual=true;
var gManualPlaced=0;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gManual = false;
    gManualPlaced = 0;
    gMarked = 0;
    gLives = 3;
    gHints = 3;
    gFirstMove = true;
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    var elBtn = document.querySelector('button');
    elBtn.innerHTML = '😁';
    gBoard = buildBoard();
    renderBoard(gBoard, '.board-container');
}
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell();
        }
    }

    return board;
}
function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    };
    return cell;
}
function placeMine(board, minesNum, locationI, locationJ) {
    for (var i = 0; i < minesNum; i++) {
        var cellI = getRandomInt(0, gLevel.SIZE);
        var cellJ = getRandomInt(0, gLevel.SIZE);
        while (board[locationI][locationJ] === board[cellI][cellJ] || board[cellI][cellJ].isMine) {
            cellI = getRandomInt(0, gLevel.SIZE);
            cellJ = getRandomInt(0, gLevel.SIZE);
        }
        board[cellI][cellJ].isMine = true;
    }
    console.table(board);
}
function cellClicked(elCell, i, j) {
    if (gLives === 0) checkIfOver();
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;
    if (!gManual) {
        placeMinesManually(i, j);
        return;
    }
    if (gHintPreesed) {
        showHintedCell(i, j);
        gHintPreesed = false;
        return;
    }
    if (gFirstMove) {
        gFirstMove = false;
        firstClick(i, j);
        if (gGame.isOn) startTime();
    }
    gGame.shownCount++;
    gBoard[i][j].isShown = true;
    elCell.classList.add('shown');
    var elSpanInCell = elCell.querySelector('span');
    if (gBoard[i][j].isMine) {
        elSpanInCell.innerText = MINE;
        elSpanInCell.classList.add('.uncovered');
        gLives--;
        livesUpdate();
        gMarked++;
        gGame.shownCount--;
        updateEmoje('wounded');
        checkIfOver();
        return;
    }
    else if (gBoard[i][j].minesAroundCount !== 0) elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    else elSpanInCell.innerText = '0';
    if (gBoard[i][j].isMine) {
        gLives--;
        livesUpdate()
        checkIfOver();
        return;
    }
    updateEmoje();
    checkIfOver();
}

function firstClick(i, j) {
    if (gManualPlaced !== gLevel.MINES) {
        placeMine(gBoard, gLevel.MINES, i, j);
    }
    gMinesLocation = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            // console.log(gMinesLocation.length);
            if (gBoard[i][j].isMine) gMinesLocation.push({ i: i, j: j });
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
        }
    }
    // console.log(gMinesLocation);
}
function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.toggle('marked');

    if (!gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount !== 0) {
        // elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].isMarked) elSpanInCell.innerText = FLAG;
    else elSpanInCell.innerText = '';

    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gMarked++;
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked);


    checkIfOver();
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) minesAroundCount++;
        }
    }
    // if (minesAroundCount === 0) {

    //     return minesAroundCount.classList.add('number')
    // }
    // else if (minesAroundCount > 0 && cominesAroundCountnter <= 3) {
    //     `<span class='number' style="color:orange">${minesAroundCount}</span>`;
    //     return minesAroundCount;
    // }
    // else if (minesAroundCount > 3 && minesAroundCount <= 6) {
    //     `<span class='number' style="color:red">${minesAroundCount}</span>`;
    //     return minesAroundCount
    // }
    // else 
    return minesAroundCount;

}

function changeSize(btn, size, minesNum) {
    var elBtn = document.querySelectorAll('button');
    for (var i = 0; i < elBtn.length; i++) {
        var currentBtn = elBtn[i];
        if (currentBtn === btn) continue;
        currentBtn.classList.remove('uncovered')
    }
    gLevel.MINES = minesNum;
    gLevel.SIZE = size;
    restartGame();
}
function checkIfOver() {
    if (gLives === 0) {
        alert('YOU HAVE LOST THE GAME');
        updateEmoje('dead');
        gGame.isOn = false;
        stopTime();
        showMines();
    }
    else if (gGame.shownCount === ((gLevel.SIZE) ** 2) - gLevel.MINES && gMarked === gLevel.MINES) {
        alert('YOU HAVE WON THE GAME!!');
        updateEmoje('winner');
        stopTime();
    }
}
function restartGame() {
    displayHints();
    showSafePicks();
    stopTime();
    init();
}
function livesUpdate() {
    var elspan = document.querySelector('h2 span');
    console.log(elspan);
    var lives = '';
    for (var i = 0; i < gLives; i++) {
        lives += '💖';
    }
    elspan.innerText = lives;
}
function showMines() {
    for (var i = 0; i < gMinesLocation.length; i++) {
        var location = gMinesLocation[i];
        var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
        var elSpan = elCell.querySelector('span');
        elSpan.innerText = MINE;
        elCell.classList.add('reveal');
        elSpan.classList.add('reveal');
    }
}
function startTime() {
    var elTimer = document.querySelector('.timer');
    var start = Date.now();
    gTimerInterval = setInterval(() => {
        gTime = ((Date.now() - start) / 1000);
        elTimer.innerText = ((Date.now() - start) / 1000);
    }, 100);
}

function stopTime() {
    clearInterval(gTimerInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';
    gGame.isOn = false;
}
function updateEmoje(value) {
    var elBtn = document.querySelector('.emoje');
    switch (value) {
        case 'dead':
            elBtn.innerText = '💀';
            break;
        case 'wounded':
            elBtn.innerText = '🤕';
            break;
        case 'winner':
            elBtn.innerText = '🥳';
            break;
    }
}

function revealHint(elHint) {
    if (gHints === 0) return;
    elHint.style.display = 'none'
    gHintPreesed = true;
    gHints--;
}

function showHintedCell(locationI, locationJ) {
    var cellShown = [];
    for (var i = locationI - 1; i <= locationI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = locationJ - 1; j <= locationJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMarked) continue;
            cellShown.push({ i: i, j: j })
            renderCell(gBoard[i][j], i, j);
        }
    }

    setTimeout(() => {
        for (var i = 0; i < cellShown.length; i++) {
            gBoard[cellShown[i].i][cellShown[i].j].isShown = false;
            var elCell = document.querySelector(`.cell-${cellShown[i].i}-${cellShown[i].j}`);
            var elSpan = elCell.querySelector('span');
            elCell.classList.remove('reveal');
            elSpan.classList.remove('reveal');
            elSpan.innerText = '';
        }
    }, 2000);

}
function displayHints() {
    var hints = document.querySelectorAll('.hints span');
    for (var i = 0; i < hints.length; i++) {
        hints[i].style.display = 'inline';
    }
}
function makeBoardManually() {
    if (!gGame.isOn) return;
    var mines = gLevel.MINES;
    gManual = false;
    alert(`place: ${mines} mines where you want to start the game`);
}
function placeMinesManually(locationI, locationJ) {
    console.log(locationI);
    console.log(locationJ);
    console.log(gBoard[locationI][locationJ]);
    if (gBoard[locationI][locationJ].isMine) return;
    gManualPlaced++;
    gBoard[locationI][locationJ].isMine = true;
    var elCell = document.querySelector(`.cell-${locationI}-${locationJ}`);
    elCell.classList.add('chosen');
    setTimeout(() => {
        elCell.classList.remove('chosen');
    }, 1000);
    if (gManualPlaced === gLevel.MINES) {
        gManual = true;
        alert(`All the mines are placed you can start playing`)
    }
}
function revealeSafe(elBtn) {
    var safeToPick = [];
    var cells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safeToPick.push(gBoard[i][j]);
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                cells.push(elCell);
            }
        }
    }
    elBtn.style.display = 'none'
    var randomCell = getRandomInt(0, safeToPick.length);
    if (cells.length === 0) return;
    cells[randomCell].classList.add('chosen');
    setTimeout(() => {
        cells[randomCell].classList.remove('chosen');
    }, 2000);
}
function showSafePicks() {
    var safePicks = document.querySelectorAll('.safepicks span');
    for (var i = 0; i < safePicks.length; i++) {
        safePicks[i].style.display = 'inline';
    }
}
