'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());
const MINE = '💣';
const EMPTY = ' ';
const FLAG = '🚩'
const LIVE = '❤';
var gBombLocation = [];
var gBoard;
// var GgameBoard;
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

function init(size, minesNum) {
    gLevel = {
        SIZE: size,
        MINES: minesNum
    };
    gLives = 3;
    gGame.shownCount = 0;
    var elBtn = document.querySelector('button');
    elBtn.innerHTML = '😁';
    gBoard = buildBoard(size);
    printMat(gBoard, '.board-container')
    gGame.isOn = true;
}
function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY;
        }
    }
    console.table(board);
    return board;
}
function placeMine(board, minesNum) {
    for (var i = 0; i < minesNum; i++) {
        var numI = getRandomIntInt(0, board.length - 1);
        var numJ = getRandomIntInt(0, board[0].length - 1);
        // if( board[numI][numJ] === MINE) placeMine(board, minesNum);
        board[numI][numJ] = MINE;
    }
    return board;

}
// function click(event) {
//     // console.log(i, j);
//     console.log(event);
//     // if (event === 0) {
//     //     cellMarked(i, j);
//     // }
//     // else {
//     //     cellClicked(i, j);
//     // }
// }
// function cellMarked(i, j) {
//     var cell = gBoard[i][j];
//     if (!cell.isMarked) {
//         // cell.isShown = true;
//         cell = FLAG;
//         renderCell({ i: i, j: j }, FLAG);
//     }
//     else {
//         cell = EMPTY;
//         renderCell({ i: i, j: j }, EMPTY);
//     }
// }

function cellClicked(i, j) {
    if (gGame.isOn === false) return;
    // if(gGame.shownCount===1){
    // printMat(gBoard, '.board-container')

    if (gGame.shownCount + gGame.markedCount === (gBoard.length) ** 2) {
        var elBtn = document.querySelector('button');
        elBtn.innerHTML = '🥳';
        gGame.isOn = false;
        alert(`You have won`);
    }
    gGame.shownCount++
    var cell = gBoard[i][j];
    if (cell.isMine) {
        cell.isShown = true;
        cell = MINE;
        renderCell({ i: i, j: j }, MINE);
        if (gLives === 1) {
            var elBtn = document.querySelector('button');
            elBtn.innerHTML = '💀';
            gGame.isOn = false;
            alert(`You have lost`);

        }
        else {
            gLives--;
            var elBtn = document.querySelector('button');
            console.log(elBtn);
            elBtn.innerHTML = '🤕';
            alert(`you clicked you have ${gLives} left!`)
        }
    }
    else {
        renderCell({ i: i, j: j }, cell.minesAroundCount);
    }
}
function setMinesNegsCount(i, j) {
    var counter = 0;
    if (gBoard[i][j] === MINE) return;
    if (i === 0 && j === 0) {
        for (var row = i; row <= i + 1 && row < gBoard.length; row++) {
            for (var col = j; col <= j + 1 && col < gBoard[0].length; col++) {
                if (gBoard[row][col] === MINE || gBoard[row][col].isMine) counter++;
            }
        }
    }
    else if (i === 0) {
        for (var row = i; row <= i + 1 && row < gBoard.length; row++) {
            for (var col = j - 1; col <= j + 1 && col < gBoard[0].length; col++) {
                if (gBoard[row][col] === MINE || gBoard[row][col].isMine) counter++;
            }
        }
    }
    else if (j === 0) {
        for (var row = i - 1; row <= i + 1 && row < gBoard.length; row++) {
            for (var col = j; col <= j + 1 && col < gBoard[0].length; col++) {
                if (gBoard[row][col] === MINE || gBoard[row][col].isMine) counter++;
            }
        }
    }
    else {
        for (var row = i - 1; row <= i + 1 && row < gBoard.length; row++) {
            for (var col = j - 1; col <= j + 1 && col < gBoard[0].length; col++) {
                if (gBoard[row][col] === MINE || gBoard[row][col].isMine) counter++;
            }
        }
    }
    if (counter === 0) return `<span class='number'>${counter}</span>`;
    if (counter > 0 && counter <= 3) return `<span class='number' style="color:orange">${counter}</span>`;
    if (counter > 3 && counter <= 6) return `<span class='number' style="color:red">${counter}</span>`;
    if (counter > 6 && counter <= 9) return `<span class='number' style="color:magenta">${counter}</span>`;

}
