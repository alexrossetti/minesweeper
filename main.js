
let grid = [];
const rows = 8;
const columns = 8;
let revealed = 0;
let mines = 8;

function init() {
    reset();
    createBoard(rows, columns);
    addMines(mines, (rows*columns));
}

function reset(){
    document.getElementById('board').innerHTML = "";
    document.getElementById('title').innerHTML = "";
    grid = [];
}

function createBoard(rows, columns) {

    for (let i = 1; i <= rows; i++){
        for (let j = 1; j <= columns; j++){
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.addEventListener('mousedown', click);
            tile.id = "tile"+(j + (rows * (i-1))-1);
            document.getElementById('board').appendChild(tile);
            grid.push('tile');
        }
        const breaker = document.createElement('div');
        breaker.className = 'clear';
        document.getElementById('board').appendChild(breaker);
        const info = document.createElement('div');
        document.getElementById('info').appendChild(info);
    }

    info.innerHTML = 'Mines: '+mines;
}


function addMines(mines, tiles) {

    // for each mine, choose a random tile for the mine
    for (let i = 0; i < mines; i++){
        const random = Math.floor((Math.random()*tiles));

        // don't assign the same tile as a mine more than once
        if (check(random) != 'mine'){
            grid[random] = 'mine';
        } else {
            i--;
        }
    }

    // get the number of adjacent mines for each tile
    for (let x = 0; x < tiles; x++){
        
        if (check(x) != 'mine') {
            // corner squares
            if (x === 0) {
                grid[x] = 
                    ((check(x+1) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns+1)) == 'mine') | 0);
            } else if (x === columns-1) {
                grid[x] = 
                    ((check(x-1) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns-1)) == 'mine') | 0);
            } else if (x === (rows*columns)-columns){
                grid[x] = 
                    ((check(x+1) == 'mine') | 0)
                    +((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns+1)) == 'mine') | 0);
            } else if (x === (rows*columns)-1) {
                grid[x] = 
                    ((check(x-1) == 'mine') | 0)
                    +((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns+1)) == 'mine') | 0);
            } else if (x % columns === 0) {           // squares in the left-hand column
                grid[x] = 
                    ((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns+1)) == 'mine') | 0)
                    +((check(x+1) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns+1)) == 'mine') | 0);
            } else if (x % rows === columns-1) {       // squares in the right-hand column
                grid[x] = 
                    ((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns-1)) == 'mine') | 0)
                    +((check(x-1) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns-1)) == 'mine') | 0);
            } else if (x < columns) {                 // squares on top row
                grid[x] = 
                    ((check(x-1) == 'mine') | 0)
                    +((check(x+1) == 'mine') | 0)
                    +((check(x+(columns-1)) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns+1)) == 'mine') | 0);
            } else if (x > (rows*columns)-(columns+1)){                 // squares on bottom row
                grid[x] = 
                    ((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns+1)) == 'mine') | 0)
                    +((check(x-(columns-1)) == 'mine') | 0)
                    +((check(x-1) == 'mine') | 0)
                    +((check(x+1) == 'mine') | 0);
            } else {                                        // all other squares
                grid[x] = 
                    ((check(x-(columns+1)) == 'mine') | 0)
                    +((check(x-columns) == 'mine') | 0)
                    +((check(x-(columns-1)) == 'mine') | 0)
                    +((check(x-1) == 'mine') | 0)
                    +((check(x+1) == 'mine') | 0)
                    +((check(x+(columns-1)) == 'mine') | 0)
                    +((check(x+columns) == 'mine') | 0)
                    +((check(x+(columns+1)) == 'mine') | 0);
            }
        }
        
    }

}


function click(event) {
    let id = event.target.id;
    
    // if user clicks on a mine, display all the mines and game over. Otherwise show the tile
    if (check(id.substr(4)) === 'mine') {
        
        for (let x = 0; x < rows*columns; x++){
            if (grid[x] == 'mine'){
                document.getElementById('tile'+x).className += ' mine';
            } else {
                showTile('tile'+x);
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

// check to see if the user has won the game -- if only mines are left uncovered
function checkWin(){

    for (let i = 0; i < rows*columns; i++){
        if ((document.getElementById('tile'+i).className != 'revealed') && (check(i) != 'mine')){
            return false;
        }
    }

    return true;
}


function showTile(id) {
    let tile = document.getElementById(id);
    let tileId = parseInt(id.substr(4));

    if (check(tileId) != 'mine'){
        revealed++;

        tile.className = 'revealed';
        if (check(tileId) > 0){
            tile.innerHTML = '<h4>'+check(tileId)+'</h4>';
        }
        
        // if tile has no mines around it, check and reveal neighbouring tiles
        if (check(tileId) == 0) {   
            
            if (tileId === (columns-1) && document.getElementById('tile'+(tileId-1)).className != 'revealed') {
                showTile('tile'+(tileId-1));
            }
            if (tileId % columns < (columns-1) && document.getElementById('tile'+(tileId+1)).className != 'revealed') {
                    showTile('tile'+(tileId+1));
            }  
            if (tileId < (rows*columns)-columns && document.getElementById('tile'+(tileId+8)).className != 'revealed') {
                    showTile('tile'+(tileId+columns));
            } 
            if (tileId > (columns-1) && document.getElementById('tile'+(tileId-8)).className != 'revealed'){
                showTile('tile'+(tileId-columns));
            }
            if ((tileId % columns > 0) && (tileId > (columns-1)) && document.getElementById('tile'+(tileId-(columns+1))).className != 'revealed'){
                showTile('tile'+(tileId-(columns+1)));
            }
            if ((tileId % columns != (columns-1)) && (tileId > (columns-1)) && document.getElementById('tile'+(tileId-(columns-1))).className != 'revealed'){
                showTile('tile'+(tileId-(columns-1)));
            }
            if ((tileId % columns > 0) && (tileId < (rows*columns)-columns) && document.getElementById('tile'+(tileId+(columns-1))).className != 'revealed'){
                showTile('tile'+(tileId+(columns-1)));
            }
            if ((tileId % columns > 0) && (tileId < (rows*columns)-(columns+1)) && document.getElementById('tile'+(tileId+(columns+1))).className != 'revealed'){
                showTile('tile'+(tileId+(columns+1)));
            }

        }
    }

}

// checks if a tile is a mine -- returns the value of a particular tile on the board
function check(id) {
    return (grid[id]);
}

window.onload = function(){
    init();
}