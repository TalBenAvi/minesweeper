function printMat(mat, selector) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false
            };
            if (gGame.shownCount === 0) {
                gBoard = placeMine(gBoard, gLevel.MINES);
                console.table(gBoard)
                gGame.shownCount++;
                var number = setMinesNegsCount(i, j);
            }
            if (mat[i][j] === MINE) cell.isMine = true;
            else var number = setMinesNegsCount(i, j);
            mat[i][j] = cell;
            cell.minesAroundCount = number;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td > <div class="${className}" onclick="cellClicked(${i},${j})"></div> </td>`;
        }
        strHTML += '</tr class="' + className + '">'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
