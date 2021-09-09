let columns = 7;
let rows = 6;

class Player
{
    constructor(id)
    {
        this.id = id;
    }
}

class Cell
{
    constructor(id)
    {
        this.id = id
        this.used = false
        this.color = ""
    }
}

class Game
{
    constructor()
    {
        this.player1 = new Player(1);
        this.player2 = new Player(2);
        this.cell_list = []
        this.able_to_click = true

        for (let r = 0; r < rows; r++)
        {
            this.cell_list.push([]);
            for (let c = 0; c < columns; c++)
            {
                let id = ""+r + ""+c;
                this.cell_list[r].push(new Cell(id));
            }
        }
    }

    findCell(id)
    {
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                if (this.cell_list[r][c].id == id)
                {
                    return this.cell_list[r][c];
                }
            }
        }
    }

    findNearestFreeColumnPlace(column)
    {
        for (let row = 0; row < rows; row++)
        {
            if (this.cell_list[row][column].used == true)
            {
                return row - 1;
            }
        }
        return rows - 1;
    }

    NewGame()
    {
        console.log("NewGame");
    }

    fieldEvaluation(last_token_row, last_token_column, last_color)
    {
        let i_j_list = [[-1, 1],[0, 1],[1, 1],[1, 0]];
        for (let dir = 0; dir < 4; dir++)
        {
            let winning_index = 0;
            let no_win = false;
            let i = i_j_list[dir][0];
            let j = i_j_list[dir][1];
            let running_var = 1;
            for (let neighbour = 0; neighbour < 4; neighbour++)
            {
                let fail = false;
                let next_row = last_token_row+i*running_var;
                let next_column = last_token_column+j*running_var;

                if(next_row <= rows-1 && next_column <= columns-1 && next_row >= 0 && next_column >= 0)
                {
                    if (this.cell_list[next_row][next_column].color != last_color)
                    {
                        fail = true
                    }
                    else
                    {
                        winning_index += 1;
                    }
                }
                else
                {
                    fail = true
                }

                if (fail)
                {
                    if (no_win)
                    {
                        break
                    }
                    else
                    {
                        i *= -1;
                        j *= -1;
                        no_win == true;
                        running_var = 0
                    }
                }

                if (winning_index == 3)
                {
                    return true;
                }
                running_var++;
            }    
        }
        return false;

    }

    winScreen(color)
    {
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                document.getElementById(this.cell_list[r][c].id).style.background=color;//red
            }
        }
    }

    insertPiece(button)
    {
        if (this.able_to_click)
        {
            let cell = this.findCell(button.id)
            let color = ''
            let color_str = ""
            if (!cell.used)
            {
                cell.used = false
                if (document.getElementById("player").className == "player1")
                {
                    color = '#FF0000';
                    color_str = "red"
                    document.getElementById("player").className = "player2";
                }
                else
                {
                    color = '#FFFF00';
                    color_str = "yellow"
                    document.getElementById("player").className = "player1";
                }
                let free_row = this.findNearestFreeColumnPlace(parseInt(cell.id[1]))
                this.cell_list[free_row][parseInt(cell.id[1])].used = true
                this.cell_list[free_row][parseInt(cell.id[1])].color = color_str
                document.getElementById(""+free_row+""+parseInt(cell.id[1])).style.background=color;//red
                let win = this.fieldEvaluation(free_row, parseInt(cell.id[1]), color_str)
                if(win)
                {
                    this.winScreen(color);
                    this.able_to_click = false
                }
            }
        }
    }
}

class View
{
    constructor(grid)
    {
        this.grid = grid;
    }

    connectToGame(game) 
    {
        document.getElementById("NewGame").addEventListener("click", () => game.NewGame(), false);
        let index = 0;
        for (let button of this.grid.getElementsByTagName("button"))
        {
            button.addEventListener("click", () => game.insertPiece(button), false);
            index++;
        }  
    }
}



const view = new View(document.getElementsByClassName("grid")[0]);
const game = new Game();
view.connectToGame(game);
