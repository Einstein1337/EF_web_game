let columns = 7;
let rows = 6;

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
        this.id = 0
        this.able_to_find_new_game = true
        this.player = 0
        this.cell_list = []
        this.able_to_click = false
        this.myTurn = false
        this.player = ""
        this.player_color = ''
        this.player_color_str = ""

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


    updateGame(data)
    {
        this.able_to_click = data.turn
        if (this.able_to_click == true)
        {
            document.getElementById("player").className = this.player;
        }
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                if(data.cli[r][c] == 1)
                {
                    this.cell_list[r][c].used = true;
                    this.cell_list[r][c].color = "red";
                    document.getElementById(""+r+""+c).style.background='#FF0000';
                }
                else if(data.cli[r][c] == 2)
                {
                    this.cell_list[r][c].used = true;
                    this.cell_list[r][c].color = "yellow"
                    document.getElementById(""+r+""+c).style.background='#FFFF00'
                }
            }
        }
        console.log(data.cli)
    }

    async fetchUpdateFromServer()
    {
        try {
            const response = await fetch('/gamestate/'+this.player+'/'+this.id);
            const json = await response.json();
            this.updateGame(json);
          } catch (error) {
            console.log(error);
          }
    }

    wait()
    {
        while(!this.able_to_click)
        {
            this.fetchUpdateFromServer();
        }
    }

    async newGame()
    {
        console.log(this.able_to_find_new_game)
        if(this.able_to_find_new_game)
        {
            this.able_to_find_new_game = false
            try {
                const response = await fetch('/newgame');
                const json = await response.json();
                this.player = json.player;
                this.id = json.id;
                if (this.player == "player1")
                {
                    this.player_color = '#FF0000';
                    this.player_color_str = "red"
                }
                else
                {
                    this.player_color = '#FFFF00';
                    this.player_color_str = "yellow"
                }
                this.updateGame(json);
                this.wait()
            } catch (error) {
                console.log(error);
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

    winScreen()
    {
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                document.getElementById(this.cell_list[r][c].id).style.background=this.player_color;//red
            }
        }
    }

    insertPiece(button)
    {
        if (this.able_to_click)
        {
            let cell = this.findCell(button.id)
            if (!cell.used)
            {
                cell.used = false
                let free_row = this.findNearestFreeColumnPlace(parseInt(cell.id[1]))
                this.cell_list[free_row][parseInt(cell.id[1])].used = true
                this.cell_list[free_row][parseInt(cell.id[1])].color = this.player_color_str
                document.getElementById(""+free_row+""+parseInt(cell.id[1])).style.background=this.player_color;//red
                this.able_to_click = false
                document.getElementById("player").className = "notmyturn"
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
        let index = 0;
        for (let button of this.grid.getElementsByTagName("button"))
        {
            button.addEventListener("click", () => game.insertPiece(button), false);
            index++;
        } 
        document.getElementById("NewGame").addEventListener("click", () => game.newGame(), false)
    }
}



const view = new View(document.getElementsByClassName("grid")[0]);
const game = new Game();
view.connectToGame(game);
