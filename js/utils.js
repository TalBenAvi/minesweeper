'use strict'
function renderBoard(board, selector) {
    var strHTML = '<table>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className="cell-${i}-${j}";
            var cellTag = `<td class="${className}" oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">`;
            if (cell.isMine) strHTML += cellTag + `<span>${MINE}</span></td>`;
            else {
                if (cell.minesAroundCount === 0) {
                    strHTML += cellTag + `<span></span></td>`;
                } else {
                    strHTML += cellTag + `<span>${cell.minesAroundCount}</span></td>`;
                }

            }
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;
}
// // location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//     elCell.innerHTML = value;
// }
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
