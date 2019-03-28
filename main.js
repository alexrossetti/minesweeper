const rows = 8;
const columns = 8;
let revealed = 0;
let mines = 10;
let grid = new Array(rows);

for (let i = 0; i < grid.length; i++){
    grid[i] = new Array(columns);
}

function init() {
    reset();
    createBoard(rows, columns);
    addMines(mines, (rows*columns));
}

function reset(){
    document.getElementById('info').innerHTML = "";
    document.getElementById('board').innerHTML = "";
    document.getElementById('title').innerHTML = "";
}

function createBoard(rows, columns) {

    for (let i = 0; i < grid.length; i++){
        grid[i] = new Array(columns);
    }

    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.addEventListener('mousedown', click);
            tile.id = "tile"+(j + (rows * (i)));
            document.getElementById('board').appendChild(tile);
            grid[i][j] = 'tile';
        }
        const breaker = document.createElement('div');
        breaker.className = 'clear';
        document.getElementById('board').appendChild(breaker);
    }
    
    const info = document.createElement('div');
    document.getElementById('info').appendChild(info);
    info.innerHTML = 'Mines: '+mines;
}


function addMines(mines, tiles) {

    let minesAdded = 0;

    while (minesAdded < mines){
        let column = Math.floor(Math.random() * columns);
        let row = Math.floor(Math.random() * rows);
     
        if (grid[row][column] != 'mine') {
            grid[row][column] = 'mine';
            minesAdded++;
        }
    }

    // get the number of adjacent mines for each tile
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            if (check(i, j) != 'mine'){
                grid[i][j] = getNeighbours(i, j);
            }
        }
    }

}

// for each tile, if it's not a mine, check its neighbours and return the number of mines adjacent to it
function getNeighbours(row, column){

    let total = 0;

    // i offset in x direction, j offset in y direction
    for (let i = -1; i <= 1; i++){
        for (let j = -1; j <= 1; j++){

            const xOffset = row + i;
            const yOffset = column + j;

            // if it's not on the grid, ignore it
            if (xOffset > -1 && xOffset < columns && yOffset > -1 && yOffset < rows){
                
                if (check(xOffset, yOffset) == 'mine'){
                    //console.log("mine at " + xOffset, yOffset);
                    total++;
                }   
            }

        }
    }

    return total;
}


function click(event) {
    let id = event.target.id.substr(4);
   
    // translate id into the index of the 2d grid array; 
    row = Math.floor(id / columns);
    column = id % rows;

    // if user clicks on a mine, display all the mines and game over. Otherwise show the tile
    if (check(row, column) === 'mine') {
        
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                if (check(i, j) == 'mine'){
                    document.getElementById('tile'+((i*columns)+j)).className += ' mine';   
                } else {
                    showTile((i*columns)+j);
                }
                
            }
        }       
        document.getElementById('title').innerHTML = "GAME OVER";
    } else {
        showTile(id);
         
        // if all tiles are revealed, the user has won
        if (checkWin() == true){
            document.getElementById('title').innerHTML = "YOU WIN";
        }
        
    }

}

function showTile(id) {
    let tile = document.getElementById('tile'+id);
    let tileId = id;
    const row = Math.floor(id / columns);
    const column = id % rows;
    
    revealed++;
    tile.className = 'revealed';

    if (check(row, column) > 0){
        tile.innerHTML = '<h4>'+check(row, column)+'</h4>';
    }

    if (check(row, column) == 0) {   
    
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){

                if (!(i == 0 && j == 0)){

                    const xOffset = row + i;
                    const yOffset = column + j;

                    //console.log(xOffset, yOffset);

                    // if it's not on the grid, ignore it
                    if (xOffset > -1 && xOffset < rows && yOffset > -1 && yOffset < columns){
                        const newId = (xOffset * columns) + yOffset;
                        
                        if (!(document.getElementById('tile'+newId).classList.contains('revealed'))){ 
                            showTile(newId);    
                        }
                        
                    }

                }

            }
        }

       
    }
    
}


// check to see if the user has won the game -- if only mines are left uncovered
function checkWin(){

    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            if ((document.getElementById('tile'+((rows*i)+j)).className != 'revealed') && (check(i, j) != 'mine')){
                return false;
            }   
        }
    }

    return true;
}


// checks if a tile is a mine -- returns the value of a particular tile on the board
function check(row, column) {
    return (grid[row][column]); 
}

window.onload = function(){
    init();
}