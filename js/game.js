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
var gTime;
var gTimerInterval = 0;
var gLives = 3;
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
    gMarked = 0;
    gLives = 3;
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
        console.log(board[locationI][locationJ]);
        console.log(board[cellI][cellJ]);
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
    placeMine(gBoard, gLevel.MINES, i, j);
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gMinesLocation.push({ i: i, j: j });
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
        }
    }
    console.log(gMinesLocation);
}
function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.toggle('marked');

    if (!gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount !== 0) {
        elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].isMarked) elSpanInCell.innerText = FLAG;
    else elSpanInCell.innerText = '';

    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gMarked++;
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) gMarked--;


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
    }
    else if (gGame.shownCount === ((gLevel.SIZE) ** 2) - gLevel.MINES && gMarked === gLevel.MINES) {
        alert('YOU HAVE WON THE GAME!!');
        updateEmoje('winner');
        stopTime();
    }
}
function restartGame() {
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
    var elDiv = document.querySelector('div');
    var elButtonDiv = elDiv.querySelector('button');
    switch (value) {
        case 'dead':
            elButtonDiv.innerText = '💀';
            break;
        case 'wounded':
            elButtonDiv.innerText = '🤕';
            break;
        case 'winner':
            elButtonDiv.innerText = '🥳';
            break;
    }
}
